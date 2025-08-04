-- Fix the function security warning by adding search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';