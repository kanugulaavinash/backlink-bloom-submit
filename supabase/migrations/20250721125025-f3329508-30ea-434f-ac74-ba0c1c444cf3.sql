
-- Add service-specific configuration table
CREATE TABLE IF NOT EXISTS public.api_key_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  configuration_key TEXT NOT NULL,
  configuration_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add integration status tracking
ALTER TABLE public.api_keys 
ADD COLUMN IF NOT EXISTS integration_status TEXT DEFAULT 'not_tested',
ADD COLUMN IF NOT EXISTS last_test_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS test_result JSONB,
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'generic';

-- Add RLS policies for api_key_configurations
ALTER TABLE public.api_key_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage api key configurations" 
ON public.api_key_configurations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'::app_role
));

-- Update the custom functions to handle new configuration
CREATE OR REPLACE FUNCTION public.custom_upsert_api_key_with_config(
  p_service_name TEXT,
  p_key_name TEXT,
  p_key_value TEXT,
  p_service_type TEXT DEFAULT 'generic',
  p_configurations JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Function to test API key integration
CREATE OR REPLACE FUNCTION public.update_api_key_test_result(
  p_id UUID,
  p_status TEXT,
  p_result JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.api_keys 
  SET 
    integration_status = p_status,
    last_test_at = now(),
    test_result = p_result,
    updated_at = now()
  WHERE id = p_id;
END;
$$;
