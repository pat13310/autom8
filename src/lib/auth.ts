import { supabase } from './supabase';
import * as bcrypt from 'bcryptjs';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role?: 'superuser';
}

/**
 * Fonction pour vérifier un mot de passe avec bcrypt
 */
function verifyBcryptPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function signIn(email: string, password: string): Promise<{ user: AdminUser }> {
  console.log('Vérification des identifiants superuser pour:', email);
  
  try {
    // Récupérer le superuser par email (insensible à la casse)
    const { data: superusers, error } = await supabase
      .from('superuser')
      .select('*')
      .ilike('email', email);
    
    if (error) {
      console.error('Erreur lors de la recherche du superuser:', error);
      throw new Error('Erreur de base de données');
    }
    
    if (!superusers || superusers.length === 0) {
      console.error('Superuser non trouvé');
      throw new Error('Utilisateur non trouvé');
    }
    
    const superuser = superusers[0];
    
    // Vérifier le mot de passe
    let passwordValid = false;
    
    // Vérifier si c'est un hash bcrypt (commence par $2a$, $2b$ ou $2y$)
    if (superuser.password_hash.startsWith('$2')) {
      passwordValid = await verifyBcryptPassword(password, superuser.password_hash);
    } 
    // Vérifier si c'est un mot de passe en clair avec préfixe (pour les tests)
    else if (superuser.password_hash.startsWith('non_hache_')) {
      const clearPassword = superuser.password_hash.substring(10);
      passwordValid = (password === clearPassword);
    }
    // Cas spécial pour admin@example.com avec mot de passe "test"
    else if (email.toLowerCase() === 'admin@example.com' && password === 'test') {
      passwordValid = true;
    }
    // Cas spécial pour superuser4@autopro.com avec mot de passe "Autopro2023!"
    else if (email.toLowerCase() === 'superuser4@autopro.com' && password === 'Autopro2023!') {
      passwordValid = true;
    }
    
    if (!passwordValid) {
      console.error('Mot de passe superuser incorrect');
      throw new Error('Mot de passe incorrect');
    }
    
    // Mettre à jour la date de dernière connexion
    const { error: updateError } = await supabase
      .from('superuser')
      .update({ last_login: new Date().toISOString() })
      .eq('id', superuser.id);
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour de la date de connexion:', updateError);
      // Ne pas bloquer la connexion pour cette erreur
    }
    
    // Créer une session locale
    const user = {
      id: superuser.id,
      email: superuser.email,
      name: superuser.name || 'Superuser',
      role: 'superuser' as const
    };
    
    localStorage.setItem('autom8_user', JSON.stringify(user));
    
    return { user };
  } catch (error) {
    console.error('Échec de l\'authentification:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    // Supprimer la session locale
    localStorage.removeItem('autom8_user');
    console.log('Déconnexion réussie');
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    throw error;
  }
}

export async function getUser(): Promise<AdminUser | null> {
  try {
    // Vérifier si nous avons un utilisateur en session locale
    const localUser = localStorage.getItem('autom8_user');
    if (localUser) {
      const user = JSON.parse(localUser) as AdminUser;
      
      // Vérifier si le superuser existe toujours dans la base de données
      const { data: superusers, error: superuserError } = await supabase
        .from('superuser')
        .select('id, email, name')
        .eq('email', user.email);
      
      if (!superuserError && superusers && superusers.length > 0) {
        return {
          ...superusers[0],
          role: 'superuser'
        };
      } else {
        // Si le superuser n'existe plus, supprimer la session locale
        localStorage.removeItem('autom8_user');
      }
    }

    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

export function onAuthStateChange(callback: (user: AdminUser | null) => void) {
  // Vérifier l'état initial
  getUser().then(user => {
    callback(user);
  });
  
  // Nous n'utilisons pas l'API Auth de Supabase,
  // donc nous ne pouvons pas écouter les changements d'état d'authentification.
  // À la place, nous pourrions créer un écouteur personnalisé pour localStorage,
  // mais ce n'est pas standard en TypeScript/JavaScript.
  
  // Fonction pour nettoyer (vide dans ce cas)
  return () => {};
}