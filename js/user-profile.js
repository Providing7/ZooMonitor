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
 * Criar perfil básico se não existir
 */
async function createBasicProfile(user) {
    try {
        const { error } = await window.supabaseClient
            .from('profiles')
            .insert({
                id: user.id,
                email: user.email,
                full_name: user.email?.split('@')[0] || 'Usuário',
                avatar_url: null
            });

        if (error && !error.message.includes('duplicate')) {
            console.error('Erro ao criar perfil:', error);
        } else {
            // Tentar novamente buscar o perfil
            await updateHeaderWithProfile();
        }
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

// Exportar funções para uso global
window.updateHeaderWithProfile = updateHeaderWithProfile;
window.removeProfileFromHeader = removeProfileFromHeader;

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Aguardar um pouco para garantir que Supabase está carregado
        setTimeout(updateHeaderWithProfile, 500);
    });
} else {
    setTimeout(updateHeaderWithProfile, 500);
}

// Listener para mudanças de autenticação
if (typeof window !== 'undefined') {
    // Aguardar Supabase estar disponível
    const checkSupabase = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(checkSupabase);
            window.supabaseClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    updateHeaderWithProfile();
                } else if (event === 'SIGNED_OUT') {
                    removeProfileFromHeader();
                }
            });
        }
    }, 100);
    
    // Timeout de segurança
    setTimeout(() => clearInterval(checkSupabase), 5000);
}

