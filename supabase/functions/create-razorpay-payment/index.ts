import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  postId: string;
  amount: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user?.email) {
      throw new Error('User not authenticated');
    }

    const { postId, amount }: PaymentRequest = await req.json();

    if (!postId || !amount) {
      throw new Error('Missing postId or amount');
    }

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    console.log('Creating Razorpay order for amount:', amount);

    // Create Razorpay order
    const orderData = {
      amount: amount * 100, // Convert to paisa (like cents for USD)
      currency: 'INR',
      receipt: `receipt_${postId}_${Date.now()}`,
      notes: {
        post_id: postId,
        user_id: user.id,
        user_email: user.email
      }
    };

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Razorpay API error:', errorText);
      throw new Error(`Razorpay API error: ${response.status}`);
    }

    const order = await response.json();
    console.log('Razorpay order created:', order.id);

    // Store payment transaction in database
    const { error: paymentError } = await supabaseService
      .from('payment_transactions')
      .insert({
        post_id: postId,
        user_id: user.id,
        amount: amount,
        currency: 'INR',
        status: 'pending',
        gateway: 'razorpay',
        razorpay_order_id: order.id,
        created_at: new Date().toISOString()
      });

    if (paymentError) {
      console.error('Error storing payment transaction:', paymentError);
      throw paymentError;
    }

    console.log('Payment transaction stored successfully');

    return new Response(
      JSON.stringify({
        success: true,
        order: order,
        keyId: razorpayKeyId // Frontend needs this for checkout
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Error in create-razorpay-payment:', error);
    
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