-- Script pour désactiver temporairement RLS sur la table posts
-- Cela permettra à tous les utilisateurs d'accéder à la table sans restrictions

-- Désactiver RLS sur la table posts
ALTER TABLE "public"."posts" DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est bien désactivé
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'posts';
-- Si relrowsecurity est false, alors RLS est désactivé
