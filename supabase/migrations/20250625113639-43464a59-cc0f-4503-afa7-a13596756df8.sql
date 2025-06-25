
-- Create guest_posts table for the submission feature
CREATE TABLE public.guest_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  author_name TEXT NOT NULL,
  author_bio TEXT,
  author_website TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on guest_posts table
ALTER TABLE public.guest_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for guest_posts
CREATE POLICY "Users can insert their own posts"
  ON public.guest_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own posts"
  ON public.guest_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.guest_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all posts"
  ON public.guest_posts FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all posts"
  ON public.guest_posts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
