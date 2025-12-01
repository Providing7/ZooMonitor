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

-- Política: Usuários podem inserir seu próprio perfil
CREATE POLICY "Usuários podem inserir próprio perfil"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

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

-- Política: Criador do grupo pode atualizar
CREATE POLICY "Criador pode atualizar grupo"
    ON public.grupos FOR UPDATE
    USING (auth.uid() = created_by);

-- Política: Criador do grupo pode deletar
CREATE POLICY "Criador pode deletar grupo"
    ON public.grupos FOR DELETE
    USING (auth.uid() = created_by);

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

-- Política: Usuários podem entrar em grupos
CREATE POLICY "Usuários podem entrar em grupos"
    ON public.grupo_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem sair de grupos
CREATE POLICY "Usuários podem sair de grupos"
    ON public.grupo_members FOR DELETE
    USING (auth.uid() = user_id);

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

-- Política: Autor pode atualizar seu post
CREATE POLICY "Autor pode atualizar próprio post"
    ON public.grupo_posts FOR UPDATE
    USING (auth.uid() = author_id);

-- Política: Autor pode deletar seu post
CREATE POLICY "Autor pode deletar próprio post"
    ON public.grupo_posts FOR DELETE
    USING (auth.uid() = author_id);

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

-- Política: Admins podem atualizar eventos
CREATE POLICY "Admins podem atualizar eventos"
    ON public.eventos FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política: Admins podem deletar eventos
CREATE POLICY "Admins podem deletar eventos"
    ON public.eventos FOR DELETE
    USING (
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

-- Política: Usuários podem atualizar seus agendamentos
CREATE POLICY "Usuários podem atualizar agendamentos"
    ON public.agendamentos FOR UPDATE
    USING (auth.uid() = user_id);

-- Política: Usuários podem deletar seus agendamentos
CREATE POLICY "Usuários podem deletar agendamentos"
    ON public.agendamentos FOR DELETE
    USING (auth.uid() = user_id);

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

-- Política: Admins podem criar programas
CREATE POLICY "Admins podem criar programas"
    ON public.programas FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política: Admins podem atualizar programas
CREATE POLICY "Admins podem atualizar programas"
    ON public.programas FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política: Admins podem deletar programas
CREATE POLICY "Admins podem deletar programas"
    ON public.programas FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

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

CREATE TRIGGER update_programas_updated_at BEFORE UPDATE ON public.programas
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

-- ========================================
-- 9. ÍNDICES PARA MELHOR PERFORMANCE
-- ========================================

-- Índices para perfis
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Índices para grupos
CREATE INDEX IF NOT EXISTS idx_grupos_created_by ON public.grupos(created_by);
CREATE INDEX IF NOT EXISTS idx_grupos_is_public ON public.grupos(is_public);

-- Índices para membros de grupos
CREATE INDEX IF NOT EXISTS idx_grupo_members_grupo_id ON public.grupo_members(grupo_id);
CREATE INDEX IF NOT EXISTS idx_grupo_members_user_id ON public.grupo_members(user_id);
CREATE INDEX IF NOT EXISTS idx_grupo_members_composite ON public.grupo_members(grupo_id, user_id);

-- Índices para posts de grupos
CREATE INDEX IF NOT EXISTS idx_grupo_posts_grupo_id ON public.grupo_posts(grupo_id);
CREATE INDEX IF NOT EXISTS idx_grupo_posts_author_id ON public.grupo_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_grupo_posts_created_at ON public.grupo_posts(created_at DESC);

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_eventos_date ON public.eventos(date);
CREATE INDEX IF NOT EXISTS idx_eventos_created_by ON public.eventos(created_by);

-- Índices para agendamentos
CREATE INDEX IF NOT EXISTS idx_agendamentos_user_id ON public.agendamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON public.agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_scheduled_date ON public.agendamentos(scheduled_date);

-- Índices para programas
CREATE INDEX IF NOT EXISTS idx_programas_is_free ON public.programas(is_free);
CREATE INDEX IF NOT EXISTS idx_programas_created_at ON public.programas(created_at DESC);

-- ========================================
-- 10. COMENTÁRIOS NAS TABELAS (DOCUMENTAÇÃO)
-- ========================================

COMMENT ON TABLE public.profiles IS 'Perfis de usuários do sistema';
COMMENT ON TABLE public.grupos IS 'Grupos de discussão e colaboração';
COMMENT ON TABLE public.grupo_members IS 'Relação de membros em grupos';
COMMENT ON TABLE public.grupo_posts IS 'Posts publicados em grupos';
COMMENT ON TABLE public.eventos IS 'Eventos do ZooMonitor';
COMMENT ON TABLE public.agendamentos IS 'Agendamentos de serviços';
COMMENT ON TABLE public.programas IS 'Programas educacionais oferecidos';
