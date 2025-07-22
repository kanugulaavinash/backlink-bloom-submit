
-- Add AI-related columns to existing tables
ALTER TABLE public.guest_posts 
ADD COLUMN IF NOT EXISTS ai_tags TEXT[],
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS ai_confidence_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

ALTER TABLE public.imported_posts 
ADD COLUMN IF NOT EXISTS ai_tags TEXT[],
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS ai_confidence_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Create post embeddings table for semantic search
CREATE TABLE IF NOT EXISTS public.post_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('guest', 'imported', 'static')),
  embedding_vector VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, post_type)
);

-- Create user reading history table
CREATE TABLE IF NOT EXISTS public.user_reading_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('guest', 'imported', 'static')),
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_duration INTEGER, -- seconds spent reading
  read_progress DECIMAL(3,2), -- percentage read (0.00 to 1.00)
  UNIQUE(user_id, post_id, post_type)
);

-- Create AI generated content table
CREATE TABLE IF NOT EXISTS public.ai_generated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('guest', 'imported', 'static')),
  content_type TEXT NOT NULL CHECK (content_type IN ('summary', 'tags', 'meta_description')),
  ai_content JSONB NOT NULL,
  confidence_score DECIMAL(3,2),
  model_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, post_type, content_type)
);

-- Create search analytics table
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  results_count INTEGER,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  search_type TEXT DEFAULT 'text' CHECK (search_type IN ('text', 'semantic', 'hybrid')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user saved posts table
CREATE TABLE IF NOT EXISTS public.user_saved_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('guest', 'imported', 'static')),
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, post_id, post_type)
);

-- Add RLS policies
ALTER TABLE public.post_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_posts ENABLE ROW LEVEL SECURITY;

-- Post embeddings - public read, admin write
CREATE POLICY "Anyone can view post embeddings" ON public.post_embeddings FOR SELECT USING (true);
CREATE POLICY "Only admins can manage embeddings" ON public.post_embeddings FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- User reading history - users can manage their own
CREATE POLICY "Users can view their own reading history" ON public.user_reading_history FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own reading history" ON public.user_reading_history FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own reading history" ON public.user_reading_history FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all reading history" ON public.user_reading_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- AI generated content - public read, admin write
CREATE POLICY "Anyone can view AI content" ON public.ai_generated_content FOR SELECT USING (true);
CREATE POLICY "Only admins can manage AI content" ON public.ai_generated_content FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- Search analytics - users can insert, admins can view all
CREATE POLICY "Users can log searches" ON public.search_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view search analytics" ON public.search_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- User saved posts - users manage their own
CREATE POLICY "Users can view their saved posts" ON public.user_saved_posts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can save posts" ON public.user_saved_posts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can unsave posts" ON public.user_saved_posts FOR DELETE USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_embeddings_post ON public.post_embeddings(post_id, post_type);
CREATE INDEX IF NOT EXISTS idx_user_reading_history_user ON public.user_reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_history_post ON public.user_reading_history(post_id, post_type);
CREATE INDEX IF NOT EXISTS idx_ai_content_post ON public.ai_generated_content(post_id, post_type, content_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON public.search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_user_saved_posts_user ON public.user_saved_posts(user_id);

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_post_view_count(
  p_post_id TEXT,
  p_post_type TEXT,
  p_user_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update view count based on post type
  IF p_post_type = 'guest' THEN
    UPDATE public.guest_posts 
    SET view_count = COALESCE(view_count, 0) + 1 
    WHERE id::text = p_post_id;
  ELSIF p_post_type = 'imported' THEN
    UPDATE public.imported_posts 
    SET view_count = COALESCE(view_count, 0) + 1 
    WHERE id::text = p_post_id;
  END IF;
  
  -- Log reading history if user is authenticated
  IF p_user_id IS NOT NULL THEN
    INSERT INTO public.user_reading_history (user_id, post_id, post_type)
    VALUES (p_user_id, p_post_id, p_post_type)
    ON CONFLICT (user_id, post_id, post_type) 
    DO UPDATE SET read_at = now();
  END IF;
END;
$$;
