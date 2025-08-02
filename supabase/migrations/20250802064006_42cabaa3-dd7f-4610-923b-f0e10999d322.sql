-- First, check if the new columns exist and add them if they don't
-- Add SEO and featured image columns to guest_posts table
DO $$ 
BEGIN
    -- Add featured_image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guest_posts' AND column_name = 'featured_image_url') THEN
        ALTER TABLE public.guest_posts ADD COLUMN featured_image_url TEXT;
    END IF;
    
    -- Add meta_title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guest_posts' AND column_name = 'meta_title') THEN
        ALTER TABLE public.guest_posts ADD COLUMN meta_title TEXT;
    END IF;
    
    -- Add meta_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guest_posts' AND column_name = 'meta_description') THEN
        ALTER TABLE public.guest_posts ADD COLUMN meta_description TEXT;
    END IF;
    
    -- Add focus_keyword column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guest_posts' AND column_name = 'focus_keyword') THEN
        ALTER TABLE public.guest_posts ADD COLUMN focus_keyword TEXT;
    END IF;
    
    -- Add custom_permalink column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guest_posts' AND column_name = 'custom_permalink') THEN
        ALTER TABLE public.guest_posts ADD COLUMN custom_permalink TEXT;
    END IF;
END $$;

-- Add the same columns to imported_posts table for consistency
DO $$ 
BEGIN
    -- Add featured_image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'imported_posts' AND column_name = 'meta_title') THEN
        ALTER TABLE public.imported_posts ADD COLUMN meta_title TEXT;
    END IF;
    
    -- Add meta_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'imported_posts' AND column_name = 'meta_description') THEN
        ALTER TABLE public.imported_posts ADD COLUMN meta_description TEXT;
    END IF;
    
    -- Add focus_keyword column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'imported_posts' AND column_name = 'focus_keyword') THEN
        ALTER TABLE public.imported_posts ADD COLUMN focus_keyword TEXT;
    END IF;
    
    -- Add custom_permalink column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'imported_posts' AND column_name = 'custom_permalink') THEN
        ALTER TABLE public.imported_posts ADD COLUMN custom_permalink TEXT;
    END IF;
END $$;