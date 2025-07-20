import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AIDetectionRequest {
  postId: string;
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, content }: AIDetectionRequest = await req.json();
    
    // Initialize Supabase client with service role for database writes
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log(`Starting AI content detection for post: ${postId}`);

    // Simulate AI content detection (replace with actual API like ZeroGPT or similar)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalSentences = sentences.length;
    
    // Simulate AI detection results
    const aiScore = Math.random() * 25; // Random score 0-25%
    const highlights: any[] = [];
    
    // Simulate finding some AI-generated content if score > 15%
    if (aiScore > 15) {
      const suspiciousSentences = Math.floor(totalSentences * 0.1); // 10% of sentences
      
      for (let i = 0; i < suspiciousSentences; i++) {
        const sentenceIndex = Math.floor(Math.random() * totalSentences);
        const sentence = sentences[sentenceIndex];
        
        highlights.push({
          sentence_index: sentenceIndex,
          text: sentence.trim(),
          confidence: 0.75 + Math.random() * 0.2,
          reason: "High probability of AI generation detected"
        });
      }
    }

    const validationStatus = aiScore > 30 ? 'failed' : 'passed';
    
    // Store results in database
    const { error: insertError } = await supabaseService
      .from('validation_results')
      .upsert({
        post_id: postId,
        ai_content_score: Math.round(aiScore * 100) / 100,
        ai_content_highlights: highlights,
        ai_detection_details: {
          total_sentences: totalSentences,
          analysis_model: "AI Detection Demo v1.0",
          scan_date: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'post_id'
      });

    if (insertError) {
      console.error('Error storing AI detection results:', insertError);
      throw new Error('Failed to store validation results');
    }

    console.log(`AI detection completed. Score: ${aiScore}%, Status: ${validationStatus}`);

    return new Response(JSON.stringify({
      success: true,
      ai_score: Math.round(aiScore * 100) / 100,
      highlights,
      status: validationStatus,
      total_sentences: totalSentences
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('AI detection error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});