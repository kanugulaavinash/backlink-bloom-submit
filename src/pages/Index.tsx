
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import SamplePostsCarousel from "@/components/SamplePostsCarousel";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTASection from "@/components/FinalCTASection";
import SEO from "@/components/SEO";
import SitemapGenerator from "@/components/SitemapGenerator";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Header />
        <HeroSection />
        <HowItWorksSection />
        <PricingSection />
        <SamplePostsCarousel />
        <TestimonialsSection />
        <FinalCTASection />
      </div>
    </>
  );
};

export default Index;
