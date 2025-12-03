// ========================================
// SISTEMA DE AGENDAMENTOS EM PILHA (STACK)
// ========================================

class AgendamentosStack {
    constructor() {
        this.stack = [];
        this.currentView = 'list'; // 'list' ou 'agendamentos'
        this.agendamentos = []; // Inicializar array de agendamentos
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

        // Criar view de agendamentos (a lista já existe no HTML)
        const agendamentosView = document.createElement('div');
        agendamentosView.className = 'agendamentos-stack-view agendamentos-stack-detail';
        agendamentosView.id = 'agendamentosView';
        agendamentosView.style.display = 'none';
        
        // Inserir após os cards
        const servicosCards = container.querySelector('.servicos-cards');
        if (servicosCards && servicosCards.parentNode) {
            servicosCards.parentNode.insertBefore(agendamentosView, servicosCards.nextSibling);
        } else {
            container.appendChild(agendamentosView);
        }
    }

    attachEventListeners() {
        // Delegar eventos para os botões "Agendar"
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.servico-card-button');
            if (!button) return;

            const card = button.closest('.servico-card');
            if (!card) return;

            const servicoName = card.querySelector('.servico-card-name')?.textContent || '';
            const buttonText = button.textContent.trim();
            
            console.log('Botão clicado:', buttonText, 'Serviço:', servicoName);
            
            // Verificar se é o botão "Agendar" dos serviços disponíveis
            if (buttonText === 'Agendar' && 
                (servicoName === 'Análise de Dados' || servicoName === 'Consulta de Suporte')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Abrindo agendamentos para:', servicoName);
                this.showAgendamentos(servicoName, card);
            }
        });
    }

    async showAgendamentos(servicoName, cardElement) {
        console.log('showAgendamentos chamado para:', servicoName);
        
        // Verificar se Supabase está disponível
        if (!window.supabaseClient) {
            console.error('Supabase client não disponível');
            if (window.notifications) {
                window.notifications.error('Erro ao conectar com o servidor. Tente novamente.');
            } else {
                alert('Erro ao conectar com o servidor. Tente novamente.');
            }
            return;
        }

        // Verificar se o usuário está logado (mas permitir continuar mesmo sem login para testar)
        let user = null;
        try {
            const { data: { user: authUser }, error } = await window.supabaseClient.auth.getUser();
            user = authUser;
            
            if (error) {
                console.warn('Erro ao verificar usuário:', error);
            }
            
            if (!user) {
                console.log('Usuário não logado, mas continuando...');
                // Continuar mesmo sem login para permitir visualizar a interface
            }
        } catch (error) {
            console.warn('Erro ao verificar usuário:', error);
            // Continuar mesmo com erro
        }

        // Adicionar à pilha
        this.stack.push({
            view: 'agendamentos',
            servicoName: servicoName
        });

        // Carregar agendamentos do usuário (se logado)
        if (user) {
            await this.loadAgendamentos();
        } else {
            this.agendamentos = [];
        }

        // Mostrar view de agendamentos
        console.log('Chamando showAgendamentosView...');
        this.showAgendamentosView(servicoName, cardElement);
    }

    async loadAgendamentos() {
        if (!window.supabaseClient) {
            console.warn('Supabase client não disponível');
            return;
        }

        try {
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) return;

            const { data, error } = await window.supabaseClient
                .from('agendamentos')
                .select('*')
                .eq('user_id', user.id)
                .order('scheduled_date', { ascending: true });

            if (error) {
                console.error('Erro ao carregar agendamentos:', error);
                return;
            }

            this.agendamentos = data || [];
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
            this.agendamentos = [];
        }
    }

    showAgendamentosView(servicoName, cardElement) {
        console.log('showAgendamentosView chamado');
        const agendamentosView = document.getElementById('agendamentosView');
        if (!agendamentosView) {
            console.error('View de agendamentos não encontrada. Tentando criar...');
            this.createStackContainer();
            const newView = document.getElementById('agendamentosView');
            if (!newView) {
                console.error('Não foi possível criar a view de agendamentos');
                return;
            }
            return this.showAgendamentosView(servicoName, cardElement);
        }

        console.log('View de agendamentos encontrada, renderizando...');
        // Obter dados do serviço
        const servicoData = this.getServicoData(servicoName, cardElement);

        agendamentosView.innerHTML = `
            <button class="agendamentos-back" id="agendamentosBack" aria-label="Voltar">
                <span>←</span> Voltar
            </button>
            <div class="agendamentos-content">
                <div class="agendamentos-header">
                    <h1 class="agendamentos-title">Meus Agendamentos</h1>
                    <button class="agendamentos-new-button" id="agendamentosNewButton">
                        + Novo Agendamento
                    </button>
                </div>

                <div class="agendamentos-list" id="agendamentosList">
                    ${this.renderAgendamentosList()}
                </div>

                <!-- Modal de Novo Agendamento -->
                <div class="agendamento-modal-overlay" id="agendamentoModal" style="display: none;">
                    <div class="agendamento-modal">
                        <button class="agendamento-modal-close" id="agendamentoModalClose" aria-label="Fechar">×</button>
                        <h2 class="agendamento-modal-title">Novo Agendamento</h2>
                        <form class="agendamento-form" id="agendamentoForm">
                            <input type="hidden" id="agendamentoServicoType" value="${servicoData.type}">
                            <input type="hidden" id="agendamentoServicoName" value="${servicoData.name}">
                            <input type="hidden" id="agendamentoPrice" value="${servicoData.price}">
                            
                            <div class="agendamento-form-group">
                                <label for="agendamentoServico" class="agendamento-form-label">Serviço</label>
                                <input type="text" id="agendamentoServico" class="agendamento-form-input" value="${servicoData.name}" readonly>
                            </div>

                            <div class="agendamento-form-group">
                                <label for="agendamentoDate" class="agendamento-form-label">Data e Hora *</label>
                                <input type="datetime-local" id="agendamentoDate" class="agendamento-form-input" required>
                            </div>

                            <div class="agendamento-form-group">
                                <label for="agendamentoNotes" class="agendamento-form-label">Observações</label>
                                <textarea id="agendamentoNotes" class="agendamento-form-textarea" rows="4" placeholder="Adicione observações sobre o agendamento..."></textarea>
                            </div>

                            <div class="agendamento-form-actions">
                                <button type="button" class="agendamento-form-cancel" id="agendamentoFormCancel">Cancelar</button>
                                <button type="submit" class="agendamento-form-submit">Agendar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Adicionar event listeners
        const backButton = agendamentosView.querySelector('#agendamentosBack');
        if (backButton) {
            backButton.addEventListener('click', () => this.goBack());
            backButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.goBack();
            });
        }

        const newButton = agendamentosView.querySelector('#agendamentosNewButton');
        if (newButton) {
            newButton.addEventListener('click', () => this.openNewAgendamentoModal());
        }

        const modal = agendamentosView.querySelector('#agendamentoModal');
        const modalClose = agendamentosView.querySelector('#agendamentoModalClose');
        const modalCancel = agendamentosView.querySelector('#agendamentoFormCancel');
        const form = agendamentosView.querySelector('#agendamentoForm');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeNewAgendamentoModal());
        }

        if (modalCancel) {
            modalCancel.addEventListener('click', () => this.closeNewAgendamentoModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeNewAgendamentoModal();
                }
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createAgendamento(form);
            });
        }

        // Adicionar listeners para ações dos agendamentos
        this.attachAgendamentoActions();

        // Agora esconder lista e mostrar agendamentos
        const servicosCards = document.querySelector('.servicos-cards');
        const agendamentoTitle = document.querySelector('.agendamento-title');

        // Esconder lista e título
        if (servicosCards) {
            servicosCards.style.display = 'none';
        }
        if (agendamentoTitle) {
            agendamentoTitle.style.display = 'none';
        }

        // Mostrar agendamentos
        agendamentosView.style.display = 'block';
        this.currentView = 'agendamentos';

        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getServicoData(servicoName, cardElement) {
        const servicosData = {
            'Análise de Dados': {
                type: 'analise_dados',
                name: 'Análise de Dados',
                price: 150
            },
            'Consulta de Suporte': {
                type: 'consulta_suporte',
                name: 'Consulta de Suporte',
                price: 100
            }
        };

        return servicosData[servicoName] || {
            type: 'analise_dados',
            name: servicoName,
            price: 0
        };
    }

    renderAgendamentosList() {
        if (!this.agendamentos || this.agendamentos.length === 0) {
            return `
                <div class="agendamentos-empty">
                    <p class="agendamentos-empty-text">Você ainda não possui agendamentos.</p>
                    <p class="agendamentos-empty-subtext">Clique em "Novo Agendamento" para criar um.</p>
                </div>
            `;
        }

        return this.agendamentos.map(agendamento => {
            const date = new Date(agendamento.scheduled_date);
            const formattedDate = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const statusLabels = {
                'pending': 'Pendente',
                'confirmed': 'Confirmado',
                'completed': 'Concluído',
                'cancelled': 'Cancelado'
            };

            const statusColors = {
                'pending': '#FFA500',
                'confirmed': '#28A745',
                'completed': '#6C757D',
                'cancelled': '#DC3545'
            };

            return `
                <div class="agendamento-item" data-agendamento-id="${agendamento.id}">
                    <div class="agendamento-item-content">
                        <div class="agendamento-item-info">
                            <h3 class="agendamento-item-name">${agendamento.servico_name}</h3>
                            <p class="agendamento-item-date">${formattedDate}</p>
                            ${agendamento.notes ? `<p class="agendamento-item-notes">${agendamento.notes}</p>` : ''}
                        </div>
                        <div class="agendamento-item-meta">
                            <span class="agendamento-item-status" style="background-color: ${statusColors[agendamento.status] || '#6C757D'}">
                                ${statusLabels[agendamento.status] || agendamento.status}
                            </span>
                            <p class="agendamento-item-price">R$ ${parseFloat(agendamento.price || 0).toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="agendamento-item-actions">
                        ${agendamento.status === 'pending' || agendamento.status === 'confirmed' ? `
                        <button class="agendamento-item-cancel" data-agendamento-id="${agendamento.id}">Cancelar</button>
                        ` : ''}
                        <button class="agendamento-item-delete" data-agendamento-id="${agendamento.id}">Excluir</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    attachAgendamentoActions() {
        const agendamentosView = document.getElementById('agendamentosView');
        if (!agendamentosView) return;

        // Cancelar agendamento
        agendamentosView.addEventListener('click', async (e) => {
            if (e.target.classList.contains('agendamento-item-cancel')) {
                const agendamentoId = e.target.dataset.agendamentoId;
                await this.cancelAgendamento(agendamentoId);
            }
        });

        // Deletar agendamento
        agendamentosView.addEventListener('click', async (e) => {
            if (e.target.classList.contains('agendamento-item-delete')) {
                const agendamentoId = e.target.dataset.agendamentoId;
                const confirmed = await this.showDeleteConfirmation();
                if (confirmed) {
                    await this.deleteAgendamento(agendamentoId);
                }
            }
        });
    }

    openNewAgendamentoModal() {
        const modal = document.getElementById('agendamentoModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeNewAgendamentoModal() {
        const modal = document.getElementById('agendamentoModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    async createAgendamento(form) {
        if (!window.supabaseClient) {
            console.error('Supabase client não disponível');
            return;
        }

        try {
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) {
                if (window.notifications) {
                    window.notifications.error('Por favor, faça login para criar agendamentos.');
                }
                return;
            }

            const servicoType = form.querySelector('#agendamentoServicoType').value;
            const servicoName = form.querySelector('#agendamentoServicoName').value;
            const price = parseFloat(form.querySelector('#agendamentoPrice').value);
            const scheduledDate = form.querySelector('#agendamentoDate').value;
            const notes = form.querySelector('#agendamentoNotes').value;

            if (!scheduledDate) {
                if (window.notifications) {
                    window.notifications.warning('Por favor, selecione uma data e hora.');
                }
                return;
            }

            const { data, error } = await window.supabaseClient
                .from('agendamentos')
                .insert([
                    {
                        user_id: user.id,
                        servico_type: servicoType,
                        servico_name: servicoName,
                        price: price,
                        scheduled_date: scheduledDate,
                        notes: notes || null,
                        status: 'pending'
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar agendamento:', error);
                if (window.notifications) {
                    window.notifications.error('Erro ao criar agendamento. Tente novamente.');
                }
                return;
            }

            if (window.notifications) {
                window.notifications.success('Agendamento criado com sucesso!');
            }

            // Recarregar agendamentos
            await this.loadAgendamentos();
            
            // Atualizar lista
            const list = document.getElementById('agendamentosList');
            if (list) {
                list.innerHTML = this.renderAgendamentosList();
            }

            // Fechar modal e limpar formulário
            this.closeNewAgendamentoModal();
            form.reset();
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            if (window.notifications) {
                window.notifications.error('Erro ao criar agendamento. Tente novamente.');
            }
        }
    }

    async cancelAgendamento(agendamentoId) {
        if (!window.supabaseClient) return;

        try {
            const { error } = await window.supabaseClient
                .from('agendamentos')
                .update({ status: 'cancelled' })
                .eq('id', agendamentoId);

            if (error) {
                console.error('Erro ao cancelar agendamento:', error);
                if (window.notifications) {
                    window.notifications.error('Erro ao cancelar agendamento.');
                }
                return;
            }

            if (window.notifications) {
                window.notifications.success('Agendamento cancelado com sucesso!');
            }

            // Recarregar agendamentos
            await this.loadAgendamentos();
            
            // Atualizar lista
            const list = document.getElementById('agendamentosList');
            if (list) {
                list.innerHTML = this.renderAgendamentosList();
            }
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
        }
    }

    /**
     * Mostrar modal de confirmação de exclusão
     * @returns {Promise<boolean>} true se confirmado, false se cancelado
     */
    showDeleteConfirmation() {
        return new Promise((resolve) => {
            // Verificar se já existe um modal
            let modal = document.getElementById('deleteAgendamentoModal');
            if (modal) {
                modal.remove();
            }

            // Criar modal
            modal = document.createElement('div');
            modal.id = 'deleteAgendamentoModal';
            modal.className = 'delete-confirmation-modal-overlay';
            modal.innerHTML = `
                <div class="delete-confirmation-modal">
                    <div class="delete-confirmation-icon">⚠️</div>
                    <h2 class="delete-confirmation-title">Confirmar Exclusão</h2>
                    <p class="delete-confirmation-message">
                        Tem certeza que deseja excluir este agendamento?<br>
                        <span class="delete-confirmation-warning">Esta ação não pode ser desfeita.</span>
                    </p>
                    <div class="delete-confirmation-actions">
                        <button class="delete-confirmation-cancel" id="deleteConfirmationCancel">
                            Cancelar
                        </button>
                        <button class="delete-confirmation-confirm" id="deleteConfirmationConfirm">
                            Excluir
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            // Animar entrada
            setTimeout(() => {
                modal.classList.add('delete-confirmation-modal-show');
            }, 10);

            // Event listeners
            const cancelBtn = modal.querySelector('#deleteConfirmationCancel');
            const confirmBtn = modal.querySelector('#deleteConfirmationConfirm');

            const closeModal = (result) => {
                modal.classList.remove('delete-confirmation-modal-show');
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                    resolve(result);
                }, 200);
            };

            cancelBtn.addEventListener('click', () => closeModal(false));
            confirmBtn.addEventListener('click', () => closeModal(true));

            // Fechar ao clicar no overlay
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(false);
                }
            });

            // Fechar com ESC
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    closeModal(false);
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        });
    }

    async deleteAgendamento(agendamentoId) {
        if (!window.supabaseClient) return;

        try {
            const { error } = await window.supabaseClient
                .from('agendamentos')
                .delete()
                .eq('id', agendamentoId);

            if (error) {
                console.error('Erro ao deletar agendamento:', error);
                if (window.notifications) {
                    window.notifications.error('Erro ao excluir agendamento.');
                }
                return;
            }

            if (window.notifications) {
                window.notifications.success('Agendamento excluído com sucesso!');
            }

            // Recarregar agendamentos
            await this.loadAgendamentos();
            
            // Atualizar lista
            const list = document.getElementById('agendamentosList');
            if (list) {
                list.innerHTML = this.renderAgendamentosList();
            }
        } catch (error) {
            console.error('Erro ao deletar agendamento:', error);
        }
    }


    goBack() {
        if (this.stack.length > 0) {
            this.stack.pop();
        }

        const agendamentosView = document.getElementById('agendamentosView');
        const servicosCards = document.querySelector('.servicos-cards');
        const agendamentoTitle = document.querySelector('.agendamento-title');

        if (!agendamentosView) return;

        // Esconder agendamentos
        agendamentosView.style.display = 'none';

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
            window.agendamentosStack = new AgendamentosStack();
        }
    });
} else {
    if (document.querySelector('.agendamento-page')) {
        window.agendamentosStack = new AgendamentosStack();
    }
}

