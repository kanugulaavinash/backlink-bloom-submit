
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Search, User, Calendar, TrendingUp, Star, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { 
  getAllPosts, 
  getAllPostsByCategory, 
  searchAllPosts, 
  getLatestPosts, 
  getDynamicCategories,
  BlogPost 
} from "@/data/blogPosts";
import { format } from "date-fns";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const Blog = () => {
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const postsPerPage = 9;

  // Fallback categories with emojis for display
  const categoryIcons: Record<string, string> = {
    'Technology': '🚀',
    'Business': '💼',
    'Marketing': '📈',
    'Design': '🎨',
    'Development': '💻',
    'Lifestyle': '✨',
    'Health': '💚',
    'Travel': '✈️',
    'Food': '🍳',
    'Fashion': '👗',
    'Sports': '⚽',
    'Entertainment': '🎬',
    'Education': '📚',
    'Finance': '💰',
    'Science': '🔬',
    'Politics': '🏛️',
    'Art': '🖼️',
    'Music': '🎵',
    'Photography': '📸',
    'Gaming': '🎮'
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      loadPosts();
    }
  }, [selectedCategory, searchQuery, initialLoading]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      console.log('Loading initial blog data...');
      
      const [allPosts, latest, dynamicCategories] = await Promise.all([
        getAllPosts(),
        getLatestPosts(4),
        getDynamicCategories()
      ]);
      
      console.log('Initial data loaded:', {
        totalPosts: allPosts.length,
        latestPosts: latest.length,
        categories: dynamicCategories.length
      });
      
      setDisplayedPosts(allPosts.slice(0, postsPerPage));
      setLatestPosts(latest);
      setCategories(dynamicCategories);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      let posts: BlogPost[] = [];
      
      if (searchQuery) {
        posts = await searchAllPosts(searchQuery);
      } else if (selectedCategory && selectedCategory !== "All") {
        posts = await getAllPostsByCategory(selectedCategory);
      } else {
        posts = await getAllPosts();
      }
      
      setDisplayedPosts(posts.slice(0, postsPerPage));
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadMorePosts = async () => {
    try {
      setLoading(true);
      let posts: BlogPost[] = [];
      
      if (searchQuery) {
        posts = await searchAllPosts(searchQuery);
      } else if (selectedCategory && selectedCategory !== "All") {
        posts = await getAllPostsByCategory(selectedCategory);
      } else {
        posts = await getAllPosts();
      }
      
      const nextPosts = posts.slice(0, (currentPage + 1) * postsPerPage);
      setDisplayedPosts(nextPosts);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasMorePosts = async () => {
    try {
      let totalPosts = 0;
      
      if (searchQuery) {
        const posts = await searchAllPosts(searchQuery);
        totalPosts = posts.length;
      } else if (selectedCategory && selectedCategory !== "All") {
        const posts = await getAllPostsByCategory(selectedCategory);
        totalPosts = posts.length;
      } else {
        const posts = await getAllPosts();
        totalPosts = posts.length;
      }
      
      return displayedPosts.length < totalPosts;
    } catch (error) {
      console.error('Error checking more posts:', error);
      return false;
    }
  };

  const getCategoryCount = async (categoryName: string) => {
    const posts = await getAllPostsByCategory(categoryName);
    return posts.length;
  };

  const getPostTypeColor = (postType?: string) => {
    switch (postType) {
      case 'guest': return 'bg-green-500';
      case 'imported': return 'bg-blue-500';
      case 'static': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPostTypeLabel = (postType?: string) => {
    switch (postType) {
      case 'guest': return 'Guest Post';
      case 'imported': return 'Imported';
      case 'static': return 'Featured';
      default: return 'Post';
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Trending Stories & Insights</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            Discover
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Amazing Stories
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Explore our curated collection of insightful articles, expert opinions, and trending topics from writers around the world.
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-blue-500 transition-colors" />
            <Input
              type="text"
              placeholder="Search for articles, topics, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 pr-6 py-8 text-lg bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder-gray-500 rounded-2xl shadow-2xl focus:shadow-3xl transition-all duration-300 focus:ring-4 focus:ring-white/30"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Pills */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Browse by Category
              </h2>
              <div className="flex flex-wrap gap-3">
                {/* All Category */}
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className={`h-12 px-6 rounded-xl font-medium transition-all duration-300 ${
                    !selectedCategory
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "hover:bg-gray-50 border-2 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2 text-lg">🌟</span>
                  All
                </Button>
                
                {/* Dynamic Categories */}
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`h-12 px-6 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category.name
                        ? `text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                        : "hover:bg-gray-50 border-2 hover:border-gray-300"
                    }`}
                    style={
                      selectedCategory === category.name
                        ? { background: `linear-gradient(to right, ${category.color}, ${category.color}dd)` }
                        : {}
                    }
                  >
                    <span className="mr-2 text-lg">
                      {categoryIcons[category.name] || '📝'}
                    </span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Featured Posts Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500" />
                Featured Articles
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPosts.map((post, index) => (
                  <Card key={post.id} className={`overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group border-0 shadow-lg ${
                    index === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''
                  }`}>
                    <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[16/10]' : 'aspect-video'}`}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                        <Badge 
                          className="text-white border-0 px-3 py-1 font-medium"
                          style={{ backgroundColor: categories.find(c => c.name === post.category)?.color || '#3B82F6' }}
                        >
                          {post.category}
                        </Badge>
                        {post.subCategory && (
                          <Badge variant="secondary" className="bg-white/90 text-gray-800 border-0 px-3 py-1">
                            {post.subCategory}
                          </Badge>
                        )}
                        <Badge className={`${getPostTypeColor(post.postType)} text-white border-0 px-3 py-1 text-xs`}>
                          {getPostTypeLabel(post.postType)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <Link to={`/blog/post/${post.id}`}>
                          <h3 className={`font-bold text-white mb-2 line-clamp-2 hover:text-blue-200 transition-colors ${
                            index === 0 ? 'text-2xl' : 'text-lg'
                          }`}>
                            {post.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views || Math.floor(Math.random() * 1000 + 100)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index !== 0 && (
                      <CardContent className="p-6">
                        <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                          </div>
                          <Link to={`/blog/post/${post.id}`}>
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2">
                              Read More →
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Load More Button */}
            <div className="text-center">
              <Button
                onClick={loadMorePosts}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {loading ? "Loading..." : "Load More Articles"}
              </Button>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {/* Latest Posts */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                    Latest Posts
                  </h3>
                  <div className="space-y-6">
                    {latestPosts.map((post) => (
                      <div key={post.id} className="group">
                        <Link to={`/blog/post/${post.id}`} className="block">
                          <div className="flex gap-4">
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-16 h-16 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {post.title}
                                </h4>
                                <Badge className={`${getPostTypeColor(post.postType)} text-white text-xs px-1 py-0`}>
                                  {post.postType === 'guest' ? 'NEW' : getPostTypeLabel(post.postType)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span>{post.author}</span>
                                <span>•</span>
                                <span>{format(new Date(post.publishedAt), 'MMM d')}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Stats */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    Categories
                  </h3>
                  <div className="space-y-4">
                    {categories.slice(0, 8).map((category) => (
                      <CategoryItem
                        key={category.id}
                        category={category}
                        icon={categoryIcons[category.name] || '📝'}
                        onSelect={() => setSelectedCategory(category.name)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Get the latest articles and insights delivered to your inbox.
                  </p>
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Item Component
const CategoryItem = ({ 
  category, 
  icon, 
  onSelect 
}: { 
  category: Category; 
  icon: string; 
  onSelect: () => void; 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      const posts = await getAllPostsByCategory(category.name);
      setCount(posts.length);
    };
    loadCount();
  }, [category.name]);

  return (
    <button
      onClick={onSelect}
      className="flex items-center justify-between w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-md group-hover:shadow-lg transition-shadow"
          style={{ backgroundColor: category.color }}
        >
          {icon}
        </div>
        <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {category.name}
        </span>
      </div>
      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1">
        {count}
      </Badge>
    </button>
  );
};

export default Blog;
