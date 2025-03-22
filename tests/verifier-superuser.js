// Script pour vérifier la table superuser après sa création manuelle
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
 * Fonction pour vérifier la table superuser
 */
async function verifierTableSuperuser() {
  console.log('=== VÉRIFICATION DE LA TABLE SUPERUSER ===');
  
  try {
    // Vérifier si la table existe
    console.log('\n1. Vérification de l\'existence de la table...');
    
    const { data, error } = await supabase
      .from('superuser')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error(`❌ Erreur lors de la vérification: ${error.message}`);
      
      if (error.message.includes('does not exist')) {
        console.log('\nLa table superuser n\'existe pas.');
        console.log('Veuillez exécuter le script SQL pour créer la table.');
      } else if (error.message.includes('permission denied')) {
        console.log('\nVous n\'avez pas les permissions nécessaires pour accéder à la table.');
        console.log('Vérifiez les politiques RLS (Row Level Security) de la table.');
      }
      
      return false;
    }
    
    console.log('✅ La table superuser existe et est accessible');
    
    // Afficher le nombre d'enregistrements
    console.log(`\nNombre d'enregistrements: ${data.length}`);
    
    // Afficher les détails des superusers
    if (data.length > 0) {
      console.log('\nListe des superusers:');
      
      data.forEach((superuser, index) => {
        console.log(`\n--- Superuser ${index + 1} ---`);
        
        // Afficher toutes les colonnes sauf password_hash
        Object.entries(superuser).forEach(([key, value]) => {
          if (key !== 'password_hash') {
            console.log(`- ${key}: ${value || 'Non spécifié'}`);
          }
        });
      });
      
      // Vérifier si admin@example.com existe
      const adminUser = data.find(user => user.email === 'admin@example.com');
      
      if (adminUser) {
        console.log('\n✅ Le superuser admin@example.com existe dans la table');
      } else {
        console.log('\nℹ️ Le superuser admin@example.com n\'existe pas dans la table');
      }
    } else {
      console.log('\nℹ️ La table est vide, aucun superuser trouvé');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur inattendue: ${error}`);
    return false;
  }
}

// Exécuter la fonction
verifierTableSuperuser()
  .then(success => {
    console.log(`\n=== VÉRIFICATION ${success ? 'TERMINÉE' : 'ÉCHOUÉE'} ===`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(`Erreur fatale: ${error}`);
    process.exit(1);
  });
