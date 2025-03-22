// Script pour ajouter un superuser dans la table superuser
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

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
  email: 'superuser@autopro.com',
  name: 'Super Utilisateur',
  role: 'admin'
};

/**
 * Fonction pour ajouter un superuser
 */
async function ajouterSuperuser() {
  console.log('=== AJOUT D\'UN SUPERUSER ===');
  console.log(`Email: ${superuserInfo.email}`);
  
  try {
    // Étape 1: Vérifier si le superuser existe déjà
    console.log('\n1. Vérification si le superuser existe déjà...');
    
    const { data: existingSuperuser, error: existingError } = await supabase
      .from('superuser')
      .select('*')
      .eq('email', superuserInfo.email)
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
      console.log(`- Rôle: ${existingSuperuser.role || 'Non spécifié'}`);
      return true;
    }
    
    // Étape 2: Déterminer la structure de la table
    console.log('\n2. Détermination de la structure de la table superuser...');
    
    // Tenter d'insérer un enregistrement avec des colonnes communes
    const superuserId = randomUUID();
    
    // Créer un objet avec toutes les colonnes possibles
    // Nous utiliserons cet objet pour l'insertion
    const superuserData = {
      id: superuserId,
      email: superuserInfo.email,
      name: superuserInfo.name,
      role: superuserInfo.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };
    
    // Étape 3: Ajouter le superuser
    console.log('\n3. Ajout du superuser dans la table...');
    
    const { error: insertError } = await supabase
      .from('superuser')
      .insert([superuserData]);
    
    if (insertError) {
      console.error(`❌ Erreur lors de l'ajout du superuser: ${insertError.message}`);
      
      // Si l'erreur est due à des colonnes manquantes, essayer avec moins de colonnes
      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('\nTentative avec moins de colonnes...');
        
        // Créer un objet avec seulement les colonnes essentielles
        const essentialData = {
          id: superuserId,
          email: superuserInfo.email,
          name: superuserInfo.name
        };
        
        const { error: retryError } = await supabase
          .from('superuser')
          .insert([essentialData]);
        
        if (retryError) {
          console.error(`❌ Échec de la seconde tentative: ${retryError.message}`);
          return false;
        } else {
          console.log('✅ Superuser ajouté avec succès (colonnes essentielles uniquement)');
        }
      } else {
        return false;
      }
    } else {
      console.log('✅ Superuser ajouté avec succès');
    }
    
    // Étape 4: Vérifier que le superuser a bien été ajouté
    console.log('\n4. Vérification finale...');
    
    const { data: finalSuperuser, error: finalError } = await supabase
      .from('superuser')
      .select('*')
      .eq('email', superuserInfo.email)
      .single();
    
    if (finalError) {
      console.error(`❌ Erreur lors de la vérification finale: ${finalError.message}`);
      return false;
    }
    
    console.log('✅ Vérification réussie, le superuser est bien présent dans la table');
    
    // Afficher toutes les colonnes disponibles
    console.log('\nDétails du superuser:');
    Object.entries(finalSuperuser).forEach(([key, value]) => {
      console.log(`- ${key}: ${value || 'Non spécifié'}`);
    });
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur inattendue: ${error}`);
    return false;
  }
}

// Exécuter la fonction
ajouterSuperuser()
  .then(success => {
    console.log(`\n=== OPÉRATION ${success ? 'RÉUSSIE' : 'ÉCHOUÉE'} ===`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(`Erreur fatale: ${error}`);
    process.exit(1);
  });
