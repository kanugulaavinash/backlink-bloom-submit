
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import PricingSection from "@/components/PricingSection";
import SamplePostsCarousel from "@/components/SamplePostsCarousel";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <SamplePostsCarousel />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
};

export default Index;
