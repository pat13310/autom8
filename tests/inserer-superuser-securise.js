// Script pour insérer un superuser avec mot de passe haché côté client
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

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
  email: 'superuser4@autopro.com',
  name: 'Super Utilisateur AutoPro 4',
  password: 'Autopro2023!'
};

/**
 * Fonction pour hacher un mot de passe avec bcrypt
 * Utilise la bibliothèque bcryptjs pour un hachage sécurisé
 */
async function hashPassword(password) {
  // Utiliser bcrypt avec un facteur de coût de 10
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Fonction pour insérer un superuser avec mot de passe haché côté client
 */
async function insererSuperuser() {
  console.log('=== INSERTION D\'UN SUPERUSER SÉCURISÉ ===');
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
    
    // Hacher le mot de passe côté client
    console.log('\n2. Hachage du mot de passe côté client...');
    const hashedPassword = await hashPassword(superuserInfo.password);
    console.log(`Mot de passe haché: ${hashedPassword.substring(0, 20)}... (tronqué)`);
    
    // Préparer les données d'insertion
    console.log('\n3. Préparation des données d\'insertion...');
    
    const userData = {
      email: superuserInfo.email,
      password_hash: hashedPassword,
      name: superuserInfo.name,
      created_at: new Date().toISOString()
    };
    
    // Insérer le superuser
    console.log('\n4. Insertion du superuser...');
    
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
        } else {
          // Afficher seulement les premiers caractères du hash pour vérification
          console.log(`- ${key}: ${value.substring(0, 20)}... (tronqué)`);
        }
      });
    }
    
    console.log('\n⚠️ IMPORTANT: Ce hachage est fait côté client et n\'est pas compatible avec pgcrypto.');
    console.log('Pour l\'authentification, vous devrez utiliser une logique spécifique pour vérifier ce format de hachage.');
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue: ${error.message}`);
    if (error.stack) {
      console.error(`Stack trace: ${error.stack}`);
    }
    return false;
  }
}

// Exécuter la fonction
insererSuperuser()
  .then(success => {
    console.log(`\n=== OPÉRATION ${success ? 'RÉUSSIE' : 'ÉCHOUÉE'} ===`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
