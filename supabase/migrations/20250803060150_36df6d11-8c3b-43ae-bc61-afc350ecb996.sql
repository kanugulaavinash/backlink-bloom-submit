-- Create storage buckets for media management
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
('blog-images', 'blog-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']),
('featured-images', 'featured-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
('videos', 'videos', true, 524288000, ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']),
('documents', 'documents', false, 104857600, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']);

-- Create media_folders table for organization
CREATE TABLE public.media_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
  bucket_id TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media_tags table for tagging system
CREATE TABLE public.media_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Drop existing media_library table if it exists and recreate with proper structure
DROP TABLE IF EXISTS public.media_library CASCADE;

-- Create comprehensive media_library table
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  bucket_id TEXT NOT NULL,
  folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration REAL,
  thumbnail_path TEXT,
  alt_text TEXT,
  caption TEXT,
  metadata JSONB DEFAULT '{}',
  tags UUID[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media_usage table to track where files are used
CREATE TABLE public.media_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID NOT NULL REFERENCES public.media_library(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'guest_post', 'imported_post', etc.
  content_id UUID NOT NULL,
  usage_context TEXT, -- 'featured_image', 'content_image', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media_folders
CREATE POLICY "Users can view folders they created or admin can view all" 
ON public.media_folders FOR SELECT 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own folders" 
ON public.media_folders FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own folders or admin can update all" 
ON public.media_folders FOR UPDATE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own folders or admin can delete all" 
ON public.media_folders FOR DELETE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

-- RLS Policies for media_tags
CREATE POLICY "Anyone can view tags" 
ON public.media_tags FOR SELECT 
USING (true);

CREATE POLICY "Users can create tags" 
ON public.media_tags FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update tags they created or admin can update all" 
ON public.media_tags FOR UPDATE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete tags they created or admin can delete all" 
ON public.media_tags FOR DELETE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

-- RLS Policies for media_library
CREATE POLICY "Users can view media they uploaded or admin can view all" 
ON public.media_library FOR SELECT 
USING (uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can upload media" 
ON public.media_library FOR INSERT 
WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can update their own media or admin can update all" 
ON public.media_library FOR UPDATE 
USING (uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own media or admin can delete all" 
ON public.media_library FOR DELETE 
USING (uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'));

-- RLS Policies for media_usage
CREATE POLICY "Users can view usage of their media or admin can view all" 
ON public.media_usage FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.media_library 
  WHERE id = media_usage.media_id 
  AND (uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'))
));

CREATE POLICY "System can insert usage records" 
ON public.media_usage FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update usage records" 
ON public.media_usage FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete usage of their media or admin can delete all" 
ON public.media_usage FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.media_library 
  WHERE id = media_usage.media_id 
  AND (uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'))
));

-- Storage policies for blog-images bucket
CREATE POLICY "Anyone can view blog images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own blog images or admin can update all" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'blog-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Users can delete their own blog images or admin can delete all" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'blog-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

-- Storage policies for featured-images bucket
CREATE POLICY "Anyone can view featured images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'featured-images');

CREATE POLICY "Authenticated users can upload featured images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'featured-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own featured images or admin can update all" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'featured-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Users can delete their own featured images or admin can delete all" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'featured-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

-- Storage policies for videos bucket
CREATE POLICY "Anyone can view videos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own videos or admin can update all" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'videos' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Users can delete their own videos or admin can delete all" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'videos' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

-- Storage policies for documents bucket
CREATE POLICY "Users can view documents they uploaded or admin can view all" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Authenticated users can upload documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own documents or admin can update all" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Users can delete their own documents or admin can delete all" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin')));

-- Create indexes for better performance
CREATE INDEX idx_media_library_bucket_id ON public.media_library(bucket_id);
CREATE INDEX idx_media_library_folder_id ON public.media_library(folder_id);
CREATE INDEX idx_media_library_uploaded_by ON public.media_library(uploaded_by);
CREATE INDEX idx_media_library_created_at ON public.media_library(created_at);
CREATE INDEX idx_media_library_mime_type ON public.media_library(mime_type);
CREATE INDEX idx_media_usage_media_id ON public.media_usage(media_id);
CREATE INDEX idx_media_usage_content_type_id ON public.media_usage(content_type, content_id);
CREATE INDEX idx_media_folders_parent_id ON public.media_folders(parent_id);
CREATE INDEX idx_media_folders_bucket_id ON public.media_folders(bucket_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_media_folders_updated_at
  BEFORE UPDATE ON public.media_folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON public.media_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update usage count
CREATE OR REPLACE FUNCTION public.update_media_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.media_library 
    SET usage_count = usage_count + 1 
    WHERE id = NEW.media_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.media_library 
    SET usage_count = GREATEST(usage_count - 1, 0) 
    WHERE id = OLD.media_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update usage count
CREATE TRIGGER trigger_update_media_usage_count
  AFTER INSERT OR DELETE ON public.media_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_media_usage_count();