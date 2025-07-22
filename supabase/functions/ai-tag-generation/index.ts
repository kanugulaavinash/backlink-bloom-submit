import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, postType, content, title, category } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Generate AI tags
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a content tagging expert. Generate 5-8 relevant, specific tags for blog content. Tags should be lowercase, single words or short phrases (2-3 words max), and highly relevant to the content. Focus on topics, technologies, concepts, and actionable keywords that readers would search for.'
          },
          {
            role: 'user',
            content: `Title: ${title}\nCategory: ${category}\nContent: ${content.substring(0, 2000)}...`
          }
        ],
        max_tokens: 100,
        temperature: 0.5,
      }),
    });

    const aiData = await response.json();
    const tagsText = aiData.choices[0].message.content;
    
    // Parse tags from response
    const tags = tagsText
      .split(/[,\n]/)
      .map(tag => tag.trim().toLowerCase().replace(/^[-•*#]/, '').trim())
      .filter(tag => tag.length > 0 && tag.length < 30)
      .slice(0, 8);

    // Store in database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error } = await supabase
      .from('ai_generated_content')
      .upsert({
        post_id: postId,
        post_type: postType,
        content_type: 'tags',
        ai_content: { tags },
        confidence_score: 0.8,
        model_used: 'gpt-4o-mini'
      });

    if (error) {
      console.error('Database error:', error);
    }

    return new Response(JSON.stringify({ tags }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-tag-generation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});