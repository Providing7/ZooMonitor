// ========================================
// TRATAMENTO DE ERROS DE AUTENTICAÇÃO
// ========================================

/**
 * Verificar e tratar erros na URL (como link de confirmação expirado)
 */
function handleAuthErrorsInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorCode = urlParams.get('error_code');
    const errorDescription = urlParams.get('error_description');

    if (error || errorCode) {
        let errorMessage = '';
        let showResendButton = false;

        if (errorCode === 'otp_expired' || errorDescription?.includes('expired')) {
            errorMessage = 'O link de confirmação expirou. Por favor, solicite um novo link.';
            showResendButton = true;
        } else if (errorCode === 'access_denied') {
            errorMessage = 'Acesso negado. O link pode ter expirado ou já foi usado.';
            showResendButton = true;
        } else if (errorDescription) {
            errorMessage = decodeURIComponent(errorDescription.replace(/\+/g, ' '));
        } else {
            errorMessage = 'Ocorreu um erro na autenticação. Tente novamente.';
        }

        // Mostrar notificação de erro
        if (window.notifications) {
            window.notifications.error(errorMessage);
        } else {
            alert(errorMessage);
        }

        // Mostrar opção de reenviar email se necessário
        if (showResendButton) {
            showResendEmailOption();
        }

        // Limpar parâmetros da URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

/**
 * Mostrar opção de reenviar email de confirmação
 */
function showResendEmailOption() {
    // Verificar se já existe o modal
    let resendModal = document.getElementById('resendEmailModal');
    if (resendModal) {
        resendModal.style.display = 'flex';
        return;
    }

    // Criar modal para reenviar email
    resendModal = document.createElement('div');
    resendModal.id = 'resendEmailModal';
    resendModal.className = 'resend-email-modal-overlay';
    resendModal.innerHTML = `
        <div class="resend-email-modal">
            <button class="resend-email-modal-close" id="resendEmailModalClose" aria-label="Fechar">×</button>
            <h2 class="resend-email-modal-title">Link Expirado</h2>
            <p class="resend-email-modal-message">
                O link de confirmação expirou. Por favor, informe seu email para receber um novo link.
            </p>
            <form id="resendEmailForm" class="resend-email-form">
                <div class="resend-email-form-group">
                    <label for="resendEmail" class="resend-email-form-label">Email</label>
                    <input type="email" id="resendEmail" class="resend-email-form-input" placeholder="seu@email.com" required autocomplete="email">
                </div>
                <button type="submit" class="resend-email-form-submit">
                    Reenviar Link de Confirmação
                </button>
                <button type="button" class="resend-email-form-cancel" id="resendEmailFormCancel">
                    Cancelar
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(resendModal);

    // Event listeners
    const closeBtn = resendModal.querySelector('#resendEmailModalClose');
    const cancelBtn = resendModal.querySelector('#resendEmailFormCancel');
    const form = resendModal.querySelector('#resendEmailForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeResendEmailModal());
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeResendEmailModal());
    }

    resendModal.addEventListener('click', (e) => {
        if (e.target === resendModal) {
            closeResendEmailModal();
        }
    });

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleResendConfirmationEmail(form);
        });
    }

    // Mostrar modal
    resendModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Fechar modal de reenvio de email
 */
function closeResendEmailModal() {
    const modal = document.getElementById('resendEmailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Reenviar email de confirmação
 */
async function handleResendConfirmationEmail(form) {
    if (!window.supabaseClient) {
        if (window.notifications) {
            window.notifications.error('Erro ao conectar com o servidor.');
        } else {
            alert('Erro ao conectar com o servidor.');
        }
        return;
    }

    const emailInput = form.querySelector('#resendEmail');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
        if (window.notifications) {
            window.notifications.warning('Por favor, informe seu email.');
        } else {
            alert('Por favor, informe seu email.');
        }
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
    }

    try {
        const { error } = await window.supabaseClient.auth.resend({
            type: 'signup',
            email: email
        });

        if (error) {
            throw error;
        }

        if (window.notifications) {
            window.notifications.success('Email de confirmação reenviado! Verifique sua caixa de entrada.');
        } else {
            alert('Email de confirmação reenviado! Verifique sua caixa de entrada.');
        }

        closeResendEmailModal();
    } catch (error) {
        console.error('Erro ao reenviar email:', error);
        
        let errorMessage = 'Erro ao reenviar email. ';
        if (error.message.includes('rate limit')) {
            errorMessage = '⏱️ Aguarde alguns segundos antes de tentar novamente.';
        } else if (error.message.includes('not found') || error.message.includes('does not exist')) {
            errorMessage = 'Email não encontrado. Verifique se o email está correto ou registre-se novamente.';
        } else {
            errorMessage += error.message;
        }

        if (window.notifications) {
            window.notifications.error(errorMessage);
        } else {
            alert(errorMessage);
        }
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Reenviar Link de Confirmação';
        }
    }
}

// Inicializar quando DOM estiver pronto
// DESABILITADO: Confirmação de email foi removida - não processar erros de confirmação
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//         handleAuthErrorsInURL();
//     });
// } else {
//     handleAuthErrorsInURL();
// }

// Exportar funções globais
window.handleAuthErrorsInURL = handleAuthErrorsInURL;
window.showResendEmailOption = showResendEmailOption;
window.closeResendEmailModal = closeResendEmailModal;
window.handleResendConfirmationEmail = handleResendConfirmationEmail;

