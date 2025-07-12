
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

interface UnifiedPost {
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
  source: 'guest' | 'imported';
  categories?: string[];
  published_date?: string;
  wordpress_url?: string;
}

const PostsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Fetch guest posts
      let guestQuery = supabase.from("guest_posts").select("*");
      if (sourceFilter === "all" || sourceFilter === "guest") {
        if (statusFilter !== "all") {
          guestQuery = guestQuery.eq("status", statusFilter);
        }
        if (searchTerm) {
          guestQuery = guestQuery.or(`title.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
        }
      }

      // Fetch imported posts
      let importedQuery = supabase.from("imported_posts").select("*");
      if (sourceFilter === "all" || sourceFilter === "imported") {
        if (statusFilter !== "all") {
          importedQuery = importedQuery.eq("status", statusFilter);
        }
        if (searchTerm) {
          importedQuery = importedQuery.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
        }
      }

      const promises = [];
      if (sourceFilter === "all" || sourceFilter === "guest") {
        promises.push(guestQuery.order("created_at", { ascending: false }));
      }
      if (sourceFilter === "all" || sourceFilter === "imported") {
        promises.push(importedQuery.order("created_at", { ascending: false }));
      }

      const results = await Promise.all(promises);
      
      let allPosts: UnifiedPost[] = [];
      
      // Process guest posts
      if (sourceFilter === "all" || sourceFilter === "guest") {
        const guestData = results[sourceFilter === "guest" ? 0 : 0];
        if (guestData.data) {
          const guestPosts = guestData.data.map((post: any) => ({
            ...post,
            source: 'guest' as const,
          }));
          allPosts = [...allPosts, ...guestPosts];
        }
      }

      // Process imported posts
      if (sourceFilter === "all" || sourceFilter === "imported") {
        const importedIndex = sourceFilter === "imported" ? 0 : sourceFilter === "all" ? 1 : 0;
        const importedData = results[importedIndex];
        if (importedData.data) {
          const importedPosts = importedData.data.map((post: any) => ({
            ...post,
            source: 'imported' as const,
            author_name: 'Imported Author',
            category: post.categories?.[0] || 'Uncategorized',
            content: post.content || '',
          }));
          allPosts = [...allPosts, ...importedPosts];
        }
      }

      // Sort all posts by created_at
      allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setPosts(allPosts);
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
  }, [searchTerm, statusFilter, sourceFilter]);

  const handleStatusUpdate = async (postId: string, newStatus: string, source: 'guest' | 'imported') => {
    try {
      setActionLoading(postId);
      const tableName = source === 'guest' ? 'guest_posts' : 'imported_posts';
      const { error } = await supabase
        .from(tableName)
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

  const handleDelete = async (postId: string, source: 'guest' | 'imported') => {
    try {
      setActionLoading(postId);
      const tableName = source === 'guest' ? 'guest_posts' : 'imported_posts';
      const { error } = await supabase
        .from(tableName)
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
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "imported": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceBadgeColor = (source: 'guest' | 'imported') => {
    return source === 'imported' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700 border-gray-200";
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
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="guest">Guest Posts</SelectItem>
                <SelectItem value="imported">Imported</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="imported">Imported</SelectItem>
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
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Words</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={`${post.source}-${post.id}`}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{post.title}</div>
                      {post.excerpt && (
                        <div className="text-sm text-muted-foreground truncate mt-1">
                          {post.excerpt}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{post.author_name}</TableCell>
                    <TableCell>
                      {post.source === 'imported' && post.categories?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {post.categories.slice(0, 2).map((cat, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                          {post.categories.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        post.category
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSourceBadgeColor(post.source)}>
                        {post.source === 'imported' ? 'Imported' : 'Guest'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.source === 'imported' && post.published_date 
                        ? new Date(post.published_date).toLocaleDateString()
                        : new Date(post.created_at).toLocaleDateString()
                      }
                    </TableCell>
                    <TableCell>{getWordCount(post.content || '')}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const basePath = post.source === 'imported' ? '/admin/imported-posts' : '/admin/posts';
                                navigate(`${basePath}/view/${post.id}`);
                              }}
                              disabled={actionLoading === post.id}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Post</p>
                          </TooltipContent>
                        </Tooltip>

                        {post.source === 'guest' && post.status === "pending" && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => handleStatusUpdate(post.id, "approved", post.source)}
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
                                  onClick={() => handleStatusUpdate(post.id, "rejected", post.source)}
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
                              onClick={() => {
                                const basePath = post.source === 'imported' ? '/admin/imported-posts' : '/admin/posts';
                                navigate(`${basePath}/edit/${post.id}`);
                              }}
                              disabled={actionLoading === post.id}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Post</p>
                          </TooltipContent>
                        </Tooltip>

                        {post.source === 'imported' && post.wordpress_url && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(post.wordpress_url, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Original</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

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
                                onClick={() => handleDelete(post.id, post.source)}
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
