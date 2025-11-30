// ========================================
// SISTEMA DE ACESSIBILIDADE - GLOBAL
// ========================================

// Inicializar controles de acessibilidade em todas as páginas
function initAccessibility() {
    // Sistema de Temas (Modo Escuro/Claro)
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Aplicar tema salvo
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeToggle) {
        updateThemeIcon(currentTheme);
    }

    // Toggle de tema (suporte a click e touch)
    if (themeToggle) {
        const handleThemeToggle = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        };
        
        themeToggle.addEventListener('click', handleThemeToggle);
        themeToggle.addEventListener('touchend', handleThemeToggle);
    }

    function updateThemeIcon(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-toggle-icon');
            const label = themeToggle.querySelector('.theme-toggle-label');
            
            if (icon && label) {
                if (theme === 'light') {
                    icon.textContent = '☀️';
                    label.textContent = 'Modo Escuro';
                } else {
                    icon.textContent = '🌙';
                    label.textContent = 'Modo Claro';
                }
            }
        }
    }

    // Sistema de Tamanho de Fonte
    const fontSizeButtons = document.querySelectorAll('.font-size-btn');
    const currentFontSize = localStorage.getItem('fontSize') || 'normal';

    // Aplicar tamanho salvo
    document.documentElement.setAttribute('data-font-size', currentFontSize);
    updateActiveFontButton(currentFontSize);

    // Controle de tamanho de fonte (suporte a click e touch)
    fontSizeButtons.forEach(button => {
        const handleFontSize = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const size = button.getAttribute('data-size');
            document.documentElement.setAttribute('data-font-size', size);
            localStorage.setItem('fontSize', size);
            updateActiveFontButton(size);
        };
        
        button.addEventListener('click', handleFontSize);
        button.addEventListener('touchend', handleFontSize);
    });

    function updateActiveFontButton(size) {
        fontSizeButtons.forEach(btn => {
            if (btn.getAttribute('data-size') === size) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// Funcionalidade do menu de acessibilidade (abrir/fechar)
function initAccessibilityMenu() {
    const accessibilityButton = document.querySelector('.accessibility-button');
    
    if (!accessibilityButton) return;
    
    const menu = accessibilityButton.closest('.accessibility-menu');
    const menuContent = menu?.querySelector('.accessibility-menu-content');
    
    if (!menu || !menuContent) return;
    
    let isMenuOpen = false;
    
    // Abrir/fechar menu ao clicar/toque no botão
    const handleMenuToggle = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            menuContent.classList.add('show');
            accessibilityButton.classList.add('active');
            
            // Ajustar posição após um pequeno delay para garantir que o menu foi renderizado
            setTimeout(() => {
                const buttonRect = accessibilityButton.getBoundingClientRect();
                
                // Obter largura real do menu (pode variar em mobile)
                const computedStyle = window.getComputedStyle(menuContent);
                const menuWidth = parseInt(computedStyle.width) || 280;
                const menuHeight = menuContent.offsetHeight || 300;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const margin = 20; // margem da borda
                const spacing = 10; // espaço entre botão e menu
                
                // Calcular posição horizontal - alinhar à direita do botão
                let rightPosition = viewportWidth - buttonRect.right;
                
                // Se o menu vai ultrapassar a borda direita, ajustar para margem mínima
                if (rightPosition < margin) {
                    rightPosition = margin;
                }
                // Se o menu vai ultrapassar a borda esquerda, ajustar
                else if (buttonRect.left + menuWidth > viewportWidth - margin) {
                    rightPosition = margin;
                }
                
                // Calcular posição vertical - abaixo do botão
                let topPosition = buttonRect.bottom + spacing;
                
                // Se o menu vai ultrapassar a borda inferior, posicionar acima do botão
                if (topPosition + menuHeight > viewportHeight - margin) {
                    topPosition = buttonRect.top - menuHeight - spacing;
                    
                    // Se ainda não couber acima, posicionar no meio da tela verticalmente
                    if (topPosition < margin) {
                        topPosition = Math.max(margin, (viewportHeight - menuHeight) / 2);
                    }
                }
                
                // Garantir que o menu não ultrapasse a borda superior
                if (topPosition < margin) {
                    topPosition = margin;
                }
                
                // Aplicar posição fixa com transform para garantir alinhamento
                menuContent.style.position = 'fixed';
                menuContent.style.right = rightPosition + 'px';
                menuContent.style.top = topPosition + 'px';
                menuContent.style.left = 'auto';
                menuContent.style.bottom = 'auto';
                menuContent.style.transform = 'translateX(0)';
                menuContent.style.maxWidth = 'none'; // Remover max-width para cálculo correto
            }, 10);
        } else {
            menuContent.classList.remove('show');
            accessibilityButton.classList.remove('active');
            // Resetar estilos inline quando fechar
            menuContent.style.position = '';
            menuContent.style.right = '';
            menuContent.style.top = '';
            menuContent.style.left = '';
            menuContent.style.bottom = '';
            menuContent.style.transform = '';
            menuContent.style.maxWidth = '';
        }
    };
    
    // Adicionar eventos para click e touch
    accessibilityButton.addEventListener('click', handleMenuToggle);
    accessibilityButton.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleMenuToggle(e);
    });
    
    // Prevenir que o clique/toque no menu feche o menu
    if (menuContent) {
        const preventClose = function(e) {
            e.stopPropagation();
        };
        menuContent.addEventListener('click', preventClose);
        menuContent.addEventListener('touchend', preventClose);
    }
    
    // Fechar menu ao clicar/toque fora
    const handleOutsideClick = function(e) {
        if (isMenuOpen && menu && !menu.contains(e.target)) {
            isMenuOpen = false;
            if (menuContent) {
                menuContent.classList.remove('show');
                // Resetar estilos inline quando fechar
                menuContent.style.position = '';
                menuContent.style.right = '';
                menuContent.style.top = '';
                menuContent.style.left = '';
                menuContent.style.bottom = '';
                menuContent.style.transform = '';
                menuContent.style.maxWidth = '';
            }
            if (accessibilityButton) {
                accessibilityButton.classList.remove('active');
            }
        }
    };
    
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchend', handleOutsideClick);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAccessibility();
        initAccessibilityMenu();
    });
} else {
    initAccessibility();
    initAccessibilityMenu();
}

