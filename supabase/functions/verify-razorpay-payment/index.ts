import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { createHmac } from "https://deno.land/std@0.190.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, postId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !postId) {
      throw new Error('Missing required payment verification parameters');
    }

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayKeySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    console.log('Verifying payment for order:', razorpay_order_id);

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    console.log('Payment signature verified successfully');

    // Update payment transaction status
    const { data: paymentData, error: paymentError } = await supabaseService
      .from('payment_transactions')
      .update({ 
        status: 'completed',
        razorpay_payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (paymentError) {
      console.error('Error updating payment:', paymentError);
      throw paymentError;
    }

    // Update guest post status
    const { error: postError } = await supabaseService
      .from('guest_posts')
      .update({ 
        payment_status: 'completed',
        submission_step: 4,
        status: 'pending_review',
        updated_at: new Date().toISOString()
      })
      .eq('id', postId);

    if (postError) {
      console.error('Error updating post:', postError);
      throw postError;
    }

    console.log('Payment verification completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verified successfully',
        paymentData 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Error in verify-razorpay-payment:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});