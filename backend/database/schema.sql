-- ========================================
-- SCHEMA DO BANCO DE DADOS - ZOOMONITOR
-- ========================================
-- Execute este SQL no SQL Editor do Supabase

-- ========================================
-- 1. TABELA DE PERFIS DE USUÁRIO
-- ========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'researcher')),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver perfis públicos
CREATE POLICY "Perfis públicos são visíveis para todos"
    ON public.profiles FOR SELECT
    USING (is_public = true OR auth.uid() = id);

-- Política: Usuários podem atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ========================================
-- 2. TABELA DE GRUPOS
-- ========================================
CREATE TABLE IF NOT EXISTS public.grupos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    member_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver grupos públicos
CREATE POLICY "Grupos públicos são visíveis"
    ON public.grupos FOR SELECT
    USING (is_public = true);

-- Política: Usuários autenticados podem criar grupos
CREATE POLICY "Usuários podem criar grupos"
    ON public.grupos FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- ========================================
-- 3. TABELA DE MEMBROS DE GRUPOS
-- ========================================
CREATE TABLE IF NOT EXISTS public.grupo_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id UUID REFERENCES public.grupos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(grupo_id, user_id)
);

ALTER TABLE public.grupo_members ENABLE ROW LEVEL SECURITY;

-- Política: Membros podem ver outros membros do grupo
CREATE POLICY "Membros podem ver outros membros"
    ON public.grupo_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.grupo_members gm
            WHERE gm.grupo_id = grupo_members.grupo_id
            AND gm.user_id = auth.uid()
        )
    );

-- ========================================
-- 4. TABELA DE POSTS EM GRUPOS
-- ========================================
CREATE TABLE IF NOT EXISTS public.grupo_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id UUID REFERENCES public.grupos(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    is_suggested BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.grupo_posts ENABLE ROW LEVEL SECURITY;

-- Política: Membros do grupo podem ver posts
CREATE POLICY "Membros podem ver posts do grupo"
    ON public.grupo_posts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.grupo_members gm
            WHERE gm.grupo_id = grupo_posts.grupo_id
            AND gm.user_id = auth.uid()
        )
    );

-- Política: Membros podem criar posts
CREATE POLICY "Membros podem criar posts"
    ON public.grupo_posts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.grupo_members gm
            WHERE gm.grupo_id = grupo_posts.grupo_id
            AND gm.user_id = auth.uid()
        )
    );

-- ========================================
-- 5. TABELA DE EVENTOS
-- ========================================
CREATE TABLE IF NOT EXISTS public.eventos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    image_url TEXT,
    ticket_price DECIMAL(10, 2),
    tickets_available INTEGER,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver eventos
CREATE POLICY "Eventos são públicos"
    ON public.eventos FOR SELECT
    USING (true);

-- Política: Admins podem criar eventos
CREATE POLICY "Admins podem criar eventos"
    ON public.eventos FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ========================================
-- 6. TABELA DE AGENDAMENTOS
-- ========================================
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    servico_type TEXT NOT NULL CHECK (servico_type IN ('analise_dados', 'consulta_suporte', 'treinamento')),
    servico_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    price DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios agendamentos
CREATE POLICY "Usuários veem próprios agendamentos"
    ON public.agendamentos FOR SELECT
    USING (auth.uid() = user_id);

-- Política: Usuários podem criar agendamentos
CREATE POLICY "Usuários podem criar agendamentos"
    ON public.agendamentos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 7. TABELA DE PROGRAMAS
-- ========================================
CREATE TABLE IF NOT EXISTS public.programas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    is_free BOOLEAN DEFAULT true,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.programas ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver programas
CREATE POLICY "Programas são públicos"
    ON public.programas FOR SELECT
    USING (true);

-- ========================================
-- 8. FUNÇÕES AUXILIARES
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grupos_updated_at BEFORE UPDATE ON public.grupos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grupo_posts_updated_at BEFORE UPDATE ON public.grupo_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON public.eventos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON public.agendamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil ao registrar
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar contador de membros do grupo
CREATE OR REPLACE FUNCTION update_grupo_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.grupos
        SET member_count = member_count + 1
        WHERE id = NEW.grupo_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.grupos
        SET member_count = member_count - 1
        WHERE id = OLD.grupo_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_member_count_on_insert
    AFTER INSERT ON public.grupo_members
    FOR EACH ROW EXECUTE FUNCTION update_grupo_member_count();

CREATE TRIGGER update_member_count_on_delete
    AFTER DELETE ON public.grupo_members
    FOR EACH ROW EXECUTE FUNCTION update_grupo_member_count();

