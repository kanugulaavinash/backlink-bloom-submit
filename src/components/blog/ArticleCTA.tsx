import { MessageSquare, Bookmark, Share2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ArticleCTAProps {
  postId: string;
  title: string;
  className?: string;
}

export function ArticleCTA({ postId, title, className = "" }: ArticleCTAProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // Newsletter signup logic would go here
      setIsSubscribed(true);
      setEmail('');
      toast({
        title: "Thanks for subscribing!",
        description: "You'll receive our latest articles in your inbox.",
      });
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link copied to clipboard.",
      });
    }
  };

  if (isSubscribed) {
    return (
      <Card className={`bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Bell className="w-8 h-8 mx-auto text-primary mb-2" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              You're all set! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">
              Thank you for subscribing. You'll receive our latest insights directly in your inbox.
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Article
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Leave Comment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 ${className}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-foreground">
          Enjoyed this article?
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get more insights like this delivered to your inbox weekly
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleNewsletterSignup} className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!email}>
              <Bell className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </form>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmark
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Comment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}