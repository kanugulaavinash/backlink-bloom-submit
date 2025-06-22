
import { useParams, Link } from "react-router-dom";
import { getPostsByCategory, getPostsBySubCategory } from "@/data/blogPosts";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { format } from "date-fns";

const BlogCategory = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  
  const posts = subcategory 
    ? getPostsBySubCategory(category || '', subcategory)
    : getPostsByCategory(category || '');

  const displayTitle = subcategory 
    ? `${category?.replace(/-/g, ' ')} - ${subcategory.replace(/-/g, ' ')}`
    : category?.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 capitalize">{displayTitle}</h1>
            <p className="text-xl opacity-90">
              {posts.length} article{posts.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No posts found</h2>
              <p className="text-gray-600 mb-8">There are no posts in this category yet.</p>
              <Link to="/blog">
                <Button>Browse All Posts</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      {post.subCategory && (
                        <Badge variant="outline">{post.subCategory}</Badge>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime} min</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(post.publishedAt), 'MMM d')}</span>
                      </div>
                    </div>
                    
                    <Link to={`/blog/post/${post.id}`}>
                      <Button variant="outline" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCategory;
