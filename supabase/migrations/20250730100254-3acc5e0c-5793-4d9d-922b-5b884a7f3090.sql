-- Update system settings to set Razorpay as default payment gateway
UPDATE public.system_settings 
SET setting_value = 'razorpay' 
WHERE setting_key = 'payment_gateway';

-- Insert payment_gateway setting if it doesn't exist
INSERT INTO public.system_settings (setting_key, setting_value)
SELECT 'payment_gateway', 'razorpay'
WHERE NOT EXISTS (
  SELECT 1 FROM public.system_settings WHERE setting_key = 'payment_gateway'
);

-- Update currency to INR
UPDATE public.system_settings 
SET setting_value = 'INR' 
WHERE setting_key = 'payment_currency';

-- Insert payment_currency setting if it doesn't exist
INSERT INTO public.system_settings (setting_key, setting_value)
SELECT 'payment_currency', 'INR'
WHERE NOT EXISTS (
  SELECT 1 FROM public.system_settings WHERE setting_key = 'payment_currency'
);