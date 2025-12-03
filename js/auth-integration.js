// ========================================
// INTEGRAÇÃO DE AUTENTICAÇÃO NO FRONTEND
// ========================================

// Aguardar carregamento do Supabase
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar se estamos na página de membros
    if (window.location.pathname.includes('membros.html')) {
        await initAuth();
    }
});

/**
 * Inicializar sistema de autenticação
 */
async function initAuth() {
    // Verificar se Supabase está configurado
    if (!window.supabaseClient) {
        console.error('Supabase não está configurado. Configure as variáveis de ambiente.');
        return;
    }

    const supabase = window.supabaseClient;

    // Verificar se usuário já está logado
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        // Usuário já está logado, redirecionar ou mostrar perfil
        handleLoggedInUser(session);
    }

    // Listener para mudanças de autenticação
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Garantir que o perfil existe
            if (session && session.user) {
                await ensureUserProfile(supabase, session.user);
            }
            handleLoggedInUser(session);
            // Atualizar header com perfil
            if (window.updateHeaderWithProfile) {
                await window.updateHeaderWithProfile();
            }
        } else if (event === 'SIGNED_OUT') {
            handleLoggedOutUser();
            // Remover perfil do header
            if (window.removeProfileFromHeader) {
                window.removeProfileFromHeader();
            }
        } else if (event === 'USER_UPDATED') {
            // Quando o usuário é atualizado, garantir que o perfil existe
            if (session && session.user) {
                await ensureUserProfile(supabase, session.user);
                if (window.updateHeaderWithProfile) {
                    await window.updateHeaderWithProfile();
                }
            }
        }
    });

    // Configurar botões de login
    setupAuthButtons(supabase);
}

/**
 * Configurar botões de autenticação
 */
function setupAuthButtons(supabase) {
    // Botão de registro com email
    const emailBtn = document.querySelector('.register-button-email');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            showEmailRegisterForm(supabase);
        });
    }

    // Link de login (se já é membro)
    const loginLink = document.querySelector('.register-login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm(supabase);
        });
    }
}

/**
 * Mostrar formulário de registro com email
 */
function showEmailRegisterForm(supabase) {
    const modal = document.getElementById('registerModal');
    if (!modal) return;

    // Criar formulário dinamicamente
    const formHTML = `
        <form id="emailRegisterForm" class="register-email-form">
            <div class="form-group">
                <label for="fullName">Nome Completo</label>
                <input type="text" id="fullName" name="fullName" placeholder="Seu nome completo" required autocomplete="name">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="seu@email.com" required autocomplete="email">
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input type="password" id="password" name="password" placeholder="Mínimo 6 caracteres" required minlength="6" autocomplete="new-password">
            </div>
            <button type="submit" class="register-button register-button-submit">
                Criar conta
            </button>
            <p style="margin-top: 12px; text-align: center; font-size: 14px;">
                <a href="#" onclick="event.preventDefault(); showLoginForm(window.supabaseClient); return false;" style="color: var(--beige); text-decoration: none;">
                    Já tem conta? <strong>Fazer login</strong>
                </a>
            </p>
        </form>
    `;

    // Substituir botões pelo formulário
    const buttonsContainer = document.querySelector('.register-buttons');
    if (buttonsContainer) {
        buttonsContainer.innerHTML = formHTML;
    }

    // Atualizar título e subtítulo do modal
    const modalTitle = document.querySelector('.register-modal-title');
    const modalSubtitle = document.querySelector('.register-modal-subtitle');
    if (modalTitle) {
        modalTitle.textContent = 'Bem-vindo ao ZooMonitor';
    }
    if (modalSubtitle) {
        modalSubtitle.textContent = 'Crie sua conta para começar';
    }

    // Adicionar handler do formulário
    const form = document.getElementById('emailRegisterForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleEmailRegister(supabase, form);
        });
    }
}

/**
 * Mostrar formulário de login
 */
function showLoginForm(supabase) {
    const modal = document.getElementById('registerModal');
    if (!modal) return;

    // Criar formulário de login dinamicamente
    const formHTML = `
        <form id="emailLoginForm" class="register-email-form">
            <div class="form-group">
                <label for="loginEmail">Email</label>
                <input type="email" id="loginEmail" name="email" placeholder="seu@email.com" required autocomplete="email">
            </div>
            <div class="form-group">
                <label for="loginPassword">Senha</label>
                <input type="password" id="loginPassword" name="password" placeholder="••••••••" required autocomplete="current-password">
            </div>
            <button type="submit" class="register-button register-button-submit">
                Entrar
            </button>
            <p style="margin-top: 12px; text-align: center; font-size: 14px;">
                <a href="#" onclick="event.preventDefault(); showEmailRegisterForm(window.supabaseClient); return false;" style="color: var(--beige); text-decoration: none;">
                    Não tem conta? <strong>Registre-se</strong>
                </a>
            </p>
        </form>
    `;

    // Substituir botões pelo formulário
    const buttonsContainer = document.querySelector('.register-buttons');
    if (buttonsContainer) {
        buttonsContainer.innerHTML = formHTML;
    }

    // Atualizar título e subtítulo do modal
    const modalTitle = document.querySelector('.register-modal-title');
    const modalSubtitle = document.querySelector('.register-modal-subtitle');
    if (modalTitle) {
        modalTitle.textContent = 'Bem-vindo de volta';
    }
    if (modalSubtitle) {
        modalSubtitle.textContent = 'Entre na sua conta';
    }

    // Adicionar handler do formulário
    const form = document.getElementById('emailLoginForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleEmailLogin(supabase, form);
        });
    }
}

/**
 * Processar login com email
 */
async function handleEmailLogin(supabase, form) {
    const emailInput = form.querySelector('#loginEmail');
    const passwordInput = form.querySelector('#loginPassword');
    const submitButton = form.querySelector('button[type="submit"]');
    
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
        if (window.notifications) {
            window.notifications.warning('Por favor, preencha todos os campos.');
        } else {
            alert('Por favor, preencha todos os campos.');
        }
        return;
    }

    // Desabilitar botão durante o processo
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Remover botão de login imediatamente após login bem-sucedido
        if (window.removeLoginButtonFromHeader) {
            window.removeLoginButtonFromHeader();
        }

        // Login bem-sucedido - o listener onAuthStateChange vai atualizar a UI
        if (window.notifications) {
            window.notifications.success('Login realizado com sucesso!');
        }
        
        // Limpar formulário
        form.reset();
        closeRegisterModal();
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        
        // Mensagens de erro mais amigáveis
        let errorMessage = 'Erro ao fazer login. ';
        
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid')) {
            errorMessage = 'Email ou senha incorretos. Verifique e tente novamente.';
        } else if (error.message.includes('rate limit') || error.message.includes('25 seconds')) {
            errorMessage = '⏱️ Aguarde alguns segundos antes de tentar novamente. Por segurança, há um limite de tentativas.';
        } else {
            errorMessage += error.message;
        }
        
        if (window.notifications) {
            window.notifications.error(errorMessage);
        } else {
            alert(errorMessage);
        }
    } finally {
        // Reabilitar botão
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
        }
    }
}

/**
 * Garantir que o perfil do usuário existe no banco
 */
async function ensureUserProfile(supabase, user) {
    if (!user || !user.id) return;

    try {
        // Verificar se o perfil já existe
        const { data: existingProfile, error: selectError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        if (existingProfile) {
            // Perfil já existe
            return;
        }

        // Criar perfil se não existir
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
        
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                email: user.email,
                full_name: fullName,
                avatar_url: null,
                role: 'member',
                is_public: true
            });

        if (insertError) {
            // Se o erro for de duplicata, tudo bem (pode ter sido criado pelo trigger)
            if (!insertError.message.includes('duplicate') && !insertError.message.includes('already exists')) {
                console.error('Erro ao criar perfil:', insertError);
            }
        } else {
            console.log('Perfil criado com sucesso para:', user.email);
        }
    } catch (error) {
        console.error('Erro ao garantir perfil:', error);
    }
}

/**
 * Processar registro com email
 */
async function handleEmailRegister(supabase, form) {
    const fullNameInput = form.querySelector('#fullName') || form.querySelector('[name="fullName"]');
    const emailInput = form.querySelector('#email') || form.querySelector('[name="email"]');
    const passwordInput = form.querySelector('#password') || form.querySelector('[name="password"]');
    const submitButton = form.querySelector('button[type="submit"]');
    
    const fullName = fullNameInput ? fullNameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!fullName || !email || !password) {
        if (window.notifications) {
            window.notifications.warning('Por favor, preencha todos os campos.');
        } else {
            alert('Por favor, preencha todos os campos.');
        }
        return;
    }

    if (password.length < 6) {
        if (window.notifications) {
            window.notifications.warning('A senha deve ter pelo menos 6 caracteres.');
        } else {
            alert('A senha deve ter pelo menos 6 caracteres.');
        }
        return;
    }

    // Desabilitar botão durante o processo
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Criando conta...';
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                },
                emailRedirectTo: null
            }
        });

        if (error) throw error;

        // Criar perfil imediatamente após registro
        if (data.user) {
            await ensureUserProfile(supabase, data.user);
        }

        // Mostrar notificação de sucesso
        if (window.notifications) {
            window.notifications.success('Registro realizado com sucesso! Você já pode fazer login.');
        } else {
            alert('Registro realizado com sucesso! Você já pode fazer login.');
        }
        
        // Limpar formulário
        form.reset();
        closeRegisterModal();
    } catch (error) {
        console.error('Erro ao registrar:', error);
        
        // Mensagens de erro mais amigáveis
        let errorMessage = 'Erro ao registrar. ';
        
        if (error.message.includes('rate limit') || error.message.includes('25 seconds')) {
            errorMessage = '⏱️ Aguarde alguns segundos antes de tentar novamente. Por segurança, há um limite de tentativas.';
        } else if (error.message.includes('already registered') || error.message.includes('already exists')) {
            errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
        } else if (error.message.includes('invalid email')) {
            errorMessage = 'Email inválido. Verifique e tente novamente.';
        } else if (error.message.includes('password')) {
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else {
            errorMessage += error.message;
        }
        
        if (window.notifications) {
            window.notifications.error(errorMessage);
        } else {
            alert(errorMessage);
        }
    } finally {
        // Reabilitar botão
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Criar conta';
        }
    }
}

/**
 * Lidar com usuário logado
 */
function handleLoggedInUser(session) {
    console.log('Usuário logado:', session.user);
    // Atualizar UI para mostrar que está logado
    const membersContent = document.querySelector('.members-content');
    if (membersContent) {
        const displayName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário';
        membersContent.innerHTML = `
            <h1 class="members-title">Bem-vindo,</h1>
            <p class="members-subtitle" style="font-size: 16px; margin-bottom: 20px; word-break: break-word;">${session.user.email}</p>
            <div style="width: 100%; max-width: 200px; height: 1px; background: linear-gradient(to right, transparent, var(--beige), transparent); margin: 15px 0;"></div>
            <p class="members-subtitle" style="margin-bottom: 30px;">Você está conectado ao<br>ZooMonitor.</p>
            <button class="members-login-button" onclick="handleLogout()" style="width: 100%; max-width: 200px;">Sair</button>
        `;
    }
}

/**
 * Lidar com logout
 */
async function handleLogout() {
    if (!window.supabaseClient) return;

    const { error } = await window.supabaseClient.auth.signOut();
    if (error) {
        alert('Erro ao fazer logout: ' + error.message);
    } else {
        location.reload();
    }
}

// Exportar funções globais
window.handleLogout = handleLogout;
window.showLoginForm = showLoginForm;
window.showEmailRegisterForm = showEmailRegisterForm;

