import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Eye, Heart, ChevronRight, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  ai_summary?: string;
  author?: string;
  author_name?: string;
  created_at: string;
  category?: string;
  categories?: string[];
  reading_time?: number;
  view_count?: number;
  like_count?: number;
  post_type: string;
  featured_image_url?: string;
}

interface CategorySectionProps {
  categoryName: string;
  categoryColor?: string;
  initialPosts?: BlogPost[];
  showViewAll?: boolean;
  maxPosts?: number;
}

const CategorySection = ({ 
  categoryName, 
  categoryColor = 'hsl(var(--primary))',
  initialPosts = [],
  showViewAll = true,
  maxPosts = 6
}: CategorySectionProps) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(!initialPosts.length);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = maxPosts;

  useEffect(() => {
    if (!initialPosts.length) {
      fetchCategoryPosts();
    }
  }, [categoryName]);

  const fetchCategoryPosts = async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const from = (page - 1) * postsPerPage;
      const to = from + postsPerPage - 1;

      // Fetch guest posts (basic fields for now)
      const { data: guestPosts, error: guestError } = await supabase
        .from('guest_posts')
        .select('id, title, excerpt, author_name, created_at, category')
        .eq('category', categoryName)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .range(from, to);

      // Fetch imported posts (basic fields for now)
      const { data: importedPosts, error: importedError } = await supabase
        .from('imported_posts')
        .select('id, title, excerpt, created_at, categories')
        .contains('categories', [categoryName])
        .order('created_at', { ascending: false })
        .range(from, to);

      if (guestError || importedError) {
        console.error('Error fetching posts:', guestError || importedError);
        return;
      }

      // Combine and format posts
      const allPosts: BlogPost[] = [
        ...(guestPosts || []).map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          author: post.author_name,
          created_at: post.created_at,
          category: post.category,
          post_type: 'guest' as const,
          reading_time: 5, // Default for now
          view_count: Math.floor(Math.random() * 1000),
          like_count: Math.floor(Math.random() * 50)
        })),
        ...(importedPosts || []).map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          created_at: post.created_at,
          category: post.categories?.[0] || categoryName,
          post_type: 'imported' as const,
          reading_time: 5, // Default for now
          view_count: Math.floor(Math.random() * 1000),
          like_count: Math.floor(Math.random() * 50)
        }))
      ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, postsPerPage);

      if (append) {
        setPosts(prev => [...prev, ...allPosts]);
      } else {
        setPosts(allPosts);
      }

      setHasMore(allPosts.length === postsPerPage);
      setCurrentPage(page);

    } catch (error) {
      console.error('Error fetching category posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      fetchCategoryPosts(currentPage + 1, true);
    }
  };

  const getDisplayAuthor = (post: BlogPost) => {
    return post.author || post.author_name || 'Anonymous';
  };

  const getDisplayExcerpt = (post: BlogPost) => {
    return post.ai_summary || post.excerpt || 'No preview available';
  };

  const getPostImageUrl = (post: BlogPost) => {
    if (post.featured_image_url) return post.featured_image_url;
    
    // Fallback images based on category
    const categoryImages = {
      'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
      'Business': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop',
      'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      'Design': 'https://images.unsplash.com/photo-1558655146-9f40138c2e04?w=400&h=250&fit=crop',
      'Development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      'Lifestyle': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
      'Health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=250&fit=crop',
      'Travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'
    };
    
    return categoryImages[categoryName as keyof typeof categoryImages] || 
           'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=250&fit=crop';
  };

  if (loading) {
    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: categoryColor }}></div>
            {categoryName}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-48 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: categoryColor }}></div>
            {categoryName}
          </h2>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <p>No posts available in this category yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="w-1 h-8 rounded-full" style={{ backgroundColor: categoryColor }}></div>
          {categoryName}
          <Badge variant="secondary" className="ml-2 text-sm">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </Badge>
        </h2>
        {showViewAll && (
          <Link to={`/blog/category/${categoryName.toLowerCase()}`}>
            <Button 
              variant="outline" 
              className="hover:bg-muted transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>

      {/* Horizontal Scrolling Posts Grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 pb-4" style={{ width: `${posts.length * 350}px` }}>
          {posts.map((post, index) => (
            <Card 
              key={`${post.post_type}-${post.id}`} 
              className="flex-shrink-0 w-80 overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 group border-0 shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={getPostImageUrl(post)}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Post Type Badge */}
                <div className="absolute top-4 right-4">
                  <Badge 
                    className={`text-white border-0 px-3 py-1 text-xs ${
                      post.post_type === 'guest' ? 'bg-green-500' :
                      post.post_type === 'imported' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                  >
                    {post.post_type === 'guest' ? 'Guest' : 'Imported'}
                  </Badge>
                </div>

                {/* Trending Badge for high-performing posts */}
                {(post.view_count || 0) > 1000 && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-black border-0 px-3 py-1 text-xs flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <Link to={`/blog/post/${post.id}`}>
                  <h3 className="font-bold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                  {getDisplayExcerpt(post)}
                </p>
                
                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{getDisplayAuthor(post)}</span>
                    </div>
                    {post.reading_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.reading_time}m</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(post.created_at), 'MMM d')}</span>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {post.view_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.view_count.toLocaleString()}</span>
                      </div>
                    )}
                    {post.like_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.like_count}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link to={`/blog/post/${post.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 transition-colors"
                    >
                      Read More →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={loadMorePosts}
            disabled={loadingMore}
            variant="outline"
            className="hover:bg-muted transition-colors"
          >
            {loadingMore ? "Loading..." : `Load More ${categoryName} Posts`}
          </Button>
        </div>
      )}
    </section>
  );
};

export default CategorySection;