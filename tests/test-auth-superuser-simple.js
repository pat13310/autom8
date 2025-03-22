// Script simplifié pour tester l'authentification des superusers
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
 * Fonction pour vérifier si un superuser existe
 */
async function checkSuperuser(email) {
  console.log(`\nVérification du superuser: ${email}`);
  
  try {
    const { data, error } = await supabase
      .from('superuser')
      .select('*')
      .eq('email', email);
    
    if (error) {
      console.error(`Erreur: ${error.message}`);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.log(`Aucun superuser trouvé avec l'email: ${email}`);
      return false;
    }
    
    console.log(`Superuser trouvé:`);
    console.log(`- ID: ${data[0].id}`);
    console.log(`- Email: ${data[0].email}`);
    console.log(`- Nom: ${data[0].name || 'Non spécifié'}`);
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue: ${error.message}`);
    return false;
  }
}

/**
 * Fonction pour tester l'authentification d'un superuser
 */
async function testSuperuserAuth(email, password) {
  console.log(`\n=== TEST D'AUTHENTIFICATION POUR ${email} ===`);
  
  // Vérifier d'abord si le superuser existe
  const exists = await checkSuperuser(email);
  
  if (!exists) {
    console.log(`Le superuser ${email} n'existe pas dans la base de données`);
    return false;
  }
  
  // Tenter de se connecter via l'API Auth de Supabase
  try {
    console.log(`\nTentative de connexion avec l'API Auth...`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error(`Erreur d'authentification: ${error.message}`);
      return false;
    }
    
    if (!data.user) {
      console.error(`Aucune donnée utilisateur retournée`);
      return false;
    }
    
    console.log(`Connexion réussie via l'API Auth`);
    console.log(`- ID: ${data.user.id}`);
    console.log(`- Email: ${data.user.email}`);
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue: ${error.message}`);
    return false;
  }
}

// Exécuter les tests
async function runTests() {
  console.log('=== DÉBUT DES TESTS ===');
  
  // Test 1: Vérifier si admin@example.com existe
  await checkSuperuser('admin@example.com');
  
  // Test 2: Vérifier si superuser4@autopro.com existe
  await checkSuperuser('superuser4@autopro.com');
  
  // Test 3: Tenter de se connecter avec admin@example.com
  await testSuperuserAuth('admin@example.com', 'test');
  
  // Test 4: Tenter de se connecter avec superuser4@autopro.com
  await testSuperuserAuth('superuser4@autopro.com', 'Autopro2023!');
  
  console.log('\n=== FIN DES TESTS ===');
}

// Exécuter les tests
runTests()
  .then(() => {
    console.log('\nTests terminés');
    process.exit(0);
  })
  .catch(error => {
    console.error(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
