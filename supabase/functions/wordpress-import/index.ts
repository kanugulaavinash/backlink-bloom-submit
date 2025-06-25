
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { parseString } from 'https://esm.sh/xml2js@0.6.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface WordPressPost {
  title: string[];
  'content:encoded': string[];
  'excerpt:encoded'?: string[];
  'wp:post_name': string[];
  'wp:post_date': string[];
  'wp:post_type': string[];
  'wp:status': string[];
  'wp:post_id': string[];
  category?: Array<{
    _: string;
    $: { domain: string; nicename: string };
  }>;
}

interface ParsedPost {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published_date: string;
  wordpress_id: string;
  categories: string[];
  tags: string[];
}

const BATCH_SIZE = 10; // Process posts in smaller batches

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('WordPress import function called');

    const requestBody = await req.json();
    const { xmlContent, sessionId, filename } = requestBody;
    
    if (!sessionId || !xmlContent) {
      throw new Error('Session ID and XML content are required');
    }

    console.log('Processing XML content for session:', sessionId);

    // Parse XML
    let parseResult;
    try {
      parseResult = await new Promise<any>((resolve, reject) => {
        parseString(xmlContent, (err, result) => {
          if (err) {
            console.error('XML parsing error:', err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error('Failed to parse XML:', error);
      throw new Error(`XML parsing failed: ${error.message}`);
    }

    const posts = parseResult?.rss?.channel?.[0]?.item || [];
    console.log('Found', posts.length, 'items in XML');

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Invalid authentication');
    }

    console.log('User authenticated:', user.id);

    // Process posts in smaller batches to avoid memory issues
    let successfulImports = 0;
    const errors: any[] = [];
    let processedCount = 0;

    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
      const batch = posts.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(posts.length / BATCH_SIZE)}`);

      for (const post of batch) {
        try {
          processedCount++;
          
          // Only process actual posts, not pages or other post types
          const postType = post['wp:post_type']?.[0];
          const status = post['wp:status']?.[0];
          
          if (postType !== 'post' || status === 'trash') {
            continue;
          }

          const categories: string[] = [];
          const tags: string[] = [];

          // Extract categories and tags
          if (post.category && Array.isArray(post.category)) {
            post.category.forEach((cat: any) => {
              if (cat && cat.$ && cat._) {
                if (cat.$.domain === 'category') {
                  categories.push(cat._);
                } else if (cat.$.domain === 'post_tag') {
                  tags.push(cat._);
                }
              }
            });
          }

          const parsedPost: ParsedPost = {
            title: post.title?.[0] || 'Untitled',
            content: post['content:encoded']?.[0] || '',
            excerpt: post['excerpt:encoded']?.[0] || '',
            slug: post['wp:post_name']?.[0] || '',
            published_date: post['wp:post_date']?.[0] || new Date().toISOString(),
            wordpress_id: post['wp:post_id']?.[0] || '',
            categories,
            tags,
          };

          // Validate required fields
          if (!parsedPost.title || !parsedPost.content) {
            errors.push({
              wordpress_id: parsedPost.wordpress_id,
              error: 'Missing required fields (title or content)'
            });
            continue;
          }

          // Insert post into database
          const { error: insertError } = await supabase
            .from('imported_posts')
            .insert({
              ...parsedPost,
              imported_by: user.id,
              import_session_id: sessionId,
              status: 'imported'
            });

          if (insertError) {
            console.error('Insert error for post:', parsedPost.wordpress_id, insertError);
            errors.push({
              wordpress_id: parsedPost.wordpress_id,
              error: insertError.message
            });
          } else {
            successfulImports++;
          }

        } catch (error) {
          console.error('Exception processing post:', error);
          const wordpressId = post['wp:post_id']?.[0] || 'unknown';
          errors.push({
            wordpress_id: wordpressId,
            error: error.message
          });
        }
      }

      // Small delay between batches to prevent overwhelming the system
      if (i + BATCH_SIZE < posts.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const totalValidPosts = processedCount;
    const failedImports = errors.length;

    console.log('Import results:', {
      total: totalValidPosts,
      successful: successfulImports,
      failed: failedImports
    });

    // Update import session
    const { error: updateError } = await supabase
      .from('import_sessions')
      .update({
        total_posts: totalValidPosts,
        successful_imports: successfulImports,
        failed_imports: failedImports,
        errors: errors,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_posts: totalValidPosts,
        successful_imports: successfulImports,
        failed_imports: failedImports,
        errors: errors
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
