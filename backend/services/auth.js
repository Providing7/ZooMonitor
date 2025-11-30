// ========================================
// SERVIÇO DE AUTENTICAÇÃO
// ========================================

import { supabase } from '../config/supabase.js';

/**
 * Registrar novo usuário com email e senha
 */
export async function signUp(email, password, fullName) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao registrar:', error);
        return { data: null, error };
    }
}

/**
 * Login com email e senha
 */
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return { data: null, error };
    }
}

/**
 * Login com Google
 */
export async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/pages/membros.html`
            }
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao fazer login com Google:', error);
        return { data: null, error };
    }
}

/**
 * Login com Facebook
 */
export async function signInWithFacebook() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: `${window.location.origin}/pages/membros.html`
            }
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao fazer login com Facebook:', error);
        return { data: null, error };
    }
}

/**
 * Logout
 */
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        return { error };
    }
}

/**
 * Obter usuário atual
 */
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { user, error: null };
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return { user: null, error };
    }
}

/**
 * Obter perfil do usuário
 */
export async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        return { data: null, error };
    }
}

/**
 * Atualizar perfil do usuário
 */
export async function updateUserProfile(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return { data: null, error };
    }
}

/**
 * Listener para mudanças de autenticação
 */
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}

