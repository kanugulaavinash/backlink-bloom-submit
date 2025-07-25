import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Calendar, User, Clock, Eye, Heart, ArrowUp } from "lucide-react";
import { getAllPostsWithPagination, BlogPost } from "@/data/blogPosts";

const AllPostsSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Load initial posts
  useEffect(() => {
    loadPosts(1, true);
  }, []);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadPosts = useCallback(async (page: number, reset: boolean = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      console.log(`Loading posts for page ${page}`);
      
      const result = await getAllPostsWithPagination(page, 9);
      
      setPosts(prev => reset ? result.posts : [...prev, ...result.posts]);
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
      setCurrentPage(page);
      
      console.log(`Loaded ${result.posts.length} posts, total: ${result.totalCount}`);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadPosts(currentPage + 1);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPostImageUrl = (post: BlogPost) => {
    if (post.imageUrl) return post.imageUrl;
    
    // Generate placeholder based on category
    const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo'];
    const colorIndex = post.category.length % colors.length;
    return `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=240&fit=crop&auto=format&q=80&bg=${colors[colorIndex]}`;
  };

  if (posts.length === 0 && loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-16 mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            All Posts
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our complete collection of articles, insights, and stories from our community of writers.
            {totalCount > 0 && (
              <span className="block mt-2 text-sm">
                Showing {posts.length} of {totalCount} posts
              </span>
            )}
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post, index) => (
              <Card 
                key={`${post.id}-${index}`} 
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getPostImageUrl(post)}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=240&fit=crop&auto=format&q=80';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-background/90 text-foreground"
                    >
                      {post.category}
                    </Badge>
                  </div>
                  {post.postType && (
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant="outline" 
                        className="bg-background/90 text-xs"
                      >
                        {post.postType}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/blog/post/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}m</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                    <Link 
                      to={`/blog/post/${post.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              disabled={loading}
              size="lg"
              className="px-8 py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                  Loading More Posts...
                </>
              ) : (
                'Load More Posts'
              )}
            </Button>
          </div>
        )}

        {/* End Message */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              You've reached the end! Thanks for exploring all our content.
            </p>
          </div>
        )}

        {/* No Posts Message */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No posts available at the moment. Check back soon for new content!
            </p>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 z-50 shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
    </section>
  );
};

export default AllPostsSection;