
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Globe, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import TrustIndicators from "@/components/TrustIndicators";

const HeroSection = () => {
  const stats = [
    { number: "1000+", label: "Posts Published", icon: FileText },
    { number: "Stuffedition", label: "Platform", icon: Globe },
    { number: "85+", label: "Average DA Score", icon: TrendingUp },
    { number: "98%", label: "Approval Rate", icon: Award }
  ];

  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          🚀 #1 Trusted Guest Posting Platform • Stuffedition Success Stories
        </Badge>
        
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
          Scale Your Authority with
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block mt-4">
            Premium Guest Posts
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Get published on high-authority sites with Stuffedition's AI-powered submission platform. 
          Guaranteed do-follow backlinks, 98% approval rate, and results that drive real traffic.
        </p>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-0">
              <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link to="/signin">
            <Button size="lg" className="px-10 py-6 text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-2xl">
              Start Publishing Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <TrustIndicators />
      </div>
    </section>
  );
};

export default HeroSection;
