// ========================================
// SERVIÇO DE PROGRAMAS
// ========================================

import { supabase } from '../config/supabase.js';

/**
 * Obter todos os programas
 */
export async function getProgramas() {
    try {
        const { data, error } = await supabase
            .from('programas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao obter programas:', error);
        return { data: null, error };
    }
}

/**
 * Obter um programa específico
 */
export async function getProgramaById(programaId) {
    try {
        const { data, error } = await supabase
            .from('programas')
            .select('*')
            .eq('id', programaId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao obter programa:', error);
        return { data: null, error };
    }
}

