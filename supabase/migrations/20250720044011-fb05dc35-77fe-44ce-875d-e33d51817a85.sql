
-- Create categories table for dynamic category management
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  color text DEFAULT '#3B82F6',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
    )
  );

-- Add scheduling fields to guest_posts table
ALTER TABLE public.guest_posts 
ADD COLUMN scheduled_for timestamp with time zone,
ADD COLUMN timezone text DEFAULT 'UTC',
ADD COLUMN auto_publish boolean DEFAULT false;

-- Insert default categories from the hardcoded list
INSERT INTO public.categories (name, description, color) VALUES
('Technology', 'Posts about technology, software, and innovation', '#3B82F6'),
('Business', 'Business strategy, entrepreneurship, and industry insights', '#10B981'),
('Marketing', 'Digital marketing, advertising, and promotion strategies', '#F59E0B'),
('Design', 'UI/UX design, graphic design, and creative processes', '#8B5CF6'),
('Development', 'Software development, programming, and coding', '#EF4444'),
('Lifestyle', 'Personal development, wellness, and life improvement', '#F97316'),
('Health', 'Health, fitness, and medical topics', '#06B6D4'),
('Travel', 'Travel experiences, destinations, and tips', '#84CC16'),
('Food', 'Cooking, recipes, and culinary experiences', '#EC4899'),
('Fashion', 'Style, trends, and fashion industry insights', '#F43F5E'),
('Sports', 'Sports, fitness, and athletic performance', '#22C55E'),
('Entertainment', 'Movies, music, games, and entertainment industry', '#A855F7'),
('Education', 'Learning, teaching, and educational resources', '#0EA5E9'),
('Finance', 'Personal finance, investing, and money management', '#059669'),
('Science', 'Scientific research, discoveries, and analysis', '#DC2626'),
('Politics', 'Political analysis, policy, and governance', '#7C3AED'),
('Art', 'Visual arts, creativity, and artistic expression', '#DB2777'),
('Music', 'Music industry, artists, and musical content', '#9333EA'),
('Photography', 'Photography techniques, equipment, and visual storytelling', '#0891B2'),
('Gaming', 'Video games, gaming industry, and interactive entertainment', '#EA580C');

-- Create function to get category usage count
CREATE OR REPLACE FUNCTION public.get_category_usage_count(category_name text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT COUNT(*)::integer
  FROM public.guest_posts
  WHERE category = category_name;
$$;
