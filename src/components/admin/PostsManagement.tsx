
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, Check, X, Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GuestPost {
  id: string;
  title: string;
  author_name: string;
  status: string;
  category: string;
  created_at: string;
  content: string;
  excerpt?: string;
  author_bio?: string;
  author_website?: string;
  tags?: string[];
}

const PostsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [posts, setPosts] = useState<GuestPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase.from("guest_posts").select("*");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, statusFilter]);

  const handleStatusUpdate = async (postId: string, newStatus: string) => {
    try {
      setActionLoading(postId);
      const { error } = await supabase
        .from("guest_posts")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post ${newStatus} successfully.`,
      });

      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post status.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      setActionLoading(postId);
      const { error } = await supabase
        .from("guest_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully.",
      });

      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getWordCount = (content: string) => {
    return content.split(/\s+/).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>Posts Management</CardTitle>
          
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No posts found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Words</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{post.title}</div>
                    </TableCell>
                    <TableCell>{post.author_name}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{getWordCount(post.content)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/admin/posts/view/${post.id}`)}
                              disabled={actionLoading === post.id}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Post</p>
                          </TooltipContent>
                        </Tooltip>

                        {post.status === "pending" && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => handleStatusUpdate(post.id, "approved")}
                                  disabled={actionLoading === post.id}
                                >
                                  {actionLoading === post.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Approve Post</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleStatusUpdate(post.id, "rejected")}
                                  disabled={actionLoading === post.id}
                                >
                                  {actionLoading === post.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Reject Post</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                              disabled={actionLoading === post.id}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Post</p>
                          </TooltipContent>
                        </Tooltip>

                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700"
                                  disabled={actionLoading === post.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Post</p>
                            </TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the post
                                "{post.title}" and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(post.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default PostsManagement;
