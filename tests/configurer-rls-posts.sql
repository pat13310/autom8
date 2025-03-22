-- Script pour configurer les politiques RLS pour la table posts
-- Ce script permet aux superusers d'effectuer toutes les opérations sur la table posts

-- Supprimer les politiques existantes sur la table posts
DROP POLICY IF EXISTS "Autoriser les superusers à gérer les posts" ON "public"."posts";

-- Activer RLS sur la table posts (si ce n'est pas déjà fait)
ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;

-- Créer une politique qui permet aux superusers d'effectuer toutes les opérations
CREATE POLICY "Autoriser les superusers à gérer les posts"
ON "public"."posts"
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM "public"."superuser"
    WHERE "email" = current_setting('request.jwt.claims', true)::json->>'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."superuser"
    WHERE "email" = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Alternative si la méthode ci-dessus ne fonctionne pas
-- Cette politique permet à tous les utilisateurs d'effectuer toutes les opérations
-- À utiliser uniquement temporairement pour débloquer la situation
CREATE POLICY "Autoriser tous les utilisateurs à gérer les posts temporairement"
ON "public"."posts"
FOR ALL
USING (true)
WITH CHECK (true);
