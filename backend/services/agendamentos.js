// ========================================
// SERVIÇO DE AGENDAMENTOS
// ========================================

import { supabase } from '../config/supabase.js';

/**
 * Obter agendamentos do usuário atual
 */
export async function getAgendamentos() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('agendamentos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao obter agendamentos:', error);
        return { data: null, error };
    }
}

/**
 * Criar novo agendamento
 */
export async function createAgendamento(agendamentoData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('agendamentos')
            .insert({
                ...agendamentoData,
                user_id: user.id
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        return { data: null, error };
    }
}

/**
 * Atualizar agendamento
 */
export async function updateAgendamento(agendamentoId, updates) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('agendamentos')
            .update(updates)
            .eq('id', agendamentoId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        return { data: null, error };
    }
}

/**
 * Cancelar agendamento
 */
export async function cancelAgendamento(agendamentoId) {
    try {
        return await updateAgendamento(agendamentoId, { status: 'cancelled' });
    } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        return { data: null, error };
    }
}

