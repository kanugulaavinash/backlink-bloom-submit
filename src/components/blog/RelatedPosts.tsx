import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllPostsByCategory, getLatestPosts, type BlogPost } from "@/data/blogPosts";
import { format } from "date-fns";

interface RelatedPostsProps {
  currentPost: BlogPost;
  maxPosts?: number;
}

const RelatedPosts = ({ currentPost, maxPosts = 3 }: RelatedPostsProps) => {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedPosts();
  }, [currentPost]);

  const loadRelatedPosts = async () => {
    try {
      setLoading(true);
      
      // First try to get posts from the same category
      let posts = await getAllPostsByCategory(currentPost.category);
      
      // Filter out the current post
      posts = posts.filter(post => post.id !== currentPost.id);
      
      // If we don't have enough posts from the same category, fill with latest posts
      if (posts.length < maxPosts) {
        const latestPosts = await getLatestPosts(maxPosts * 2);
        const additionalPosts = latestPosts.filter(
          post => post.id !== currentPost.id && 
                  !posts.some(existingPost => existingPost.id === post.id)
        );
        posts = [...posts, ...additionalPosts];
      }
      
      // Limit to maxPosts
      setRelatedPosts(posts.slice(0, maxPosts));
    } catch (error) {
      console.error('Error loading related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            YOU MAY ALSO LIKE
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(maxPosts)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!relatedPosts.length) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Technology': '#3B82F6',
      'Business': '#10B981',
      'Marketing': '#8B5CF6',
      'Design': '#F59E0B',
      'Development': '#06B6D4',
      'Lifestyle': '#EC4899',
      'Health': '#10B981',
      'Travel': '#3B82F6',
      'Food': '#F59E0B',
      'Fashion': '#EC4899',
      'Sports': '#EF4444',
      'Entertainment': '#8B5CF6',
      'Education': '#6366F1',
      'Finance': '#059669',
      'Science': '#0891B2',
      'Politics': '#DC2626',
      'Art': '#7C3AED',
      'Music': '#DB2777',
      'Photography': '#0D9488',
      'Gaming': '#7C2D12'
    };
    return categoryColors[category] || '#DC2626';
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center tracking-wide">
          YOU MAY ALSO LIKE
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden border border-border shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    className="text-white font-semibold px-3 py-1 text-xs border-0 uppercase tracking-wide"
                    style={{ backgroundColor: getCategoryColor(post.category) }}
                  >
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <Link to={`/blog/post/${post.id}`}>
                  <h3 className="font-bold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors group-hover:text-primary text-lg">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                
                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>By {post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime} min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;