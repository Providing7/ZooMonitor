# ⚡ Passo a Passo Rápido - Configurar Supabase

## 🎯 O que você precisa fazer AGORA:

### 1️⃣ Criar Conta e Projeto (5 minutos)

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"** ou **"Sign up"**
3. Faça login (GitHub, Google ou email)
4. Clique em **"New Project"**
5. Preencha:
   - **Name**: `zoomitor-pe` (ou qualquer nome)
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: `South America` (ou mais próxima)
6. Clique em **"Create new project"**
7. ⏳ Aguarde 2-3 minutos (enquanto cria o projeto)

### 2️⃣ Pegar as Credenciais (2 minutos)

1. No dashboard do projeto, clique em **⚙️ Settings** (canto inferior esquerdo)
2. Clique em **API** (no menu lateral)
3. Você verá:
   - **Project URL**: `https://xxxxx.supabase.co` ← COPIE ISSO
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ← COPIE ISSO

### 3️⃣ Criar o Banco de Dados (3 minutos)

1. No menu lateral, clique em **SQL Editor** (ícone de banco de dados)
2. Clique em **"New query"**
3. Abra o arquivo `backend/database/schema.sql` do seu projeto
4. **Copie TODO o conteúdo** do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **"Run"** (ou Ctrl+Enter)
7. ✅ Deve aparecer "Success" ou "Success. No rows returned"

### 4️⃣ Configurar no Projeto (2 minutos)

1. Na raiz do projeto, crie arquivo `.env`:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

2. Edite `pages/membros.html`:
   - Encontre as linhas com `YOUR_SUPABASE_URL` e `YOUR_SUPABASE_ANON_KEY`
   - Substitua pelos valores que você copiou

3. No terminal, instale dependências:
   ```bash
   npm install
   ```

### 5️⃣ Testar (1 minuto)

1. Abra `pages/membros.html` no navegador
2. Abra o Console (F12)
3. Se não aparecer erros, está funcionando! ✅

## ⚠️ IMPORTANTE

- ✅ A **anon key** é pública e segura para usar no frontend
- ✅ **NUNCA** commite o arquivo `.env` no Git
- ✅ A senha do banco você só usa se precisar acessar diretamente

## 🆘 Problemas?

### Erro: "Invalid API key"
→ Verifique se copiou a chave completa (é bem longa!)

### Erro: "Failed to fetch"
→ Verifique se a URL está correta (deve começar com `https://`)

### Erro: "relation does not exist"
→ Execute o schema SQL novamente

## ✅ Pronto!

Depois disso, você pode:
- Testar login/registro na página de membros
- Criar grupos
- Adicionar eventos
- Fazer agendamentos

---

**Tempo total estimado: ~15 minutos** ⏱️

