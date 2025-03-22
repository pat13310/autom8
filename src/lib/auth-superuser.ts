import { supabase } from './supabase';
import * as crypto from 'crypto';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role?: 'admin' | 'superuser';
}

/**
 * Fonction pour hacher un mot de passe avec SHA-256 (pour les mots de passe hashés côté client)
 */
function hashPasswordSHA256(password: string, salt: string): string {
  return crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');
}

/**
 * Fonction pour vérifier un mot de passe haché côté client
 */
function verifyClientHashedPassword(password: string, hashedPassword: string): boolean {
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
 * Fonction pour vérifier les identifiants d'un superuser
 */
async function verifySuperuserCredentials(email: string, password: string): Promise<AdminUser | null> {
  console.log('Vérification des identifiants superuser pour:', email);
  
  try {
    // Récupérer le superuser par email
    const { data: superusers, error } = await supabase
      .from('superuser')
      .select('*')
      .eq('email', email);
    
    if (error) {
      console.error('Erreur lors de la recherche du superuser:', error);
      return null;
    }
    
    if (!superusers || superusers.length === 0) {
      console.error('Superuser non trouvé');
      return null;
    }
    
    const superuser = superusers[0];
    
    // Vérifier le mot de passe
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
    // Cas spécial pour admin@example.com avec mot de passe "test"
    else if (email === 'admin@example.com' && password === 'test') {
      passwordValid = true;
    }
    
    if (!passwordValid) {
      console.error('Mot de passe superuser incorrect');
      return null;
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
    
    // Retourner les informations du superuser
    return {
      id: superuser.id,
      email: superuser.email,
      name: superuser.name || 'Superuser',
      role: 'superuser'
    };
  } catch (error) {
    console.error('Erreur lors de la vérification des identifiants superuser:', error);
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<{ user: AdminUser }> {
  console.log('Démarrage du processus d\'authentification pour:', email);
  
  try {
    // Essayer d'abord de se connecter en tant que superuser
    const superuser = await verifySuperuserCredentials(email, password);
    
    if (superuser) {
      console.log('Authentification réussie en tant que superuser');
      
      // Créer une session locale (sans utiliser l'API Auth de Supabase)
      localStorage.setItem('autom8_user', JSON.stringify(superuser));
      
      return { user: superuser };
    }
    
    // Si ce n'est pas un superuser, vérifier si c'est un administrateur
    const { data: admins, error: adminError } = await supabase
      .from('administrators')
      .select('id, email, name')
      .eq('email', email);

    if (adminError || !admins || admins.length === 0) {
      console.error('Administrateur non trouvé:', adminError);
      throw new Error('Utilisateur non trouvé');
    }

    const admin = admins[0];

    // Essayer de s'authentifier avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Erreur d\'authentification:', authError);
      // Vérifier si c'est une erreur de mot de passe (cas le plus courant lorsque l'utilisateur existe mais l'authentification échoue)
      if (admin) {
        throw new Error('Mot de passe incorrect');
      }
      throw new Error('Identifiants invalides');
    }

    if (!authData.user) {
      console.error('Aucune donnée utilisateur retournée par l\'authentification');
      throw new Error('Erreur d\'authentification');
    }

    // Mettre à jour la date de dernière connexion
    const { error: updateError } = await supabase
      .from('administrators')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    if (updateError) {
      console.error('Erreur lors de la mise à jour de la date de connexion:', updateError);
      // Ne pas lancer d'erreur car ce n'est pas critique
    }

    // Ajouter le rôle d'administrateur
    
    
    return { user: admin };

  } catch (error) {
    console.error('Échec de l\'authentification:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    // Supprimer la session locale pour les superusers
    localStorage.removeItem('autom8_user');
    
    // Déconnexion de l'API Auth de Supabase (pour les administrateurs)
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    throw error;
  }
}

export async function getUser(): Promise<AdminUser | null> {
  try {
    // Vérifier d'abord si nous avons un superuser en session locale
    const localUser = localStorage.getItem('autom8_user');
    if (localUser) {
      const superuser = JSON.parse(localUser) as AdminUser;
      
      // Vérifier si le superuser existe toujours dans la base de données
      const { data: superusers, error: superuserError } = await supabase
        .from('superuser')
        .select('id, email, name')
        .eq('email', superuser.email);
      
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

    // Vérifier si nous avons une session Supabase Auth (pour les administrateurs)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erreur de session:', sessionError);
      return null;
    }

    if (!session?.user) {
      return null;
    }

    // Vérifier si c'est un administrateur
    const { data: admins, error: adminError } = await supabase
      .from('administrators')
      .select('id, email, name')
      .eq('email', session.user.email);

    if (adminError || !admins || admins.length === 0) {
      console.error('Erreur lors de la récupération des données administrateur:', adminError);
      return null;
    }

    return {
      ...admins[0],
      role: 'admin'
    };
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
  
  // Écouter les changements de session Supabase Auth (pour les administrateurs)
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // Vérifier si c'est un administrateur
      const { data: admins, error: adminError } = await supabase
        .from('administrators')
        .select('id, email, name')
        .eq('email', session.user.email);
      
      if (adminError || !admins || admins.length === 0) {
        console.error('Erreur lors de la récupération des données administrateur:', adminError);
        callback(null);
        return;
      }

      callback({
        ...admins[0],
        role: 'admin'
      });
    } else if (event === 'SIGNED_OUT') {
      // Vérifier si nous avons toujours un superuser en session locale
      const localUser = localStorage.getItem('autom8_user');
      if (!localUser) {
        callback(null);
      }
    }
  });
  
  // Fonction pour nettoyer les écouteurs
  return () => {
    authListener.subscription.unsubscribe();
  };
}
