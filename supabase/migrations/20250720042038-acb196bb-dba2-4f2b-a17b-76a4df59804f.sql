
-- Create storage bucket for blog post media
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-media', 'blog-media', true);

-- Create storage policies for blog media bucket
CREATE POLICY "Anyone can view blog media" ON storage.objects FOR SELECT USING (bucket_id = 'blog-media');
CREATE POLICY "Authenticated users can upload blog media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-media' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own blog media" ON storage.objects FOR UPDATE USING (bucket_id = 'blog-media' AND auth.uid()::text = owner);
CREATE POLICY "Users can delete their own blog media" ON storage.objects FOR DELETE USING (bucket_id = 'blog-media' AND auth.uid()::text = owner);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog_posts table for admin/user created posts (separate from guest_posts)
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE,
  featured_image_url TEXT,
  featured_image_alt TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  visibility TEXT NOT NULL DEFAULT 'public',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  meta_title TEXT,
  meta_description TEXT,
  word_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0
);

-- Create junction table for blog_posts and categories
CREATE TABLE public.blog_post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  UNIQUE(blog_post_id, category_id)
);

-- Create junction table for blog_posts and tags  
CREATE TABLE public.blog_post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(blog_post_id, tag_id)
);

-- Create media library table
CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Tags policies  
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tags" ON public.tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Blog posts policies
CREATE POLICY "Users can view published posts" ON public.blog_posts FOR SELECT USING (status = 'published' AND visibility = 'public');
CREATE POLICY "Users can manage their own posts" ON public.blog_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all posts" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Blog post categories policies
CREATE POLICY "Anyone can view post categories" ON public.blog_post_categories FOR SELECT USING (true);
CREATE POLICY "Users can manage their post categories" ON public.blog_post_categories FOR ALL USING (EXISTS (SELECT 1 FROM public.blog_posts WHERE id = blog_post_id AND user_id = auth.uid()));
CREATE POLICY "Admins can manage all post categories" ON public.blog_post_categories FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Blog post tags policies
CREATE POLICY "Anyone can view post tags" ON public.blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Users can manage their post tags" ON public.blog_post_tags FOR ALL USING (EXISTS (SELECT 1 FROM public.blog_posts WHERE id = blog_post_id AND user_id = auth.uid()));
CREATE POLICY "Admins can manage all post tags" ON public.blog_post_tags FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Media library policies
CREATE POLICY "Users can view their own media" ON public.media_library FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own media" ON public.media_library FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all media" ON public.media_library FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all media" ON public.media_library FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Insert some default categories
INSERT INTO public.categories (name, slug, description) VALUES 
('Technology', 'technology', 'Posts about technology and innovation'),
('Business', 'business', 'Business and entrepreneurship content'),
('Health & Wellness', 'health-wellness', 'Health, fitness and wellness articles'),
('Lifestyle', 'lifestyle', 'Lifestyle and personal development'),
('Education', 'education', 'Educational content and tutorials');

-- Insert some default tags
INSERT INTO public.tags (name, slug) VALUES 
('programming', 'programming'),
('startup', 'startup'),
('productivity', 'productivity'),
('design', 'design'),
('marketing', 'marketing');
