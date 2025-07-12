import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ImportedPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  status: string;
  published_date: string;
  wordpress_id: string;
  wordpress_url: string;
  created_at: string;
  featured_image_url: string;
}

const ImportedPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<ImportedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('imported_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Error",
        description: "Failed to fetch post details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'imported':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Post not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin-dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/admin/imported-posts/edit/${post.id}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Post
          </Button>
          {post.wordpress_url && (
            <Button variant="outline" asChild>
              <a href={post.wordpress_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Original
              </a>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold mb-4">{post.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getStatusColor(post.status)}>
                  {post.status}
                </Badge>
                {post.categories?.map((category, idx) => (
                  <Badge key={idx} variant="outline">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {post.featured_image_url && (
            <div className="mt-4">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
            <div>
              <strong>Published Date:</strong> {
                post.published_date ? 
                format(new Date(post.published_date), 'MMM d, yyyy') : 
                'Not set'
              }
            </div>
            <div>
              <strong>Import Date:</strong> {format(new Date(post.created_at), 'MMM d, yyyy')}
            </div>
            <div>
              <strong>WordPress ID:</strong> {post.wordpress_id || 'N/A'}
            </div>
            <div>
              <strong>Status:</strong> {post.status}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {post.excerpt && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Excerpt</h3>
              <p className="text-gray-700 italic">{post.excerpt}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Content</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportedPostView;