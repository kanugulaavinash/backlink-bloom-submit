import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Eye, Heart, ArrowRight, TrendingUp } from "lucide-react";
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

interface ModernCategorySectionProps {
  categoryName: string;
  categoryColor?: string;
  displayName?: string;
  maxPosts?: number;
  layoutType?: 'grid' | 'mixed' | 'list';
}

const ModernCategorySection = ({ 
  categoryName, 
  categoryColor = '#DC2626',
  displayName,
  maxPosts = 6,
  layoutType = 'mixed'
}: ModernCategorySectionProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryPosts();
  }, [categoryName]);

  const fetchCategoryPosts = async () => {
    try {
      setLoading(true);

      // Fetch guest posts
      const { data: guestPosts, error: guestError } = await supabase
        .from('guest_posts')
        .select('id, title, excerpt, author_name, created_at, category')
        .eq('category', categoryName)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(maxPosts);

      // Fetch imported posts
      const { data: importedPosts, error: importedError } = await supabase
        .from('imported_posts')
        .select('id, title, excerpt, created_at, categories')
        .contains('categories', [categoryName])
        .order('created_at', { ascending: false })
        .limit(maxPosts);

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
          reading_time: Math.floor(Math.random() * 8) + 3,
          view_count: Math.floor(Math.random() * 5000) + 100,
          like_count: Math.floor(Math.random() * 150) + 10
        })),
        ...(importedPosts || []).map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          created_at: post.created_at,
          category: post.categories?.[0] || categoryName,
          post_type: 'imported' as const,
          reading_time: Math.floor(Math.random() * 8) + 3,
          view_count: Math.floor(Math.random() * 5000) + 100,
          like_count: Math.floor(Math.random() * 150) + 10
        }))
      ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, maxPosts);

      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching category posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayAuthor = (post: BlogPost) => {
    return post.author || post.author_name || 'Anonymous';
  };

  const getDisplayExcerpt = (post: BlogPost) => {
    return post.ai_summary || post.excerpt || 'No preview available';
  };

  const getPostImageUrl = (post: BlogPost, isLarge = false) => {
    if (post.featured_image_url) return post.featured_image_url;
    
    const categoryImages = {
      'Lifestyle': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
      'Entertainment': 'https://images.unsplash.com/photo-1489599516984-0717d9ee94da?w=800&h=500&fit=crop',
      'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=500&fit=crop',
      'Business': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=500&fit=crop',
      'Health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=500&fit=crop',
      'Travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop'
    };
    
    return categoryImages[categoryName as keyof typeof categoryImages] || 
           'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&h=500&fit=crop';
  };

  if (loading) {
    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-muted"></div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          </div>
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
    return null;
  }

  const sectionTitle = displayName || `${categoryName.toUpperCase()} UPDATES`;

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div 
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: categoryColor }}
          ></div>
          <h2 className="text-2xl font-bold text-foreground">
            {sectionTitle}
          </h2>
          <Badge 
            variant="secondary" 
            className="ml-2 text-xs"
            style={{ 
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
              border: `1px solid ${categoryColor}40`
            }}
          >
            {posts.length} POSTS
          </Badge>
        </div>
        
        <Link to={`/blog/category/${categoryName.toLowerCase()}`}>
          <Button 
            variant="outline" 
            className="hover:bg-muted transition-colors text-sm"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Posts Grid */}
      {layoutType === 'mixed' && posts.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Large Featured Post */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border border-border shadow-lg group">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={getPostImageUrl(posts[0], true)}
                  alt={posts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    className="text-white font-semibold px-3 py-1 text-xs border-0"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {categoryName.toUpperCase()}
                  </Badge>
                </div>

                {/* Trending Badge */}
                {(posts[0].view_count || 0) > 1000 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-black border-0 px-3 py-1 text-xs flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      HOT
                    </Badge>
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Link to={`/blog/post/${posts[0].id}`}>
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 hover:text-gray-200 transition-colors">
                      {posts[0].title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-200 mb-4 line-clamp-2">
                    {getDisplayExcerpt(posts[0])}
                  </p>
                  
                  <div className="flex items-center gap-4 text-gray-300 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{getDisplayAuthor(posts[0])}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{posts[0].reading_time}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{posts[0].view_count?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Smaller Posts Column */}
          <div className="space-y-4">
            {posts.slice(1, 4).map((post) => (
              <Card key={post.id} className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex gap-3 p-4">
                  <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded">
                    <img
                      src={getPostImageUrl(post)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Badge 
                      className="text-xs font-medium mb-2 border-0"
                      style={{ 
                        backgroundColor: categoryColor,
                        color: 'white'
                      }}
                    >
                      {categoryName.toUpperCase()}
                    </Badge>
                    
                    <Link to={`/blog/post/${post.id}`}>
                      <h4 className="font-semibold text-foreground line-clamp-2 text-sm hover:text-primary transition-colors mb-2 group-hover:text-primary">
                        {post.title}
                      </h4>
                    </Link>
                    
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <span>{getDisplayAuthor(post)}</span>
                      <span>•</span>
                      <span>{format(new Date(post.created_at), 'MMM d')}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // Regular Grid Layout
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden border border-border shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={getPostImageUrl(post)}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    className="text-white font-semibold px-3 py-1 text-xs border-0"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {categoryName.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <Link to={`/blog/post/${post.id}`}>
                  <h3 className="font-bold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {getDisplayExcerpt(post)}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>{getDisplayAuthor(post)}</span>
                    <span>{post.reading_time}m read</span>
                  </div>
                  <span>{format(new Date(post.created_at), 'MMM d')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default ModernCategorySection;