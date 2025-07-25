-- Create comments table for advanced comment system
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL, -- References blog post ID from blogPosts.ts
  user_id UUID NOT NULL,
  parent_id UUID NULL, -- For threaded comments
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Anyone can view approved comments" 
ON public.comments 
FOR SELECT 
USING (is_approved = true AND is_deleted = false);

CREATE POLICY "Users can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" 
ON public.comments 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Create bookmarks table for content bookmarking
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id TEXT NOT NULL, -- References blog post ID from blogPosts.ts
  post_type TEXT NOT NULL DEFAULT 'blog', -- 'blog', 'guest_post', 'imported_post'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id, post_type)
);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON public.bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
ON public.bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON public.bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookmarks" 
ON public.bookmarks 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id UUID NULL, -- NULL if not registered user
  status TEXT NOT NULL DEFAULT 'active',
  preferences JSONB DEFAULT '{"frequency": "weekly", "categories": []}',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE NULL,
  confirmed_at TIMESTAMP WITH TIME ZONE NULL,
  confirmation_token UUID DEFAULT gen_random_uuid()
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter subscribers
CREATE POLICY "Users can view their own subscription" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Anyone can subscribe" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own subscription" 
ON public.newsletter_subscribers 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Admins can manage all subscriptions" 
ON public.newsletter_subscribers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON public.bookmarks(post_id);
CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on comments
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();