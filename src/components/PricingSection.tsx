
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, Shield, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const features = [
    "1 Premium Guest Post Submission",
    "AI-Powered Content Review", 
    "Fast Turnaround (2-3 days)",
    "Guaranteed Do-follow Backlink",
    "High DA Site Placement",
    "SEO Optimization Tips",
    "Performance Analytics",
    "Dedicated Support",
    "100% Money-Back Guarantee"
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white relative">
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            💎 Premium Publishing Plan
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Affordable</span> Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your content published on high-authority sites with our streamlined process. No hidden fees, no commitments.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 font-semibold">
              <Sparkles className="inline h-5 w-5 mr-2" />
              Most Popular Choice
            </div>
            
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            
            <div className="p-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Premium Guest Post</h3>
                <p className="text-gray-600 mb-6">Perfect for growing your online authority</p>
                <div className="flex items-center justify-center mb-6">
                  <span className="text-6xl font-bold text-gray-900">$5</span>
                  <span className="text-gray-600 ml-2 text-xl">per post</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/signin">
                <Button className="w-full py-6 text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl">
                  Get Started for $5
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-2xl px-8 py-4">
            <Shield className="h-8 w-8 text-green-600 mr-4" />
            <div className="text-left">
              <div className="font-semibold text-green-800">100% Money-Back Guarantee</div>
              <div className="text-green-600 text-sm">Full refund if your post isn't approved within 14 days</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
