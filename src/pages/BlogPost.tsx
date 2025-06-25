
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPostById, BlogPost } from "@/data/blogPosts";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { format } from "date-fns";
import { createSafeHTML, sanitizer } from "@/lib/sanitization";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
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
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {sanitizedPost.title}
            </h1>
            
            <div className="flex items-center gap-6 text-gray-600 mb-6">
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

            <p className="text-xl text-gray-700 leading-relaxed">
              {sanitizedPost.excerpt}
            </p>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={sanitizer.sanitizeUrl(post.imageUrl)}
              alt={sanitizedPost.title}
              className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              className="text-gray-800 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={createSafeHTML(post.content, false)}
            />
          </div>

          {/* Tags */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="hover:bg-blue-100">
                  {sanitizer.sanitizeText(tag)}
                </Badge>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
