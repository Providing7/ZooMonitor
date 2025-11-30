# Estrutura do Projeto ZooMonitor

Este projeto foi organizado seguindo o padrão MVC (Model-View-Controller) para melhor organização e manutenibilidade.

## 📁 Estrutura de Pastas

```
ZooMonitorPE/
│
├── pages/                      # Views (Páginas HTML)
│   ├── index.html
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
├── images/                     # Imagens e assets visuais
│   ├── hero-elefante.jpg
│   ├── leopardo-1.avif
│   ├── leopardo-2.avif
│   └── ... (outras imagens)
│
├── assets/                     # Outros recursos (opcional)
│
└── README.md                   # Documentação principal
```

## 🔗 Como Funcionam os Caminhos

### Nas Páginas HTML (pages/)
- **CSS Global**: `../css/global/styles.css`
- **CSS da Página**: `../css/pages/nome-da-pagina.css`
- **JavaScript**: `../js/script.js`
- **Imagens**: `../images/nome-da-imagem.jpg`
- **Outras Páginas**: `nome-da-pagina.html` (mesma pasta)

### Nos Arquivos CSS (css/)
- **Imagens**: `../../images/nome-da-imagem.jpg`
  - De `css/pages/` ou `css/global/` para `images/` = `../../images/`

## 📝 Convenções

1. **HTML (Views)**: Todas as páginas HTML ficam em `pages/`
2. **CSS Global**: Estilos compartilhados (header, reset, variáveis) em `css/global/`
3. **CSS Específico**: Cada página tem seu próprio CSS em `css/pages/`
4. **JavaScript**: Scripts compartilhados em `js/`
5. **Imagens**: Todas as imagens em `images/`

## 🚀 Vantagens desta Estrutura

✅ **Organização**: Fácil encontrar arquivos por tipo
✅ **Manutenibilidade**: Mudanças isoladas por página
✅ **Escalabilidade**: Fácil adicionar novas páginas
✅ **Performance**: CSS específico carrega apenas quando necessário
✅ **Padrão MVC**: Estrutura profissional e reconhecível

