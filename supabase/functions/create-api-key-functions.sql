
-- Create helper functions for API key management

CREATE OR REPLACE FUNCTION public.custom_select(query TEXT)
RETURNS TABLE(result JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This is a temporary function for API key selection
  -- In production, you should use proper typed queries
  RETURN QUERY
  SELECT jsonb_build_object(
    'id', ak.id,
    'service_name', ak.service_name,
    'key_name', ak.key_name,
    'is_configured', ak.is_configured,
    'created_at', ak.created_at,
    'updated_at', ak.updated_at
  )
  FROM api_keys ak
  ORDER BY ak.service_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.custom_upsert_api_key(
  p_service_name TEXT,
  p_key_name TEXT,
  p_key_value TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION public.custom_delete_api_key(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.api_keys WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.custom_create_invitation(
  p_email TEXT,
  p_role TEXT,
  p_message TEXT,
  p_invited_by UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_invitations (email, role, message, invited_by, status)
  VALUES (p_email, p_role::public.app_role, p_message, p_invited_by, 'pending');
END;
$$;
