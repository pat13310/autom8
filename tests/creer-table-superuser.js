// Script pour créer la table superuser et y ajouter un administrateur
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement depuis le fichier .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

console.log(`URL Supabase: ${supabaseUrl}`);

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Requête SQL pour créer la table superuser
const createTableSQL = `
-- Vérifier si l'extension pgcrypto est installée (nécessaire pour crypt et gen_salt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Créer la table superuser si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS public.superuser (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Activer RLS (Row Level Security)
ALTER TABLE public.superuser ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes pour éviter les doublons
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent lire les superusers" ON public.superuser;
DROP POLICY IF EXISTS "Les superusers peuvent modifier les superusers" ON public.superuser;
DROP POLICY IF EXISTS "anon peut lire les superusers" ON public.superuser;

-- Créer une politique permettant aux utilisateurs authentifiés de lire la table
CREATE POLICY "Les utilisateurs authentifiés peuvent lire les superusers"
  ON public.superuser
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Créer une politique permettant aux superusers de modifier la table
CREATE POLICY "Les superusers peuvent modifier les superusers"
  ON public.superuser
  FOR ALL
  USING (auth.email() IN (SELECT email FROM public.superuser));

-- Ajouter une politique pour permettre à anon d'accéder à la table (utile pour les tests)
CREATE POLICY "anon peut lire les superusers"
  ON public.superuser
  FOR SELECT
  USING (auth.role() = 'anon');
`;

// Requête SQL pour insérer un superuser
const insertSuperuserSQL = `
-- Insérer un superuser s'il n'existe pas déjà
INSERT INTO public.superuser (email, password_hash, name, created_at)
SELECT 
  'admin@example.com', 
  crypt('test', gen_salt('bf')), 
  'John Doe', 
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.superuser WHERE email = 'admin@example.com'
);
`;

/**
 * Fonction pour créer la table superuser
 */
async function creerTableSuperuser() {
  console.log('=== CRÉATION DE LA TABLE SUPERUSER ===');
  
  try {
    // Exécuter la requête SQL pour créer la table
    console.log('\n1. Création de la table et configuration des politiques...');
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
      // Si la fonction RPC n'existe pas, essayer avec une requête SQL directe
      if (createError.message.includes('function') && createError.message.includes('does not exist')) {
        console.log('ℹ️ La fonction RPC exec_sql n\'existe pas, tentative avec une requête SQL directe...');
        
        // Essayer d'exécuter la requête SQL directement
        const { error: sqlError } = await supabase.from('_exec_sql').select('*').eq('sql', createTableSQL);
        
        if (sqlError) {
          console.error(`❌ Erreur lors de la création de la table: ${sqlError.message}`);
          console.log('\nVous devez exécuter le script SQL manuellement dans l\'interface d\'administration Supabase.');
          console.log('Voici le script SQL à exécuter:');
          console.log('\n' + createTableSQL);
          return false;
        }
      } else {
        console.error(`❌ Erreur lors de la création de la table: ${createError.message}`);
        console.log('\nVous devez exécuter le script SQL manuellement dans l\'interface d\'administration Supabase.');
        console.log('Voici le script SQL à exécuter:');
        console.log('\n' + createTableSQL);
        return false;
      }
    } else {
      console.log('✅ Table et politiques créées avec succès');
    }
    
    // Vérifier si la table a été créée
    console.log('\n2. Vérification de la création de la table...');
    
    const { data: tableExists, error: tableError } = await supabase
      .from('superuser')
      .select('*')
      .limit(1);
    
    if (tableError) {
      if (tableError.message.includes('does not exist')) {
        console.error('❌ La table n\'a pas été créée correctement');
        return false;
      } else {
        console.error(`❌ Erreur lors de la vérification: ${tableError.message}`);
        return false;
      }
    }
    
    console.log('✅ La table superuser existe et est accessible');
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur inattendue: ${error}`);
    return false;
  }
}

/**
 * Fonction pour ajouter un superuser
 */
async function ajouterSuperuser() {
  console.log('\n=== AJOUT D\'UN SUPERUSER ===');
  
  try {
    // Vérifier si le superuser existe déjà
    console.log('\n1. Vérification si le superuser existe déjà...');
    
    const { data: existingSuperuser, error: existingError } = await supabase
      .from('superuser')
      .select('*')
      .eq('email', 'admin@example.com')
      .single();
    
    if (existingError) {
      if (existingError.code === 'PGRST116') {
        console.log('ℹ️ Le superuser n\'existe pas encore');
      } else {
        console.error(`❌ Erreur lors de la vérification: ${existingError.message}`);
        return false;
      }
    } else {
      console.log('✅ Le superuser existe déjà dans la table');
      console.log(`- ID: ${existingSuperuser.id}`);
      console.log(`- Email: ${existingSuperuser.email}`);
      console.log(`- Nom: ${existingSuperuser.name || 'Non spécifié'}`);
      return true;
    }
    
    // Exécuter la requête SQL pour insérer un superuser
    console.log('\n2. Ajout du superuser...');
    
    const { error: insertError } = await supabase.rpc('exec_sql', { sql: insertSuperuserSQL });
    
    if (insertError) {
      // Si la fonction RPC n'existe pas, essayer avec une requête SQL directe
      if (insertError.message.includes('function') && insertError.message.includes('does not exist')) {
        console.log('ℹ️ La fonction RPC exec_sql n\'existe pas, tentative avec une insertion directe...');
        
        // Essayer d'insérer directement
        const { error: directInsertError } = await supabase
          .from('superuser')
          .insert([{
            email: 'admin@example.com',
            password_hash: 'password_hash_placeholder', // Impossible de hasher côté client
            name: 'John Doe',
            created_at: new Date().toISOString()
          }]);
        
        if (directInsertError) {
          console.error(`❌ Erreur lors de l'insertion directe: ${directInsertError.message}`);
          console.log('\nVous devez exécuter le script SQL manuellement dans l\'interface d\'administration Supabase.');
          console.log('Voici le script SQL à exécuter:');
          console.log('\n' + insertSuperuserSQL);
          return false;
        } else {
          console.log('✅ Superuser ajouté avec succès (sans hachage du mot de passe)');
          console.log('⚠️ Le mot de passe n\'a pas été haché correctement, vous devrez le mettre à jour manuellement');
        }
      } else {
        console.error(`❌ Erreur lors de l'ajout du superuser: ${insertError.message}`);
        console.log('\nVous devez exécuter le script SQL manuellement dans l\'interface d\'administration Supabase.');
        console.log('Voici le script SQL à exécuter:');
        console.log('\n' + insertSuperuserSQL);
        return false;
      }
    } else {
      console.log('✅ Superuser ajouté avec succès');
    }
    
    // Vérifier que le superuser a bien été ajouté
    console.log('\n3. Vérification finale...');
    
    const { data: finalSuperuser, error: finalError } = await supabase
      .from('superuser')
      .select('*')
      .eq('email', 'admin@example.com')
      .single();
    
    if (finalError) {
      console.error(`❌ Erreur lors de la vérification finale: ${finalError.message}`);
      return false;
    }
    
    console.log('✅ Vérification réussie, le superuser est bien présent dans la table');
    
    // Afficher les détails du superuser
    console.log('\nDétails du superuser:');
    Object.entries(finalSuperuser).forEach(([key, value]) => {
      // Ne pas afficher le mot de passe haché
      if (key !== 'password_hash') {
        console.log(`- ${key}: ${value || 'Non spécifié'}`);
      }
    });
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur inattendue: ${error}`);
    return false;
  }
}

// Exécuter les fonctions
async function main() {
  // Créer d'abord la table
  const tableCreee = await creerTableSuperuser();
  
  if (tableCreee) {
    // Si la table a été créée, ajouter un superuser
    await ajouterSuperuser();
  } else {
    console.log('\n⚠️ Impossible d\'ajouter un superuser car la table n\'a pas pu être créée');
    console.log('Veuillez d\'abord créer la table en exécutant le script SQL manuellement');
  }
}

main()
  .then(() => {
    console.log('\n=== OPÉRATION TERMINÉE ===');
    process.exit(0);
  })
  .catch(error => {
    console.error(`Erreur fatale: ${error}`);
    process.exit(1);
  });
