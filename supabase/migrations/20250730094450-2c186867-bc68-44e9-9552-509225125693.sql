-- Add Razorpay-specific columns to payment_transactions table
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS gateway TEXT DEFAULT 'stripe';

-- Update existing records to use 'stripe' as gateway
UPDATE public.payment_transactions 
SET gateway = 'stripe' 
WHERE gateway IS NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_razorpay_order 
ON public.payment_transactions(razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_gateway 
ON public.payment_transactions(gateway);