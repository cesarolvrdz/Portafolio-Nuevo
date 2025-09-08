import { createClient } from '@supabase/supabase-js';

// Variables de entorno de Supabase
const supabaseUrl = import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Verificar si las variables de entorno están configuradas
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabaseClient = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // No necesitamos sesiones para datos públicos
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey
        }
      }
    });
  } catch (error) {
    console.warn('Error initializing Supabase client:', error);
    supabaseClient = null;
  }
} else {
  console.warn('Supabase not configured. Using fallback data.');
}

export const supabase = supabaseClient;

// Helper para manejo de errores consistente
export function handleSupabaseError(error) {
  console.error('Supabase error:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
  throw new Error(`Database error: ${error.message}`);
}

// Helper para verificar la conexión
export async function testSupabaseConnection() {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await supabase.from('profile').select('count').limit(1);
    if (error) throw error;
    return { success: true, data: 'Connection successful' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
