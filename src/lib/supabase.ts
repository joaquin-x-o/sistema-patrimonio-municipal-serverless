import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las variables de entorno de Supabase en el archivo .env');
}

// Cliente principal (mantiene las sesiones activas en el navegador)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente auxiliar para administración (evita pisar la sesión del administrador)
export const supabaseAuthAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});