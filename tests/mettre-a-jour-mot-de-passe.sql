-- Script SQL pour mettre à jour le mot de passe du superuser avec un hachage correct

-- S'assurer que l'extension pgcrypto est installée
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Mettre à jour le mot de passe du superuser
UPDATE public.superuser
SET 
    password_hash = crypt('Autopro2023!', gen_salt('bf')),
    updated_at = now()
WHERE 
    email = 'superuser@autopro.com';

-- Vérifier que la mise à jour a fonctionné
SELECT 
    id, 
    email, 
    name, 
    substring(password_hash, 1, 20) || '...' AS password_preview,
    created_at,
    updated_at
FROM 
    public.superuser 
WHERE 
    email = 'superuser@autopro.com';
