import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

async function verifierStructurePosts() {
  try {
    // Vérifier si la table posts existe
    const { data: tableInfo, error: tableError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Erreur lors de la vérification de la table posts:', tableError.message);
      
      // Vérifier si l'erreur indique que la table n'existe pas
      if (tableError.message.includes('does not exist')) {
        console.log('La table "posts" n\'existe pas dans la base de données.');
        await creerTablePosts();
      }
      return;
    }

    console.log('La table "posts" existe dans la base de données.');
    
    // Vérifier si la table activity_logs existe
    const { data: logsInfo, error: logsError } = await supabase
      .from('activity_logs')
      .select('*')
      .limit(1);

    if (logsError) {
      console.error('Erreur lors de la vérification de la table activity_logs:', logsError.message);
      
      // Vérifier si l'erreur indique que la table n'existe pas
      if (logsError.message.includes('does not exist')) {
        console.log('La table "activity_logs" n\'existe pas dans la base de données.');
        await creerTableActivityLogs();
      }
    } else {
      console.log('La table "activity_logs" existe dans la base de données.');
    }
  } catch (err) {
    console.error('Erreur lors de la vérification de la structure:', err);
  }
}

async function creerTablePosts() {
  try {
    console.log('Création de la table "posts"...');
    
    // Utiliser l'API REST pour exécuter une requête SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS posts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            slug TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            content TEXT,
            image TEXT,
            author TEXT,
            author_image TEXT,
            category TEXT,
            tags TEXT[],
            read_time TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            published BOOLEAN DEFAULT FALSE
          );
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur lors de la création de la table: ${JSON.stringify(errorData)}`);
    }

    console.log('Table "posts" créée avec succès!');
  } catch (err) {
    console.error('Erreur lors de la création de la table posts:', err);
  }
}

async function creerTableActivityLogs() {
  try {
    console.log('Création de la table "activity_logs"...');
    
    // Utiliser l'API REST pour exécuter une requête SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS activity_logs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_email TEXT,
            action TEXT,
            details TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur lors de la création de la table: ${JSON.stringify(errorData)}`);
    }

    console.log('Table "activity_logs" créée avec succès!');
  } catch (err) {
    console.error('Erreur lors de la création de la table activity_logs:', err);
  }
}

// Exécuter la vérification
verifierStructurePosts();
