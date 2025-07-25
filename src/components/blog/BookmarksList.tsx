import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookmarkCheck, Trash2, Calendar, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { getPostById } from '@/data/blogPosts'

interface Bookmark {
  id: string
  post_id: string
  post_type: string // Changed from union type to string
  created_at: string
  post_data?: any
}

export function BookmarksList() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadBookmarks()
    }
  }, [user])

  const loadBookmarks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch post data for each bookmark
      const bookmarksWithData = await Promise.all(
        (data || []).map(async (bookmark: any) => {
          try {
            let postData = null
            
            if (bookmark.post_type === 'blog') {
              postData = await getPostById(bookmark.post_id)
            } else if (bookmark.post_type === 'guest_post') {
              const { data: guestPost } = await supabase
                .from('guest_posts')
                .select('*')
                .eq('id', bookmark.post_id)
                .single()
              postData = guestPost
            } else if (bookmark.post_type === 'imported_post') {
              const { data: importedPost } = await supabase
                .from('imported_posts')
                .select('*')
                .eq('id', bookmark.post_id)
                .single()
              postData = importedPost
            }

            return {
              ...bookmark,
              post_data: postData
            } as Bookmark
          } catch (error) {
            console.error('Error fetching post data:', error)
            return bookmark as Bookmark
          }
        })
      )

      setBookmarks(bookmarksWithData.filter(b => b.post_data)) // Filter out bookmarks with no post data
    } catch (error) {
      console.error('Error loading bookmarks:', error)
      toast({
        title: 'Error',
        description: 'Failed to load bookmarks',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId)

      if (error) throw error

      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId))
      toast({
        title: 'Bookmark removed',
        description: 'Article removed from your reading list',
      })
    } catch (error) {
      console.error('Error removing bookmark:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove bookmark',
        variant: 'destructive',
      })
    }
  }

  const getPostUrl = (bookmark: Bookmark) => {
    if (bookmark.post_type === 'blog') {
      return `/blog/post/${bookmark.post_id}`
    } else if (bookmark.post_type === 'guest_post') {
      return `/admin/posts/view/${bookmark.post_id}`
    } else if (bookmark.post_type === 'imported_post') {
      return `/admin/imported-posts/view/${bookmark.post_id}`
    }
    return '#'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <BookmarkCheck className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Your Reading List</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <BookmarkCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Sign in to view bookmarks</h3>
          <p className="text-muted-foreground text-sm">
            Create an account to save articles for later reading
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Your Reading List</h2>
          <Badge variant="secondary">{bookmarks.length}</Badge>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookmarkCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground text-sm">
              Start bookmarking articles to build your personal reading list
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <Link
                        to={getPostUrl(bookmark)}
                        className="hover:text-primary transition-colors"
                      >
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                          {bookmark.post_data?.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Saved {format(new Date(bookmark.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {bookmark.post_type === 'blog' ? 'Blog Post' : 
                           bookmark.post_type === 'guest_post' ? 'Guest Post' : 'Imported'}
                        </Badge>
                      </div>
                    </div>

                    {bookmark.post_data?.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {bookmark.post_data.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {bookmark.post_data?.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{bookmark.post_data.author}</span>
                        </div>
                      )}
                      {bookmark.post_data?.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{bookmark.post_data.readTime} min read</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}