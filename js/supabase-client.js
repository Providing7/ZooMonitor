// ========================================
// CLIENTE SUPABASE PARA FRONTEND
// ========================================

// Importar Supabase via CDN (para uso direto no HTML)
// Este arquivo será usado no frontend

// Configuração do Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || window.env?.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || window.env?.VITE_SUPABASE_ANON_KEY;

// Verificar se as variáveis estão configuradas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('⚠️ Variáveis do Supabase não configuradas! Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
}

// Carregar Supabase via CDN se não estiver disponível
let supabase;
if (typeof window !== 'undefined') {
    // Carregar via script tag se necessário
    if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        script.onload = () => {
            window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            supabase = window.supabase;
        };
        document.head.appendChild(script);
    } else {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

// Exportar para uso global
window.supabaseClient = supabase;

export default supabase;

