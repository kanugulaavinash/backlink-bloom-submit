import { useState, useEffect } from 'react'
import { MessageCircle, Reply, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Comment {
  id: string
  content: string
  user_id: string
  parent_id: string | null
  created_at: string
  updated_at: string
  is_approved: boolean | null
  is_deleted: boolean | null
  post_id: string
  profiles: {
    full_name: string | null
    email: string
    avatar_url: string | null
  } | null
  replies?: Comment[]
}

interface CommentsSystemProps {
  postId: string
}

export function CommentsSystem({ postId }: CommentsSystemProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .eq('is_approved', true)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Organize comments into threaded structure
      const commentMap = new Map()
      const rootComments: Comment[] = []

      // Add replies array and ensure proper typing
      const commentsWithReplies = (data || []).map(comment => ({
        ...comment,
        replies: [] as Comment[]
      }))

      commentsWithReplies.forEach((comment) => {
        commentMap.set(comment.id, comment)
      })

      commentsWithReplies.forEach((comment) => {
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id)
          if (parent) {
            parent.replies.push(comment)
          }
        } else {
          rootComments.push(comment)
        }
      })

      setComments(rootComments)
    } catch (error) {
      console.error('Error loading comments:', error)
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const submitComment = async (content: string, parentId: string | null = null) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to leave a comment',
        variant: 'destructive',
      })
      return
    }

    if (!content.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
        parent_id: parentId,
      })

      if (error) throw error

      toast({
        title: 'Comment submitted',
        description: 'Your comment is pending approval',
      })

      // Clear forms
      if (parentId) {
        setReplyContent('')
        setReplyTo(null)
      } else {
        setNewComment('')
      }

      // Reload comments to show updated count
      loadComments()
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit comment',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getUserInitials = (name: string | null, email: string | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email?.substring(0, 2).toUpperCase() || 'U'
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex gap-3 ${isReply ? 'ml-12 mt-4' : 'mb-6'}`}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.profiles?.avatar_url || ''} />
        <AvatarFallback className="text-xs">
          {getUserInitials(comment.profiles?.full_name, comment.profiles?.email)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {comment.profiles?.full_name || comment.profiles?.email?.split('@')[0] || 'Anonymous'}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(comment.created_at), 'MMM d, yyyy')}
          </span>
        </div>
        
        <p className="text-sm text-foreground leading-relaxed">
          {comment.content}
        </p>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setReplyTo(comment.id)}
          >
            <Reply className="w-3 h-3 mr-1" />
            Reply
          </Button>
        </div>

        {/* Reply Form */}
        {replyTo === comment.id && (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => submitComment(replyContent, comment.id)}
                disabled={!replyContent.trim() || submitting}
              >
                {submitting ? 'Submitting...' : 'Reply'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setReplyTo(null)
                  setReplyContent('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Comments</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-16 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">
          Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
        </h3>
      </div>

      {/* New Comment Form */}
      {user ? (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.user_metadata?.avatar_url || ''} />
              <AvatarFallback className="text-xs">
                {getUserInitials(user.user_metadata?.full_name, user.email || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => submitComment(newComment)}
              disabled={!newComment.trim() || submitting}
            >
              {submitting ? 'Submitting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 border rounded-lg bg-muted/50 text-center">
          <p className="text-muted-foreground">
            Please sign in to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  )
}