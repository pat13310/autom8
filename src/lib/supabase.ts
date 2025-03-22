import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

console.log('Configuration Supabase:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!supabaseServiceKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client Supabase public (lecture seule)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client Supabase avec clé de service (pour les superusers)
export function getServiceClient() {
  if (!supabaseServiceKey) {
    console.error('Erreur: Clé de service Supabase manquante');
    throw new Error('Missing Supabase service key');
  }

  console.log('Création du client service Supabase...');
  
  return createClient(supabaseUrl, supabaseServiceKey);
}