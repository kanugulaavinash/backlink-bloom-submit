-- Insert Razorpay API key configurations
INSERT INTO public.api_keys (service_name, key_name, key_value, is_configured, service_type)
VALUES 
  ('razorpay', 'key_id', 'rzp_live_4oXhhfyn5cKowH', true, 'payment'),
  ('razorpay', 'key_secret', 'QQBRknspbWHS3SS4oqhEVLKS', true, 'payment')
ON CONFLICT (service_name, key_name) 
DO UPDATE SET 
  key_value = EXCLUDED.key_value,
  is_configured = true,
  service_type = 'payment',
  updated_at = now();