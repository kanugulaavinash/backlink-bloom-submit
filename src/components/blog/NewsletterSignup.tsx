import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/useAuth'

interface NewsletterSignupProps {
  title?: string
  description?: string
  className?: string
}

export function NewsletterSignup({ 
  title = "Stay Updated", 
  description = "Get the latest articles and insights delivered to your inbox",
  className = ""
}: NewsletterSignupProps) {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.trim().toLowerCase(),
          user_id: user?.id || null,
        })

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: 'Already subscribed',
            description: 'This email is already subscribed to our newsletter',
          })
        } else {
          throw error
        }
      } else {
        setSubscribed(true)
        toast({
          title: 'Successfully subscribed!',
          description: 'Thank you for subscribing to our newsletter',
        })
        setEmail('')
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      toast({
        title: 'Subscription failed',
        description: 'Please try again or contact support',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">You're all set!</h3>
            <p className="text-muted-foreground text-sm">
              Thank you for subscribing. You'll receive our latest content in your inbox.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !email.trim()}
          >
            {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </CardContent>
    </Card>
  )
}