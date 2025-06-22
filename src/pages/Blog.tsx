
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { blogPosts, getLatestPosts, getPostsByCategory, getPostsBySearch, BlogPost } from "@/data/blogPosts";

const Blog = () => {
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const postsPerPage = 6;

  const categories = [
    "All",
    "Lifestyle",
    "Health", 
    "Entertainment",
    "Science & Technology",
    "News",
    "Sports",
    "Travel",
    "Videos"
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, searchQuery]);

  const loadPosts = () => {
    let posts = blogPosts;
    
    if (searchQuery) {
      posts = getPostsBySearch(searchQuery);
    } else if (selectedCategory && selectedCategory !== "All") {
      posts = getPostsByCategory(selectedCategory);
    }
    
    setDisplayedPosts(posts.slice(0, postsPerPage));
    setCurrentPage(1);
  };

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      let posts = blogPosts;
      
      if (searchQuery) {
        posts = getPostsBySearch(searchQuery);
      } else if (selectedCategory && selectedCategory !== "All") {
        posts = getPostsByCategory(selectedCategory);
      }
      
      const nextPosts = posts.slice(0, (currentPage + 1) * postsPerPage);
      setDisplayedPosts(nextPosts);
      setCurrentPage(prev => prev + 1);
      setLoading(false);
    }, 500);
  };

  const hasMorePosts = () => {
    let totalPosts = blogPosts.length;
    
    if (searchQuery) {
      totalPosts = getPostsBySearch(searchQuery).length;
    } else if (selectedCategory && selectedCategory !== "All") {
      totalPosts = getPostsByCategory(selectedCategory).length;
    }
    
    return displayedPosts.length < totalPosts;
  };

  const latestPosts = getLatestPosts(3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Banner */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Amazing Stories
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Explore our collection of insightful articles, expert opinions, and trending topics across various categories.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg bg-white/90 backdrop-blur-sm border-0 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category === "All" ? null : category)}
                  className="mb-2"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {displayedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      {post.subCategory && (
                        <Badge variant="outline">{post.subCategory}</Badge>
                      )}
                    </div>
                    
                    <Link to={`/blog/post/${post.id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasMorePosts() && (
              <div className="text-center">
                <Button
                  onClick={loadMorePosts}
                  disabled={loading}
                  size="lg"
                  className="px-8"
                >
                  {loading ? "Loading..." : "Load More Articles"}
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Latest Posts */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Latest Posts</h3>
                <div className="space-y-4">
                  {latestPosts.map((post) => (
                    <div key={post.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                      <Link to={`/blog/post/${post.id}`}>
                        <h4 className="font-medium hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Categories */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => {
                    const count = getPostsByCategory(category).length;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="flex items-center justify-between w-full text-left hover:text-blue-600 transition-colors"
                      >
                        <span>{category}</span>
                        <Badge variant="outline">{count}</Badge>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
