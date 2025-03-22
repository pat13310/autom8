-- Script SQL pour insérer un superuser avec mot de passe correctement haché

-- S'assurer que l'extension pgcrypto est installée
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Supprimer le superuser existant s'il existe déjà (pour éviter les conflits)
DELETE FROM public.superuser WHERE email = 'superuser@autopro.com';

-- Insérer un nouveau superuser avec mot de passe correctement haché
INSERT INTO public.superuser (
    id,
    email, 
    password_hash, 
    name, 
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'superuser@autopro.com', 
    crypt('Autopro2023!', gen_salt('bf')), 
    'Super Utilisateur AutoPro', 
    now(),
    now()
);

-- Vérifier que l'insertion a fonctionné
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
