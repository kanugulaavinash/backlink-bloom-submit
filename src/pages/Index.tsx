
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SitemapGenerator from "@/components/SitemapGenerator";
import { SimpleScene3D } from "@/components/3d/SimpleScene3D";
import { VideoBackground } from "@/components/VideoBackground";
import { usePagePerformance } from "@/hooks/useAnalytics";
import WhyChooseSection from "@/components/WhyChooseSection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  usePagePerformance('Homepage');

  return (
    <>
      <SEO 
        title="Stuffedition - Publish Your Guest Post for Just $5 | Get Permanent Dofollow Backlinks"
        description="The most affordable guest posting platform on the web. Publish high-quality guest posts for only $5 with permanent dofollow backlinks. Fast approval, human-written content only."
        url="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Stuffedition",
          "description": "The most affordable guest posting platform - publish for just $5",
          "url": "https://stuffedition.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://stuffedition.com/blog?search={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "provider": {
            "@type": "Organization",
            "name": "Stuffedition",
            "url": "https://stuffedition.com"
          }
        }}
      />
      <SitemapGenerator />
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Header />
        
        {/* Main Hero Section with 3D and Video */}
        <section className="relative min-h-screen flex items-center justify-center">
          <VideoBackground />
          <SimpleScene3D />
          
          <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            {/* Premium Badge */}
            <Badge variant="secondary" className="mb-8 px-6 py-3 text-sm animate-fade-in">
              💎 Premium Guest Posting Platform
            </Badge>
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight">
              Publish Your Guest Post for Just 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block mt-2">
                $5
              </span>
              — Get a Permanent Dofollow Backlink
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in leading-relaxed font-medium">
              The Most Affordable Guest Posting Platform on the Web — Only at Stuffedition
            </p>
            
            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed">
              Are you a blogger, marketer, or SEO expert looking to boost your website's authority and traffic? Stuffedition offers unbeatable value with permanent do-follow backlinks.
            </p>
            
            {/* What You Get Section */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-12 border border-border/50 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-foreground">🔗 What You Get for $5:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">✅</span>
                  <span className="text-sm sm:text-base">One Guest Post Publication</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">✅</span>
                  <span className="text-sm sm:text-base">Permanent Do-Follow Backlink</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">✅</span>
                  <span className="text-sm sm:text-base">Indexed by Search Engines</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">✅</span>
                  <span className="text-sm sm:text-base">Fast Approval Process</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">✅</span>
                  <span className="text-sm sm:text-base">Live Link Within 24–48 Hours</span>
                </div>
              </div>
            </div>
            
            {/* Quality Standards */}
            <div className="bg-secondary/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-12 border border-secondary/20 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-foreground">🚫 No Shortcuts. Only Quality.</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm sm:text-base">100% Original Content</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-sm sm:text-base">Human-Written Only</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm sm:text-base">600+ Words Minimum</span>
                </div>
              </div>
            </div>
            
            {/* Main CTA */}
            <div className="space-y-6 animate-scale-in">
              <Link to="/signin">
                <Button 
                  size="lg" 
                  className="px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl hover:scale-105 transition-all duration-300 shadow-2xl w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  Submit Your Guest Post
                  <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </Link>
              
              <p className="text-sm text-muted-foreground">
                📩 Ready to Submit? Click above to publish your article now for just $5
              </p>
            </div>
          </div>
          
          {/* Subtle Stats */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-4 sm:gap-8 text-center px-4">
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
        
        {/* Why Choose Section */}
        <WhyChooseSection />
        
        {/* Comprehensive FAQ Section */}
        <FAQSection />
      </div>
      <Footer />
    </>
  );
};

export default Index;
