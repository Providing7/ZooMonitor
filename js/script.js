// Menu mobile - toggle com touch
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navDropdown = document.querySelector('.nav-dropdown');
    
    if (!mobileMenuToggle || !mobileMenu || !navDropdown) return;
    
    // Garantir que o menu inicie oculto e otimizado
    mobileMenu.style.opacity = '0';
    mobileMenu.style.display = 'none';
    
    let isMenuOpen = false;
    
    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        isMenuOpen = !isMenuOpen;
        
        // Usar requestAnimationFrame para melhor performance
        requestAnimationFrame(() => {
            if (isMenuOpen) {
                navDropdown.classList.add('active');
                // Mostrar menu imediatamente com opacity para feedback visual rápido
                mobileMenu.style.display = 'block';
                mobileMenu.style.opacity = '0';
                // Forçar reflow e então animar
                mobileMenu.offsetHeight; // Force reflow
                requestAnimationFrame(() => {
                    mobileMenu.style.opacity = '1';
                });
            } else {
                navDropdown.classList.remove('active');
                mobileMenu.style.opacity = '0';
                // Remover display após animação
                setTimeout(() => {
                    if (!isMenuOpen) {
                        mobileMenu.style.display = 'none';
                    }
                }, 150);
            }
        });
    };
    
    // Adicionar eventos para click e touch
    mobileMenuToggle.addEventListener('click', toggleMenu);
    mobileMenuToggle.addEventListener('touchend', (e) => {
        e.preventDefault();
        toggleMenu(e);
    });
    
    // Fechar menu ao clicar em um link
    const menuLinks = mobileMenu.querySelectorAll('.nav-dropdown-link');
    const closeMenu = () => {
        isMenuOpen = false;
        navDropdown.classList.remove('active');
        mobileMenu.style.opacity = '0';
        setTimeout(() => {
            if (!isMenuOpen) {
                mobileMenu.style.display = 'none';
            }
        }, 120);
    };
    
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
        link.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeMenu();
        });
    });
    
    // Fechar menu ao clicar fora
    const closeMenuOutside = (e) => {
        if (isMenuOpen && !navDropdown.contains(e.target)) {
            isMenuOpen = false;
            navDropdown.classList.remove('active');
            mobileMenu.style.opacity = '0';
            setTimeout(() => {
                if (!isMenuOpen) {
                    mobileMenu.style.display = 'none';
                }
            }, 120);
        }
    };
    
    document.addEventListener('click', closeMenuOutside);
    document.addEventListener('touchend', closeMenuOutside);
}

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header transparente que fica sólido ao fazer scroll
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.backgroundColor = 'rgba(26, 71, 42, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'transparent';
        header.style.backdropFilter = 'none';
    }
    
    lastScroll = currentScroll;
});

// Formulário de newsletter
const newsletterForm = document.querySelector('.footer-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        const newsletterCheckbox = document.getElementById('newsletter');
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        
        const email = emailInput ? emailInput.value.trim() : '';
        const newsletter = newsletterCheckbox ? newsletterCheckbox.checked : false;
        
        if (!email) {
            if (window.notifications) {
                window.notifications.warning('Por favor, informe seu email.');
            } else {
                alert('Por favor, informe seu email.');
            }
            return;
        }
        
        if (!newsletter) {
            if (window.notifications) {
                window.notifications.warning('Por favor, aceite a inscrição na newsletter.');
            } else {
                alert('Por favor, aceite a inscrição na newsletter.');
            }
            return;
        }
        
        // Desabilitar botão durante o envio
        if (submitButton) {
            submitButton.disabled = true;
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            
            // Simular envio (você pode integrar com uma API aqui)
            setTimeout(() => {
                // Mostrar popup customizado
                showNewsletterPopup();
                
                newsletterForm.reset();
                
                // Reabilitar botão
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            }, 500);
        } else {
            showNewsletterPopup();
            newsletterForm.reset();
        }
    });
}

// Função para mostrar popup de newsletter
function showNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    if (!popup) return;
    
    popup.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

// Inicializar listeners do popup quando DOM estiver pronto
function initNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    if (!popup) return;
    
    const closeButton = document.getElementById('newsletterPopupButton');
    const closeIcon = document.getElementById('newsletterPopupClose');
    
    const closePopup = () => {
        popup.classList.remove('show');
        document.body.style.overflow = '';
    };
    
    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
        closeButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            closePopup();
        });
    }
    
    if (closeIcon) {
        closeIcon.addEventListener('click', closePopup);
        closeIcon.addEventListener('touchend', (e) => {
            e.preventDefault();
            closePopup();
        });
    }
    
    // Fechar ao clicar no overlay
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('show')) {
            closePopup();
        }
    });
}

// Inicializar menu mobile e popup quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initNewsletterPopup();
    });
} else {
    initMobileMenu();
    initNewsletterPopup();
}

// Animação de entrada suave para seções
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar todas as seções principais
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ========================================
// SISTEMA DE ACESSIBILIDADE
// ========================================
// O sistema de acessibilidade está em js/accessibility.js
// e é carregado em todas as páginas

