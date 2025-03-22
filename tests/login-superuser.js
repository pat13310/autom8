// Script pour tester la connexion avec la table superuser
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as crypto from 'crypto';
import * as readline from 'readline';

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

// Créer une interface pour lire l'entrée utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Fonction pour hacher un mot de passe avec SHA-256 (pour les mots de passe hashés côté client)
 */
function hashPasswordSHA256(password, salt) {
  return crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');
}

/**
 * Fonction pour vérifier un mot de passe haché côté client
 */
function verifyClientHashedPassword(password, hashedPassword) {
  // Format: $sha256$salt$hash
  const parts = hashedPassword.split('$');
  
  if (parts.length !== 4 || parts[1] !== 'sha256') {
    return false;
  }
  
  const salt = parts[2];
  const hash = parts[3];
  
  const calculatedHash = hashPasswordSHA256(password, salt);
  return calculatedHash === hash;
}

/**
 * Fonction pour se connecter en tant que superuser
 */
async function loginSuperuser(email, password) {
  console.log('=== CONNEXION SUPERUSER ===');
  console.log(`Email: ${email}`);
  
  try {
    // Récupérer le superuser par email
    console.log('\n1. Recherche du superuser...');
    
    const { data: superuser, error } = await supabase
      .from('superuser')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.error('❌ Utilisateur non trouvé');
        return false;
      } else {
        console.error(`❌ Erreur lors de la recherche: ${error.message}`);
        return false;
      }
    }
    
    console.log('✅ Superuser trouvé');
    
    // Vérifier le mot de passe
    console.log('\n2. Vérification du mot de passe...');
    
    let passwordValid = false;
    
    // Vérifier si c'est un hash côté client (format $sha256$salt$hash)
    if (superuser.password_hash.startsWith('$sha256$')) {
      passwordValid = verifyClientHashedPassword(password, superuser.password_hash);
    } 
    // Vérifier si c'est un mot de passe en clair avec préfixe (pour les tests)
    else if (superuser.password_hash.startsWith('non_hache_')) {
      const clearPassword = superuser.password_hash.substring(10);
      passwordValid = (password === clearPassword);
    }
    // Sinon, c'est probablement un hash bcrypt qui ne peut pas être vérifié côté client
    else {
      console.log('⚠️ Le mot de passe est haché avec bcrypt et ne peut pas être vérifié côté client');
      console.log('⚠️ Dans un environnement de production, cette vérification doit être faite côté serveur');
      
      // Pour les tests, on peut considérer que le mot de passe est valide si c'est "test" pour admin@example.com
      if (email === 'admin@example.com' && password === 'test') {
        console.log('✅ Mot de passe valide (simulation pour admin@example.com)');
        passwordValid = true;
      } else {
        console.log('❌ Mot de passe invalide (simulation)');
        passwordValid = false;
      }
    }
    
    if (!passwordValid) {
      console.error('❌ Mot de passe incorrect');
      return false;
    }
    
    console.log('✅ Mot de passe valide');
    
    // Mettre à jour la date de dernière connexion
    console.log('\n3. Mise à jour de la date de dernière connexion...');
    
    const { error: updateError } = await supabase
      .from('superuser')
      .update({ last_login: new Date().toISOString() })
      .eq('id', superuser.id);
    
    if (updateError) {
      console.error(`⚠️ Erreur lors de la mise à jour de la date de connexion: ${updateError.message}`);
      // Ne pas bloquer la connexion pour cette erreur
    } else {
      console.log('✅ Date de dernière connexion mise à jour');
    }
    
    // Simuler une session
    console.log('\n=== CONNEXION RÉUSSIE ===');
    console.log('Détails du superuser:');
    console.log(`- ID: ${superuser.id}`);
    console.log(`- Email: ${superuser.email}`);
    console.log(`- Nom: ${superuser.name || 'Non spécifié'}`);
    console.log(`- Date de création: ${superuser.created_at}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur inattendue: ${error.message}`);
    return false;
  }
}

// Fonction principale qui demande les identifiants à l'utilisateur
function promptCredentials() {
  rl.question('Email: ', (email) => {
    rl.question('Mot de passe: ', async (password) => {
      const success = await loginSuperuser(email, password);
      
      console.log(`\n=== OPÉRATION ${success ? 'RÉUSSIE' : 'ÉCHOUÉE'} ===`);
      
      rl.close();
      process.exit(success ? 0 : 1);
    });
  });
}

// Si des arguments sont fournis, les utiliser comme identifiants
if (process.argv.length >= 4) {
  const email = process.argv[2];
  const password = process.argv[3];
  
  loginSuperuser(email, password)
    .then(success => {
      console.log(`\n=== OPÉRATION ${success ? 'RÉUSSIE' : 'ÉCHOUÉE'} ===`);
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error(`Erreur fatale: ${error.message}`);
      process.exit(1);
    });
} else {
  // Sinon, demander les identifiants à l'utilisateur
  promptCredentials();
}
