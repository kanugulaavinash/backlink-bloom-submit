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
    const { query, limit = 10, searchType = 'hybrid' } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let results = [];

    if (searchType === 'semantic' || searchType === 'hybrid') {
      // Generate embedding for search query
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: query,
        }),
      });

      const embeddingData = await embeddingResponse.json();
      const queryEmbedding = embeddingData.data[0].embedding;

      // Search using embeddings (semantic similarity)
      const { data: semanticResults, error: semanticError } = await supabase.rpc(
        'semantic_search_posts',
        {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: limit
        }
      );

      if (!semanticError && semanticResults) {
        results = [...results, ...semanticResults];
      }
    }

    if (searchType === 'text' || searchType === 'hybrid') {
      // Text-based search as fallback
      const { data: guestPosts } = await supabase
        .from('guest_posts')
        .select('id, title, content, excerpt, category, author_name, created_at, view_count, ai_summary, ai_tags, reading_time')
        .or(`title.ilike.%${query}%, content.ilike.%${query}%, category.ilike.%${query}%`)
        .eq('status', 'approved')
        .limit(limit);

      const { data: importedPosts } = await supabase
        .from('imported_posts')
        .select('id, title, content, excerpt, categories, created_at, view_count, ai_summary, ai_tags, reading_time')
        .or(`title.ilike.%${query}%, content.ilike.%${query}%`)
        .limit(limit);

      if (guestPosts) {
        const textResults = guestPosts.map(post => ({
          ...post,
          post_type: 'guest',
          similarity: 0.5 // Default similarity for text search
        }));
        results = [...results, ...textResults];
      }

      if (importedPosts) {
        const textResults = importedPosts.map(post => ({
          ...post,
          post_type: 'imported',
          similarity: 0.5
        }));
        results = [...results, ...textResults];
      }
    }

    // Remove duplicates and sort by similarity
    const uniqueResults = results
      .filter((post, index, self) => 
        index === self.findIndex(p => p.id === post.id && p.post_type === post.post_type)
      )
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, limit);

    // Log search analytics
    await supabase
      .from('search_analytics')
      .insert({
        query,
        results_count: uniqueResults.length,
        search_type: searchType,
        user_id: null // Will be set from client if user is logged in
      });

    return new Response(JSON.stringify({ 
      results: uniqueResults,
      count: uniqueResults.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in semantic-search:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});