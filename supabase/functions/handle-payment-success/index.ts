import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { sessionId, postId } = await req.json();

    if (!sessionId || !postId) {
      throw new Error('Missing sessionId or postId');
    }

    console.log('Processing payment success for session:', sessionId, 'post:', postId);

    // Update payment transaction status
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payment_transactions')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_session_id', sessionId)
      .select()
      .single();

    if (paymentError) {
      console.error('Error updating payment:', paymentError);
      throw paymentError;
    }

    // Update guest post status
    const { error: postError } = await supabaseClient
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

    console.log('Payment success processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment processed successfully',
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
    console.error('Error in handle-payment-success:', error);
    
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