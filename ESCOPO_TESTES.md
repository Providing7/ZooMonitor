# 🧪 ESCOPO DE TESTES - ZOOMONITOR

## 📋 ÍNDICE

1. [Testes de Autenticação](#1-testes-de-autenticação)
2. [Testes de Perfil de Usuário](#2-testes-de-perfil-de-usuário)
3. [Testes de Eventos](#3-testes-de-eventos)
4. [Testes de Agendamentos](#4-testes-de-agendamentos)
5. [Testes de Serviços](#5-testes-de-serviços)
6. [Testes de Interface e UI](#6-testes-de-interface-e-ui)
7. [Testes de Responsividade](#7-testes-de-responsividade)
8. [Testes de Performance](#8-testes-de-performance)
9. [Testes de Segurança](#9-testes-de-segurança)
10. [Testes de Integração](#10-testes-de-integração)
11. [Testes de Acessibilidade](#11-testes-de-acessibilidade)
12. [Testes de Compatibilidade](#12-testes-de-compatibilidade)

---

## 1. TESTES DE AUTENTICAÇÃO

### 1.1. Registro de Usuário

#### TC-AUTH-001: Registro com Email Válido
**Objetivo**: Verificar se o registro com email válido funciona corretamente.

**Pré-condições**: 
- Usuário não está logado
- Navegador limpo (sem sessão)

**Passos**:
1. Acessar página de membros (`pages/membros.html`)
2. Clicar em "Registrar com Email"
3. Preencher formulário:
   - Nome completo: "João Silva"
   - Email: "joao.silva@teste.com"
   - Senha: "Senha123!@#"
   - Confirmar senha: "Senha123!@#"
4. Clicar em "Registrar"

**Resultado Esperado**:
- ✅ Mensagem de sucesso exibida
- ✅ Email de confirmação enviado
- ✅ Notificação informando verificação de email
- ✅ Formulário limpo

**Critérios de Aceite**:
- Email de confirmação recebido em até 2 minutos
- Link de confirmação funcional
- Dados não salvos no banco até confirmação

---

#### TC-AUTH-002: Registro com Email Inválido
**Objetivo**: Verificar validação de email inválido.

**Passos**:
1. Acessar página de membros
2. Preencher formulário com email inválido: "email-invalido"
3. Tentar registrar

**Resultado Esperado**:
- ✅ Mensagem de erro: "Email inválido"
- ✅ Campo email destacado em vermelho
- ✅ Registro não realizado

---

#### TC-AUTH-003: Registro com Senha Fraca
**Objetivo**: Verificar validação de senha forte.

**Passos**:
1. Preencher formulário com senha fraca: "123"
2. Tentar registrar

**Resultado Esperado**:
- ✅ Mensagem de erro sobre senha fraca
- ✅ Sugestão de senha forte
- ✅ Registro não realizado

---

#### TC-AUTH-004: Registro com Senhas Não Coincidentes
**Objetivo**: Verificar validação de confirmação de senha.

**Passos**:
1. Preencher senha: "Senha123!@#"
2. Preencher confirmação: "Senha456!@#"
3. Tentar registrar

**Resultado Esperado**:
- ✅ Mensagem: "As senhas não coincidem"
- ✅ Registro não realizado

---

#### TC-AUTH-005: Registro com Email Já Cadastrado
**Objetivo**: Verificar tratamento de email duplicado.

**Pré-condições**: Email já existe no sistema

**Passos**:
1. Tentar registrar com email existente
2. Preencher formulário completo
3. Clicar em "Registrar"

**Resultado Esperado**:
- ✅ Mensagem: "Este email já está cadastrado"
- ✅ Opção para fazer login
- ✅ Registro não realizado

---

### 1.2. Confirmação de Email

#### TC-AUTH-006: Confirmação de Email Válida
**Objetivo**: Verificar confirmação de email funcional.

**Pré-condições**: Email de confirmação recebido

**Passos**:
1. Abrir email de confirmação
2. Clicar no link de confirmação
3. Aguardar redirecionamento

**Resultado Esperado**:
- ✅ Redirecionamento para página inicial
- ✅ Mensagem de sucesso: "Email confirmado com sucesso!"
- ✅ Perfil criado automaticamente no banco
- ✅ Usuário logado automaticamente
- ✅ Header atualizado com perfil

---

#### TC-AUTH-007: Link de Confirmação Expirado
**Objetivo**: Verificar tratamento de link expirado.

**Pré-condições**: Link de confirmação expirado (24h+)

**Passos**:
1. Clicar em link de confirmação expirado
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Modal de erro exibido
- ✅ Mensagem: "Link de confirmação expirado"
- ✅ Opção para reenviar email
- ✅ Formulário para inserir email novamente

---

#### TC-AUTH-008: Reenvio de Email de Confirmação
**Objetivo**: Verificar funcionalidade de reenvio.

**Passos**:
1. Após link expirado, inserir email no modal
2. Clicar em "Reenviar Link de Confirmação"

**Resultado Esperado**:
- ✅ Novo email enviado
- ✅ Mensagem de sucesso
- ✅ Modal fechado

---

### 1.3. Login

#### TC-AUTH-009: Login com Credenciais Válidas
**Objetivo**: Verificar login funcional.

**Pré-condições**: Usuário registrado e email confirmado

**Passos**:
1. Acessar página de membros
2. Clicar em "Login"
3. Inserir email e senha corretos
4. Clicar em "Entrar"

**Resultado Esperado**:
- ✅ Login realizado com sucesso
- ✅ Redirecionamento para página inicial
- ✅ Header atualizado (perfil visível, botão login removido)
- ✅ Sessão persistida no localStorage
- ✅ Notificação de sucesso

---

#### TC-AUTH-010: Login com Email Inválido
**Objetivo**: Verificar tratamento de email não cadastrado.

**Passos**:
1. Tentar login com email inexistente
2. Inserir senha qualquer

**Resultado Esperado**:
- ✅ Mensagem: "Email ou senha incorretos"
- ✅ Login não realizado
- ✅ Campos destacados

---

#### TC-AUTH-011: Login com Senha Incorreta
**Objetivo**: Verificar tratamento de senha incorreta.

**Pré-condições**: Email válido cadastrado

**Passos**:
1. Inserir email correto
2. Inserir senha incorreta
3. Tentar login

**Resultado Esperado**:
- ✅ Mensagem: "Email ou senha incorretos"
- ✅ Login não realizado
- ✅ Opção para recuperar senha

---

#### TC-AUTH-012: Login com Email Não Confirmado
**Objetivo**: Verificar bloqueio de login sem confirmação.

**Pré-condições**: Usuário registrado mas email não confirmado

**Passos**:
1. Tentar login com credenciais corretas
2. Email não foi confirmado

**Resultado Esperado**:
- ✅ Mensagem: "Por favor, confirme seu email antes de fazer login"
- ✅ Opção para reenviar email de confirmação
- ✅ Login não realizado

---

#### TC-AUTH-013: Login via Botão no Header
**Objetivo**: Verificar botão de login no header.

**Pré-condições**: Usuário não logado

**Passos**:
1. Acessar qualquer página
2. Clicar no botão "Login" no header
3. Preencher credenciais
4. Fazer login

**Resultado Esperado**:
- ✅ Modal de login abre
- ✅ Login funcional
- ✅ Botão desaparece após login
- ✅ Perfil aparece no header

---

### 1.4. Persistência de Sessão

#### TC-AUTH-014: Sessão Persiste após Fechar Navegador
**Objetivo**: Verificar persistência de sessão.

**Pré-condições**: Usuário logado

**Passos**:
1. Fazer login
2. Fechar navegador completamente
3. Abrir navegador novamente
4. Acessar o site

**Resultado Esperado**:
- ✅ Usuário permanece logado
- ✅ Perfil visível no header
- ✅ Botão de login não aparece
- ✅ Sessão restaurada automaticamente

---

#### TC-AUTH-015: Renovação Automática de Token
**Objetivo**: Verificar renovação automática.

**Pré-condições**: Usuário logado, token próximo de expirar

**Passos**:
1. Fazer login
2. Aguardar próximo da expiração do token (ou simular)
3. Continuar navegando

**Resultado Esperado**:
- ✅ Token renovado automaticamente
- ✅ Usuário não é deslogado
- ✅ Sessão mantida
- ✅ Sem interrupção na navegação

---

#### TC-AUTH-016: Logout
**Objetivo**: Verificar logout funcional.

**Pré-condições**: Usuário logado

**Passos**:
1. Clicar no avatar no header
2. Clicar em "Sair"
3. Confirmar logout

**Resultado Esperado**:
- ✅ Logout realizado
- ✅ Sessão removida
- ✅ Redirecionamento para página inicial
- ✅ Botão de login aparece
- ✅ Perfil removido do header
- ✅ Notificação de sucesso

---

### 1.5. Recuperação de Senha

#### TC-AUTH-017: Solicitar Recuperação de Senha
**Objetivo**: Verificar funcionalidade de recuperação.

**Passos**:
1. Na página de login, clicar em "Esqueci minha senha"
2. Inserir email cadastrado
3. Clicar em "Enviar"

**Resultado Esperado**:
- ✅ Email de recuperação enviado
- ✅ Mensagem de sucesso
- ✅ Instruções exibidas

---

#### TC-AUTH-018: Reset de Senha com Link Válido
**Objetivo**: Verificar reset de senha.

**Pré-condições**: Link de recuperação recebido

**Passos**:
1. Abrir email de recuperação
2. Clicar no link
3. Inserir nova senha
4. Confirmar nova senha
5. Salvar

**Resultado Esperado**:
- ✅ Senha alterada com sucesso
- ✅ Login possível com nova senha
- ✅ Login com senha antiga não funciona

---

## 2. TESTES DE PERFIL DE USUÁRIO

### 2.1. Criação de Perfil

#### TC-PROF-001: Criação Automática de Perfil
**Objetivo**: Verificar criação automática após confirmação.

**Pré-condições**: Email confirmado

**Passos**:
1. Confirmar email
2. Verificar banco de dados

**Resultado Esperado**:
- ✅ Perfil criado na tabela `profiles`
- ✅ `id` vinculado ao `auth.users`
- ✅ `email` preenchido
- ✅ `full_name` preenchido (se fornecido)
- ✅ `role` = 'member' (padrão)
- ✅ `is_public` = true (padrão)

---

#### TC-PROF-002: Exibição de Perfil no Header
**Objetivo**: Verificar exibição correta no header.

**Pré-condições**: Usuário logado

**Passos**:
1. Fazer login
2. Verificar header

**Resultado Esperado**:
- ✅ Avatar visível (ou inicial do nome)
- ✅ Nome do usuário visível
- ✅ Menu dropdown funcional
- ✅ Botão de login removido

---

#### TC-PROF-003: Avatar com Fallback
**Objetivo**: Verificar fallback quando não há avatar.

**Pré-condições**: Usuário sem avatar_url

**Passos**:
1. Fazer login
2. Verificar avatar no header

**Resultado Esperado**:
- ✅ Avatar gerado automaticamente (ui-avatars.com)
- ✅ Iniciais do nome visíveis
- ✅ Cores consistentes

---

### 2.2. Menu Dropdown

#### TC-PROF-004: Abertura do Menu Dropdown
**Objetivo**: Verificar funcionalidade do menu.

**Passos**:
1. Clicar no avatar no header
2. Verificar menu

**Resultado Esperado**:
- ✅ Menu abre suavemente
- ✅ Opções visíveis:
  - Ver perfil
  - Sair
- ✅ Menu fecha ao clicar fora

---

#### TC-PROF-005: Navegação no Menu
**Objetivo**: Verificar links do menu.

**Passos**:
1. Abrir menu dropdown
2. Clicar em "Ver perfil"
3. Clicar em "Sair"

**Resultado Esperado**:
- ✅ "Ver perfil" leva para página de membros
- ✅ "Sair" realiza logout
- ✅ Menu fecha após ação

---

## 3. TESTES DE EVENTOS

### 3.1. Listagem de Eventos

#### TC-EVT-001: Carregamento da Lista de Eventos
**Objetivo**: Verificar carregamento da página.

**Passos**:
1. Acessar `pages/eventos.html`
2. Verificar carregamento

**Resultado Esperado**:
- ✅ Página carrega sem erros
- ✅ Cards de eventos exibidos
- ✅ Imagens carregadas
- ✅ Informações visíveis (título, data, local)
- ✅ Botão "Informações" em cada card

---

#### TC-EVT-002: Dados do Supabase vs Fallback
**Objetivo**: Verificar integração com banco.

**Passos**:
1. Com eventos no banco: verificar dados reais
2. Sem eventos no banco: verificar fallback

**Resultado Esperado**:
- ✅ Dados do Supabase exibidos quando disponíveis
- ✅ Dados estáticos exibidos como fallback
- ✅ Sem erros no console
- ✅ Transição suave

---

#### TC-EVT-003: Responsividade dos Cards
**Objetivo**: Verificar layout responsivo.

**Passos**:
1. Acessar página de eventos
2. Redimensionar janela
3. Testar em mobile

**Resultado Esperado**:
- ✅ Cards se adaptam ao tamanho da tela
- ✅ Mobile: 1 coluna
- ✅ Tablet: 2 colunas
- ✅ Desktop: 3 colunas
- ✅ Imagens responsivas

---

### 3.2. Stack Navigation de Eventos

#### TC-EVT-004: Abertura da Visualização Detalhada
**Objetivo**: Verificar stack navigation.

**Passos**:
1. Clicar em "Informações" em um card
2. Verificar transição

**Resultado Esperado**:
- ✅ Stack navigation abre suavemente
- ✅ Transição de slide da direita
- ✅ Detalhes do evento exibidos:
  - Título
  - Data e hora
  - Local
  - Descrição
  - Imagem
  - Mapa (se disponível)
- ✅ Botão "Voltar" visível

---

#### TC-EVT-005: Conteúdo da Visualização Detalhada
**Objetivo**: Verificar informações exibidas.

**Passos**:
1. Abrir detalhes de um evento
2. Verificar todas as seções

**Resultado Esperado**:
- ✅ Título grande e destacado
- ✅ Data formatada corretamente
- ✅ Descrição completa
- ✅ Imagem em alta qualidade
- ✅ Mapa interativo (Google Maps)
- ✅ Botões de compartilhamento social
- ✅ Informações de localização

---

#### TC-EVT-006: Voltar para Lista
**Objetivo**: Verificar botão de voltar.

**Passos**:
1. Abrir detalhes de evento
2. Clicar em "Voltar"

**Resultado Esperado**:
- ✅ Stack navigation fecha
- ✅ Retorna para lista de eventos
- ✅ Transição suave
- ✅ Lista mantém scroll position

---

#### TC-EVT-007: Múltiplos Eventos
**Objetivo**: Verificar navegação entre eventos.

**Passos**:
1. Abrir detalhes do evento 1
2. Voltar
3. Abrir detalhes do evento 2

**Resultado Esperado**:
- ✅ Cada evento exibe seus próprios detalhes
- ✅ Sem mistura de dados
- ✅ Transições funcionam corretamente

---

#### TC-EVT-008: Compartilhamento Social
**Objetivo**: Verificar botões de compartilhamento.

**Passos**:
1. Abrir detalhes de evento
2. Clicar em botões de compartilhamento (Facebook, Twitter, LinkedIn)

**Resultado Esperado**:
- ✅ Botões funcionais
- ✅ Abrem em nova aba
- ✅ URL e texto corretos
- ✅ Design responsivo

---

## 4. TESTES DE AGENDAMENTOS

### 4.1. Listagem de Serviços

#### TC-AGD-001: Carregamento de Serviços
**Objetivo**: Verificar página de agendamento.

**Passos**:
1. Acessar `pages/agendamento-online.html`
2. Verificar serviços

**Resultado Esperado**:
- ✅ 3 cards de serviços exibidos:
  - Análise de Dados (R$ 150)
  - Consulta de Suporte (R$ 100)
  - Treinamento de Plataforma (R$ 400) - Encerrado
- ✅ Informações corretas em cada card
- ✅ Botões apropriados ("Agendar" ou "Ver curso")

---

#### TC-AGD-002: Botão "Agendar" para Serviços Disponíveis
**Objetivo**: Verificar abertura da aba de agendamentos.

**Passos**:
1. Clicar em "Agendar" em "Análise de Dados"
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Stack navigation abre
- ✅ Aba de agendamentos exibida
- ✅ Lista de agendamentos do usuário (se houver)
- ✅ Botão "Novo Agendamento" visível

---

#### TC-AGD-003: Botão "Ver Curso" para Treinamento
**Objetivo**: Verificar stack navigation de serviço.

**Passos**:
1. Clicar em "Ver curso" em "Treinamento de Plataforma"
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Stack navigation de serviço abre
- ✅ Detalhes do treinamento exibidos
- ✅ Status "Encerrado" visível
- ✅ Informações de contato

---

### 4.2. Aba de Agendamentos

#### TC-AGD-004: Lista de Agendamentos do Usuário
**Objetivo**: Verificar exibição de agendamentos.

**Pré-condições**: Usuário logado, com agendamentos

**Passos**:
1. Abrir aba de agendamentos
2. Verificar lista

**Resultado Esperado**:
- ✅ Agendamentos do usuário exibidos
- ✅ Informações corretas:
  - Nome do serviço
  - Data e hora
  - Status (pendente, confirmado, cancelado)
- ✅ Botões de ação (cancelar, excluir)

---

#### TC-AGD-005: Lista Vazia
**Objetivo**: Verificar estado vazio.

**Pré-condições**: Usuário sem agendamentos

**Passos**:
1. Abrir aba de agendamentos
2. Verificar mensagem

**Resultado Esperado**:
- ✅ Mensagem: "Você ainda não tem agendamentos"
- ✅ Botão "Novo Agendamento" destacado
- ✅ Design amigável

---

#### TC-AGD-006: Criar Novo Agendamento
**Objetivo**: Verificar criação de agendamento.

**Passos**:
1. Clicar em "Novo Agendamento"
2. Preencher formulário:
   - Serviço: "Análise de Dados"
   - Data: data futura
   - Hora: hora disponível
   - Observações: (opcional)
3. Clicar em "Agendar"

**Resultado Esperado**:
- ✅ Modal de criação abre
- ✅ Formulário funcional
- ✅ Validação de campos
- ✅ Agendamento criado no Supabase
- ✅ Lista atualizada automaticamente
- ✅ Modal fecha
- ✅ Notificação de sucesso

---

#### TC-AGD-007: Validação de Formulário
**Objetivo**: Verificar validações.

**Passos**:
1. Tentar criar agendamento sem preencher campos obrigatórios
2. Tentar data passada
3. Tentar hora inválida

**Resultado Esperado**:
- ✅ Mensagens de erro específicas
- ✅ Campos destacados
- ✅ Submit bloqueado até validação

---

#### TC-AGD-008: Cancelar Agendamento
**Objetivo**: Verificar cancelamento.

**Pré-condições**: Agendamento existente

**Passos**:
1. Abrir aba de agendamentos
2. Clicar em "Cancelar" em um agendamento
3. Confirmar cancelamento

**Resultado Esperado**:
- ✅ Confirmação exibida
- ✅ Status alterado para "cancelado"
- ✅ Atualização no banco
- ✅ Lista atualizada
- ✅ Notificação de sucesso

---

#### TC-AGD-009: Excluir Agendamento
**Objetivo**: Verificar exclusão.

**Pré-condições**: Agendamento existente

**Passos**:
1. Clicar em "Excluir" em um agendamento
2. Confirmar exclusão

**Resultado Esperado**:
- ✅ Confirmação exibida
- ✅ Agendamento removido do banco
- ✅ Lista atualizada
- ✅ Notificação de sucesso

---

#### TC-AGD-010: Filtros e Ordenação
**Objetivo**: Verificar filtros (se implementados).

**Passos**:
1. Filtrar por status
2. Ordenar por data

**Resultado Esperado**:
- ✅ Filtros funcionais
- ✅ Ordenação correta
- ✅ UI responsiva

---

## 5. TESTES DE SERVIÇOS

### 5.1. Stack Navigation de Serviços

#### TC-SVC-001: Visualização Detalhada de Serviço
**Objetivo**: Verificar detalhes do serviço.

**Passos**:
1. Clicar em "Ver curso" em "Treinamento de Plataforma"
2. Verificar conteúdo

**Resultado Esperado**:
- ✅ Stack navigation abre
- ✅ Título do serviço
- ✅ Descrição completa
- ✅ Preço destacado
- ✅ Status visível
- ✅ Informações de contato
- ✅ Botão "Voltar"

---

#### TC-SVC-002: Navegação entre Serviços
**Objetivo**: Verificar múltiplos serviços.

**Passos**:
1. Abrir detalhes de um serviço
2. Voltar
3. Abrir detalhes de outro

**Resultado Esperado**:
- ✅ Cada serviço exibe seus próprios detalhes
- ✅ Sem mistura de dados
- ✅ Transições suaves

---

## 6. TESTES DE INTERFACE E UI

### 6.1. Header

#### TC-UI-001: Header Fixo
**Objetivo**: Verificar comportamento do header.

**Passos**:
1. Fazer scroll na página
2. Verificar header

**Resultado Esperado**:
- ✅ Header permanece fixo no topo
- ✅ Muda de estilo ao fazer scroll (se implementado)
- ✅ Sempre visível
- ✅ Links funcionais

---

#### TC-UI-002: Menu Hambúrguer (Mobile)
**Objetivo**: Verificar menu mobile.

**Passos**:
1. Acessar em dispositivo mobile (ou redimensionar)
2. Clicar no menu hambúrguer
3. Verificar abertura

**Resultado Esperado**:
- ✅ Menu abre suavemente
- ✅ Todos os links visíveis
- ✅ Performance rápida (< 200ms)
- ✅ Backdrop blur funcional
- ✅ Fecha ao clicar fora ou em link

---

#### TC-UI-003: Menu Dropdown (Desktop)
**Objetivo**: Verificar menu desktop.

**Passos**:
1. Acessar em desktop
2. Hover sobre "Mais"
3. Verificar dropdown

**Resultado Esperado**:
- ✅ Dropdown abre no hover
- ✅ Links organizados
- ✅ Transição suave
- ✅ Fecha ao sair do hover

---

#### TC-UI-004: Toggle de Tema
**Objetivo**: Verificar alternância de tema.

**Passos**:
1. Clicar no toggle de tema
2. Verificar mudança
3. Recarregar página

**Resultado Esperado**:
- ✅ Tema alterna entre claro/escuro
- ✅ Todas as cores atualizadas
- ✅ Preferência persistida
- ✅ Mantém escolha após reload

---

### 6.2. Notificações

#### TC-UI-005: Notificações Toast
**Objetivo**: Verificar sistema de notificações.

**Passos**:
1. Realizar ações que geram notificações:
   - Login bem-sucedido
   - Erro de validação
   - Sucesso de operação
2. Verificar exibição

**Resultado Esperado**:
- ✅ Notificações aparecem no canto da tela
- ✅ Tipos corretos (sucesso, erro, aviso, info)
- ✅ Auto-dismiss após tempo configurado
- ✅ Pode fechar manualmente
- ✅ Múltiplas notificações empilhadas corretamente

---

### 6.3. Modais

#### TC-UI-006: Modal de Login
**Objetivo**: Verificar modal de login.

**Passos**:
1. Clicar em "Login" no header
2. Verificar modal

**Resultado Esperado**:
- ✅ Modal abre centralizado
- ✅ Backdrop escuro
- ✅ Formulário funcional
- ✅ Fecha ao clicar fora ou em X
- ✅ Fecha após login bem-sucedido

---

#### TC-UI-007: Modal de Erro de Autenticação
**Objetivo**: Verificar modal de erro.

**Pré-condições**: Link de confirmação expirado

**Passos**:
1. Clicar em link expirado
2. Verificar modal

**Resultado Esperado**:
- ✅ Modal de erro exibido
- ✅ Mensagem clara
- ✅ Formulário para reenvio
- ✅ Botão de fechar funcional

---

### 6.4. Footer

#### TC-UI-008: Footer Padronizado
**Objetivo**: Verificar footer em todas as páginas.

**Passos**:
1. Acessar cada página
2. Verificar footer

**Resultado Esperado**:
- ✅ Footer idêntico em todas as páginas
- ✅ Links funcionais
- ✅ Informações de contato corretas
- ✅ Design consistente
- ✅ Responsivo

---

## 7. TESTES DE RESPONSIVIDADE

### 7.1. Breakpoints

#### TC-RESP-001: Mobile (< 768px)
**Objetivo**: Verificar layout mobile.

**Passos**:
1. Redimensionar para < 768px
2. Verificar todas as páginas

**Resultado Esperado**:
- ✅ Menu hambúrguer visível
- ✅ Cards em 1 coluna
- ✅ Textos legíveis
- ✅ Botões acessíveis
- ✅ Imagens responsivas
- ✅ Sem scroll horizontal

---

#### TC-RESP-002: Tablet (768px - 1024px)
**Objetivo**: Verificar layout tablet.

**Passos**:
1. Redimensionar para 768px - 1024px
2. Verificar layout

**Resultado Esperado**:
- ✅ Cards em 2 colunas
- ✅ Menu adaptado
- ✅ Espaçamentos adequados
- ✅ Touch-friendly

---

#### TC-RESP-003: Desktop (> 1024px)
**Objetivo**: Verificar layout desktop.

**Passos**:
1. Acessar em desktop
2. Verificar layout

**Resultado Esperado**:
- ✅ Cards em 3 colunas
- ✅ Menu dropdown
- ✅ Espaçamentos amplos
- ✅ Hover effects funcionais

---

### 7.2. Páginas Específicas

#### TC-RESP-004: Página de Membros Mobile
**Objetivo**: Verificar responsividade da página de membros.

**Passos**:
1. Acessar `pages/membros.html` em mobile
2. Verificar elementos

**Resultado Esperado**:
- ✅ Card de boas-vindas responsivo
- ✅ Email visível e legível
- ✅ Botão "Sair" acessível
- ✅ Formulários adaptados
- ✅ Sem overflow

---

#### TC-RESP-005: Stack Navigation Mobile
**Objetivo**: Verificar stack navigation em mobile.

**Passos**:
1. Abrir stack navigation em mobile
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Transição suave
- ✅ Conteúdo legível
- ✅ Botão voltar acessível
- ✅ Scroll funcional
- ✅ Sem problemas de touch

---

## 8. TESTES DE PERFORMANCE

### 8.1. Tempo de Carregamento

#### TC-PERF-001: Tempo de Carregamento Inicial
**Objetivo**: Verificar performance de carregamento.

**Ferramentas**: Chrome DevTools, Lighthouse

**Métricas Esperadas**:
- ✅ First Contentful Paint (FCP) < 1.8s
- ✅ Largest Contentful Paint (LCP) < 2.5s
- ✅ Time to Interactive (TTI) < 3.8s
- ✅ Total Blocking Time (TBT) < 200ms

---

#### TC-PERF-002: Carregamento de Imagens
**Objetivo**: Verificar otimização de imagens.

**Passos**:
1. Verificar Network tab
2. Analisar carregamento de imagens

**Resultado Esperado**:
- ✅ Imagens em formato otimizado (.avif, .webp)
- ✅ Lazy loading implementado
- ✅ Tamanhos adequados
- ✅ Sem imagens muito grandes

---

#### TC-PERF-003: Animações Suaves
**Objetivo**: Verificar performance de animações.

**Passos**:
1. Abrir/fechar menu hambúrguer
2. Abrir stack navigation
3. Verificar FPS

**Resultado Esperado**:
- ✅ 60 FPS durante animações
- ✅ Sem lag ou travamentos
- ✅ Transições suaves
- ✅ Uso de requestAnimationFrame

---

### 8.2. Otimizações

#### TC-PERF-004: Cache de Sessão
**Objetivo**: Verificar cache de sessão.

**Passos**:
1. Fazer login
2. Fechar e reabrir navegador
3. Medir tempo de restauração

**Resultado Esperado**:
- ✅ Sessão restaurada rapidamente (< 500ms)
- ✅ Sem requisições desnecessárias
- ✅ localStorage funcional

---

## 9. TESTES DE SEGURANÇA

### 9.1. Autenticação

#### TC-SEC-001: Proteção de Rotas
**Objetivo**: Verificar proteção de áreas restritas.

**Passos**:
1. Tentar acessar agendamentos sem login
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Redirecionamento para login
- ✅ Mensagem informativa
- ✅ Dados não acessíveis

---

#### TC-SEC-002: Row Level Security (RLS)
**Objetivo**: Verificar RLS no Supabase.

**Passos**:
1. Fazer login como usuário A
2. Tentar acessar dados do usuário B
3. Verificar no banco

**Resultado Esperado**:
- ✅ Apenas dados próprios acessíveis
- ✅ RLS bloqueia acesso não autorizado
- ✅ Queries retornam apenas dados permitidos

---

#### TC-SEC-003: Validação de Inputs
**Objetivo**: Verificar validação de formulários.

**Passos**:
1. Tentar SQL injection em campos
2. Tentar XSS em campos
3. Tentar inserir scripts

**Resultado Esperado**:
- ✅ Inputs sanitizados
- ✅ Validação client-side e server-side
- ✅ Sem execução de código malicioso
- ✅ Mensagens de erro apropriadas

---

#### TC-SEC-004: Tokens e Sessões
**Objetivo**: Verificar segurança de tokens.

**Passos**:
1. Inspecionar localStorage
2. Verificar tokens

**Resultado Esperado**:
- ✅ Tokens não expostos em logs
- ✅ Refresh tokens seguros
- ✅ Expiração adequada
- ✅ Sem tokens em URLs

---

## 10. TESTES DE INTEGRAÇÃO

### 10.1. Integração Supabase

#### TC-INT-001: Conexão com Supabase
**Objetivo**: Verificar conexão.

**Passos**:
1. Verificar console do navegador
2. Realizar operações

**Resultado Esperado**:
- ✅ Sem erros de conexão
- ✅ Queries executadas com sucesso
- ✅ Timeout adequado
- ✅ Retry em caso de falha

---

#### TC-INT-002: CRUD de Agendamentos
**Objetivo**: Verificar operações CRUD.

**Passos**:
1. Criar agendamento
2. Ler agendamento
3. Atualizar agendamento
4. Deletar agendamento

**Resultado Esperado**:
- ✅ Todas as operações funcionais
- ✅ Dados persistidos corretamente
- ✅ Atualizações em tempo real
- ✅ Sem erros

---

#### TC-INT-003: Sincronização de Dados
**Objetivo**: Verificar sincronização.

**Passos**:
1. Criar agendamento em uma aba
2. Verificar em outra aba

**Resultado Esperado**:
- ✅ Dados sincronizados
- ✅ Atualizações refletidas
- ✅ Sem conflitos

---

### 10.2. Integração Gemini (Chatbot)

#### TC-INT-004: Chatbot Funcional
**Objetivo**: Verificar integração com Gemini.

**Passos**:
1. Abrir chatbot
2. Enviar mensagem
3. Verificar resposta

**Resultado Esperado**:
- ✅ Chatbot responde
- ✅ Respostas contextuais
- ✅ Sem erros de API
- ✅ Tratamento de erros adequado

---

## 11. TESTES DE ACESSIBILIDADE

### 11.1. Navegação por Teclado

#### TC-ACC-001: Navegação Completa
**Objetivo**: Verificar acessibilidade por teclado.

**Passos**:
1. Navegar apenas com teclado (Tab, Enter, Esc)
2. Verificar todos os elementos

**Resultado Esperado**:
- ✅ Todos os elementos acessíveis
- ✅ Foco visível
- ✅ Ordem lógica de tab
- ✅ Atalhos funcionais

---

#### TC-ACC-002: ARIA Labels
**Objetivo**: Verificar labels ARIA.

**Passos**:
1. Inspecionar elementos com screen reader
2. Verificar labels

**Resultado Esperado**:
- ✅ ARIA labels presentes
- ✅ Descrições adequadas
- ✅ Roles corretos
- ✅ Screen reader friendly

---

#### TC-ACC-003: Contraste de Cores
**Objetivo**: Verificar contraste WCAG.

**Ferramentas**: Lighthouse, WAVE

**Resultado Esperado**:
- ✅ Contraste mínimo 4.5:1 (texto normal)
- ✅ Contraste mínimo 3:1 (texto grande)
- ✅ Elementos interativos destacados

---

## 12. TESTES DE COMPATIBILIDADE

### 12.1. Navegadores

#### TC-COMP-001: Chrome
**Objetivo**: Verificar compatibilidade.

**Versões**: Últimas 2 versões

**Resultado Esperado**:
- ✅ Funcionalidade completa
- ✅ Sem erros no console
- ✅ Layout correto

---

#### TC-COMP-002: Firefox
**Objetivo**: Verificar compatibilidade.

**Versões**: Últimas 2 versões

**Resultado Esperado**:
- ✅ Funcionalidade completa
- ✅ CSS renderizado corretamente
- ✅ JavaScript funcional

---

#### TC-COMP-003: Safari
**Objetivo**: Verificar compatibilidade.

**Versões**: Últimas 2 versões

**Resultado Esperado**:
- ✅ Funcionalidade completa
- ✅ Webkit específico funcionando
- ✅ Sem problemas conhecidos

---

#### TC-COMP-004: Edge
**Objetivo**: Verificar compatibilidade.

**Versões**: Últimas 2 versões

**Resultado Esperado**:
- ✅ Funcionalidade completa
- ✅ Compatível com Chrome

---

### 12.2. Dispositivos

#### TC-COMP-005: iOS
**Objetivo**: Verificar em dispositivos iOS.

**Passos**:
1. Testar em iPhone/iPad
2. Verificar funcionalidades

**Resultado Esperado**:
- ✅ Touch events funcionais
- ✅ Safari mobile compatível
- ✅ Performance adequada

---

#### TC-COMP-006: Android
**Objetivo**: Verificar em dispositivos Android.

**Passos**:
1. Testar em dispositivos Android
2. Verificar funcionalidades

**Resultado Esperado**:
- ✅ Chrome mobile compatível
- ✅ Touch events funcionais
- ✅ Performance adequada

---

## 📊 MATRIZ DE COBERTURA DE TESTES

| Categoria | Testes Planejados | Prioridade Alta | Prioridade Média | Prioridade Baixa |
|-----------|-------------------|-----------------|------------------|------------------|
| Autenticação | 18 | 12 | 4 | 2 |
| Perfil | 5 | 3 | 2 | 0 |
| Eventos | 8 | 5 | 2 | 1 |
| Agendamentos | 10 | 7 | 2 | 1 |
| Serviços | 2 | 1 | 1 | 0 |
| Interface/UI | 8 | 5 | 2 | 1 |
| Responsividade | 5 | 4 | 1 | 0 |
| Performance | 4 | 3 | 1 | 0 |
| Segurança | 4 | 4 | 0 | 0 |
| Integração | 4 | 3 | 1 | 0 |
| Acessibilidade | 3 | 2 | 1 | 0 |
| Compatibilidade | 6 | 4 | 2 | 0 |
| **TOTAL** | **77** | **54** | **19** | **5** |

---

## 🎯 PRIORIZAÇÃO DE TESTES

### **Fase 1 - Críticos (Fazer Primeiro)**
- TC-AUTH-001 a TC-AUTH-016 (Autenticação completa)
- TC-PROF-001 a TC-PROF-003 (Perfil básico)
- TC-AGD-001 a TC-AGD-010 (Agendamentos)
- TC-SEC-001 a TC-SEC-004 (Segurança)
- TC-INT-001 a TC-INT-003 (Integração Supabase)

### **Fase 2 - Importantes (Fazer em Segunda)**
- TC-EVT-001 a TC-EVT-008 (Eventos)
- TC-UI-001 a TC-UI-008 (Interface)
- TC-RESP-001 a TC-RESP-005 (Responsividade)
- TC-PERF-001 a TC-PERF-004 (Performance)

### **Fase 3 - Complementares (Fazer por Último)**
- TC-SVC-001 a TC-SVC-002 (Serviços)
- TC-ACC-001 a TC-ACC-003 (Acessibilidade)
- TC-COMP-001 a TC-COMP-006 (Compatibilidade)
- TC-INT-004 (Chatbot)

---

## 📝 TEMPLATE DE RELATÓRIO DE TESTE

```markdown
### TC-XXX-XXX: Nome do Teste

**Data**: DD/MM/YYYY
**Testador**: Nome
**Ambiente**: Chrome 120 / Windows 11
**Status**: ✅ PASSOU / ❌ FALHOU / ⚠️ BLOQUEADO

**Observações**:
- [Detalhes adicionais]
- [Screenshots se necessário]
- [Logs de erro se falhou]

**Evidências**:
- Screenshot: [link]
- Video: [link]
```

---

## 🔧 FERRAMENTAS RECOMENDADAS

### **Testes Manuais**
- Chrome DevTools
- Firefox Developer Tools
- Responsive Design Mode
- Lighthouse (Performance/Accessibility)

### **Testes Automatizados (Futuro)**
- Jest (Unit Tests)
- Cypress (E2E Tests)
- Playwright (Cross-browser)
- Supertest (API Tests)

---

## ✅ CHECKLIST RÁPIDO

### **Antes de Cada Release**
- [ ] Todos os testes críticos executados
- [ ] Sem erros no console
- [ ] Performance aceitável (Lighthouse > 90)
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Funciona nos principais navegadores
- [ ] Acessibilidade básica (WCAG AA)
- [ ] Segurança validada (RLS, validações)
- [ ] Documentação atualizada

---

*Documento criado em: Dezembro 2024*
*Última atualização: Dezembro 2024*

