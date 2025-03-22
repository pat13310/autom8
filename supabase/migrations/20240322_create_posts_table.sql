-- Create posts table if not exists
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title text NOT NULL,
  description text NULL,
  content text NULL,
  image text NULL,
  author text NOT NULL,
  author_image text NULL,
  category text NULL,
  read_time text NULL DEFAULT '5 min'::text,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  published boolean NULL DEFAULT false,
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_slug_key UNIQUE (slug),
  CONSTRAINT slug_length CHECK ((char_length(slug) >= 3))
) TABLESPACE pg_default;

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public posts are viewable by everyone" ON posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Only superusers can insert posts" ON posts
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM superuser 
    WHERE email = auth.jwt()->>'email'
  ));

CREATE POLICY "Only superusers can update posts" ON posts
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM superuser 
    WHERE email = auth.jwt()->>'email'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM superuser 
    WHERE email = auth.jwt()->>'email'
  ));

CREATE POLICY "Only superusers can delete posts" ON posts
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM superuser 
    WHERE email = auth.jwt()->>'email'
  ));

-- Create or replace the update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
