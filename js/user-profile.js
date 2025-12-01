// ========================================
// GERENCIAMENTO DE PERFIL DO USUÁRIO
// ========================================

/**
 * Atualizar header com foto do perfil do usuário
 */
export async function updateHeaderWithProfile() {
    if (!window.supabaseClient) return;

    try {
        // Verificar se usuário está logado
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            // Usuário não logado - remover foto do header se existir
            removeProfileFromHeader();
            return;
        }

        // Garantir que o perfil existe antes de buscar
        await ensureUserProfileExists(session.user);

        // Buscar perfil do usuário
        const { data: profile, error } = await window.supabaseClient
            .from('profiles')
            .select('full_name, avatar_url, email')
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error('Erro ao buscar perfil:', error);
            // Se não tiver perfil, criar um básico
            await createBasicProfile(session.user);
            // Tentar buscar novamente
            const { data: newProfile } = await window.supabaseClient
                .from('profiles')
                .select('full_name, avatar_url, email')
                .eq('id', session.user.id)
                .single();
            
            if (newProfile) {
                addProfileToHeader(newProfile, session.user);
                window.currentUserProfile = newProfile;
            }
            return;
        }

        // Adicionar foto no header
        addProfileToHeader(profile, session.user);
        
        // Armazenar perfil globalmente para uso no chatbot
        window.currentUserProfile = profile;
    } catch (error) {
        console.error('Erro ao atualizar header:', error);
    }
}

/**
 * Garantir que o perfil do usuário existe
 */
async function ensureUserProfileExists(user) {
    if (!window.supabaseClient || !user || !user.id) return;

    try {
        // Verificar se o perfil já existe
        const { data: existingProfile } = await window.supabaseClient
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
        
        const { error } = await window.supabaseClient
            .from('profiles')
            .insert({
                id: user.id,
                email: user.email,
                full_name: fullName,
                avatar_url: null,
                role: 'member',
                is_public: true
            });

        if (error) {
            // Se o erro for de duplicata, tudo bem (pode ter sido criado pelo trigger)
            if (!error.message.includes('duplicate') && !error.message.includes('already exists')) {
                console.error('Erro ao criar perfil:', error);
            }
        } else {
            console.log('Perfil criado com sucesso para:', user.email);
        }
    } catch (error) {
        console.error('Erro ao garantir perfil:', error);
    }
}

/**
 * Criar perfil básico se não existir
 */
async function createBasicProfile(user) {
    try {
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
        
        const { error } = await window.supabaseClient
            .from('profiles')
            .insert({
                id: user.id,
                email: user.email,
                full_name: fullName,
                avatar_url: null,
                role: 'member',
                is_public: true
            });

        if (error) {
            // Se o erro for de duplicata, tudo bem (pode ter sido criado pelo trigger)
            if (!error.message.includes('duplicate') && !error.message.includes('already exists')) {
                console.error('Erro ao criar perfil:', error);
            }
        } else {
            console.log('Perfil criado com sucesso para:', user.email);
        }
        
        // Tentar novamente buscar o perfil
        await updateHeaderWithProfile();
    } catch (error) {
        console.error('Erro ao criar perfil:', error);
    }
}

/**
 * Adicionar foto do perfil no header
 */
function addProfileToHeader(profile, user) {
    // Remover foto anterior se existir
    removeProfileFromHeader();
    
    // Remover botão de login se existir
    if (window.removeLoginButtonFromHeader) {
        window.removeLoginButtonFromHeader();
    }

    const headerRightControls = document.querySelector('.header-right-controls');
    if (!headerRightControls) return;

    // Criar elemento do perfil
    const profileContainer = document.createElement('div');
    profileContainer.className = 'user-profile-header';
    profileContainer.id = 'user-profile-header';

    const avatarUrl = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || user.email)}&background=2d5a3d&color=fff&size=128`;
    const displayName = profile.full_name || user.email?.split('@')[0] || 'Usuário';

    profileContainer.innerHTML = `
        <div class="user-profile-avatar-container">
            <img src="${avatarUrl}" alt="${displayName}" class="user-profile-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2d5a3d&color=fff&size=128'">
        </div>
        <div class="user-profile-menu">
            <div class="user-profile-info">
                <div class="user-profile-name">${displayName}</div>
                <div class="user-profile-email">${user.email}</div>
            </div>
            <button class="user-profile-logout" onclick="handleLogout()">Sair</button>
        </div>
    `;

    // Inserir antes do dropdown menu
    const dropdown = headerRightControls.querySelector('.nav-dropdown');
    if (dropdown) {
        headerRightControls.insertBefore(profileContainer, dropdown);
    } else {
        headerRightControls.appendChild(profileContainer);
    }
}

/**
 * Remover foto do perfil do header
 */
function removeProfileFromHeader() {
    const existingProfile = document.getElementById('user-profile-header');
    if (existingProfile) {
        existingProfile.remove();
    }
    window.currentUserProfile = null;
    
    // Se não houver perfil e não houver botão de login, adicionar botão de login
    if (window.addLoginButtonToHeader && !document.getElementById('header-login-button')) {
        // Verificar se realmente não está logado antes de adicionar
        if (window.supabaseClient) {
            window.supabaseClient.auth.getUser().then(({ data: { user } }) => {
                if (!user) {
                    window.addLoginButtonToHeader();
                }
            });
        } else {
            window.addLoginButtonToHeader();
        }
    }
}

/**
 * Obter foto do perfil do usuário atual
 */
export function getUserAvatar() {
    if (!window.currentUserProfile) {
        return null;
    }
    
    const profile = window.currentUserProfile;
    const displayName = profile.full_name || 'Usuário';
    
    if (profile.avatar_url) {
        return profile.avatar_url;
    }
    
    // Gerar avatar baseado no nome
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2d5a3d&color=fff&size=128`;
}

/**
 * Obter nome do usuário atual
 */
export function getUserDisplayName() {
    if (!window.currentUserProfile) {
        return 'Usuário';
    }
    return window.currentUserProfile.full_name || window.currentUserProfile.email?.split('@')[0] || 'Usuário';
}

/**
 * Fazer logout do usuário
 */
async function handleLogout() {
    if (!window.supabaseClient) {
        console.error('Supabase não está disponível');
        return;
    }

    try {
        const { error } = await window.supabaseClient.auth.signOut();
        
        if (error) {
            console.error('Erro ao fazer logout:', error);
            if (window.notifications) {
                window.notifications.error('Erro ao fazer logout.');
            }
            return;
        }

        // Remover perfil do header
        removeProfileFromHeader();
        
        // Adicionar botão de login
        if (window.addLoginButtonToHeader) {
            window.addLoginButtonToHeader();
        }

        if (window.notifications) {
            window.notifications.success('Logout realizado com sucesso!');
        }

        // Recarregar página após um breve delay
        setTimeout(() => {
            window.location.reload();
        }, 500);
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        if (window.notifications) {
            window.notifications.error('Erro ao fazer logout.');
        }
    }
}

// Exportar funções para uso global
window.updateHeaderWithProfile = updateHeaderWithProfile;
window.removeProfileFromHeader = removeProfileFromHeader;
window.handleLogout = handleLogout;
window.ensureUserProfileExists = ensureUserProfileExists;

// Inicializar quando o DOM estiver pronto
function initUserProfile() {
    // Aguardar Supabase estar disponível
    const checkSupabase = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(checkSupabase);
            // Verificar sessão imediatamente
            updateHeaderWithProfile();
        }
    }, 100);
    
    // Timeout de segurança
    setTimeout(() => {
        clearInterval(checkSupabase);
        if (window.supabaseClient) {
            updateHeaderWithProfile();
        }
    }, 2000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initUserProfile();
    });
} else {
    initUserProfile();
}

// Listener para mudanças de autenticação
if (typeof window !== 'undefined') {
    // Aguardar Supabase estar disponível
    const checkSupabase = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(checkSupabase);
            window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                    // Garantir que o perfil existe antes de atualizar o header
                    if (session && session.user) {
                        await ensureUserProfileExists(session.user);
                    }
                    await updateHeaderWithProfile();
                } else if (event === 'SIGNED_OUT') {
                    removeProfileFromHeader();
                }
            });
        }
    }, 100);
    
    // Timeout de segurança
    setTimeout(() => clearInterval(checkSupabase), 5000);
}

