// ========================================
// SERVIÇO DE EVENTOS
// ========================================

import { supabase } from '../config/supabase.js';

/**
 * Obter todos os eventos
 */
export async function getEventos() {
    try {
        const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao obter eventos:', error);
        return { data: null, error };
    }
}

/**
 * Obter um evento específico
 */
export async function getEventoById(eventoId) {
    try {
        const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .eq('id', eventoId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao obter evento:', error);
        return { data: null, error };
    }
}

/**
 * Criar novo evento (apenas admins)
 */
export async function createEvento(eventoData) {
    try {
        const { data, error } = await supabase
            .from('eventos')
            .insert(eventoData)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        return { data: null, error };
    }
}

/**
 * Atualizar evento
 */
export async function updateEvento(eventoId, updates) {
    try {
        const { data, error } = await supabase
            .from('eventos')
            .update(updates)
            .eq('id', eventoId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao atualizar evento:', error);
        return { data: null, error };
    }
}

/**
 * Deletar evento
 */
export async function deleteEvento(eventoId) {
    try {
        const { error } = await supabase
            .from('eventos')
            .delete()
            .eq('id', eventoId);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Erro ao deletar evento:', error);
        return { error };
    }
}

