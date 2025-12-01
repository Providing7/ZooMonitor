// ========================================
// SISTEMA DE NAVEGAÇÃO EM PILHA (STACK) PARA EVENTOS
// ========================================

class EventosStack {
    constructor() {
        this.stack = [];
        this.currentView = 'list'; // 'list' ou 'detail'
        this.init();
    }

    init() {
        // Criar container para views em pilha
        this.createStackContainer();
        
        // Adicionar event listeners aos botões dos cards
        this.attachEventListeners();
        
        // Carregar eventos do Supabase
        this.loadEventos();
    }

    createStackContainer() {
        const eventosPage = document.querySelector('.eventos-page');
        if (!eventosPage) return;

        const container = eventosPage.querySelector('.container');
        if (!container) return;

        // Criar view de detalhes (a lista já existe no HTML)
        const detailView = document.createElement('div');
        detailView.className = 'eventos-stack-view eventos-stack-detail';
        detailView.id = 'eventosDetailView';
        detailView.style.display = 'none';
        
        // Inserir após os cards
        const eventosCards = container.querySelector('.eventos-cards');
        if (eventosCards && eventosCards.parentNode) {
            eventosCards.parentNode.insertBefore(detailView, eventosCards.nextSibling);
        } else {
            container.appendChild(detailView);
        }
    }

    attachEventListeners() {
        // Delegar eventos para os botões dos cards
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.evento-card-button, .evento-card-link');
            if (!button) return;

            const card = button.closest('.evento-card');
            if (!card) return;

            e.preventDefault();
            
            // Obter dados do evento do card
            const eventoId = card.dataset.eventoId || this.getEventoIdFromCard(card);
            const eventoTitle = card.querySelector('.evento-card-title')?.textContent || '';
            
            if (eventoId || eventoTitle) {
                this.showEventoDetail(eventoId, eventoTitle, card);
            }
        });
    }

    getEventoIdFromCard(card) {
        // Mapear títulos para IDs
        const title = card.querySelector('.evento-card-title')?.textContent || '';
        const titleMap = {
            'Workshop de Bem-Estar Animal 2050': 'workshop-2050',
            'Festa de Celebração ZooMonitor 2070': 'festa-2070',
            'Conferência Futuro da Monitorização de Fauna': 'conferencia-futuro'
        };
        return titleMap[title] || title.toLowerCase().replace(/\s+/g, '-');
    }

    async loadEventos() {
        if (!window.supabaseClient) {
            console.warn('Supabase client não disponível');
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('eventos')
                .select('*')
                .order('date', { ascending: true });

            if (error) {
                console.error('Erro ao carregar eventos:', error);
                return;
            }

            // Se houver eventos no banco, usar eles
            if (data && data.length > 0) {
                this.renderEventosFromDB(data);
            } else {
                // Caso contrário, usar eventos estáticos
                this.renderEventosEstaticos();
            }
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            this.renderEventosEstaticos();
        }
    }

    renderEventosFromDB(eventos) {
        const listView = document.getElementById('eventosListView');
        if (!listView) return;

        const eventosCards = document.querySelector('.eventos-cards');
        if (!eventosCards) return;

        // Limpar cards existentes
        eventosCards.innerHTML = '';

        eventos.forEach(evento => {
            const card = this.createEventoCard(evento);
            eventosCards.appendChild(card);
        });
    }

    renderEventosEstaticos() {
        // Os cards já estão no HTML, apenas adicionar data-attributes
        const cards = document.querySelectorAll('.evento-card');
        cards.forEach((card, index) => {
            const title = card.querySelector('.evento-card-title')?.textContent || '';
            const eventoId = this.getEventoIdFromCard(card);
            card.dataset.eventoId = eventoId;
        });
    }

    createEventoCard(evento) {
        const card = document.createElement('div');
        card.className = 'evento-card';
        card.dataset.eventoId = evento.id;

        const imageUrl = evento.image_url || this.getDefaultImage(evento.title);
        const date = this.formatDate(evento.date);
        const location = evento.location || '';

        card.innerHTML = `
            <div class="evento-card-image">
                <img src="${imageUrl}" alt="${evento.title}">
            </div>
            <div class="evento-card-content">
                <h3 class="evento-card-title">${evento.title}</h3>
                <p class="evento-card-date">${date}${location ? ' | ' + location : ''}</p>
                <a href="#" class="evento-card-link">Mais informações</a>
                <a href="#" class="evento-card-button">Informações</a>
            </div>
        `;

        return card;
    }

    getDefaultImage(title) {
        const imageMap = {
            'Workshop de Bem-Estar Animal 2050': '../images/rinocerontes.avif',
            'Festa de Celebração ZooMonitor 2070': '../images/7d9a32_1204d34dfa164bc18e2aa6c8d9dcceaf~mv2.avif',
            'Conferência Futuro da Monitorização de Fauna': '../images/7d9a32_3472cee9f04242d09611359b68ad7296~mv2.avif'
        };
        return imageMap[title] || '../images/evento-default.jpg';
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { weekday: 'short', day: '2-digit', month: 'short' };
        return date.toLocaleDateString('pt-BR', options);
    }

    async showEventoDetail(eventoId, eventoTitle, cardElement) {
        // Adicionar à pilha
        this.stack.push({
            view: 'detail',
            eventoId: eventoId,
            eventoTitle: eventoTitle
        });

        // Carregar dados do evento
        const eventoData = await this.getEventoData(eventoId, eventoTitle, cardElement);
        
        // Renderizar detalhes
        this.renderEventoDetail(eventoData);

        // Mostrar view de detalhes
        this.showDetailView();
    }

    async getEventoData(eventoId, eventoTitle, cardElement) {
        // Tentar buscar do Supabase primeiro
        if (window.supabaseClient && eventoId && eventoId !== 'workshop-2050' && eventoId !== 'festa-2070' && eventoId !== 'conferencia-futuro') {
            try {
                const { data, error } = await window.supabaseClient
                    .from('eventos')
                    .select('*')
                    .eq('id', eventoId)
                    .single();

                if (!error && data) {
                    return data;
                }
            } catch (error) {
                console.error('Erro ao buscar evento:', error);
            }
        }

        // Dados estáticos baseados no título
        return this.getEventoDataEstatico(eventoId, eventoTitle, cardElement);
    }

    getEventoDataEstatico(eventoId, eventoTitle, cardElement) {
        const eventosData = {
            'workshop-2050': {
                id: 'workshop-2050',
                title: 'Workshop de Bem-Estar Animal 2050',
                date: '2025-11-02',
                time: '10:27 - 12:27',
                location: 'Centro de Convenções Zoológico',
                fullLocation: 'Centro de Convenções Zoológico, Av. das Flores, 400 - Ancora, Rio das Ostras - RJ, 28899-419, Brasil',
                description: 'Oficinas práticas sobre bem-estar animal.',
                image: '../images/rinocerontes.avif',
                status: 'tickets_available',
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.234!2d-41.927!3d-22.523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDMxJzIyLjgiUyA0McKwNTUnMzcuMiJX!5e0!3m2!1spt-BR!2sbr!4v1234567890&q=Centro+de+Convenções+Zoológico,+Av.+das+Flores,+400+-+Ancora,+Rio+das+Ostras+-+RJ'
            },
            'festa-2070': {
                id: 'festa-2070',
                title: 'Festa de Celebração ZooMonitor 2070',
                date: '2025-11-02',
                time: '10:27 - 12:27',
                location: 'Espaço Cultural EcoVida',
                fullLocation: 'Espaço Cultural EcoVida, Brasília - Plano Piloto, Brasília - DF, Brasil',
                description: 'Celebração do monitoramento digital de fauna.',
                image: '../images/7d9a32_1204d34dfa164bc18e2aa6c8d9dcceaf~mv2.avif',
                status: 'registration_closed',
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.123!2d-47.882!3d-15.794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDQ3JzM4LjQiUyA0N8KwNTInNTUuMiJX!5e0!3m2!1spt-BR!2sbr!4v1234567890&q=Espaço+Cultural+EcoVida,+Brasília+-+DF'
            },
            'conferencia-futuro': {
                id: 'conferencia-futuro',
                title: 'Conferência Futuro da Monitorização de Fauna',
                date: '2025-11-02',
                time: '10:27 - 12:27',
                location: 'Auditório do ZooMonitor',
                fullLocation: 'Auditório do ZooMonitor, Recife - PE, Brasil',
                description: 'Conferência sobre o futuro do monitoramento de fauna.',
                image: '../images/7d9a32_3472cee9f04242d09611359b68ad7296~mv2.avif',
                status: 'tickets_available',
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.123!2d-34.881!3d-8.052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMDMnMDcuMiJTIDM0wrA1Mic1MS42Ilc!5e0!3m2!1spt-BR!2sbr!4v1234567890&q=Recife+-+PE'
            }
        };

        return eventosData[eventoId] || {
            id: eventoId,
            title: eventoTitle,
            date: '2025-11-02',
            time: '10:27 - 12:27',
            location: 'Local a definir',
            fullLocation: 'Local a definir',
            description: 'Detalhes do evento em breve.',
            image: '../images/evento-default.jpg',
            status: 'tickets_available',
            mapUrl: ''
        };
    }

    renderEventoDetail(eventoData) {
        const detailView = document.getElementById('eventosDetailView');
        if (!detailView) return;

        const formattedDate = this.formatFullDate(eventoData.date, eventoData.time);
        const statusText = eventoData.status === 'registration_closed' 
            ? 'O registro está fechado' 
            : 'Os ingressos estão à venda';
        const statusLink = eventoData.status === 'registration_closed'
            ? 'Ver outros eventos'
            : 'Ver e obter ingressos';

        detailView.innerHTML = `
            <button class="evento-detail-back" id="eventoDetailBack" aria-label="Voltar">
                <span>←</span> Voltar
            </button>
            <div class="evento-detail-content">
                <div class="evento-detail-header">
                    <h1 class="evento-detail-title">${eventoData.title}</h1>
                    <p class="evento-detail-date">${this.formatShortDate(eventoData.date)} | ${eventoData.location}</p>
                    <p class="evento-detail-description">${eventoData.description}</p>
                    <div class="evento-detail-ticket-box">
                        <p class="evento-detail-ticket-text">${statusText}</p>
                        <a href="#" class="evento-detail-other-events" id="eventoDetailOtherEvents">${statusLink}</a>
                    </div>
                </div>

                <div class="evento-detail-image-section">
                    <img src="${eventoData.image}" alt="${eventoData.title}" class="evento-detail-main-image">
                </div>

                <div class="evento-detalhes-content">
                    <div class="evento-detalhes-info">
                        <h2 class="evento-detalhes-title">Horário e local</h2>
                        <p class="evento-detalhes-item">${formattedDate}</p>
                        <p class="evento-detalhes-item">${eventoData.fullLocation}</p>
                        
                        <h2 class="evento-detalhes-title">Sobre o evento</h2>
                        <p class="evento-detalhes-item">${eventoData.description}</p>
                    </div>
                    
                    ${eventoData.mapUrl ? `
                    <div class="evento-detalhes-map">
                        <iframe 
                            src="${eventoData.mapUrl}" 
                            width="100%" 
                            height="450" 
                            style="border:0;" 
                            allowfullscreen="" 
                            loading="lazy" 
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                    ` : ''}
                    
                    <div class="evento-detalhes-share">
                        <h2 class="evento-detalhes-title">Compartilhe esse evento</h2>
                        <div class="evento-share-icons">
                            <a href="#" class="share-icon" aria-label="Facebook" onclick="shareEvent('facebook', '${eventoData.title}'); return false;">f</a>
                            <a href="#" class="share-icon" aria-label="Twitter" onclick="shareEvent('twitter', '${eventoData.title}'); return false;">X</a>
                            <a href="#" class="share-icon" aria-label="LinkedIn" onclick="shareEvent('linkedin', '${eventoData.title}'); return false;">in</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Adicionar event listeners
        const backButton = detailView.querySelector('#eventoDetailBack');
        if (backButton) {
            backButton.addEventListener('click', () => this.goBack());
            backButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.goBack();
            });
        }

        const otherEventsLink = detailView.querySelector('#eventoDetailOtherEvents');
        if (otherEventsLink) {
            otherEventsLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (eventoData.status === 'registration_closed') {
                    this.goBack();
                } else {
                    // Ação para obter ingressos
                    if (window.notifications) {
                        window.notifications.info('Redirecionando para página de ingressos...');
                    }
                }
            });
        }
    }

    formatFullDate(dateString, timeString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const dateFormatted = date.toLocaleDateString('pt-BR', options);
        return timeString ? `${dateFormatted}, ${timeString}` : dateFormatted;
    }

    formatShortDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { weekday: 'short', day: '2-digit', month: 'short' };
        return date.toLocaleDateString('pt-BR', options);
    }

    showDetailView() {
        const detailView = document.getElementById('eventosDetailView');
        const eventosCards = document.querySelector('.eventos-cards');
        const eventosHeader = document.querySelector('.eventos-header');

        if (!detailView) return;

        // Esconder lista e header
        if (eventosCards) {
            eventosCards.style.display = 'none';
        }
        if (eventosHeader) {
            eventosHeader.style.display = 'none';
        }

        // Mostrar detalhes
        detailView.style.display = 'block';
        this.currentView = 'detail';

        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    goBack() {
        if (this.stack.length > 0) {
            this.stack.pop();
        }

        const detailView = document.getElementById('eventosDetailView');
        const eventosCards = document.querySelector('.eventos-cards');
        const eventosHeader = document.querySelector('.eventos-header');

        if (!detailView) return;

        // Esconder detalhes
        detailView.style.display = 'none';

        // Mostrar lista e header
        if (eventosCards) {
            eventosCards.style.display = 'grid';
        }
        if (eventosHeader) {
            eventosHeader.style.display = 'block';
        }
        this.currentView = 'list';

        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Função global para compartilhar evento
function shareEvent(platform, title) {
    const url = window.location.href;
    const text = `Confira o evento: ${title}`;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.eventos-page')) {
            window.eventosStack = new EventosStack();
        }
    });
} else {
    if (document.querySelector('.eventos-page')) {
        window.eventosStack = new EventosStack();
    }
}

