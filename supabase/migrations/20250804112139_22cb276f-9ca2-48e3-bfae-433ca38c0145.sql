-- Add new user profile fields
ALTER TABLE public.profiles 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN username TEXT;

-- Create unique index on username
CREATE UNIQUE INDEX idx_profiles_username_unique ON public.profiles(username) WHERE username IS NOT NULL;

-- Create function to update full_name from first_name and last_name
CREATE OR REPLACE FUNCTION public.update_full_name_from_parts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update full_name when first_name or last_name changes
  IF NEW.first_name IS NOT NULL AND NEW.last_name IS NOT NULL THEN
    NEW.full_name = NEW.first_name || ' ' || NEW.last_name;
  ELSIF NEW.first_name IS NOT NULL THEN
    NEW.full_name = NEW.first_name;
  ELSIF NEW.last_name IS NOT NULL THEN
    NEW.full_name = NEW.last_name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update full_name
CREATE TRIGGER trigger_update_full_name
  BEFORE INSERT OR UPDATE OF first_name, last_name ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_full_name_from_parts();

-- Update existing profiles to split full_name into first_name and last_name
UPDATE public.profiles 
SET 
  first_name = CASE 
    WHEN full_name IS NOT NULL AND position(' ' in full_name) > 0 
    THEN split_part(full_name, ' ', 1)
    ELSE full_name 
  END,
  last_name = CASE 
    WHEN full_name IS NOT NULL AND position(' ' in full_name) > 0 
    THEN substring(full_name from position(' ' in full_name) + 1)
    ELSE NULL 
  END
WHERE full_name IS NOT NULL;