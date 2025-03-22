-- Création de la table des témoignages clients
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  image TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajout de quelques témoignages d'exemple
INSERT INTO testimonials (name, position, company, image, content, rating, is_featured) VALUES
('Marie Laurent', 'Directrice des Opérations', 'TechCorp', 'https://randomuser.me/api/portraits/women/44.jpg', 'AutoPro a transformé notre façon de travailler. Notre productivité a augmenté de 200% en seulement 3 mois.', 5, true),
('Thomas Dubois', 'CEO', 'InnovTech', 'https://randomuser.me/api/portraits/men/32.jpg', 'L''interface intuitive et les analyses détaillées nous permettent de prendre des décisions éclairées rapidement.', 5, true),
('Sophie Martin', 'Responsable IT', 'GlobalSoft', 'https://randomuser.me/api/portraits/women/22.jpg', 'Le support client est exceptionnel. Nos problèmes sont résolus en moins de 24 heures.', 4, false),
('Pierre Durand', 'Directeur Financier', 'FinanceExpert', 'https://randomuser.me/api/portraits/men/12.jpg', 'Les rapports automatisés nous ont fait gagner un temps précieux. Je recommande vivement AutoPro.', 5, false),
('Julien Moreau', 'Directeur Commercial', 'VentePro', 'https://randomuser.me/api/portraits/men/67.jpg', 'Depuis que nous utilisons AutoPro, notre taux de conversion a augmenté de 45%. L''automatisation des processus de vente nous a permis de nous concentrer sur la relation client.', 5, true);

-- Création d'une politique RLS pour la table testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Politique pour les superusers (accès complet)
CREATE POLICY testimonials_superuser_policy ON testimonials
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM superuser
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Politique pour les utilisateurs non authentifiés (lecture seule pour les témoignages mis en avant)
CREATE POLICY testimonials_public_read_policy ON testimonials
  FOR SELECT
  USING (true);
