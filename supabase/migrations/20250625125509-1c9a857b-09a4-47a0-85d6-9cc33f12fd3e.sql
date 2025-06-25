
-- Create imported_posts table to store WordPress imports
CREATE TABLE public.imported_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  slug text,
  featured_image_url text,
  categories text[],
  tags text[],
  published_date timestamp with time zone,
  wordpress_id text,
  wordpress_url text,
  status text DEFAULT 'imported' CHECK (status IN ('imported', 'published', 'draft')),
  imported_by uuid REFERENCES auth.users(id) NOT NULL,
  import_session_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create import_sessions table to track import batches
CREATE TABLE public.import_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  total_posts integer DEFAULT 0,
  successful_imports integer DEFAULT 0,
  failed_imports integer DEFAULT 0,
  errors jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  imported_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS on both tables
ALTER TABLE public.imported_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for imported_posts (admin only)
CREATE POLICY "Only admins can manage imported posts"
  ON public.imported_posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for import_sessions (admin only)
CREATE POLICY "Only admins can manage import sessions"
  ON public.import_sessions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_imported_posts_import_session ON public.imported_posts(import_session_id);
CREATE INDEX idx_imported_posts_slug ON public.imported_posts(slug);
CREATE INDEX idx_imported_posts_wordpress_id ON public.imported_posts(wordpress_id);
CREATE INDEX idx_import_sessions_status ON public.import_sessions(status);
