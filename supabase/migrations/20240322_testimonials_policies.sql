-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Créer une fonction pour vérifier si l'utilisateur est un superuser
CREATE OR REPLACE FUNCTION public.is_superuser(email text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.superuser
    WHERE superuser.email = is_superuser.email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Politique pour la lecture des témoignages (public)
CREATE POLICY "Témoignages visibles par tous" ON public.testimonials
  FOR SELECT USING (true);

-- Politique pour l'insertion des témoignages (superuser uniquement)
CREATE POLICY "Insertion par superuser uniquement" ON public.testimonials
  FOR INSERT
  WITH CHECK (
    is_superuser(auth.jwt() ->> 'email')
  );

-- Politique pour la modification des témoignages (superuser uniquement)
CREATE POLICY "Modification par superuser uniquement" ON public.testimonials
  FOR UPDATE
  USING (
    is_superuser(auth.jwt() ->> 'email')
  )
  WITH CHECK (
    is_superuser(auth.jwt() ->> 'email')
  );

-- Politique pour la suppression des témoignages (superuser uniquement)
CREATE POLICY "Suppression par superuser uniquement" ON public.testimonials
  FOR DELETE
  USING (
    is_superuser(auth.jwt() ->> 'email')
  );
