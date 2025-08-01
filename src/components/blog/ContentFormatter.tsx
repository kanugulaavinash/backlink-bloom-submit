import { useState } from 'react';
import { AlertTriangle, Lightbulb, Info, CheckCircle, Quote } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createSafeHTML } from '@/lib/sanitization';

interface ContentFormatterProps {
  content: string;
  postId: string;
}

export function ContentFormatter({ content, postId }: ContentFormatterProps) {
  const formatContent = (text: string) => {
    // Split content into paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      // Handle different content types
      if (trimmedParagraph.startsWith('[TIP]')) {
        return (
          <Alert key={index} className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              <div dangerouslySetInnerHTML={createSafeHTML(trimmedParagraph.replace('[TIP]', '').trim(), false)} />
            </AlertDescription>
          </Alert>
        );
      }
      
      if (trimmedParagraph.startsWith('[WARNING]')) {
        return (
          <Alert key={index} className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-sm">
              <div dangerouslySetInnerHTML={createSafeHTML(trimmedParagraph.replace('[WARNING]', '').trim(), false)} />
            </AlertDescription>
          </Alert>
        );
      }
      
      if (trimmedParagraph.startsWith('[INFO]')) {
        return (
          <Alert key={index} className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              <div dangerouslySetInnerHTML={createSafeHTML(trimmedParagraph.replace('[INFO]', '').trim(), false)} />
            </AlertDescription>
          </Alert>
        );
      }
      
      if (trimmedParagraph.startsWith('[SUCCESS]')) {
        return (
          <Alert key={index} className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-sm">
              <div dangerouslySetInnerHTML={createSafeHTML(trimmedParagraph.replace('[SUCCESS]', '').trim(), false)} />
            </AlertDescription>
          </Alert>
        );
      }
      
      if (trimmedParagraph.startsWith('[QUOTE]')) {
        return (
          <Card key={index} className="border-l-4 border-l-primary bg-accent/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Quote className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="italic text-foreground">
                  <div dangerouslySetInnerHTML={createSafeHTML(trimmedParagraph.replace('[QUOTE]', '').trim(), false)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(trimmedParagraph)) {
        const number = trimmedParagraph.match(/^(\d+)\.\s/)?.[1];
        const content = trimmedParagraph.replace(/^\d+\.\s/, '');
        return (
          <div key={index} className="flex gap-4 items-start">
            <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center rounded-full text-xs font-bold">
              {number}
            </Badge>
            <div className="flex-1">
              <div dangerouslySetInnerHTML={createSafeHTML(content, false)} />
            </div>
          </div>
        );
      }
      
      // Handle bullet points
      if (trimmedParagraph.startsWith('• ') || trimmedParagraph.startsWith('- ')) {
        const content = trimmedParagraph.replace(/^[•-]\s/, '');
        return (
          <div key={index} className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <div dangerouslySetInnerHTML={createSafeHTML(content, false)} />
            </div>
          </div>
        );
      }
      
      // Handle headings and add IDs for table of contents
      if (trimmedParagraph.startsWith('#')) {
        const headingMatch = trimmedParagraph.match(/^(#{1,3})\s+(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const title = headingMatch[2].trim();
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          
          const HeadingTag = `h${Math.min(level + 1, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
          const className = level === 1 ? 'text-2xl font-bold mt-8 mb-4' :
                          level === 2 ? 'text-xl font-semibold mt-6 mb-3' :
                          'text-lg font-medium mt-4 mb-2';
          
          return (
            <HeadingTag key={index} id={id} className={`${className} scroll-mt-24 text-foreground`}>
              {title}
            </HeadingTag>
          );
        }
      }
      
      // Handle image placeholders
      if (trimmedParagraph.startsWith('[Insert') && trimmedParagraph.endsWith(']')) {
        return (
          <Card key={index} className="border-dashed bg-muted/30">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground text-sm">
                📷 {trimmedParagraph.slice(1, -1)}
              </div>
            </CardContent>
          </Card>
        );
      }
      
      // Regular paragraphs
      return (
        <div key={index} className="leading-relaxed text-foreground">
          <div dangerouslySetInnerHTML={createSafeHTML(trimmedParagraph, false)} />
        </div>
      );
    });
  };

  return <div className="space-y-6">{formatContent(content)}</div>;
}