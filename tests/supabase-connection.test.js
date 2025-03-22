// Script de test pour la connexion à Supabase
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

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Script de test pour vérifier la connexion à Supabase
 * Ce script vérifie:
 * 1. Si la connexion à Supabase est établie
 * 2. Si nous pouvons effectuer une requête simple
 */

async function testSupabaseConnection() {
  console.log('Démarrage du test de connexion à Supabase...');
  console.log(`URL Supabase: ${supabaseUrl}`);
  
  try {
    // Test 1: Vérifier si nous pouvons accéder à l'API Supabase
    console.log('Test 1: Vérification de la connexion à l\'API Supabase...');
    
    // Utiliser une requête simple pour vérifier la connexion
    const { data, error } = await supabase
      .from('administrators')
      .select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Échec de la connexion à Supabase:', error.message);
    } else {
      console.log('✅ Connexion à l\'API Supabase établie avec succès');
    }

    // Test 2: Essayer de récupérer des données d'une table (par exemple, administrators)
    console.log('\nTest 2: Récupération des données de la table administrators...');
    const { data: admins, error: adminsError } = await supabase
      .from('administrators')
      .select('id, email, name')
      .limit(1);
    
    if (adminsError) {
      console.error('❌ Échec de la requête sur la table administrators:', adminsError.message);
    } else {
      console.log('✅ Requête sur la table administrators réussie');
      console.log('Données récupérées:', admins);
    }

    // Test 3: Vérifier l'état de l'authentification
    console.log('\nTest 3: Vérification de l\'état d\'authentification...');
    const { data: authData } = await supabase.auth.getSession();
    
    if (authData.session) {
      console.log('✅ Session d\'authentification active trouvée');
    } else {
      console.log('ℹ️ Aucune session d\'authentification active (normal si non connecté)');
    }

    console.log('\nTests de connexion Supabase terminés');
    return true;
  } catch (error) {
    console.error('❌ Erreur inattendue lors des tests de connexion:', error);
    return false;
  }
}

// Exécuter le test
testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('🎉 Tous les tests de connexion sont terminés');
    } else {
      console.error('⚠️ Certains tests ont échoué, vérifiez les messages d\'erreur ci-dessus');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur fatale lors de l\'exécution des tests:', err);
    process.exit(1);
  });
