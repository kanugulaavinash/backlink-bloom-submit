import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Heart, Share2, Bookmark, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/data/blogPosts";
import { format } from "date-fns";

interface MSNStyleHomepageProps {
  posts: BlogPost[];
  categories: Array<{ name: string; color: string }>;
}

const MSNStyleHomepage = ({ posts, categories }: MSNStyleHomepageProps) => {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [mediumPosts, setMediumPosts] = useState<BlogPost[]>([]);
  const [smallPosts, setSmallPosts] = useState<BlogPost[]>([]);
  const [sidebarPosts, setSidebarPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    if (posts.length > 0) {
      setFeaturedPost(posts[0]);
      setMediumPosts(posts.slice(1, 3));
      setSmallPosts(posts.slice(3, 7));
      setSidebarPosts(posts.slice(7, 12));
    }
  }, [posts]);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || "#DC2626";
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const categoryTabs = ["All", "Technology", "Business", "Health", "Lifestyle", "Travel"];

  if (!featuredPost) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Navigation Tabs */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8 py-4 overflow-x-auto">
            {categoryTabs.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content Area - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Top Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Featured Article - Large */}
              <Card className="md:col-span-1 group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className="text-white border-white/20"
                      style={{ backgroundColor: getCategoryColor(featuredPost.category) }}
                    >
                      {featuredPost.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white text-xl font-bold mb-2 line-clamp-2">
                      <Link 
                        to={`/blog/post/${featuredPost.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <p className="text-white/90 text-sm line-clamp-2 mb-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white/80 text-xs">
                        <span>{featuredPost.author}</span>
                        <span>•</span>
                        <span>{formatDate(featuredPost.publishedAt)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{featuredPost.readTime}m</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                          <Share2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Medium Articles */}
              <div className="space-y-6">
                {mediumPosts.map((post) => (
                  <Card key={post.id} className="group overflow-hidden border-border hover:shadow-md transition-all duration-300">
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div className="col-span-1">
                        <div className="aspect-[4/3] overflow-hidden rounded-lg">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: `${getCategoryColor(post.category)}20`, color: getCategoryColor(post.category) }}
                        >
                          {post.category}
                        </Badge>
                        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          <Link to={`/blog/post/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Small Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {smallPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden border-border hover:shadow-md transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{ backgroundColor: `${getCategoryColor(post.category)}20`, color: getCategoryColor(post.category) }}
                    >
                      {post.category}
                    </Badge>
                    <h4 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      <Link to={`/blog/post/${post.id}`}>
                        {post.title}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}m</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Topics */}
            <Card className="p-6 border-border">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">TRENDING NOW</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <Badge
                    key={category.name}
                    variant="outline"
                    className="text-xs hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Latest Updates */}
            <Card className="p-6 border-border">
              <h3 className="font-bold text-foreground mb-4">LATEST UPDATES</h3>
              <div className="space-y-4">
                {sidebarPosts.map((post, index) => (
                  <div key={post.id} className="group">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          <Link to={`/blog/post/${post.id}`}>
                            {post.title}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < sidebarPosts.length - 1 && (
                      <div className="border-b border-border mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Popular Categories */}
            <Card className="p-6 border-border">
              <h3 className="font-bold text-foreground mb-4">POPULAR CATEGORIES</h3>
              <div className="space-y-3">
                {categories.slice(0, 8).map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-foreground hover:text-primary cursor-pointer transition-colors">
                        {category.name}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.floor(Math.random() * 50) + 10}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Stay Updated with Breaking News
          </h3>
          <p className="text-muted-foreground mb-6">
            Get the latest stories and updates delivered directly to your inbox
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            />
            <Button className="px-6">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MSNStyleHomepage;