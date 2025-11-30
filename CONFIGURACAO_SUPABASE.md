# 🚀 Guia de Configuração do Supabase

Este guia vai te ajudar a configurar o Supabase e conectar o backend ao projeto.

## 📋 Passo a Passo

### 1. Criar Conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"** ou **"Sign up"**
3. Faça login com GitHub, Google ou email

### 2. Criar Novo Projeto

1. No dashboard, clique em **"New Project"**
2. Preencha:
   - **Name**: `zoomitor-pe` (ou outro nome)
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha a região mais próxima (ex: `South America`)
3. Clique em **"Create new project"**
4. Aguarde alguns minutos enquanto o projeto é criado

### 3. Obter Credenciais

1. No dashboard do projeto, vá em **Settings** (⚙️) → **API**
2. Você verá:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo `.env`:
   ```bash
   # Copie o conteúdo de .env.example
   ```

2. Edite o `.env` e preencha:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

3. **IMPORTANTE**: Adicione `.env` ao `.gitignore` para não commitar as credenciais!

### 5. Criar Banco de Dados

1. No Supabase, vá em **SQL Editor** (no menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `backend/database/schema.sql` do projeto
4. Copie **TODO** o conteúdo do arquivo
5. Cole no SQL Editor
6. Clique em **"Run"** (ou pressione Ctrl+Enter)
7. Aguarde a confirmação de sucesso

### 6. Configurar Autenticação OAuth (Opcional)

Para login com Google/Facebook funcionar:

#### Google:
1. Vá em **Authentication** → **Providers**
2. Ative **Google**
3. Configure com suas credenciais do Google Cloud Console

#### Facebook:
1. Vá em **Authentication** → **Providers**
2. Ative **Facebook**
3. Configure com suas credenciais do Facebook Developers

### 7. Instalar Dependências

No terminal, na raiz do projeto:
```bash
npm install
```

### 8. Testar Conexão

1. Abra `pages/membros.html` no navegador
2. Abra o Console do navegador (F12)
3. Verifique se não há erros de conexão

## ✅ Checklist

- [ ] Conta criada no Supabase
- [ ] Projeto criado
- [ ] Credenciais obtidas (URL e anon key)
- [ ] Arquivo `.env` configurado
- [ ] Schema do banco executado
- [ ] Dependências instaladas (`npm install`)
- [ ] Teste de conexão realizado

## 🔒 Segurança

- ✅ **NUNCA** commite o arquivo `.env` no Git
- ✅ Use a **anon key** apenas no frontend (ela é pública, mas segura)
- ✅ Para operações sensíveis, use **service role key** apenas no backend
- ✅ O Supabase usa **Row Level Security (RLS)** para proteger os dados

## 🐛 Problemas Comuns

### Erro: "Invalid API key"
- Verifique se copiou a chave correta
- Verifique se não há espaços extras no `.env`

### Erro: "Failed to fetch"
- Verifique se a URL está correta
- Verifique se o projeto está ativo no Supabase

### Erro: "relation does not exist"
- Execute o schema SQL novamente
- Verifique se todas as tabelas foram criadas

## 📚 Próximos Passos

Após configurar:
1. ✅ Testar autenticação
2. ✅ Conectar página de grupos
3. ✅ Conectar página de eventos
4. ✅ Conectar agendamentos

## 🔗 Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de Autenticação](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

