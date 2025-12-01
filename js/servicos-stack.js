// ========================================
// SISTEMA DE NAVEGAÇÃO EM PILHA (STACK) PARA SERVIÇOS
// ========================================

class ServicosStack {
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
    }

    createStackContainer() {
        const agendamentoPage = document.querySelector('.agendamento-page');
        if (!agendamentoPage) return;

        const container = agendamentoPage.querySelector('.container');
        if (!container) return;

        // Criar view de detalhes (a lista já existe no HTML)
        const detailView = document.createElement('div');
        detailView.className = 'servico-stack-view servico-stack-detail';
        detailView.id = 'servicoDetailView';
        detailView.style.display = 'none';
        
        // Inserir após os cards
        const servicosCards = container.querySelector('.servicos-cards');
        if (servicosCards && servicosCards.parentNode) {
            servicosCards.parentNode.insertBefore(detailView, servicosCards.nextSibling);
        } else {
            container.appendChild(detailView);
        }
    }

    attachEventListeners() {
        // Delegar eventos para os botões dos cards
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.servico-card-button');
            if (!button) return;

            const card = button.closest('.servico-card');
            if (!card) return;

            const servicoName = card.querySelector('.servico-card-name')?.textContent || '';
            
            // Verificar se é o botão "Ver curso" do Treinamento de Plataforma
            if (button.textContent.trim() === 'Ver curso' && servicoName === 'Treinamento de Plataforma') {
                e.preventDefault();
                this.showServicoDetail('treinamento-plataforma', servicoName, card);
            }
        });
    }

    async showServicoDetail(servicoId, servicoName, cardElement) {
        // Adicionar à pilha
        this.stack.push({
            view: 'detail',
            servicoId: servicoId,
            servicoName: servicoName
        });

        // Carregar dados do serviço
        const servicoData = this.getServicoData(servicoId, servicoName, cardElement);
        
        // Renderizar detalhes
        this.renderServicoDetail(servicoData);

        // Mostrar view de detalhes
        this.showDetailView();
    }

    getServicoData(servicoId, servicoName, cardElement) {
        // Dados estáticos baseados no ID do serviço
        const servicosData = {
            'treinamento-plataforma': {
                id: 'treinamento-plataforma',
                name: 'Treinamento de Plataforma',
                subtitle: 'Domine a plataforma ZooMonitor e melhore a gestão de seus dados',
                status: 'Encerrado',
                price: 'R$ 400',
                address: 'Rua Dom Manoel da Costa',
                fullAddress: 'Rua Dom Manoel da Costa - Torre, Recife - State of Pernambuco, Brazil',
                phone: '(11) 3456-7890',
                email: 'info@zoomonitor.com',
                description: 'Aprenda a utilizar a plataforma ZooMonitor para coletar e analisar dados de saúde, comportamento e alimentação de animais de forma eficaz. Curso com duração de 4 horas, dividido em 2 módulos.',
                image: '../images/Treinamento.jpg',
                isAvailable: false,
                vagasDisponiveis: null
            }
        };

        return servicosData[servicoId] || {
            id: servicoId,
            name: servicoName,
            subtitle: '',
            status: '',
            price: '',
            address: '',
            fullAddress: '',
            phone: '(11) 3456-7890',
            email: 'info@zoomonitor.com',
            description: 'Detalhes do serviço em breve.',
            image: '../images/servico-default.jpg',
            isAvailable: true,
            vagasDisponiveis: null
        };
    }

    renderServicoDetail(servicoData) {
        const detailView = document.getElementById('servicoDetailView');
        if (!detailView) return;

        detailView.innerHTML = `
            <button class="servico-detail-back" id="servicoDetailBack" aria-label="Voltar">
                <span>←</span> Voltar
            </button>
            <div class="servico-detail-content">
                ${servicoData.isAvailable ? '' : `
                <div class="servico-unavailable-alert">
                    <p>Esse serviço não está disponível. Contate-nos para obter mais informações.</p>
                </div>
                `}
                
                <div class="servico-detail-header">
                    <h1 class="servico-detail-title">${servicoData.name}</h1>
                    ${servicoData.subtitle ? `<p class="servico-detail-subtitle">${servicoData.subtitle}</p>` : ''}
                </div>

                <div class="servico-detail-info-boxes">
                    ${servicoData.status ? `
                    <div class="servico-info-box">
                        <span class="servico-info-label">${servicoData.status}</span>
                    </div>
                    ` : ''}
                    ${servicoData.price ? `
                    <div class="servico-info-box">
                        <span class="servico-info-label">${servicoData.price}</span>
                    </div>
                    ` : ''}
                    ${servicoData.address ? `
                    <div class="servico-info-box">
                        <span class="servico-info-label">${servicoData.address}</span>
                    </div>
                    ` : ''}
                </div>

                ${servicoData.vagasDisponiveis !== null ? `
                <div class="servico-detail-section">
                    <h2 class="servico-detail-section-title">Vagas disponíveis</h2>
                    <p class="servico-detail-section-content">${servicoData.vagasDisponiveis}</p>
                </div>
                ` : ''}

                <div class="servico-detail-section">
                    <h2 class="servico-detail-section-title">Descrição do serviço</h2>
                    <p class="servico-detail-section-content">${servicoData.description}</p>
                </div>

                <div class="servico-detail-section">
                    <h2 class="servico-detail-section-title">Informações de contato</h2>
                    <div class="servico-contact-info">
                        <p class="servico-contact-item">${servicoData.fullAddress}</p>
                        <p class="servico-contact-item">${servicoData.phone}</p>
                        <p class="servico-contact-item">${servicoData.email}</p>
                    </div>
                </div>
            </div>
        `;

        // Adicionar event listeners
        const backButton = detailView.querySelector('#servicoDetailBack');
        if (backButton) {
            backButton.addEventListener('click', () => this.goBack());
            backButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.goBack();
            });
        }
    }

    showDetailView() {
        const detailView = document.getElementById('servicoDetailView');
        const servicosCards = document.querySelector('.servicos-cards');
        const agendamentoTitle = document.querySelector('.agendamento-title');

        if (!detailView) return;

        // Esconder lista e título
        if (servicosCards) {
            servicosCards.style.display = 'none';
        }
        if (agendamentoTitle) {
            agendamentoTitle.style.display = 'none';
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

        const detailView = document.getElementById('servicoDetailView');
        const servicosCards = document.querySelector('.servicos-cards');
        const agendamentoTitle = document.querySelector('.agendamento-title');

        if (!detailView) return;

        // Esconder detalhes
        detailView.style.display = 'none';

        // Mostrar lista e título
        if (servicosCards) {
            servicosCards.style.display = 'grid';
        }
        if (agendamentoTitle) {
            agendamentoTitle.style.display = 'block';
        }
        this.currentView = 'list';

        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.agendamento-page')) {
            window.servicosStack = new ServicosStack();
        }
    });
} else {
    if (document.querySelector('.agendamento-page')) {
        window.servicosStack = new ServicosStack();
    }
}

