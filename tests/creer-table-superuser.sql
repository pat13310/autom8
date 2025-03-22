-- Script SQL pour créer la table superuser dans Supabase
-- Version améliorée avec vérifications et gestion des erreurs

-- Vérifier si l'extension pgcrypto est installée (nécessaire pour crypt et gen_salt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Vérifier si la table existe déjà
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'superuser'
    ) THEN
        -- Créer la table superuser
        CREATE TABLE public.superuser (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE,
            last_login TIMESTAMP WITH TIME ZONE
        );

        -- Ajouter des commentaires sur la table et les colonnes
        COMMENT ON TABLE public.superuser IS 'Table des super-utilisateurs avec privilèges étendus';
        COMMENT ON COLUMN public.superuser.id IS 'Identifiant unique du super-utilisateur';
        COMMENT ON COLUMN public.superuser.email IS 'Adresse email du super-utilisateur (unique)';
        COMMENT ON COLUMN public.superuser.password_hash IS 'Mot de passe haché du super-utilisateur';
        COMMENT ON COLUMN public.superuser.name IS 'Nom complet du super-utilisateur';
        
        RAISE NOTICE 'Table superuser créée avec succès';
    ELSE
        RAISE NOTICE 'La table superuser existe déjà';
    END IF;
END
$$;

-- Activer RLS (Row Level Security) s'il n'est pas déjà activé
DO $$
BEGIN
    -- Vérifier si RLS est déjà activé
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'superuser' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.superuser ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Row Level Security activé sur la table superuser';
    ELSE
        RAISE NOTICE 'Row Level Security est déjà activé sur la table superuser';
    END IF;
END
$$;

-- Supprimer les politiques existantes pour éviter les doublons
DO $$
BEGIN
    -- Supprimer la politique de lecture si elle existe
    DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent lire les superusers" ON public.superuser;
    
    -- Supprimer la politique de modification si elle existe
    DROP POLICY IF EXISTS "Les superusers peuvent modifier les superusers" ON public.superuser;
    
    -- Supprimer la politique pour anon si elle existe
    DROP POLICY IF EXISTS "anon peut lire les superusers" ON public.superuser;
    
    RAISE NOTICE 'Anciennes politiques supprimées';
END
$$;

-- Créer une politique permettant aux utilisateurs authentifiés de lire la table
CREATE POLICY "Les utilisateurs authentifiés peuvent lire les superusers"
    ON public.superuser
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Créer une politique permettant aux superusers de modifier la table
CREATE POLICY "Les superusers peuvent modifier les superusers"
    ON public.superuser
    FOR ALL
    USING (auth.email() IN (SELECT email FROM public.superuser));

-- Ajouter une politique pour permettre à anon d'accéder à la table (utile pour les tests)
CREATE POLICY "anon peut lire les superusers"
    ON public.superuser
    FOR SELECT
    USING (auth.role() = 'anon');

-- Insérer un superuser par défaut
DO $$
BEGIN
    -- Vérifier si le superuser existe déjà
    IF NOT EXISTS (
        SELECT FROM public.superuser 
        WHERE email = 'admin@example.com'
    ) THEN
        -- Insérer le superuser avec mot de passe haché
        INSERT INTO public.superuser (
            email, 
            password_hash, 
            name,
            created_at
        )
        VALUES (
            'admin@example.com', 
            crypt('test', gen_salt('bf')), 
            'John Doe', 
            now()
        );
        
        RAISE NOTICE 'Superuser par défaut ajouté';
    ELSE
        RAISE NOTICE 'Le superuser par défaut existe déjà';
    END IF;
END
$$;

-- Vérifier que l'insertion a fonctionné
SELECT id, email, name, created_at FROM public.superuser WHERE email = 'admin@example.com';
