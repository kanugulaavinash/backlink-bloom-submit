import { User, Globe, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AuthorBioProps {
  author: string;
  authorBio?: string;
  authorWebsite?: string;
  authorAvatar?: string;
  publishedAt: string;
  className?: string;
}

export function AuthorBio({ 
  author, 
  authorBio, 
  authorWebsite, 
  authorAvatar, 
  publishedAt,
  className = "" 
}: AuthorBioProps) {
  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className={`border-l-4 border-l-primary ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={authorAvatar} alt={author} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getAuthorInitials(author)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{author}</h3>
                <Badge variant="secondary" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  Author
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(publishedAt)}
              </div>
            </div>
            
            {authorBio && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {authorBio}
              </p>
            )}
            
            {authorWebsite && (
              <Button variant="outline" size="sm" asChild>
                <a href={authorWebsite} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}