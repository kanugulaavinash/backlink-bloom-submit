import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Check, X, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ValidationQueueItem {
  id: string;
  title: string;
  author_name: string;
  validation_status: string;
  plagiarism_score?: number;
  ai_content_score?: number;
  created_at: string;
  user_id: string;
}

const RealValidationQueue = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<ValidationQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFlaggedPosts();
  }, []);

  const fetchFlaggedPosts = async () => {
    try {
      // Get posts that failed validation or have high scores
      const { data, error } = await supabase
        .from('guest_posts')
        .select(`
          id,
          title,
          author_name,
          validation_status,
          created_at,
          user_id,
          validation_results (
            plagiarism_score,
            ai_content_score
          )
        `)
        .in('validation_status', ['failed', 'flagged', 'needs_review'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching flagged posts:', error);
        setFlaggedPosts([]);
      } else {
        const formattedPosts = data?.map(post => ({
          id: post.id,
          title: post.title,
          author_name: post.author_name,
          validation_status: post.validation_status,
          plagiarism_score: post.validation_results?.[0]?.plagiarism_score,
          ai_content_score: post.validation_results?.[0]?.ai_content_score,
          created_at: post.created_at,
          user_id: post.user_id
        })) || [];
        setFlaggedPosts(formattedPosts);
      }
    } catch (error) {
      console.error('Error fetching flagged posts:', error);
      setFlaggedPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getIssueDescription = (post: ValidationQueueItem) => {
    const issues = [];
    if (post.plagiarism_score && post.plagiarism_score > 20) {
      issues.push(`High plagiarism (${post.plagiarism_score.toFixed(1)}%)`);
    }
    if (post.ai_content_score && post.ai_content_score > 30) {
      issues.push(`AI content detected (${post.ai_content_score.toFixed(1)}%)`);
    }
    return issues.length > 0 ? issues.join(', ') : 'Validation failed';
  };

  const getSeverityLevel = (post: ValidationQueueItem) => {
    const plagiarismHigh = (post.plagiarism_score || 0) > 50;
    const aiContentHigh = (post.ai_content_score || 0) > 70;
    
    if (plagiarismHigh || aiContentHigh) return 'high';
    if ((post.plagiarism_score || 0) > 20 || (post.ai_content_score || 0) > 30) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const updatePostStatus = async (postId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('guest_posts')
        .update({ validation_status: newStatus })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post ${newStatus} successfully`,
      });

      fetchFlaggedPosts(); // Refresh the list
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading validation queue...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Validation Queue ({flaggedPosts.length})
        </CardTitle>
        <CardDescription>Posts flagged for manual review due to validation issues</CardDescription>
      </CardHeader>
      
      <CardContent>
        {flaggedPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No posts in validation queue
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flaggedPosts.map((post) => {
                const severity = getSeverityLevel(post);
                return (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{post.title}</div>
                    </TableCell>
                    <TableCell>{post.author_name}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{getIssueDescription(post)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(severity)}>
                        {severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/blog-post/${post.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600"
                          onClick={() => updatePostStatus(post.id, 'approved')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => updatePostStatus(post.id, 'rejected')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RealValidationQueue;