import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const success = searchParams.get('payment_success');
      const sessionId = searchParams.get('session_id');
      const postId = searchParams.get('post_id');
      
      if (success === 'true' && sessionId && postId) {
        try {
          // Update payment status
          const { error: paymentError } = await supabase
            .from('payment_transactions')
            .update({ 
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_session_id', sessionId);

          if (paymentError) throw paymentError;

          // Update post status
          const { error: postError } = await supabase
            .from('guest_posts')
            .update({ 
              payment_status: 'completed',
              submission_step: 4,
              updated_at: new Date().toISOString()
            })
            .eq('id', postId);

          if (postError) throw postError;

          toast({
            title: "Payment Successful!",
            description: "Your post has been submitted for review. You'll be notified once it's approved.",
          });

          // Clean up URL and redirect
          navigate(`/create-blog-post/${postId}`, { replace: true });
        } catch (error) {
          console.error('Error handling payment success:', error);
          toast({
            title: "Payment Processing Error",
            description: "Payment was successful but there was an issue updating your submission. Please contact support.",
            variant: "destructive",
          });
        }
      } else if (success === 'false') {
        toast({
          title: "Payment Failed",
          description: "Your payment was not completed. Please try again.",
          variant: "destructive",
        });
        
        // Redirect back to payment step
        if (postId) {
          navigate(`/create-blog-post/${postId}`, { replace: true });
        }
      }
    };

    handlePaymentCallback();
  }, [searchParams, navigate, toast]);
};

export default usePaymentSuccess;