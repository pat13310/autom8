-- Script SQL pour mettre à jour les mots de passe des superusers avec un hachage correct

-- S'assurer que l'extension pgcrypto est installée
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Mettre à jour le mot de passe de tous les superusers dont le mot de passe commence par "non_hache_"
UPDATE public.superuser
SET 
    password_hash = crypt(
        -- Extraire le mot de passe réel en supprimant le préfixe "non_hache_"
        substring(password_hash from 10), 
        gen_salt('bf')
    )
WHERE 
    password_hash LIKE 'non_hache_%';

-- Vérifier que la mise à jour a fonctionné
SELECT 
    id, 
    email, 
    name, 
    substring(password_hash, 1, 20) || '...' AS password_preview,
    created_at,
    last_login
FROM 
    public.superuser 
WHERE 
    email LIKE 'superuser%@autopro.com';
