
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SitemapGenerator from "@/components/SitemapGenerator";
import { Scene3D } from "@/components/3d/Scene3D";
import { VideoBackground } from "@/components/VideoBackground";
import { usePagePerformance } from "@/hooks/useAnalytics";

const Index = () => {
  usePagePerformance('Homepage');

  return (
    <>
      <SEO 
        title="Backlink Bloom - Premium Guest Posting Platform | Get Quality Backlinks"
        description="Submit high-quality guest posts and get approved backlinks. AI-powered content validation, instant publishing, and SEO-optimized articles. Start building your online presence today."
        url="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Backlink Bloom",
          "description": "Premium guest posting platform with AI-powered content validation",
          "url": "https://backlinkbloom.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://backlinkbloom.com/blog?search={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "provider": {
            "@type": "Organization",
            "name": "Backlink Bloom",
            "url": "https://backlinkbloom.com"
          }
        }}
      />
      <SitemapGenerator />
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Header />
        
        {/* Main Hero Section with 3D and Video */}
        <section className="relative min-h-screen flex items-center justify-center">
          <VideoBackground />
          <Scene3D />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            {/* Premium Badge */}
            <Badge variant="secondary" className="mb-8 px-6 py-3 text-sm animate-fade-in">
              💎 Premium Guest Posting Platform
            </Badge>
            
            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
              Get Published for
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block mt-2">
                Only $5
              </span>
            </h1>
            
            {/* Simple Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
              High-quality guest posts with guaranteed dofollow backlinks. Start building your SEO presence today.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-in">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>AI Validated</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-5 w-5 text-primary" />
                <span>Instant Publishing</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span>24h Approval</span>
              </div>
            </div>
            
            {/* Main CTA */}
            <div className="space-y-6 animate-scale-in">
              <Link to="/signin">
                <Button 
                  size="lg" 
                  className="px-12 py-6 text-xl hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  Get Started Now - Only $5
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              
              <p className="text-sm text-muted-foreground">
                ✓ No hidden fees • ✓ Guaranteed dofollow backlink • ✓ 24/7 support
              </p>
            </div>
          </div>
          
          {/* Subtle Stats */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-2xl font-bold text-primary">2,847</div>
              <div className="text-sm text-muted-foreground">Posts Published</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Approval Rate</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl font-bold text-primary">24h</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </div>
        </section>
        
        {/* Minimal FAQ Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Quick Answers</h2>
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-lg bg-card border animate-fade-in">
                <h3 className="font-semibold mb-2">What do I get for $5?</h3>
                <p className="text-muted-foreground">A high-quality guest post published on a relevant blog with a guaranteed dofollow backlink to your website.</p>
              </div>
              <div className="p-6 rounded-lg bg-card border animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="font-semibold mb-2">How fast is the process?</h3>
                <p className="text-muted-foreground">Submit your content, get it approved within 24 hours, and see it published instantly.</p>
              </div>
              <div className="p-6 rounded-lg bg-card border animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <h3 className="font-semibold mb-2">What if I'm not satisfied?</h3>
                <p className="text-muted-foreground">We offer a 100% satisfaction guarantee. Not happy? Get your money back, no questions asked.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Index;
