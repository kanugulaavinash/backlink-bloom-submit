
-- Create the user_invitations table
CREATE TABLE IF NOT EXISTS public.user_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  message text,
  invited_by uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  token uuid DEFAULT gen_random_uuid(),
  expires_at timestamp with time zone DEFAULT (now() + interval '7 days'),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create the api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  key_name text NOT NULL,
  key_value text NOT NULL,
  is_configured boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(service_name, key_name)
);

-- Enable RLS on both tables
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_invitations (admin only)
CREATE POLICY "Only admins can manage invitations"
  ON public.user_invitations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for api_keys (admin only)
CREATE POLICY "Only admins can manage api keys"
  ON public.api_keys
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create the custom functions
CREATE OR REPLACE FUNCTION public.custom_create_invitation(
  p_email text,
  p_role text,
  p_message text,
  p_invited_by uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_invitations (email, role, message, invited_by, status)
  VALUES (p_email, p_role::public.app_role, p_message, p_invited_by, 'pending');
END;
$$;

CREATE OR REPLACE FUNCTION public.custom_select(query text)
RETURNS table(result jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION public.custom_upsert_api_key(
  p_service_name text,
  p_key_name text,
  p_key_value text
)
RETURNS void
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

CREATE OR REPLACE FUNCTION public.custom_delete_api_key(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.api_keys WHERE id = p_id;
END;
$$;
