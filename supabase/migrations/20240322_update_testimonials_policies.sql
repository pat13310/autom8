-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "testimonials_public_read_policy" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_superuser_policy" ON public.testimonials;

-- Politique de lecture publique (tout le monde peut lire)
CREATE POLICY "testimonials_public_read_policy" ON public.testimonials
    FOR SELECT
    TO public
    USING (true);

-- Politique pour les opérations d'écriture (vérification directe dans la table superuser)
CREATE POLICY "testimonials_superuser_write_policy" ON public.testimonials
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.superuser
            WHERE superuser.email = CURRENT_USER
            AND superuser.auth_role = 'superuser'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.superuser
            WHERE superuser.email = CURRENT_USER
            AND superuser.auth_role = 'superuser'
        )
    );

-- Activer RLS sur la table
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
