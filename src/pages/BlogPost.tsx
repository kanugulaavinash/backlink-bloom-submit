
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getPostById, type BlogPost } from "@/data/blogPosts";
import { Calendar, Clock, User, ArrowLeft, Eye, ThumbsUp, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { SocialShare } from "@/components/blog/SocialShare";
import { InlineReactions } from "@/components/blog/InlineReactions";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import { ContentFormatter } from "@/components/blog/ContentFormatter";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { useAnalytics } from "@/hooks/useAnalytics";
import { format } from "date-fns";
import { createSafeHTML, sanitizer } from "@/lib/sanitization";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const articleRef = useRef<HTMLElement>(null);
  const { trackPostView } = useAnalytics();

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      trackPostView(post.id, post.title);
    }
  }, [post, trackPostView]);

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
      <SEO 
        title={(post as any).metaTitle || sanitizedPost.title}
        description={(post as any).metaDescription || sanitizedPost.excerpt}
        image={sanitizer.sanitizeUrl(post.imageUrl)}
        url={currentUrl}
        type="article"
        publishedTime={post.publishedAt}
        modifiedTime={(post as any).lastUpdated}
        author={sanitizedPost.author}
        tags={post.tags}
        category={post.category}
      />
      <Header />
      {post && <ReadingProgress target={articleRef} />}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Desktop Sidebar */}
            <div className="hidden lg:block">
              <TableOfContents content={post.content} />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article ref={articleRef} className="max-w-none">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                  <span>/</span>
                  <Link to={`/blog/category/${post.category.toLowerCase()}`} className="hover:text-foreground transition-colors">
                    {sanitizer.sanitizeText(post.category)}
                  </Link>
                  <span>/</span>
                  <span className="text-foreground">{sanitizedPost.title}</span>
                </nav>

                {/* Back Button */}
                <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>

                {/* Article Header */}
                <header className="mb-8">
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <Badge variant="secondary" className="text-xs px-3 py-1">
                      {sanitizer.sanitizeText(post.category)}
                    </Badge>
                    {post.subCategory && (
                      <Badge variant="outline" className="text-xs px-3 py-1">
                        {sanitizer.sanitizeText(post.subCategory)}
                      </Badge>
                    )}
                    {post.id.startsWith('imported-') && (
                      <Badge className="bg-green-500 text-white text-xs px-3 py-1">Imported</Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
                    {sanitizedPost.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-muted-foreground mb-6">
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
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{post.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes.toLocaleString()}</span>
                    </div>
                  </div>

                  {(post as any).lastUpdated && (
                    <div className="text-xs text-muted-foreground mb-6">
                      Last updated: {format(new Date((post as any).lastUpdated), 'MMM d, yyyy')}
                    </div>
                  )}

                  <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
                    {sanitizedPost.excerpt}
                  </p>

                  {/* Social Share */}
                  <div className="flex items-center justify-between py-4 border-y">
                    <span className="text-sm font-medium text-muted-foreground">Share this article</span>
                    <SocialShare 
                      url={currentUrl}
                      title={sanitizedPost.title}
                      description={sanitizedPost.excerpt}
                    />
                  </div>
                </header>

                {/* Featured Image */}
                <div className="mb-8">
                  <img
                    src={sanitizer.sanitizeUrl(post.imageUrl)}
                    alt={sanitizedPost.title}
                    className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
                    loading="eager"
                  />
                </div>

                {/* Table of Contents - Mobile */}
                <div className="lg:hidden mb-8">
                  <TableOfContents content={post.content} />
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none mb-8">
                  <ContentFormatter content={post.content} postId={post.id} />
                </div>

                {/* Article CTA */}
                <ArticleCTA postId={post.id} title={sanitizedPost.title} className="mb-8" />

                <Separator className="my-8" />

                {/* Author Bio */}
                <AuthorBio 
                  author={sanitizedPost.author}
                  authorBio={(post as any).authorBio}
                  authorWebsite={(post as any).authorWebsite}
                  authorAvatar={(post as any).authorAvatar}
                  publishedAt={post.publishedAt}
                  className="mb-8"
                />

                {/* Tags */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="hover:bg-primary/10 cursor-pointer transition-colors px-3 py-1"
                      >
                        #{sanitizer.sanitizeText(tag)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Comments Section Placeholder */}
                <div className="border rounded-lg p-6 bg-muted/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Comments</h3>
                  <p className="text-muted-foreground text-center py-8">
                    [Comments Section Opens Here]
                  </p>
                </div>
              </article>
            </div>
          </div>

          {/* Related Posts Section */}
          <RelatedPosts currentPost={post} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
