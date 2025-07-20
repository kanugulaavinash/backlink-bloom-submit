
-- Create validation_results table to store plagiarism and AI content check results
CREATE TABLE public.validation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.guest_posts(id) ON DELETE CASCADE,
  plagiarism_score DECIMAL(5,2),
  ai_content_score DECIMAL(5,2),
  plagiarism_highlights JSONB,
  ai_content_highlights JSONB,
  validation_status TEXT CHECK (validation_status IN ('pending', 'passed', 'failed', 'error')),
  plagiarism_details JSONB,
  ai_detection_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_transactions table for payment tracking
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.guest_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add validation and payment status columns to guest_posts
ALTER TABLE public.guest_posts 
ADD COLUMN validation_status TEXT CHECK (validation_status IN ('pending', 'passed', 'failed', 'error')) DEFAULT 'pending',
ADD COLUMN payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
ADD COLUMN submission_step INTEGER DEFAULT 1; -- 1=draft, 2=validation, 3=payment, 4=admin_review, 5=published

-- Enable RLS on new tables
ALTER TABLE public.validation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for validation_results
CREATE POLICY "Users can view their own validation results"
  ON public.validation_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.guest_posts 
    WHERE guest_posts.id = validation_results.post_id 
    AND guest_posts.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all validation results"
  ON public.validation_results FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert validation results"
  ON public.validation_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update validation results"
  ON public.validation_results FOR UPDATE
  USING (true);

-- RLS policies for payment_transactions
CREATE POLICY "Users can view their own payment transactions"
  ON public.payment_transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payment transactions"
  ON public.payment_transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert payment transactions"
  ON public.payment_transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update payment transactions"
  ON public.payment_transactions FOR UPDATE
  USING (true);

-- Add system setting for submission fee
INSERT INTO public.system_settings (setting_key, setting_value) 
VALUES ('guest_post_submission_fee', '500') -- $5.00 in cents
ON CONFLICT (setting_key) DO NOTHING;
