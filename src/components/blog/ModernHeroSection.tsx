import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/data/blogPosts";

interface ModernHeroSectionProps {
  posts: BlogPost[];
  categories: Array<{ name: string; color: string }>;
}

const ModernHeroSection = ({ posts, categories }: ModernHeroSectionProps) => {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [sidebarPosts, setSidebarPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (posts.length > 0) {
      setFeaturedPost(posts[0]);
      setSidebarPosts(posts.slice(1, 4));
    }
  }, [posts]);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#DC2626';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!featuredPost) return null;

  return (
    <section className="bg-background pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breaking News Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#DC2626] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
              BREAKING DAILY NEWS
            </div>
            <div className="h-px bg-border flex-1"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0 shadow-lg group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <Badge 
                    className="text-white font-semibold px-4 py-2 text-sm border-0"
                    style={{ backgroundColor: getCategoryColor(featuredPost.category) }}
                  >
                    {featuredPost.category?.toUpperCase()}
                  </Badge>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <Link to={`/blog/post/${featuredPost.id}`}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 line-clamp-3 hover:text-gray-200 transition-colors">
                      {featuredPost.title}
                    </h1>
                  </Link>
                  
                  <p className="text-gray-200 text-lg mb-6 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime} min read</span>
                    </div>
                    <span>{formatDate(featuredPost.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Posts */}
          <div className="space-y-6">
            <div className="border-l-4 border-[#DC2626] pl-4">
              <h2 className="text-xl font-bold text-foreground mb-1">LATEST UPDATES</h2>
              <p className="text-muted-foreground text-sm">Stay informed with our newest content</p>
            </div>
            
            {sidebarPosts.map((post, index) => (
              <Card key={post.id} className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex gap-4 p-4">
                  <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Badge 
                      className="text-xs font-medium mb-2 border-0"
                      style={{ 
                        backgroundColor: getCategoryColor(post.category),
                        color: 'white'
                      }}
                    >
                      {post.category?.toUpperCase()}
                    </Badge>
                    
                    <Link to={`/blog/post/${post.id}`}>
                      <h3 className="font-bold text-foreground line-clamp-2 text-sm hover:text-primary transition-colors mb-2 group-hover:text-primary">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center text-xs text-muted-foreground gap-3">
                      <span>{post.author}</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* View More Button */}
            <Button 
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium py-3 rounded-lg transition-colors"
              asChild
            >
              <Link to="/blog" className="flex items-center justify-center gap-2">
                View All Articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Trending Topics Bar */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <TrendingUp className="w-4 h-4 text-[#DC2626]" />
              TRENDING NOW:
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.slice(0, 5).map((category) => (
                <Link 
                  key={category.name}
                  to={`/blog/category/${category.name.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors border-r border-border pr-3 last:border-r-0"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;