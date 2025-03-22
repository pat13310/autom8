// Script pour vérifier la structure de la table superuser et insérer un superuser
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

// Informations du superuser à ajouter
const superuserInfo = {
  email: 'superuser3@autopro.com', // Utiliser un email différent pour éviter les conflits
  name: 'Super Utilisateur AutoPro 3',
  password: 'Autopro2023!'
};

/**
 * Fonction pour vérifier la structure de la table superuser
 */
async function verifierStructureTable() {
  console.log('=== VÉRIFICATION DE LA STRUCTURE DE LA TABLE ===');
  
  try {
    // Récupérer un enregistrement pour voir les colonnes disponibles
    const { data, error } = await supabase
      .from('superuser')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Erreur lors de la vérification de la structure: ${error.message}`);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log('La table est vide, impossible de déterminer la structure exacte');
      
      // Structure par défaut basée sur le script SQL
      return {
        colonnes: ['id', 'email', 'password_hash', 'name', 'created_at'],
        hasUpdatedAt: false,
        hasLastLogin: false
      };
    }
    
    // Déterminer les colonnes disponibles
    const colonnes = Object.keys(data[0]);
    console.log('Colonnes disponibles:', colonnes.join(', '));
    
    return {
      colonnes,
      hasUpdatedAt: colonnes.includes('updated_at'),
      hasLastLogin: colonnes.includes('last_login')
    };
  } catch (error) {
    console.error(`Erreur inattendue: ${error.message}`);
    return null;
  }
}

/**
 * Fonction pour insérer un superuser en fonction de la structure de la table
 */
async function insererSuperuser(structure) {
  console.log('\n=== INSERTION D\'UN SUPERUSER ===');
  console.log(`Email: ${superuserInfo.email}`);
  
  try {
    // Vérifier si le superuser existe déjà
    console.log('\n1. Vérification si le superuser existe déjà...');
    
    const { data: existingSuperuser, error: existingError } = await supabase
      .from('superuser')
      .select('*')
      .eq('email', superuserInfo.email)
      .single();
    
    if (existingError) {
      if (existingError.code === 'PGRST116') {
        console.log('Le superuser n\'existe pas encore');
      } else {
        console.error(`Erreur lors de la vérification: ${existingError.message}`);
        return false;
      }
    } else {
      console.log('Le superuser existe déjà dans la table');
      console.log(`- ID: ${existingSuperuser.id}`);
      console.log(`- Email: ${existingSuperuser.email}`);
      console.log(`- Nom: ${existingSuperuser.name || 'Non spécifié'}`);
      return true;
    }
    
    // Préparer les données d'insertion en fonction de la structure
    console.log('\n2. Préparation des données d\'insertion...');
    
    const userData = {
      email: superuserInfo.email,
      password_hash: `non_hache_${superuserInfo.password}`, // Préfixe pour indiquer que ce n'est pas haché
      name: superuserInfo.name,
      created_at: new Date().toISOString()
    };
    
    // Ajouter updated_at si la colonne existe
    if (structure.hasUpdatedAt) {
      userData.updated_at = new Date().toISOString();
    }
    
    console.log('Données préparées:', JSON.stringify(userData, null, 2));
    
    // Insérer le superuser
    console.log('\n3. Insertion du superuser...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('superuser')
      .insert([userData])
      .select();
    
    if (insertError) {
      console.error(`Erreur lors de l'insertion: ${insertError.message}`);
      console.error(`Code d'erreur: ${insertError.code}`);
      console.error(`Détails: ${JSON.stringify(insertError.details || {})}`);
      return false;
    }
    
    console.log('Superuser ajouté avec succès');
    
    if (insertData && insertData.length > 0) {
      console.log('\nDétails du superuser inséré:');
      Object.entries(insertData[0]).forEach(([key, value]) => {
        if (key !== 'password_hash') {
          console.log(`- ${key}: ${value || 'Non spécifié'}`);
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue: ${error.message}`);
    if (error.stack) {
      console.error(`Stack trace: ${error.stack}`);
    }
    return false;
  }
}

// Exécuter les fonctions
async function main() {
  // Vérifier d'abord la structure de la table
  const structure = await verifierStructureTable();
  
  if (!structure) {
    console.error('Impossible de déterminer la structure de la table');
    return false;
  }
  
  // Insérer le superuser en fonction de la structure
  return await insererSuperuser(structure);
}

main()
  .then(success => {
    console.log(`\n=== OPÉRATION ${success ? 'RÉUSSIE' : 'ÉCHOUÉE'} ===`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
