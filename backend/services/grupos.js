// ========================================
// SERVIÇO DE GRUPOS
// ========================================

import { supabase } from '../config/supabase.js';

/**
 * Obter todos os grupos públicos
 */
export async function getGrupos() {
    try {
        const { data, error } = await supabase
            .from('grupos')
            .select('*')
            .eq('is_public', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao obter grupos:', error);
        return { data: null, error };
    }
}

/**
 * Obter um grupo específico
 */
export async function getGrupoById(grupoId) {
    try {
        const { data, error } = await supabase
            .from('grupos')
            .select('*')
            .eq('id', grupoId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao obter grupo:', error);
        return { data: null, error };
    }
}

/**
 * Criar novo grupo
 */
export async function createGrupo(grupoData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('grupos')
            .insert({
                ...grupoData,
                created_by: user.id
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao criar grupo:', error);
        return { data: null, error };
    }
}

/**
 * Obter posts de um grupo
 */
export async function getGrupoPosts(grupoId) {
    try {
        const { data, error } = await supabase
            .from('grupo_posts')
            .select(`
                *,
                profiles:author_id (
                    id,
                    full_name,
                    avatar_url
                )
            `)
            .eq('grupo_id', grupoId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao obter posts:', error);
        return { data: null, error };
    }
}

/**
 * Criar post em um grupo
 */
export async function createGrupoPost(grupoId, content, isSuggested = false) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('grupo_posts')
            .insert({
                grupo_id: grupoId,
                author_id: user.id,
                content,
                is_suggested: isSuggested
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao criar post:', error);
        return { data: null, error };
    }
}

/**
 * Entrar em um grupo
 */
export async function joinGrupo(grupoId) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('grupo_members')
            .insert({
                grupo_id: grupoId,
                user_id: user.id
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao entrar no grupo:', error);
        return { data: null, error };
    }
}

/**
 * Sair de um grupo
 */
export async function leaveGrupo(grupoId) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { error } = await supabase
            .from('grupo_members')
            .delete()
            .eq('grupo_id', grupoId)
            .eq('user_id', user.id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Erro ao sair do grupo:', error);
        return { error };
    }
}

/**
 * Verificar se usuário é membro do grupo
 */
export async function isMemberOfGrupo(grupoId) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { isMember: false };

        const { data, error } = await supabase
            .from('grupo_members')
            .select('id')
            .eq('grupo_id', grupoId)
            .eq('user_id', user.id)
            .single();

        return { isMember: !!data, error };
    } catch (error) {
        return { isMember: false, error };
    }
}

