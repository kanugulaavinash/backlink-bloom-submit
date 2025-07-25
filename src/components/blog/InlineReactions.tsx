import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

const REACTIONS = ['👍', '❤️', '😊', '🔥', '💡', '👏']

interface InlineReactionsProps {
  postId: string
  paragraphIndex: number
}

export function InlineReactions({ postId, paragraphIndex }: InlineReactionsProps) {
  const [reactions, setReactions] = useState<Record<string, number>>({})
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load reactions from localStorage for demo
    const storageKey = `reactions-${postId}-${paragraphIndex}`
    const savedReactions = localStorage.getItem(storageKey)
    const savedUserReactions = localStorage.getItem(`${storageKey}-user`)
    
    if (savedReactions) {
      setReactions(JSON.parse(savedReactions))
    }
    if (savedUserReactions) {
      setUserReactions(new Set(JSON.parse(savedUserReactions)))
    }
  }, [postId, paragraphIndex])

  const handleReaction = (emoji: string) => {
    const storageKey = `reactions-${postId}-${paragraphIndex}`
    const userStorageKey = `${storageKey}-user`
    
    const newReactions = { ...reactions }
    const newUserReactions = new Set(userReactions)

    if (userReactions.has(emoji)) {
      // Remove reaction
      newReactions[emoji] = Math.max(0, (newReactions[emoji] || 0) - 1)
      newUserReactions.delete(emoji)
      
      toast({
        title: "Reaction removed",
        description: `You removed your ${emoji} reaction`,
      })
    } else {
      // Add reaction
      newReactions[emoji] = (newReactions[emoji] || 0) + 1
      newUserReactions.add(emoji)
      
      toast({
        title: "Reaction added",
        description: `You reacted with ${emoji}`,
      })
    }

    setReactions(newReactions)
    setUserReactions(newUserReactions)
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(newReactions))
    localStorage.setItem(userStorageKey, JSON.stringify([...newUserReactions]))
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Reaction Button Trigger */}
      <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm"
          onClick={() => setIsVisible(!isVisible)}
        >
          😊
        </Button>
      </div>

      {/* Reactions Panel */}
      {isVisible && (
        <div className="absolute -right-16 top-8 z-10 bg-background/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg animate-scale-in">
          <div className="flex gap-1">
            {REACTIONS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 text-lg hover:scale-110 transition-transform ${
                  userReactions.has(emoji) ? 'bg-primary/10 border border-primary/20' : ''
                }`}
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
          
          {/* Reaction Counts */}
          {Object.entries(reactions).some(([_, count]) => count > 0) && (
            <div className="flex gap-2 mt-2 pt-2 border-t">
              {Object.entries(reactions).map(([emoji, count]) => 
                count > 0 ? (
                  <div key={emoji} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{emoji}</span>
                    <span>{count}</span>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}