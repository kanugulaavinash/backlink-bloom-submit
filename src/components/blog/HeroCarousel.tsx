import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Calendar, ChevronLeft, ChevronRight, Play, Pause, Bookmark, Heart, Share2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  imageUrl: string;
  readTime: number;
  postType?: string;
  ai_summary?: string;
  reading_time?: number;
  view_count?: number;
  like_count?: number;
}

interface HeroCarouselProps {
  posts: BlogPost[];
  categories: Array<{ name: string; color: string }>;
}

const HeroCarousel = ({ posts, categories }: HeroCarouselProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      skipSnaps: false,
      duration: 30
    },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, [autoplay]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || 'hsl(var(--primary))';
  };

  const getPostTypeColor = (postType?: string) => {
    switch (postType) {
      case 'guest': return 'bg-green-500';
      case 'imported': return 'bg-blue-500';
      case 'static': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPostTypeLabel = (postType?: string) => {
    switch (postType) {
      case 'guest': return 'Guest Post';
      case 'imported': return 'Imported';
      case 'static': return 'Featured';
      default: return 'Article';
    }
  };

  if (!posts.length) {
    return (
      <section className="relative h-[70vh] bg-gradient-to-br from-primary via-primary-foreground to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">No Featured Posts Available</h2>
            <p className="text-xl opacity-90">Check back soon for the latest content</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-black">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-10"></div>
      
      {/* Embla Carousel */}
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {posts.map((post, index) => (
            <div key={post.id} className="embla__slide relative h-full min-w-0">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
                style={{ 
                  backgroundImage: `url(${post.imageUrl})`,
                  transform: selectedIndex === index ? 'scale(1.05)' : 'scale(1.1)'
                }}
              />
              
              {/* Content Overlay */}
              <div className="relative z-20 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-3xl">
                    {/* Category and Type Badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <Badge 
                        className="text-white border-0 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                        style={{ backgroundColor: getCategoryColor(post.category) }}
                      >
                        {post.category}
                      </Badge>
                      <Badge className={`${getPostTypeColor(post.postType)} text-white border-0 px-4 py-2 text-sm backdrop-blur-sm`}>
                        {getPostTypeLabel(post.postType)}
                      </Badge>
                      <Badge className="bg-yellow-500 text-black border-0 px-4 py-2 text-sm font-medium backdrop-blur-sm flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Featured
                      </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                      {post.title}
                    </h1>

                    {/* AI Summary or Excerpt */}
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed line-clamp-3">
                      {post.ai_summary || post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-8">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>{post.reading_time || post.readTime} min read</span>
                      </div>
                      {post.view_count && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{post.view_count.toLocaleString()} views</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <Link to={`/blog/post/${post.id}`}>
                        <Button 
                          size="lg" 
                          className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          Read Full Article
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-white text-white hover:bg-white hover:text-black px-6 py-4 rounded-xl backdrop-blur-sm bg-white/10 transition-all duration-300"
                      >
                        <Bookmark className="w-5 h-5 mr-2" />
                        Save
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-white text-white hover:bg-white hover:text-black px-6 py-4 rounded-xl backdrop-blur-sm bg-white/10 transition-all duration-300"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        {post.like_count || 0}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-white text-white hover:bg-white hover:text-black px-6 py-4 rounded-xl backdrop-blur-sm bg-white/10 transition-all duration-300"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 z-30">
        <Button
          variant="outline"
          size="lg"
          onClick={scrollPrev}
          className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-black rounded-full p-3 backdrop-blur-sm transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 z-30">
        <Button
          variant="outline"
          size="lg"
          onClick={scrollNext}
          className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-black rounded-full p-3 backdrop-blur-sm transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Autoplay Control */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          variant="outline"
          onClick={toggleAutoplay}
          className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-black rounded-lg p-3 backdrop-blur-sm transition-all duration-300"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex gap-3">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div 
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ 
            width: posts.length > 0 ? `${((selectedIndex + 1) / posts.length) * 100}%` : '0%' 
          }}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;