// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '⚠️ Faltan variables de entorno.\n' +
    'Asegúrate de tener .env con:\n' +
    '  REACT_APP_SUPABASE_URL\n' +
    '  REACT_APP_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Función helper para manejar errores
export function handleSupabaseError(error) {
  if (!error) return null;
  console.error('Supabase Error:', error);
  return error.message || 'Error desconocido';
}