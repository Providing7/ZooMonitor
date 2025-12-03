// ========================================
// SISTEMA DE LOGIN NO HEADER
// ========================================

/**
 * Abrir modal de login (funciona de qualquer página)
 */
function openLoginModal() {
    // Se estiver na página de membros, usar o modal existente
    if (document.getElementById('registerModal')) {
        const modal = document.getElementById('registerModal');
        modal.style.display = 'flex';
        
        // Mostrar formulário de login
        if (window.supabaseClient && typeof showLoginForm === 'function') {
            showLoginForm(window.supabaseClient);
        } else {
            // Criar modal de login se não existir
            createLoginModal();
        }
    } else {
        // Criar modal de login se não existir na página
        createLoginModal();
    }
}

/**
 * Criar modal de login dinâmico
 */
function createLoginModal() {
    // Verificar se já existe
    let modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        return;
    }

    // Criar modal
    modal = document.createElement('div');
    modal.id = 'loginModal';
    modal.className = 'login-modal-overlay';
    modal.innerHTML = `
        <div class="login-modal">
            <button class="login-modal-close" id="loginModalClose" aria-label="Fechar">×</button>
            <h2 class="login-modal-title">Bem-vindo de volta</h2>
            <p class="login-modal-subtitle">Entre na sua conta</p>
            <form id="headerLoginForm" class="login-form">
                <div class="login-form-group">
                    <label for="headerLoginEmail" class="login-form-label">Email</label>
                    <input type="email" id="headerLoginEmail" name="email" class="login-form-input" placeholder="seu@email.com" required autocomplete="email">
                </div>
                <div class="login-form-group">
                    <label for="headerLoginPassword" class="login-form-label">Senha</label>
                    <input type="password" id="headerLoginPassword" name="password" class="login-form-input" placeholder="••••••••" required autocomplete="current-password">
                </div>
                <button type="submit" class="login-form-submit">
                    Entrar
                </button>
                <p class="login-form-register">
                    Não tem conta? <a href="pages/membros.html" class="login-form-register-link">Registre-se</a>
                </p>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeBtn = modal.querySelector('#loginModalClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLoginModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLoginModal();
        }
    });

    const form = modal.querySelector('#headerLoginForm');
    if (form && window.supabaseClient) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleHeaderLogin(form);
        });
    }

    // Mostrar modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Fechar modal de login
 */
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Também fechar modal da página de membros se estiver aberto
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Processar login do header
 */
async function handleHeaderLogin(form) {
    if (!window.supabaseClient) {
        if (window.notifications) {
            window.notifications.error('Erro ao conectar com o servidor.');
        } else {
            alert('Erro ao conectar com o servidor.');
        }
        return;
    }

    const email = form.querySelector('#headerLoginEmail').value.trim();
    const password = form.querySelector('#headerLoginPassword').value;

    if (!email || !password) {
        if (window.notifications) {
            window.notifications.warning('Por favor, preencha todos os campos.');
        } else {
            alert('Por favor, preencha todos os campos.');
        }
        return;
    }

    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Erro ao fazer login:', error);
            
            // Mensagens de erro mais específicas
            let errorMessage = 'Erro ao fazer login. ';
            
            if (error.message.includes('Invalid login credentials') || 
                error.message.includes('invalid_credentials') ||
                error.message.includes('Invalid login')) {
                errorMessage = 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
            } else if (error.message.includes('Email not confirmed') || 
                       error.message.includes('email_not_confirmed')) {
                errorMessage = 'Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.';
            } else if (error.message.includes('rate limit') || 
                       error.message.includes('25 seconds')) {
                errorMessage = '⏱️ Aguarde alguns segundos antes de tentar novamente. Por segurança, há um limite de tentativas.';
            } else {
                errorMessage += error.message || 'Verifique suas credenciais.';
            }
            
            if (window.notifications) {
                window.notifications.error(errorMessage);
            } else {
                alert(errorMessage);
            }
            return;
        }

        if (data.user) {
            // Remover botão de login imediatamente
            removeLoginButtonFromHeader();
            
            // Garantir que o perfil existe antes de atualizar
            if (window.ensureUserProfileExists) {
                await window.ensureUserProfileExists(data.user);
            }
            
            if (window.notifications) {
                window.notifications.success('Login realizado com sucesso!');
            }
            
            // Fechar modal
            closeLoginModal();
            
            // Atualizar header com perfil
            if (window.updateHeaderWithProfile) {
                await window.updateHeaderWithProfile();
            }
            
            // Recarregar página após um breve delay para atualizar o estado
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        if (window.notifications) {
            window.notifications.error('Erro ao fazer login. Tente novamente.');
        } else {
            alert('Erro ao fazer login. Tente novamente.');
        }
    }
}

/**
 * Adicionar botão de login no header
 */
function addLoginButtonToHeader() {
    // Verificar se já existe botão de login ou perfil
    const headerRightControls = document.querySelector('.header-right-controls');
    if (!headerRightControls) return;

    // Verificar se já existe perfil do usuário
    const existingProfile = document.getElementById('user-profile-header');
    if (existingProfile) {
        // Usuário já está logado, não mostrar botão de login
        return;
    }

    // Verificar se já existe botão de login
    const existingLoginBtn = document.getElementById('header-login-button');
    if (existingLoginBtn) {
        return;
    }

    // Criar botão de login
    const loginButton = document.createElement('button');
    loginButton.id = 'header-login-button';
    loginButton.className = 'header-login-button';
    loginButton.textContent = 'Login';
    loginButton.setAttribute('aria-label', 'Fazer login');
    loginButton.addEventListener('click', openLoginModal);
    loginButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        openLoginModal();
    });

    // Inserir antes do dropdown menu
    const dropdown = headerRightControls.querySelector('.nav-dropdown');
    if (dropdown) {
        headerRightControls.insertBefore(loginButton, dropdown);
    } else {
        headerRightControls.appendChild(loginButton);
    }
}

/**
 * Remover botão de login do header
 */
function removeLoginButtonFromHeader() {
    const loginButton = document.getElementById('header-login-button');
    if (loginButton) {
        loginButton.remove();
    }
}

/**
 * Verificar estado de autenticação e atualizar header
 */
async function checkAuthAndUpdateHeader() {
    if (!window.supabaseClient) {
        // Adicionar botão de login mesmo sem Supabase (para permitir navegação)
        addLoginButtonToHeader();
        return;
    }

    try {
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        
        if (user) {
            // Usuário está logado, remover botão de login
            removeLoginButtonFromHeader();
            
            // Atualizar perfil no header (se a função existir)
            if (window.updateHeaderWithProfile) {
                window.updateHeaderWithProfile();
            }
        } else {
            // Usuário não está logado, adicionar botão de login
            removeLoginButtonFromHeader();
            addLoginButtonToHeader();
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Em caso de erro, mostrar botão de login
        addLoginButtonToHeader();
    }
}

// Aguardar Supabase estar disponível antes de inicializar
function initHeaderLogin() {
    const checkSupabase = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(checkSupabase);
            
            // Verificar sessão persistida primeiro
            window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    // Usuário já está logado, remover botão e mostrar perfil
                    removeLoginButtonFromHeader();
                    if (window.updateHeaderWithProfile) {
                        window.updateHeaderWithProfile();
                    }
                } else {
                    // Usuário não está logado, mostrar botão
                    checkAuthAndUpdateHeader();
                }
            });
            
            // Verificar estado de autenticação
            checkAuthAndUpdateHeader();
            
            // Listener para mudanças de autenticação
            window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                    // Garantir que o perfil existe
                    if (session && session.user && window.ensureUserProfileExists) {
                        await window.ensureUserProfileExists(session.user);
                    }
                    removeLoginButtonFromHeader();
                    if (window.updateHeaderWithProfile) {
                        await window.updateHeaderWithProfile();
                    }
                } else if (event === 'SIGNED_OUT') {
                    // Remover perfil
                    if (window.removeProfileFromHeader) {
                        window.removeProfileFromHeader();
                    }
                    // Adicionar botão de login
                    addLoginButtonToHeader();
                }
            });
        }
    }, 100);
    
    // Timeout de segurança - adicionar botão mesmo sem Supabase
    setTimeout(() => {
        clearInterval(checkSupabase);
        if (!document.getElementById('header-login-button') && !document.getElementById('user-profile-header')) {
            addLoginButtonToHeader();
        }
    }, 2000);
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initHeaderLogin();
    });
} else {
    initHeaderLogin();
}

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLoginModal();
    }
});

// Exportar funções globais
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.addLoginButtonToHeader = addLoginButtonToHeader;
window.removeLoginButtonFromHeader = removeLoginButtonFromHeader;
window.checkAuthAndUpdateHeader = checkAuthAndUpdateHeader;

