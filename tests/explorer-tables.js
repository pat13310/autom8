// Script pour explorer les tables disponibles dans Supabase
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

/**
 * Fonction pour explorer les tables disponibles
 */
async function explorerTables() {
  console.log('=== EXPLORATION DES TABLES SUPABASE ===');
  
  try {
    // Méthode 1: Utiliser une requête SQL directe pour obtenir la liste des tables
    console.log('\n1. Tentative d\'obtenir la liste des tables via SQL...');
    
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');
    
    if (tablesError) {
      console.log(`ℹ️ Impossible d'utiliser la fonction RPC: ${tablesError.message}`);
      console.log('Cette méthode nécessite une fonction personnalisée dans Supabase.');
    } else if (tables && tables.length > 0) {
      console.log('✅ Tables trouvées:');
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    
    // Méthode 2: Tester l'accès à quelques tables communes
    console.log('\n2. Test d\'accès à des tables spécifiques...');
    
    const tablesToTest = [
      'administrators',
      'superuser',
      'users',
      'profiles',
      'auth',
      'customers',
      'products',
      'orders'
    ];
    
    for (const tableName of tablesToTest) {
      try {
        console.log(`\nTest de la table '${tableName}'...`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          if (error.message.includes('does not exist')) {
            console.log(`❌ La table '${tableName}' n'existe pas`);
          } else if (error.message.includes('permission denied')) {
            console.log(`⚠️ La table '${tableName}' existe mais vous n'avez pas les permissions nécessaires`);
          } else {
            console.log(`❌ Erreur lors de l'accès à '${tableName}': ${error.message}`);
          }
        } else {
          console.log(`✅ La table '${tableName}' existe et est accessible`);
          console.log(`   Nombre d'enregistrements récupérés: ${data ? data.length : 0}`);
          
          if (data && data.length > 0) {
            console.log('   Colonnes disponibles:');
            Object.keys(data[0]).forEach(column => {
              console.log(`   - ${column}`);
            });
          }
        }
      } catch (tableError) {
        console.log(`❌ Erreur lors du test de '${tableName}': ${tableError.message}`);
      }
    }
    
    // Méthode 3: Tenter de créer la table superuser si elle n'existe pas
    console.log('\n3. Vérification de la possibilité de créer la table superuser...');
    
    try {
      // Tenter d'exécuter une requête SQL pour créer la table
      const { error: createError } = await supabase.rpc('create_superuser_table');
      
      if (createError) {
        console.log(`ℹ️ Impossible de créer la table via RPC: ${createError.message}`);
        console.log('Cette méthode nécessite une fonction personnalisée dans Supabase.');
        console.log('\nPour créer la table superuser manuellement:');
        console.log('1. Connectez-vous à l\'interface d\'administration Supabase');
        console.log('2. Allez dans "SQL Editor"');
        console.log('3. Exécutez la requête SQL suivante:');
        console.log(`
CREATE TABLE IF NOT EXISTS public.superuser (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Activer RLS (Row Level Security)
ALTER TABLE public.superuser ENABLE ROW LEVEL SECURITY;

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
`);
      } else {
        console.log('✅ Table superuser créée avec succès');
      }
    } catch (createTableError) {
      console.log(`❌ Erreur lors de la tentative de création: ${createTableError.message}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur inattendue: ${error}`);
    return false;
  }
}

// Exécuter la fonction
explorerTables()
  .then(success => {
    console.log(`\n=== EXPLORATION ${success ? 'TERMINÉE' : 'ÉCHOUÉE'} ===`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(`Erreur fatale: ${error}`);
    process.exit(1);
  });
