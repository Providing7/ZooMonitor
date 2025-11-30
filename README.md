# ZooMonitor - Site Institucional

Site institucional do ZooMonitor, plataforma de monitoramento inteligente para a vida selvagem.

## 📁 Estrutura do Projeto (MVC)

O projeto está organizado seguindo o padrão MVC (Model-View-Controller) para melhor organização e manutenibilidade:

```
ZooMonitorPE/
│
├── index.html                  # Página inicial (ponto de entrada)
│
├── pages/                      # Views (Páginas HTML)
│   ├── workshop.html
│   ├── grupos.html
│   ├── membros.html
│   ├── agendamento-online.html
│   ├── lista-programas.html
│   ├── eventos.html
│   └── programa-otimizando.html
│
├── css/                        # Estilos CSS
│   ├── global/                 # Estilos globais compartilhados
│   │   └── styles.css          # Reset, variáveis, header, dropdown
│   │
│   └── pages/                  # CSS específicos de cada página
│       ├── index.css
│       ├── workshop.css
│       ├── grupos.css
│       ├── membros.css
│       ├── agendamento-online.css
│       ├── lista-programas.css
│       ├── eventos.css
│       └── programa-detalhes.css
│
├── js/                         # Scripts JavaScript
│   └── script.js               # Funções compartilhadas
│
└── images/                     # Imagens e assets visuais
    ├── hero-elefante.jpg
    ├── leopardo-1.avif
    ├── leopardo-2.avif
    └── ... (outras imagens)
```

## 🔗 Como Funcionam os Caminhos

### Na Página Principal (index.html na raiz)
- **CSS Global**: `css/global/styles.css`
- **CSS da Página**: `css/pages/index.css`
- **JavaScript**: `js/script.js`
- **Imagens**: `images/nome-da-imagem.jpg`
- **Outras Páginas**: `pages/nome-da-pagina.html`

### Nas Páginas em pages/
- **CSS Global**: `../css/global/styles.css`
- **CSS da Página**: `../css/pages/nome-da-pagina.css`
- **JavaScript**: `../js/script.js`
- **Imagens**: `../images/nome-da-imagem.jpg`
- **Outras Páginas**: `nome-da-pagina.html` (mesma pasta) ou `../index.html` (home)

### Nos Arquivos CSS
- **Imagens**: `../../images/nome-da-imagem.jpg` (de `css/pages/` ou `css/global/`)

## 🚀 Como Usar

1. Abra o arquivo `index.html` no navegador
2. Todas as imagens devem estar na pasta `images/`
3. O site está pronto para uso!

## ✨ Características

- ✅ Design responsivo
- ✅ Scroll suave entre seções
- ✅ Header que muda ao fazer scroll
- ✅ Formulário de newsletter funcional
- ✅ Animações de entrada suave
- ✅ Estrutura MVC organizada
- ✅ CSS separado por página
- ✅ Navegação com dropdown menu
- ✅ Visual moderno com essência de zoológico

## 📝 Páginas Disponíveis

- **Home** (`index.html`) - Página inicial com todas as seções
- **Workshop** (`pages/workshop.html`) - Detalhes do workshop de bem-estar animal
- **Grupos** (`pages/grupos.html`) - Feed de grupos e comunidades
- **Membros** (`pages/membros.html`) - Área de login e registro
- **Agendamento Online** (`pages/agendamento-online.html`) - Serviços disponíveis
- **Lista de Programas** (`pages/lista-programas.html`) - Programas educacionais
- **Eventos** (`pages/eventos.html`) - Calendário de eventos
- **Programa Detalhes** (`pages/programa-otimizando.html`) - Detalhes do programa de monitoramento

## 🔧 Backend e Banco de Dados

O projeto agora inclui backend completo com Supabase:

- ✅ **Autenticação**: Login, registro, OAuth (Google/Facebook)
- ✅ **Banco de Dados**: PostgreSQL na nuvem (Supabase)
- ✅ **APIs**: Serviços para grupos, eventos, agendamentos, programas
- ✅ **Segurança**: Row Level Security (RLS) configurado

### 📋 Configuração Rápida

1. **Criar projeto no Supabase** (veja `CONFIGURACAO_SUPABASE.md`)
2. **Configurar variáveis de ambiente** (criar `.env`)
3. **Executar schema SQL** (`backend/database/schema.sql`)
4. **Instalar dependências**: `npm install`

Veja `README_BACKEND.md` para mais detalhes sobre o backend.

## 📚 Documentação Adicional

- `ESTRUTURA_PROJETO.md` - Organização do projeto
- `README_BACKEND.md` - Documentação do backend
- `CONFIGURACAO_SUPABASE.md` - Guia de configuração do Supabase
- `backend/README.md` - Documentação dos serviços
