import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Eye, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ContentValidationResults } from "@/components/ContentValidationResults";
import { AdminApprovalActions } from "./AdminApprovalActions";

interface ValidationQueueItem {
  id: string;
  title: string;
  content: string;
  author_name: string;
  validation_status: string;
  status: string;
  plagiarism_score?: number;
  ai_content_score?: number;
  created_at: string;
  user_id: string;
}

const RealValidationQueue = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<ValidationQueueItem[]>([]);
  const [pendingPosts, setPendingPosts] = useState<ValidationQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedValidation, setSelectedValidation] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFlaggedPosts();
    fetchPendingPosts();
  }, []);

  const fetchFlaggedPosts = async () => {
    try {
      // Get posts that failed validation or have high scores
      const { data, error } = await supabase
        .from('guest_posts')
        .select(`
          id,
          title,
          content,
          author_name,
          validation_status,
          status,
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
          content: post.content,
          author_name: post.author_name,
          validation_status: post.validation_status,
          status: post.status,
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

  const fetchPendingPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('guest_posts')
        .select(`
          id,
          title,
          content,
          author_name,
          validation_status,
          status,
          created_at,
          user_id,
          validation_results (
            plagiarism_score,
            ai_content_score
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPosts = data?.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author_name: post.author_name,
        validation_status: post.validation_status,
        status: post.status,
        plagiarism_score: post.validation_results?.[0]?.plagiarism_score,
        ai_content_score: post.validation_results?.[0]?.ai_content_score,
        created_at: post.created_at,
        user_id: post.user_id
      })) || [];
      
      setPendingPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    }
  };

  const fetchValidationDetails = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('validation_results')
        .select('*')
        .eq('post_id', postId)
        .single();

      if (error) throw error;
      setSelectedValidation(data);
    } catch (error) {
      console.error('Error fetching validation details:', error);
      setSelectedValidation(null);
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

  const allPosts = [...flaggedPosts, ...pendingPosts];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Validation Queue ({allPosts.length})
        </CardTitle>
        <CardDescription>Posts requiring manual review and validation issues</CardDescription>
      </CardHeader>
      
      <CardContent>
        {allPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No posts in validation queue
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPosts.map((post) => {
                const severity = getSeverityLevel(post);
                return (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{post.title}</div>
                    </TableCell>
                    <TableCell>{post.author_name}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'pending' ? 'secondary' : 'outline'}>
                        {post.status}
                      </Badge>
                    </TableCell>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => fetchValidationDetails(post.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{post.title}</DialogTitle>
                              <DialogDescription>
                                Validation details and content review
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-6">
                              <ContentValidationResults
                                validationResult={selectedValidation}
                                isValidating={false}
                                onRetryValidation={() => {}}
                                content={post.content}
                              />
                              
                              <AdminApprovalActions
                                postId={post.id}
                                currentStatus={post.status}
                                onStatusUpdate={fetchPendingPosts}
                              />
                              
                              <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-2">Post Content</h4>
                                <div 
                                  className="prose max-w-none text-sm"
                                  dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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