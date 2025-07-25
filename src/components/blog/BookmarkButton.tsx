import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/use-toast'

interface BookmarkButtonProps {
  postId: string
  postType?: 'blog' | 'guest_post' | 'imported_post'
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'default' | 'lg'
}

export function BookmarkButton({ 
  postId, 
  postType = 'blog', 
  variant = 'ghost',
  size = 'sm' 
}: BookmarkButtonProps) {
  const { user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      checkBookmarkStatus()
    }
  }, [user, postId])

  const checkBookmarkStatus = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .eq('post_type', postType)
        .single()

      setIsBookmarked(!!data)
    } catch (error) {
      // No bookmark found, which is fine
      setIsBookmarked(false)
    }
  }

  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to bookmark articles',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId)
          .eq('post_type', postType)

        if (error) throw error

        setIsBookmarked(false)
        toast({
          title: 'Bookmark removed',
          description: 'Article removed from your reading list',
        })
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            post_id: postId,
            post_type: postType,
          })

        if (error) throw error

        setIsBookmarked(true)
        toast({
          title: 'Bookmarked!',
          description: 'Article saved to your reading list',
        })
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleBookmark}
      disabled={loading}
      className="gap-2"
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-4 h-4 text-primary" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  )
}