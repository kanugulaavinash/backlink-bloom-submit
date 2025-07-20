
-- Fix all database functions to include proper search_path security setting
-- This addresses the "Function Search Path Mutable" warnings

-- 1. Fix get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1;
$$;

-- 2. Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role::TEXT = _role
  );
$$;

-- 3. Fix custom_create_invitation function
CREATE OR REPLACE FUNCTION public.custom_create_invitation(
  p_email text,
  p_role text,
  p_message text,
  p_invited_by uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.user_invitations (email, role, message, invited_by, status)
  VALUES (p_email, p_role::public.app_role, p_message, p_invited_by, 'pending');
END;
$$;

-- 4. Fix custom_select function
CREATE OR REPLACE FUNCTION public.custom_select(query text)
RETURNS TABLE(result jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- For API keys selection
  RETURN QUERY
  SELECT jsonb_build_object(
    'id', ak.id,
    'service_name', ak.service_name,
    'key_name', ak.key_name,
    'is_configured', ak.is_configured,
    'created_at', ak.created_at,
    'updated_at', ak.updated_at
  ) as result
  FROM public.api_keys ak
  ORDER BY ak.service_name;
END;
$$;

-- 5. Fix custom_upsert_api_key function
CREATE OR REPLACE FUNCTION public.custom_upsert_api_key(
  p_service_name text,
  p_key_name text,
  p_key_value text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.api_keys (service_name, key_name, key_value, is_configured)
  VALUES (p_service_name, p_key_name, p_key_value, true)
  ON CONFLICT (service_name, key_name)
  DO UPDATE SET
    key_value = p_key_value,
    is_configured = true,
    updated_at = now();
END;
$$;

-- 6. Fix custom_delete_api_key function
CREATE OR REPLACE FUNCTION public.custom_delete_api_key(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  DELETE FROM public.api_keys WHERE id = p_id;
END;
$$;
