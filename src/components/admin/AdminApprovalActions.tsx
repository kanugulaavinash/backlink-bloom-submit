import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, X, MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminApprovalActionsProps {
  postId: string;
  currentStatus: string;
  onStatusUpdate: () => void;
}

export const AdminApprovalActions: React.FC<AdminApprovalActionsProps> = ({
  postId,
  currentStatus,
  onStatusUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const { toast } = useToast();

  const updatePostStatus = async (newStatus: string, rejectionReason?: string) => {
    setLoading(true);
    try {
      const updateData: any = {
        status: newStatus,
        validation_status: newStatus === 'published' ? 'passed' : 
                          newStatus === 'rejected' ? 'failed' : 'pending',
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('guest_posts')
        .update(updateData)
        .eq('id', postId);

      if (error) throw error;

      // Update validation results if rejecting
      if (newStatus === 'rejected' && rejectionReason) {
        await supabase
          .from('validation_results')
          .upsert({
            post_id: postId,
            validation_status: 'failed',
            updated_at: new Date().toISOString()
          });
      }

      toast({
        title: "Success",
        description: `Post ${newStatus === 'published' ? 'approved and published' : 
                     newStatus === 'rejected' ? 'rejected' : 'updated'} successfully`,
      });

      onStatusUpdate();
      setShowRejectDialog(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    updatePostStatus('published');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Error", 
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    updatePostStatus('rejected', rejectReason);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (currentStatus === 'published') {
    return (
      <div className="flex items-center gap-2">
        {getStatusBadge(currentStatus)}
        <span className="text-sm text-green-600">✓ Approved</span>
      </div>
    );
  }

  if (currentStatus === 'rejected') {
    return (
      <div className="flex items-center gap-2">
        {getStatusBadge(currentStatus)}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => updatePostStatus('pending')}
          disabled={loading}
        >
          Reconsider
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge(currentStatus)}
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleApprove}
        disabled={loading}
        className="text-green-600 hover:text-green-700"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Approve
      </Button>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Post</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this post. This will help the author understand what needs to be improved.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
              disabled={loading || !rejectReason.trim()}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
              Reject Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovalActions;