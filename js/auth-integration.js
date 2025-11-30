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
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            handleLoggedInUser(session);
        } else if (event === 'SIGNED_OUT') {
            handleLoggedOutUser();
        }
    });

    // Configurar botões de login
    setupAuthButtons(supabase);
}

/**
 * Configurar botões de autenticação
 */
function setupAuthButtons(supabase) {
    // Botão de login com Google
    const googleBtn = document.querySelector('.register-button-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/pages/membros.html`
                }
            });
            if (error) {
                alert('Erro ao fazer login com Google: ' + error.message);
            }
        });
    }

    // Botão de login com Facebook
    const facebookBtn = document.querySelector('.register-button-facebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', async () => {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    redirectTo: `${window.location.origin}/pages/membros.html`
                }
            });
            if (error) {
                alert('Erro ao fazer login com Facebook: ' + error.message);
            }
        });
    }

    // Botão de registro com email
    const emailBtn = document.querySelector('.register-button-email');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            showEmailRegisterForm(supabase);
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
                <input type="text" id="fullName" name="fullName" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input type="password" id="password" name="password" required minlength="6">
            </div>
            <button type="submit" class="register-button register-button-submit">
                Registrar-se
            </button>
        </form>
    `;

    // Substituir botões pelo formulário
    const buttonsContainer = document.querySelector('.register-buttons');
    if (buttonsContainer) {
        buttonsContainer.innerHTML = formHTML;
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
 * Processar registro com email
 */
async function handleEmailRegister(supabase, form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const fullName = formData.get('fullName');

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });

        if (error) throw error;

        alert('Registro realizado com sucesso! Verifique seu email para confirmar a conta.');
        closeRegisterModal();
    } catch (error) {
        alert('Erro ao registrar: ' + error.message);
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
        membersContent.innerHTML = `
            <h1 class="members-title">Bem-vindo, ${session.user.email}!</h1>
            <p class="members-subtitle">Você está conectado ao ZooMonitor.</p>
            <button class="members-login-button" onclick="handleLogout()">Sair</button>
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

