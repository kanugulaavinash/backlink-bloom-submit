
-- Fix the enum casting issue by explicitly referencing the public schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  default_role TEXT;
  profile_inserted BOOLEAN := FALSE;
  role_inserted BOOLEAN := FALSE;
BEGIN
  -- Log the start of user creation
  RAISE LOG 'Starting user creation for user_id: %, email: %', NEW.id, NEW.email;
  
  -- Get the default role from settings
  SELECT setting_value INTO default_role
  FROM public.system_settings
  WHERE setting_key = 'default_user_role';
  
  -- If no default role found, use 'user'
  IF default_role IS NULL THEN
    default_role := 'user';
    RAISE LOG 'No default role found, using: %', default_role;
  END IF;
  
  -- Insert profile with error handling
  BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    profile_inserted := TRUE;
    RAISE LOG 'Profile created successfully for user: %', NEW.email;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', NEW.email, SQLERRM;
    RAISE;
  END;
  
  -- Assign role with error handling - FIX: explicitly reference public.app_role
  BEGIN
    IF NEW.email = 'kanugulaavinash@gmail.com' THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'admin'::public.app_role);
      RAISE LOG 'Admin role assigned to user: %', NEW.email;
    ELSE
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, default_role::public.app_role);
      RAISE LOG 'User role % assigned to user: %', default_role, NEW.email;
    END IF;
    role_inserted := TRUE;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error assigning role to user %: %', NEW.email, SQLERRM;
    -- If role insertion fails, clean up profile if it was created
    IF profile_inserted THEN
      DELETE FROM public.profiles WHERE id = NEW.id;
      RAISE LOG 'Cleaned up profile for user % due to role assignment failure', NEW.email;
    END IF;
    RAISE;
  END;
  
  RAISE LOG 'User creation completed successfully for: %', NEW.email;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Fatal error in handle_new_user for %: %', NEW.email, SQLERRM;
  RAISE;
END;
$$;
