
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Check, X, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ValidationQueue = () => {
  const { toast } = useToast();

  const { data: flaggedPosts = [], isLoading, refetch } = useQuery({
    queryKey: ["validation-queue"],
    queryFn: async () => {
      // Get posts that need validation or have failed validation
      const { data: posts, error } = await supabase
        .from("guest_posts")
        .select(`
          id,
          title,
          author_name,
          status,
          validation_status,
          created_at,
          user_id,
          validation_results (
            plagiarism_score,
            ai_content_score,
            validation_status
          )
        `)
        .in("validation_status", ["failed", "needs_review", "flagged"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to match UI expectations
      return posts?.map(post => {
        const validationResult = post.validation_results?.[0];
        let issue = "Validation pending";
        let severity = "medium";
        let type = "validation";

        if (validationResult) {
          const plagiarismScore = validationResult.plagiarism_score || 0;
          const aiScore = validationResult.ai_content_score || 0;

          if (plagiarismScore > 20) {
            issue = `High plagiarism score (${plagiarismScore}%)`;
            severity = "high";
            type = "plagiarism_check";
          } else if (aiScore > 25) {
            issue = `High AI content score (${aiScore}%)`;
            severity = "high";
            type = "ai_detection";
          } else if (plagiarismScore > 10 || aiScore > 15) {
            issue = `Moderate validation concerns`;
            severity = "medium";
            type = "content_validation";
          } else {
            issue = "Manual review required";
            severity = "low";
          }
        }

        return {
          id: post.id,
          title: post.title,
          author: post.author_name,
          issue,
          type,
          severity,
          submittedDate: new Date(post.created_at).toLocaleDateString(),
          status: post.status,
          validationStatus: post.validation_status
        };
      }) || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleApprove = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("guest_posts")
        .update({ 
          status: "approved",
          validation_status: "passed"
        })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Post approved",
        description: "The post has been approved and published.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("guest_posts")
        .update({ 
          status: "rejected",
          validation_status: "failed"
        })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Post rejected",
        description: "The post has been rejected.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Validation Queue
        </CardTitle>
        <CardDescription>Posts flagged for manual review due to validation issues</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : flaggedPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No posts require validation review</p>
                </TableCell>
              </TableRow>
            ) : (
              flaggedPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate">{post.title}</div>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.issue}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {post.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(post.severity)}>
                      {post.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.submittedDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(post.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleReject(post.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ValidationQueue;
