-- Réinitialiser les politiques existantes
DROP POLICY IF EXISTS "testimonials_superuser_policy" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_public_read_policy" ON public.testimonials;

-- Désactiver temporairement RLS pour permettre les opérations avec la clé de service
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;

-- Créer une politique de lecture publique
CREATE POLICY "testimonials_public_read_policy" ON public.testimonials
    FOR SELECT
    TO public
    USING (true);

-- Créer une politique pour les opérations d'écriture (via clé de service)
CREATE POLICY "testimonials_service_write_policy" ON public.testimonials
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Réactiver RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
