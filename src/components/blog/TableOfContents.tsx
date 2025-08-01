import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className = "" }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      items.push({ id, title, level });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0.1 
      }
    );

    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card className={`sticky top-24 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="justify-between p-0 h-auto hover:bg-transparent">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <List className="w-4 h-4" />
                Table of Contents
              </CardTitle>
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <nav className="space-y-1">
              {tocItems.map(({ id, title, level }) => (
                <Button
                  key={id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToHeading(id)}
                  className={`
                    w-full justify-start text-left h-auto py-2 px-2
                    ${level === 2 ? 'pl-2' : level === 3 ? 'pl-6' : 'pl-4'}
                    ${activeId === id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}
                    transition-colors duration-200
                  `}
                >
                  <span className="text-xs leading-relaxed">{title}</span>
                </Button>
              ))}
            </nav>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}