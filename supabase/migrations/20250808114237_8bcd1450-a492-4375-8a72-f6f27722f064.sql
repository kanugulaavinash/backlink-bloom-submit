-- Create or replace trigger to keep profiles.full_name in sync with first_name/last_name
-- and backfill missing first_name/last_name from existing full_name values

-- 1) Ensure trigger exists on profiles to update full_name when parts change
DROP TRIGGER IF EXISTS trg_update_full_name_from_parts ON public.profiles;

CREATE TRIGGER trg_update_full_name_from_parts
BEFORE INSERT OR UPDATE OF first_name, last_name
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_full_name_from_parts();

-- 2) Backfill first_name/last_name for existing rows based on full_name, when missing
UPDATE public.profiles
SET 
  first_name = COALESCE(NULLIF(first_name, ''), split_part(full_name, ' ', 1)),
  last_name = COALESCE(
    NULLIF(last_name, ''),
    CASE 
      WHEN position(' ' in full_name) > 0 THEN NULLIF(btrim(substring(full_name from position(' ' in full_name) + 1)), '')
      ELSE NULL
    END
  ),
  updated_at = now()
WHERE full_name IS NOT NULL
  AND (first_name IS NULL OR first_name = '' OR last_name IS NULL);
