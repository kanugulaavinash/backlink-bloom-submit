import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function calculateReadingTime(content: string): number {
  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '');
  
  // Count words
  const words = textContent.trim().split(/\s+/).length;
  
  // Average reading speed (words per minute)
  const wordsPerMinute = 200;
  
  // Calculate base reading time
  let readingTime = Math.ceil(words / wordsPerMinute);
  
  // Adjust for content complexity
  const codeBlocks = (content.match(/<code>/g) || []).length;
  const images = (content.match(/<img/g) || []).length;
  const lists = (content.match(/<li>/g) || []).length;
  
  // Add extra time for code blocks (slower reading)
  readingTime += codeBlocks * 0.5;
  
  // Add time for images (15 seconds per image)
  readingTime += images * 0.25;
  
  // Add time for lists (slightly slower)
  readingTime += lists * 0.1;
  
  // Minimum 1 minute
  return Math.max(1, Math.round(readingTime));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, postType, content, updateDatabase = true } = await req.json();

    const readingTime = calculateReadingTime(content);

    if (updateDatabase) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Update the appropriate table
      if (postType === 'guest') {
        await supabase
          .from('guest_posts')
          .update({ reading_time: readingTime })
          .eq('id', postId);
      } else if (postType === 'imported') {
        await supabase
          .from('imported_posts')
          .update({ reading_time: readingTime })
          .eq('id', postId);
      }
    }

    return new Response(JSON.stringify({ 
      readingTime,
      details: {
        wordCount: content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length,
        estimatedMinutes: readingTime
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in reading-time-calculator:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});