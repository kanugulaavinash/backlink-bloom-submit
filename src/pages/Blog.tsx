import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ModernHeroSection from "@/components/blog/ModernHeroSection";
import ModernCategorySection from "@/components/blog/ModernCategorySection";
import { 
  searchAllPosts, 
  getLatestPosts, 
  getDynamicCategories,
  BlogPost 
} from "@/data/blogPosts";
import SEO from "@/components/SEO";
import { usePagePerformance, useAnalytics } from "@/hooks/useAnalytics";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const Blog = () => {
  const [heroContent, setHeroContent] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Add analytics and performance tracking
  usePagePerformance('Blog');
  const { trackSearch } = useAnalytics();

  // Category colors for modern design
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

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      console.log('Loading initial blog data...');
      
      const [latest, dynamicCategories] = await Promise.all([
        getLatestPosts(8),
        getDynamicCategories()
      ]);
      
      console.log('Initial data loaded:', {
        heroContent: latest.length,
        categories: dynamicCategories.length
      });
      
      setHeroContent(latest);
      setCategories(dynamicCategories);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await searchAllPosts(searchQuery);
      setSearchResults(results);
      trackSearch(searchQuery);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setIsSearching(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-muted-foreground">Loading blog content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Blog - Latest Articles & Guest Posts | Backlink Bloom"
        description="Discover the latest high-quality articles and guest posts on technology, business, marketing, and more. Expert insights and trending topics from our community of writers."
        url="/blog"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Backlink Bloom Blog",
          "description": "High-quality articles and guest posts on various topics",
          "url": "https://backlinkbloom.com/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Backlink Bloom",
            "logo": {
              "@type": "ImageObject",
              "url": "https://backlinkbloom.com/logo.png"
            }
          }
        }}
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Modern Hero Section */}
        <ModernHeroSection 
          posts={heroContent} 
          categories={categories.map(cat => ({
            name: cat.name,
            color: categoryColors[cat.name] || '#DC2626'
          }))} 
        />

        {/* Search Results Section */}
        {searchQuery && (
          <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <Search className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Search Results for "{searchQuery}"
                </h2>
                {!isSearching && (
                  <span className="text-muted-foreground">
                    ({searchResults.length} found)
                  </span>
                )}
              </div>
              
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((post) => (
                    <div key={post.id} className="bg-background p-6 rounded-lg border border-border shadow-sm">
                      <h3 className="font-bold text-foreground mb-2 line-clamp-2">
                        <Link to={`/blog/post/${post.id}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>{post.readTime}m read</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found matching your search.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Modern Category Sections */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Search Bar */}
            <div className="mb-16">
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-base bg-background border-2 border-border rounded-xl focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Category Sections */}
            {!searchQuery && (
              <>
                <ModernCategorySection 
                  categoryName="Lifestyle" 
                  categoryColor="#EC4899"
                  displayName="LIFESTYLE UPDATES"
                  layoutType="mixed"
                  maxPosts={4}
                />
                
                <ModernCategorySection 
                  categoryName="Entertainment" 
                  categoryColor="#8B5CF6"
                  displayName="ENTERTAINMENT UPDATES"
                  layoutType="mixed"
                  maxPosts={4}
                />
                
                <ModernCategorySection 
                  categoryName="Technology" 
                  categoryColor="#3B82F6"
                  displayName="TECH UPDATES"
                  layoutType="grid"
                  maxPosts={6}
                />
                
                <ModernCategorySection 
                  categoryName="Business" 
                  categoryColor="#10B981"
                  displayName="BUSINESS UPDATES"
                  layoutType="grid"
                  maxPosts={6}
                />
                
                <ModernCategorySection 
                  categoryName="Health" 
                  categoryColor="#10B981"
                  displayName="HEALTH & WELLNESS"
                  layoutType="grid"
                  maxPosts={6}
                />
              </>
            )}
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Stay Updated with Our Latest Content
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get the latest articles, insights, and trends delivered straight to your inbox. 
              Join thousands of readers who trust our content.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1"
              />
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;