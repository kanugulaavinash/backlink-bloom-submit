
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const SamplePostsCarousel = () => {
  const samplePosts = [
    {
      id: 1,
      title: "The Future of AI in Content Marketing",
      excerpt: "Discover how artificial intelligence is reshaping the content marketing landscape and what it means for businesses.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Building Sustainable Health Habits That Last",
      excerpt: "Learn proven strategies for creating health habits that stick and transform your lifestyle for the better.",
      author: "Dr. Michael Chen",
      date: "2024-01-12",
      category: "Health",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Remote Work: The Ultimate Guide to Productivity",
      excerpt: "Master the art of remote work with these essential tips and tools for staying productive from anywhere.",
      author: "Emma Williams",
      date: "2024-01-10",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop",
      readTime: "6 min read"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Published Posts</h2>
          <p className="text-xl text-gray-600">See what our community of writers has been sharing</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {samplePosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700">
                  {post.category}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600 font-medium">{post.readTime}</span>
                  <Link 
                    to={`/post/${post.id}`}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Read More
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SamplePostsCarousel;
