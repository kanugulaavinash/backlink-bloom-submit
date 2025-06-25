
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

    const { xmlContent, sessionId, filename } = await req.json();
    
    if (!sessionId || !xmlContent) {
      throw new Error('Session ID and XML content are required');
    }

    console.log('Processing XML content for session:', sessionId);

    // Parse XML
    const parseResult = await new Promise<any>((resolve, reject) => {
      parseString(xmlContent, (err, result) => {
        if (err) {
          console.error('XML parsing error:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const posts = parseResult?.rss?.channel?.[0]?.item || [];
    console.log('Found', posts.length, 'items in XML');

    const validPosts: ParsedPost[] = [];
    const errors: any[] = [];

    // Process each post
    for (const post of posts) {
      try {
        // Only process actual posts, not pages or other post types
        const postType = post['wp:post_type']?.[0];
        const status = post['wp:status']?.[0];
        
        if (postType !== 'post' || status === 'trash') {
          continue;
        }

        const categories: string[] = [];
        const tags: string[] = [];

        // Extract categories and tags
        if (post.category) {
          post.category.forEach((cat: any) => {
            if (cat.$.domain === 'category') {
              categories.push(cat._);
            } else if (cat.$.domain === 'post_tag') {
              tags.push(cat._);
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

        validPosts.push(parsedPost);
      } catch (error) {
        console.error('Error processing post:', error);
        errors.push({
          wordpress_id: post['wp:post_id']?.[0] || 'unknown',
          error: error.message
        });
      }
    }

    console.log('Valid posts found:', validPosts.length);

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

    // Insert posts into database
    let successfulImports = 0;
    const importErrors: any[] = [...errors];

    for (const post of validPosts) {
      try {
        const { error: insertError } = await supabase
          .from('imported_posts')
          .insert({
            ...post,
            imported_by: user.id,
            import_session_id: sessionId,
            status: 'imported'
          });

        if (insertError) {
          console.error('Insert error for post:', post.wordpress_id, insertError);
          importErrors.push({
            wordpress_id: post.wordpress_id,
            error: insertError.message
          });
        } else {
          successfulImports++;
        }
      } catch (error) {
        console.error('Exception inserting post:', post.wordpress_id, error);
        importErrors.push({
          wordpress_id: post.wordpress_id,
          error: error.message
        });
      }
    }

    const failedImports = validPosts.length - successfulImports;

    console.log('Import results:', {
      total: validPosts.length,
      successful: successfulImports,
      failed: failedImports
    });

    // Update import session
    const { error: updateError } = await supabase
      .from('import_sessions')
      .update({
        total_posts: validPosts.length,
        successful_imports: successfulImports,
        failed_imports: failedImports,
        errors: importErrors,
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
        total_posts: validPosts.length,
        successful_imports: successfulImports,
        failed_imports: failedImports,
        errors: importErrors
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
