
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModernHeroSection from "@/components/modern/ModernHeroSection";
import TrustIndicatorsSection from "@/components/modern/TrustIndicatorsSection";
import ProblemSolutionSection from "@/components/modern/ProblemSolutionSection";
import ModernHowItWorksSection from "@/components/modern/ModernHowItWorksSection";
import ModernFeaturesSection from "@/components/modern/ModernFeaturesSection";
import SocialProofSection from "@/components/modern/SocialProofSection";
import PricingValueSection from "@/components/modern/PricingValueSection";
import FAQSection from "@/components/FAQSection";
import FinalConversionSection from "@/components/modern/FinalConversionSection";
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
      <div className="min-h-screen bg-background">
        <Header />
        <ModernHeroSection />
        <TrustIndicatorsSection />
        <ProblemSolutionSection />
        <ModernHowItWorksSection />
        <ModernFeaturesSection />
        <SocialProofSection />
        <PricingValueSection />
        <FAQSection />
        <FinalConversionSection />
      </div>
      <Footer />
    </>
  );
};

export default Index;
