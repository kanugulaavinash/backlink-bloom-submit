import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Check, X, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

interface GuestPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_name: string;
  author_bio?: string;
  author_website?: string;
  category: string;
  tags?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

const GuestPostView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<GuestPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("guest_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to fetch post details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!post) return;

    try {
      setActionLoading(true);
      const { error } = await supabase
        .from("guest_posts")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", post.id);

      if (error) throw error;

      setPost({ ...post, status: newStatus });
      toast({
        title: "Success",
        description: `Post ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post status.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-muted rounded mb-6"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
            
            <div className="flex items-center gap-2">
              {post.status === "pending" && (
                <>
                  <Button
                    onClick={() => handleStatusUpdate("approved")}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("rejected")}
                    disabled={actionLoading}
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              <Button
                onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                variant="outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Post Content */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>By {post.author_name}</span>
                    <span>•</span>
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(post.status)}>
                  {post.status}
                </Badge>
              </div>
              
              {post.excerpt && (
                <p className="text-muted-foreground mt-4">{post.excerpt}</p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Author Information */}
              <div>
                <h3 className="font-semibold mb-2">Author Information</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium">{post.author_name}</p>
                  {post.author_bio && (
                    <p className="text-sm text-muted-foreground mt-1">{post.author_bio}</p>
                  )}
                  {post.author_website && (
                    <a
                      href={post.author_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {post.author_website}
                    </a>
                  )}
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Content */}
              <div>
                <h3 className="font-semibold mb-4">Content</h3>
                <div 
                  className="prose prose-gray dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Metadata */}
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>Created: {new Date(post.created_at).toLocaleString()}</p>
                <p>Last updated: {new Date(post.updated_at).toLocaleString()}</p>
                <p>Word count: {post.content.split(/\s+/).length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuestPostView;