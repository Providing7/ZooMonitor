# Backend - ZooMonitor

Este diretório contém toda a lógica de backend e integração com Supabase.

## 📁 Estrutura

```
backend/
├── config/
│   └── supabase.js          # Configuração do cliente Supabase
├── database/
│   └── schema.sql            # Schema do banco de dados
├── services/
│   ├── auth.js               # Autenticação (login, registro)
│   ├── grupos.js             # Gerenciamento de grupos
│   ├── eventos.js            # Gerenciamento de eventos
│   ├── agendamentos.js       # Gerenciamento de agendamentos
│   └── programas.js          # Gerenciamento de programas
└── README.md                 # Este arquivo
```

## 🚀 Configuração Inicial

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Crie um novo projeto
4. Anote a **URL** e a **anon key** do projeto

### 2. Configurar variáveis de ambiente

1. Copie `.env.example` para `.env` na raiz do projeto:
   ```bash
   cp .env.example .env
   ```

2. Edite `.env` e preencha com seus valores:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

### 3. Criar banco de dados

1. No Supabase, vá em **SQL Editor**
2. Abra o arquivo `backend/database/schema.sql`
3. Copie e cole todo o conteúdo no SQL Editor
4. Execute o script (botão "Run")

### 4. Instalar dependências

No terminal, na raiz do projeto:
```bash
npm install @supabase/supabase-js
```

## 📚 Serviços Disponíveis

### Autenticação (`auth.js`)
- `signUp(email, password, fullName)` - Registrar novo usuário
- `signIn(email, password)` - Login
- `signInWithGoogle()` - Login com Google
- `signInWithFacebook()` - Login com Facebook
- `signOut()` - Logout
- `getCurrentUser()` - Obter usuário atual
- `getUserProfile(userId)` - Obter perfil
- `updateUserProfile(userId, updates)` - Atualizar perfil

### Grupos (`grupos.js`)
- `getGrupos()` - Listar grupos públicos
- `getGrupoById(id)` - Obter grupo específico
- `createGrupo(data)` - Criar grupo
- `getGrupoPosts(grupoId)` - Obter posts do grupo
- `createGrupoPost(grupoId, content)` - Criar post
- `joinGrupo(grupoId)` - Entrar no grupo
- `leaveGrupo(grupoId)` - Sair do grupo

### Eventos (`eventos.js`)
- `getEventos()` - Listar eventos
- `getEventoById(id)` - Obter evento específico
- `createEvento(data)` - Criar evento (admin)
- `updateEvento(id, updates)` - Atualizar evento
- `deleteEvento(id)` - Deletar evento

### Agendamentos (`agendamentos.js`)
- `getAgendamentos()` - Listar agendamentos do usuário
- `createAgendamento(data)` - Criar agendamento
- `updateAgendamento(id, updates)` - Atualizar agendamento
- `cancelAgendamento(id)` - Cancelar agendamento

### Programas (`programas.js`)
- `getProgramas()` - Listar programas
- `getProgramaById(id)` - Obter programa específico

## 🔒 Segurança (RLS)

O banco de dados usa **Row Level Security (RLS)** para garantir que:
- Usuários só vejam seus próprios dados
- Apenas admins possam criar eventos
- Membros de grupos vejam apenas posts do seu grupo
- Perfis públicos sejam visíveis para todos

## 📝 Próximos Passos

1. ✅ Configurar Supabase
2. ✅ Criar schema do banco
3. ⏳ Integrar autenticação no frontend
4. ⏳ Conectar páginas ao backend
5. ⏳ Implementar funcionalidades completas

## 🔗 Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de Autenticação](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

