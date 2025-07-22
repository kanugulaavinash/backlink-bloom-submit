import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Clock, User, TrendingUp, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  id: string;
  title: string;
  excerpt?: string;
  ai_summary?: string;
  category?: string;
  categories?: string[];
  author?: string;
  author_name?: string;
  created_at: string;
  reading_time?: number;
  view_count?: number;
  post_type: string;
  similarity?: number;
}

interface SemanticSearchProps {
  onSearchResults?: (results: SearchResult[]) => void;
  placeholder?: string;
  className?: string;
}

const SemanticSearch = ({ 
  onSearchResults, 
  placeholder = "Search with natural language (e.g., 'How to improve SEO ranking')",
  className = ""
}: SemanticSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'text' | 'semantic' | 'hybrid'>('hybrid');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const recentSearches = [
    "How to build backlinks effectively",
    "Content marketing strategies",
    "SEO best practices 2024",
    "Guest posting guidelines"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query: searchQuery,
          limit: 8,
          searchType: searchType
        }
      });

      if (error) {
        console.error('Search error:', error);
        toast({
          variant: "destructive",
          title: "Search Error",
          description: "Failed to perform search. Please try again."
        });
        return;
      }

      const searchResults = data?.results || [];
      setResults(searchResults);
      onSearchResults?.(searchResults);

      // Track search analytics
      if (searchQuery.trim()) {
        const { data: user } = await supabase.auth.getUser();
        // Note: search_analytics table will be available after migration
        try {
          await supabase
            .from('search_analytics' as any)
            .insert({
              query: searchQuery,
              results_count: searchResults.length,
              search_type: searchType,
              user_id: user.user?.id || null
            });
        } catch (e) {
          console.log('Search analytics tracking not yet available');
        }
      }

    } catch (error) {
      console.error('Search error:', error);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    performSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Auto-search after user stops typing for 500ms
    const timeoutId = setTimeout(() => {
      if (value.trim().length > 2) {
        performSearch(value);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    onSearchResults?.([]);
  };

  const getDisplayCategory = (result: SearchResult) => {
    return result.category || result.categories?.[0] || 'Uncategorized';
  };

  const getDisplayAuthor = (result: SearchResult) => {
    return result.author || result.author_name || 'Anonymous';
  };

  const getDisplayExcerpt = (result: SearchResult) => {
    return result.ai_summary || result.excerpt || 'No preview available';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          className="pl-12 pr-32 py-6 text-lg bg-background/95 backdrop-blur-sm border-border text-foreground placeholder-muted-foreground rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all duration-300"
        />
        
        {/* Search Controls */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl shadow-lg disabled:opacity-50"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search Type Toggle */}
      <div className="flex gap-2 mt-4">
        {(['text', 'semantic', 'hybrid'] as const).map((type) => (
          <Button
            key={type}
            variant={searchType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchType(type)}
            className="capitalize"
          >
            {type === 'semantic' && <Sparkles className="h-3 w-3 mr-1" />}
            {type}
          </Button>
        ))}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-2xl border border-border bg-background/95 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Recent Searches */}
            {!query && (
              <div className="p-4">
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">Recent Searches</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(search)}
                      className="block w-full text-left p-3 hover:bg-muted rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{search}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && (
              <div className="p-4">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="text-muted-foreground">Searching...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        Found {results.length} results for "{query}"
                      </h3>
                      {searchType === 'semantic' && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI-Powered
                        </Badge>
                      )}
                    </div>
                    
                    {results.map((result) => (
                      <Link
                        key={`${result.post_type}-${result.id}`}
                        to={`/blog/post/${result.id}`}
                        onClick={() => setShowResults(false)}
                        className="block p-3 hover:bg-muted rounded-lg transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                              {result.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {getDisplayExcerpt(result)}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {getDisplayCategory(result)}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {getDisplayAuthor(result)}
                              </div>
                              {result.reading_time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {result.reading_time}m
                                </div>
                              )}
                              {result.similarity && searchType === 'semantic' && (
                                <div className="text-primary font-medium">
                                  {Math.round(result.similarity * 100)}% match
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : query ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No results found for "{query}"</p>
                    <p className="text-xs mt-1">Try adjusting your search terms or using different keywords</p>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SemanticSearch;