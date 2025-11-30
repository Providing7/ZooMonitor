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

        let avatarHTML;
        if (sender === 'bot') {
            avatarHTML = '<div class="chatbot-avatar">🤖</div>';
        } else {
            // Usar foto do perfil do usuário se disponível
            const userAvatar = this.getUserAvatar();
            if (userAvatar) {
                avatarHTML = `<div class="chatbot-avatar chatbot-avatar-image"><img src="${userAvatar}" alt="Você" onerror="this.parentElement.innerHTML='👤'"></div>`;
            } else {
                avatarHTML = '<div class="chatbot-avatar">👤</div>';
            }
        }
        
        messageDiv.innerHTML = `
            ${avatarHTML}
            <div class="chatbot-text">${this.escapeHtml(text)}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Salvar mensagem
        this.messages.push({ text, sender, timestamp: Date.now() });
    }

    getUserAvatar() {
        // Tentar obter avatar do perfil do usuário
        if (window.currentUserProfile && window.currentUserProfile.avatar_url) {
            return window.currentUserProfile.avatar_url;
        }
        
        // Se não tiver avatar, gerar um baseado no nome
        if (window.currentUserProfile) {
            const displayName = window.currentUserProfile.full_name || window.currentUserProfile.email?.split('@')[0] || 'Usuário';
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2d5a3d&color=fff&size=128`;
        }
        
        return null;
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

        if (lowerMessage.includes('serviço') || lowerMessage.includes('servicos') || lowerMessage.includes('serviços') || lowerMessage.includes('fale sobre')) {
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
            if (apiResponse && apiResponse.trim()) {
                console.log('Resposta da API:', apiResponse);
                return apiResponse;
            }
        } catch (error) {
            console.error('Erro ao chamar API de chatbot:', error);
        }

        // Resposta padrão
        return 'Entendi sua pergunta! Posso ajudar com informações sobre:\n\n• Nossos serviços\n• Eventos e programas\n• Agendamentos\n• Grupos e comunidades\n• Cadastro e login\n\nPode reformular sua pergunta ou escolher um desses tópicos?';
    }

    async callChatbotAPI(message) {
        // Suporta múltiplas APIs de IA gratuitas
        // Prioridade: Google Gemini (gratuito) > OpenAI > Hugging Face
        
        // Função auxiliar para obter variáveis de ambiente
        const getEnvVar = (key) => {
            // Tentar window.env primeiro (configurado via script no HTML)
            if (window.env && window.env[key]) {
                return window.env[key];
            }
            // Tentar variável global direta
            if (window[key]) {
                return window[key];
            }
            return null;
        };
        
        // 1. Tentar Google Gemini (GRATUITO - Recomendado)
        const geminiKey = getEnvVar('VITE_GEMINI_API_KEY') || window.GEMINI_API_KEY;
        console.log('Chave Gemini encontrada:', geminiKey ? 'Sim' : 'Não');
        if (geminiKey) {
            try {
                console.log('Tentando usar Gemini API...');
                return await this.callGeminiAPI(message, geminiKey);
            } catch (error) {
                console.error('Erro no Gemini:', error);
                // Continuar para tentar outras APIs ou usar fallback
            }
        } else {
            console.log('Chave Gemini não configurada');
        }

        // 2. Tentar OpenAI (pago, mas pode ter créditos gratuitos)
        const openaiKey = getEnvVar('VITE_OPENAI_API_KEY') || window.CHATBOT_API_KEY;
        if (openaiKey) {
            try {
                return await this.callOpenAIAPI(message, openaiKey);
            } catch (error) {
                console.log('Erro no OpenAI, tentando outras APIs...', error);
            }
        }

        // 3. Tentar Hugging Face (gratuito, mas mais lento)
        const hfKey = getEnvVar('VITE_HUGGINGFACE_API_KEY') || window.HUGGINGFACE_API_KEY;
        if (hfKey) {
            try {
                return await this.callHuggingFaceAPI(message, hfKey);
            } catch (error) {
                console.log('Erro no Hugging Face', error);
            }
        }

        // Nenhuma API configurada ou todas falharam
        console.log('Nenhuma API de IA configurada. Usando respostas pré-definidas.');
        return null;
    }

    async callGeminiAPI(message, apiKey) {
        // Google Gemini - GRATUITO e de alta qualidade
        const systemPrompt = `Você é o assistente virtual do ZooMonitor, uma plataforma especializada em monitoramento inteligente de vida selvagem.

Sua função é:
- Responder perguntas sobre nossos serviços (Análise de Dados, Consulta de Suporte, Treinamento)
- Informar sobre eventos e programas educacionais
- Ajudar com agendamentos
- Orientar sobre grupos e comunidades
- Ser prestativo, amigável e profissional

Sempre responda em português brasileiro de forma clara e objetiva. Seja conciso mas completo.`;

        // Construir histórico de conversa
        const conversationHistory = this.messages
            .slice(-4) // Últimas 4 mensagens para contexto
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

        console.log('Chamando API Gemini...');
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `${systemPrompt}\n\nUsuário: ${message}` }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 200
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erro na API Gemini:', errorData);
            throw new Error(`Gemini API erro: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Resposta da Gemini:', data);
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Formato de resposta inesperado:', data);
            throw new Error('Resposta da Gemini em formato inesperado');
        }

        const responseText = data.candidates[0].content.parts[0].text.trim();
        console.log('Texto extraído:', responseText);
        return responseText;
    }

    async callOpenAIAPI(message, apiKey) {
        // OpenAI (pago, mas pode ter créditos gratuitos)
        const conversationHistory = this.messages
            .slice(-6)
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Você é o assistente virtual do ZooMonitor, uma plataforma especializada em monitoramento inteligente de vida selvagem. Responda em português brasileiro de forma clara e objetiva.`
                    },
                    ...conversationHistory,
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API erro: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    async callHuggingFaceAPI(message, apiKey) {
        // Hugging Face - Gratuito mas mais lento
        const response = await fetch(
            'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: message,
                    parameters: {
                        max_length: 150
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Hugging Face API erro: ${response.status}`);
        }

        const data = await response.json();
        return data[0]?.generated_text || data.generated_text || null;
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

