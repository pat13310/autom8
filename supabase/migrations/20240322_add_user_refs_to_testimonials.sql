-- Ajouter les colonnes de référence utilisateur
ALTER TABLE public.testimonials
ADD COLUMN created_by uuid REFERENCES public.superuser(id),
ADD COLUMN updated_by uuid REFERENCES public.superuser(id);

-- Mettre à jour les politiques existantes
DROP POLICY IF EXISTS "testimonials_superuser_policy" ON public.testimonials;

CREATE POLICY "testimonials_superuser_policy" ON public.testimonials
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.superuser
            WHERE superuser.email = auth.jwt() ->> 'email'
            AND superuser.auth_role = 'superuser'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.superuser
            WHERE superuser.email = auth.jwt() ->> 'email'
            AND superuser.auth_role = 'superuser'
        )
    );
