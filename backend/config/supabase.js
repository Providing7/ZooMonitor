// ========================================
// CONFIGURAÇÃO DO SUPABASE
// ========================================

// Importar o cliente Supabase
import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente - SUBSTITUA pelos seus valores do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// Exportar funções auxiliares
export default supabase;

