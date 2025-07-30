
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SitemapGenerator from "@/components/SitemapGenerator";
import { usePagePerformance } from "@/hooks/useAnalytics";
import WhyChooseSection from "@/components/WhyChooseSection";
import WebTwoBacklinksSection from "@/components/WebTwoBacklinksSection";
import HowItWorksSection from "@/components/HowItWorksSection";
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
        
        {/* New Hero Section with Light Grey Background */}
        <section className="relative bg-gray-50 py-16 lg:py-24 pt-30 sm:pt-30 lg:pt-32">
          {/* Floating decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-4 h-4 bg-primary/20 rounded transform rotate-45"></div>
            <div className="absolute top-32 right-16 w-6 h-6 bg-primary/30 rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-3 h-3 bg-primary/25 rounded"></div>
            <div className="absolute bottom-32 right-12 w-5 h-5 bg-primary/20 rounded transform rotate-45"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left">
                {/* Premium Badge */}
                <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
                  💎 Premium Guest Posting Platform
                </Badge>
                
                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-primary">Just $5</span>
                  <br />
                  <span className="text-primary">Get a Permanent</span>
                  <br />
                  <span className="text-foreground">Dofollow Backlink</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  The Most Affordable Guest Posting Platform on the Web — Only at Stuffedition
                </p>
                
                {/* Description */}
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Are you a blogger, marketer, or SEO expert looking to boost your website's authority and traffic?
                </p>
                
                {/* Main CTA */}
                <div className="space-y-4">
                  <Link to="/create-blog-post">
                    <Button 
                      size="lg" 
                      className="px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Submit Your Guest Post
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground">
                    📩 Ready to Submit? Click above to publish your article now for just $5
                  </p>
                </div>
              </div>

              {/* Right Content - What You Get Card */}
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">🔗 What You Get for $5:</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-lg">✅</span>
                      <span className="text-base">One Guest Post Publication</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-lg">✅</span>
                      <span className="text-base">Permanent Do-Follow Backlink</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-lg">✅</span>
                      <span className="text-base">Indexed by Search Engines</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-lg">✅</span>
                      <span className="text-base">Fast Approval Process</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold text-lg">✅</span>
                      <span className="text-base">Live Link Within 24–48 Hours</span>
                    </div>
                  </div>
                  
                  {/* Quality Standards inside the card */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold mb-4 text-foreground">🚫 No Shortcuts. Only Quality.</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm">100% Original Content</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm">Human-Written Only</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">600+ Words Minimum</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="flex justify-center gap-8 mt-16 pt-8 bg-primary rounded-lg p-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">2,847</div>
                <div className="text-sm text-primary-foreground/80">Posts Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">98%</div>
                <div className="text-sm text-primary-foreground/80">Approval Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">24h</div>
                <div className="text-sm text-primary-foreground/80">Avg Response</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why Choose Section */}
        <WhyChooseSection />
        
        {/* Web 2.0 Backlinks Section */}
        <WebTwoBacklinksSection />
        
        {/* How It Works Section */}
        <HowItWorksSection />
        
        {/* Comprehensive FAQ Section */}
        <FAQSection />
      </div>
      <Footer />
    </>
  );
};

export default Index;
