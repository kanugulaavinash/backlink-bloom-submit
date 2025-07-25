
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getPostById, type BlogPost } from "@/data/blogPosts";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { SocialShare } from "@/components/blog/SocialShare";
import { InlineReactions } from "@/components/blog/InlineReactions";
import { format } from "date-fns";
import { createSafeHTML, sanitizer } from "@/lib/sanitization";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    if (!id) {
      setPost(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedPost = await getPostById(id);
      setPost(fetchedPost);
    } catch (error) {
      console.error('Error loading post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sanitize post data
  const sanitizedPost = {
    ...post,
    title: sanitizer.sanitizeText(post.title),
    excerpt: sanitizer.sanitizeText(post.excerpt),
    author: sanitizer.sanitizeText(post.author),
    content: post.content // This will be sanitized when rendering
  };

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {post && <ReadingProgress target={articleRef} />}
      <div className="pt-20">
        <article ref={articleRef} className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{sanitizer.sanitizeText(post.category)}</Badge>
              {post.subCategory && (
                <Badge variant="outline">{sanitizer.sanitizeText(post.subCategory)}</Badge>
              )}
              {post.id.startsWith('imported-') && (
                <Badge className="bg-green-500 text-white">Imported</Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
              {sanitizedPost.title}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{sanitizedPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {sanitizedPost.excerpt}
            </p>

            {/* Social Share */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Share this article</span>
                <SocialShare 
                  url={currentUrl}
                  title={sanitizedPost.title}
                  description={sanitizedPost.excerpt}
                />
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={sanitizer.sanitizeUrl(post.imageUrl)}
              alt={sanitizedPost.title}
              className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Article Content with Inline Reactions */}
          <div className="prose prose-lg max-w-none mb-8">
            <div className="text-foreground leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => (
                <div key={index} className="relative group">
                  <div 
                    className="text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={createSafeHTML(paragraph, false)}
                  />
                  {paragraph.trim() && paragraph.length > 50 && (
                    <InlineReactions postId={post.id} paragraphIndex={index} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="hover:bg-primary/10">
                  {sanitizer.sanitizeText(tag)}
                </Badge>
              ))}
            </div>
          </div>
        </article>

        {/* Related Posts Section */}
        <RelatedPosts currentPost={post} />
      </div>
    </div>
  );
};

export default BlogPostPage;
