import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlagiarismCheckRequest {
  postId: string;
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, content }: PlagiarismCheckRequest = await req.json();
    
    // Initialize Supabase client with service role for database writes
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log(`Starting plagiarism check for post: ${postId}`);

    // Simulate plagiarism detection (replace with actual API like Copyleaks)
    // For demo purposes, we'll simulate detecting some issues
    const words = content.split(' ');
    const totalWords = words.length;
    
    // Simulate plagiarism detection results
    const plagiarismScore = Math.random() * 15; // Random score 0-15%
    const highlights: any[] = [];
    
    // Simulate finding some plagiarized content if score > 10%
    if (plagiarismScore > 10) {
      const startIndex = Math.floor(Math.random() * (totalWords - 10));
      const endIndex = startIndex + 5 + Math.floor(Math.random() * 5);
      
      highlights.push({
        start: startIndex,
        end: endIndex,
        text: words.slice(startIndex, endIndex).join(' '),
        confidence: 0.85,
        source: "Example source website"
      });
    }

    const validationStatus = plagiarismScore > 20 ? 'failed' : 'passed';
    
    // Store results in database
    const { error: insertError } = await supabaseService
      .from('validation_results')
      .upsert({
        post_id: postId,
        plagiarism_score: Math.round(plagiarismScore * 100) / 100,
        plagiarism_highlights: highlights,
        plagiarism_details: {
          total_words: totalWords,
          checked_sources: 1000000,
          scan_date: new Date().toISOString()
        },
        validation_status: validationStatus,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'post_id'
      });

    if (insertError) {
      console.error('Error storing plagiarism results:', insertError);
      throw new Error('Failed to store validation results');
    }

    console.log(`Plagiarism check completed. Score: ${plagiarismScore}%, Status: ${validationStatus}`);

    return new Response(JSON.stringify({
      success: true,
      plagiarism_score: Math.round(plagiarismScore * 100) / 100,
      highlights,
      status: validationStatus,
      total_words: totalWords
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Plagiarism check error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});