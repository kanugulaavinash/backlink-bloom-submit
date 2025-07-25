-- Security fix: Update all database functions to prevent search_path manipulation attacks
-- This adds SET search_path TO '' to all functions that were missing it

-- Update get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1;
$function$;

-- Update has_role function  
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role::TEXT = _role
  );
$function$;

-- Update custom_select function
CREATE OR REPLACE FUNCTION public.custom_select(query text)
 RETURNS TABLE(result jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- Update custom_upsert_api_key function
CREATE OR REPLACE FUNCTION public.custom_upsert_api_key(p_service_name text, p_key_name text, p_key_value text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.api_keys (service_name, key_name, key_value, is_configured)
  VALUES (p_service_name, p_key_name, p_key_value, true)
  ON CONFLICT (service_name, key_name)
  DO UPDATE SET
    key_value = p_key_value,
    is_configured = true,
    updated_at = now();
END;
$function$;

-- Update custom_create_invitation function
CREATE OR REPLACE FUNCTION public.custom_create_invitation(p_email text, p_role text, p_message text, p_invited_by uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.user_invitations (email, role, message, invited_by, status)
  VALUES (p_email, p_role::public.app_role, p_message, p_invited_by, 'pending');
END;
$function$;

-- Update custom_delete_api_key function
CREATE OR REPLACE FUNCTION public.custom_delete_api_key(p_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM public.api_keys WHERE id = p_id;
END;
$function$;

-- Update custom_upsert_api_key_with_config function (this one already had SET search_path TO '' but updating for consistency)
CREATE OR REPLACE FUNCTION public.custom_upsert_api_key_with_config(p_service_name text, p_key_name text, p_key_value text, p_service_type text DEFAULT 'generic'::text, p_configurations jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_api_key_id UUID;
  v_config_key TEXT;
  v_config_value TEXT;
BEGIN
  -- Insert or update the API key
  INSERT INTO public.api_keys (service_name, key_name, key_value, is_configured, service_type)
  VALUES (p_service_name, p_key_name, p_key_value, true, p_service_type)
  ON CONFLICT (service_name, key_name)
  DO UPDATE SET
    key_value = p_key_value,
    is_configured = true,
    service_type = p_service_type,
    updated_at = now()
  RETURNING id INTO v_api_key_id;

  -- Delete existing configurations for this API key
  DELETE FROM public.api_key_configurations WHERE api_key_id = v_api_key_id;

  -- Insert new configurations
  FOR v_config_key, v_config_value IN 
    SELECT key, value FROM jsonb_each_text(p_configurations)
  LOOP
    INSERT INTO public.api_key_configurations (api_key_id, configuration_key, configuration_value)
    VALUES (v_api_key_id, v_config_key, v_config_value);
  END LOOP;

  RETURN v_api_key_id;
END;
$function$;

-- Update update_api_key_test_result function (this one already had SET search_path TO '' but updating for consistency)
CREATE OR REPLACE FUNCTION public.update_api_key_test_result(p_id uuid, p_status text, p_result jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  UPDATE public.api_keys 
  SET 
    integration_status = p_status,
    last_test_at = now(),
    test_result = p_result,
    updated_at = now()
  WHERE id = p_id;
END;
$function$;