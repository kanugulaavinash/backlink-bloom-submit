import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

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
    const { userId, postId, postType, limit = 5 } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let recommendations = [];

    if (userId) {
      // Get user's reading history
      const { data: readingHistory } = await supabase
        .from('user_reading_history')
        .select('post_id, post_type')
        .eq('user_id', userId)
        .order('read_at', { ascending: false })
        .limit(20);

      if (readingHistory && readingHistory.length > 0) {
        // Get categories from user's reading history
        const guestPostIds = readingHistory
          .filter(h => h.post_type === 'guest')
          .map(h => h.post_id);
        
        const importedPostIds = readingHistory
          .filter(h => h.post_type === 'imported')
          .map(h => h.post_id);

        let userCategories = [];

        if (guestPostIds.length > 0) {
          const { data: guestPosts } = await supabase
            .from('guest_posts')
            .select('category')
            .in('id', guestPostIds);
          
          if (guestPosts) {
            userCategories = [...userCategories, ...guestPosts.map(p => p.category)];
          }
        }

        if (importedPostIds.length > 0) {
          const { data: importedPosts } = await supabase
            .from('imported_posts')
            .select('categories')
            .in('id', importedPostIds);
          
          if (importedPosts) {
            const flatCategories = importedPosts
              .filter(p => p.categories)
              .flatMap(p => p.categories);
            userCategories = [...userCategories, ...flatCategories];
          }
        }

        // Get most frequent categories
        const categoryCount = userCategories.reduce((acc, cat) => {
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

        const topCategories = Object.entries(categoryCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([cat]) => cat);

        // Find posts in user's preferred categories (excluding already read)
        if (topCategories.length > 0) {
          const readPostIds = readingHistory.map(h => h.post_id);

          const { data: categoryRecommendations } = await supabase
            .from('guest_posts')
            .select('id, title, excerpt, category, author_name, created_at, view_count, ai_summary, reading_time')
            .in('category', topCategories)
            .not('id', 'in', `(${readPostIds.join(',')})`)
            .eq('status', 'approved')
            .order('view_count', { ascending: false })
            .limit(limit);

          if (categoryRecommendations) {
            recommendations = categoryRecommendations.map(post => ({
              ...post,
              post_type: 'guest',
              recommendation_reason: 'Based on your reading history'
            }));
          }
        }
      }
    }

    // If no personalized recommendations, get popular posts
    if (recommendations.length < limit) {
      const remaining = limit - recommendations.length;
      
      const { data: popularPosts } = await supabase
        .from('guest_posts')
        .select('id, title, excerpt, category, author_name, created_at, view_count, ai_summary, reading_time')
        .eq('status', 'approved')
        .order('view_count', { ascending: false })
        .limit(remaining);

      if (popularPosts) {
        const popularRecommendations = popularPosts.map(post => ({
          ...post,
          post_type: 'guest',
          recommendation_reason: 'Popular content'
        }));
        
        recommendations = [...recommendations, ...popularRecommendations];
      }
    }

    // If we have a specific post, get related posts
    if (postId && postType) {
      let currentPost = null;
      
      if (postType === 'guest') {
        const { data } = await supabase
          .from('guest_posts')
          .select('category, ai_tags')
          .eq('id', postId)
          .single();
        currentPost = data;
      } else if (postType === 'imported') {
        const { data } = await supabase
          .from('imported_posts')
          .select('categories, ai_tags')
          .eq('id', postId)
          .single();
        currentPost = data;
      }

      if (currentPost) {
        const category = postType === 'guest' ? currentPost.category : currentPost.categories?.[0];
        
        if (category) {
          const { data: relatedPosts } = await supabase
            .from('guest_posts')
            .select('id, title, excerpt, category, author_name, created_at, view_count, ai_summary, reading_time')
            .eq('category', category)
            .neq('id', postId)
            .eq('status', 'approved')
            .order('created_at', { ascending: false })
            .limit(3);

          if (relatedPosts) {
            const related = relatedPosts.map(post => ({
              ...post,
              post_type: 'guest',
              recommendation_reason: 'Related content'
            }));
            
            recommendations = [...related, ...recommendations].slice(0, limit);
          }
        }
      }
    }

    return new Response(JSON.stringify({ 
      recommendations: recommendations.slice(0, limit)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in content-recommendations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});