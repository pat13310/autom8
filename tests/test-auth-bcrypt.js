// Script de test pour l'authentification avec bcrypt
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xarnkfrwnpehoyzqdkoc.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhcm5rZnJ3bnBlaG95enFka29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQxNzM0MTYsImV4cCI6MjAwOTc0OTQxNn0.Ykgz0MN2FvPCEFAVjR9BcMU2-wIUZBMHCCfZ_sCwFtY';

console.log('URL Supabase:', supabaseUrl);

// Initialisation du client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour hacher un mot de passe avec bcrypt
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Fonction pour vérifier un mot de passe avec bcrypt
async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Fonction pour mettre à jour le mot de passe d'un superuser avec bcrypt
async function updateSuperuserPassword(email, newPassword) {
  try {
    // Hacher le mot de passe
    const hashedPassword = await hashPassword(newPassword);
    
    // Mettre à jour le mot de passe dans la base de données
    const { data, error } = await supabase
      .from('superuser')
      .update({ password_hash: hashedPassword })
      .eq('email', email);
    
    if (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      return false;
    }
    
    console.log(`Mot de passe mis à jour pour ${email}`);
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
}

// Fonction pour tester l'authentification
async function testAuthentication(email, password) {
  try {
    // Récupérer le superuser
    const { data: superusers, error } = await supabase
      .from('superuser')
      .select('*')
      .eq('email', email);
    
    if (error) {
      console.error('Erreur lors de la recherche du superuser:', error);
      return false;
    }
    
    if (!superusers || superusers.length === 0) {
      console.error('Superuser non trouvé');
      return false;
    }
    
    const superuser = superusers[0];
    
    // Vérifier le mot de passe
    const passwordValid = await verifyPassword(password, superuser.password_hash);
    
    if (!passwordValid) {
      console.error('Mot de passe incorrect');
      return false;
    }
    
    console.log(`Authentification réussie pour ${email}`);
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
}

// Tests
async function runTests() {
  console.log('=== DÉBUT DES TESTS D\'AUTHENTIFICATION AVEC BCRYPT ===');
  
  // Test 1: Mettre à jour le mot de passe de admin@example.com
  console.log('\n=== TEST 1: Mise à jour du mot de passe de admin@example.com ===');
  const updateResult = await updateSuperuserPassword('admin@example.com', 'test');
  console.log(updateResult ? '✅ Mot de passe mis à jour' : '❌ Échec de la mise à jour du mot de passe');
  
  // Test 2: Authentification avec admin@example.com
  console.log('\n=== TEST 2: Authentification avec admin@example.com ===');
  const authResult1 = await testAuthentication('admin@example.com', 'test');
  console.log(authResult1 ? '✅ Authentification réussie' : '❌ Échec de l\'authentification');
  
  // Test 3: Authentification avec un mot de passe incorrect
  console.log('\n=== TEST 3: Authentification avec un mot de passe incorrect ===');
  const authResult2 = await testAuthentication('admin@example.com', 'mauvais_mot_de_passe');
  console.log(!authResult2 ? '✅ Échec attendu de l\'authentification' : '❌ Authentification réussie (inattendu)');
  
  // Test 4: Mettre à jour le mot de passe de superuser4@autopro.com
  console.log('\n=== TEST 4: Mise à jour du mot de passe de superuser4@autopro.com ===');
  const updateResult2 = await updateSuperuserPassword('superuser4@autopro.com', 'Autopro2023!');
  console.log(updateResult2 ? '✅ Mot de passe mis à jour' : '❌ Échec de la mise à jour du mot de passe');
  
  // Test 5: Authentification avec superuser4@autopro.com
  console.log('\n=== TEST 5: Authentification avec superuser4@autopro.com ===');
  const authResult3 = await testAuthentication('superuser4@autopro.com', 'Autopro2023!');
  console.log(authResult3 ? '✅ Authentification réussie' : '❌ Échec de l\'authentification');
  
  console.log('\n=== FIN DES TESTS ===');
}

// Exécuter les tests
runTests()
  .then(() => {
    console.log('Tests terminés');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erreur lors des tests:', error);
    process.exit(1);
  });
