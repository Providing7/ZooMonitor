// ========================================
// CHATBOT - ZooMonitor
// ========================================

class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.setupEventListeners();
        this.loadChatHistory();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <div id="chatbot-button" class="chatbot-button" aria-label="Abrir chat">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div id="chatbot-window" class="chatbot-window">
                    <div class="chatbot-header">
                        <h3>ZooMonitor Assistente</h3>
                        <button id="chatbot-close" class="chatbot-close" aria-label="Fechar chat">×</button>
                    </div>
                    <div id="chatbot-messages" class="chatbot-messages">
                        <div class="chatbot-message chatbot-message-bot">
                            <div class="chatbot-avatar">🤖</div>
                            <div class="chatbot-text">
                                Olá! Sou o assistente do ZooMonitor. Como posso ajudar você hoje?
                            </div>
                        </div>
                    </div>
                    <div class="chatbot-input-container">
                        <input 
                            type="text" 
                            id="chatbot-input" 
                            class="chatbot-input" 
                            placeholder="Digite sua mensagem..."
                            aria-label="Digite sua mensagem"
                        />
                        <button id="chatbot-send" class="chatbot-send" aria-label="Enviar mensagem">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    setupEventListeners() {
        const button = document.getElementById('chatbot-button');
        const close = document.getElementById('chatbot-close');
        const send = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        button.addEventListener('click', () => this.toggle());
        close.addEventListener('click', () => this.close());
        send.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-button');
        
        if (this.isOpen) {
            window.classList.add('chatbot-window-open');
            button.classList.add('chatbot-button-hidden');
            document.getElementById('chatbot-input').focus();
        } else {
            this.close();
        }
    }

    close() {
        this.isOpen = false;
        const window = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-button');
        
        window.classList.remove('chatbot-window-open');
        button.classList.remove('chatbot-button-hidden');
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        input.value = '';

        // Mostrar indicador de digitação
        this.showTypingIndicator();

        // Processar resposta
        const response = await this.getBotResponse(message);
        
        // Remover indicador e adicionar resposta
        this.removeTypingIndicator();
        this.addMessage(response, 'bot');

        // Salvar no histórico
        this.saveChatHistory();
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message chatbot-message-${sender}`;

        const avatar = sender === 'bot' ? '🤖' : '👤';
        
        messageDiv.innerHTML = `
            <div class="chatbot-avatar">${avatar}</div>
            <div class="chatbot-text">${this.escapeHtml(text)}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Salvar mensagem
        this.messages.push({ text, sender, timestamp: Date.now() });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'chatbot-typing';
        typingDiv.className = 'chatbot-message chatbot-message-bot';
        typingDiv.innerHTML = `
            <div class="chatbot-avatar">🤖</div>
            <div class="chatbot-text chatbot-typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typing = document.getElementById('chatbot-typing');
        if (typing) {
            typing.remove();
        }
    }

    async getBotResponse(message) {
        // Respostas pré-definidas baseadas em palavras-chave
        const lowerMessage = message.toLowerCase();

        // Respostas sobre o sistema
        if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('hello')) {
            return 'Olá! Como posso ajudar você hoje? Posso responder sobre nossos serviços, eventos, programas ou agendamentos.';
        }

        if (lowerMessage.includes('serviço') || lowerMessage.includes('servicos')) {
            return 'Oferecemos três serviços principais:\n\n1. Análise de Dados - Análise completa de dados de monitoramento\n2. Consulta de Suporte - Suporte técnico especializado\n3. Treinamento de Plataforma - Capacitação na ferramenta ZooMonitor\n\nGostaria de mais informações sobre algum deles?';
        }

        if (lowerMessage.includes('evento') || lowerMessage.includes('eventos')) {
            return 'Temos vários eventos disponíveis! Você pode ver todos na página de Eventos. Temos workshops, conferências e palestras sobre monitoramento de vida selvagem. Quer que eu te ajude a encontrar um evento específico?';
        }

        if (lowerMessage.includes('programa') || lowerMessage.includes('programas')) {
            return 'Temos programas educacionais incríveis:\n\n1. Otimizando o Monitoramento de Animais com ZooMonitor\n2. Monitoramento de Vida Selvagem\n3. Coleta e Análise de Dados para Bem-Estar\n\nTodos estão disponíveis na página de Programas!';
        }

        if (lowerMessage.includes('agendamento') || lowerMessage.includes('agendar')) {
            return 'Para fazer um agendamento, acesse a página "Agendamento online" no menu. Lá você pode escolher entre nossos serviços e agendar um horário. Precisa de ajuda com algo específico?';
        }

        if (lowerMessage.includes('grupo') || lowerMessage.includes('grupos')) {
            return 'Nossos grupos são comunidades onde você pode compartilhar experiências, fazer perguntas e conectar-se com outros profissionais. Acesse a página de Grupos para ver os grupos disponíveis!';
        }

        if (lowerMessage.includes('cadastro') || lowerMessage.includes('registro') || lowerMessage.includes('cadastrar')) {
            return 'Para se cadastrar, acesse a página de Membros. Você pode se registrar com email, Google ou Facebook. É rápido e fácil!';
        }

        if (lowerMessage.includes('preço') || lowerMessage.includes('preco') || lowerMessage.includes('valor') || lowerMessage.includes('custo')) {
            return 'Nossos preços variam conforme o serviço. Alguns programas são gratuitos! Acesse as páginas de Serviços ou Programas para ver os valores detalhados.';
        }

        if (lowerMessage.includes('contato') || lowerMessage.includes('falar') || lowerMessage.includes('suporte')) {
            return 'Você pode entrar em contato conosco através do email no rodapé do site ou fazer uma consulta de suporte na página de Agendamento. Estou aqui para ajudar também!';
        }

        // Tentar usar API de chatbot (se configurada)
        try {
            const apiResponse = await this.callChatbotAPI(message);
            if (apiResponse) {
                return apiResponse;
            }
        } catch (error) {
            console.log('API de chatbot não disponível, usando respostas padrão');
        }

        // Resposta padrão
        return 'Entendi sua pergunta! Posso ajudar com informações sobre:\n\n• Nossos serviços\n• Eventos e programas\n• Agendamentos\n• Grupos e comunidades\n• Cadastro e login\n\nPode reformular sua pergunta ou escolher um desses tópicos?';
    }

    async callChatbotAPI(message) {
        // Integração com API de chatbot (OpenAI, Dialogflow, etc.)
        // Exemplo com OpenAI (requer API key)
        
        const API_KEY = window.CHATBOT_API_KEY; // Configurar no HTML
        if (!API_KEY) return null;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um assistente virtual do ZooMonitor, uma plataforma de monitoramento inteligente para vida selvagem. Seja prestativo, amigável e forneça informações sobre serviços, eventos, programas e agendamentos.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Erro ao chamar API de chatbot:', error);
            return null;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    saveChatHistory() {
        localStorage.setItem('chatbot-history', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const history = localStorage.getItem('chatbot-history');
        if (history) {
            try {
                this.messages = JSON.parse(history);
                // Mostrar últimas 10 mensagens
                const recentMessages = this.messages.slice(-10);
                recentMessages.forEach(msg => {
                    if (msg.sender !== 'user' || msg.text !== '') {
                        // Não recarregar mensagem inicial do bot
                    }
                });
            } catch (error) {
                console.error('Erro ao carregar histórico:', error);
            }
        }
    }
}

// Inicializar chatbot quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chatbot = new Chatbot();
    });
} else {
    window.chatbot = new Chatbot();
}

