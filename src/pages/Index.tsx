
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Zap, Shield, Star, Trophy, Clock, Target, Sparkles, MessageCircle, BarChart3, Globe, Eye, TrendingUp, Award, Search, Filter, FileText, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SamplePostsCarousel from "@/components/SamplePostsCarousel";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TrustIndicators from "@/components/TrustIndicators";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  const stats = [
    { number: "50K+", label: "Posts Published", icon: FileText },
    { number: "500+", label: "Partner Sites", icon: Globe },
    { number: "85+", label: "Average DA Score", icon: TrendingUp },
    { number: "98%", label: "Approval Rate", icon: Award }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$5",
      description: "Perfect for beginners testing the waters",
      features: [
        "1 Guest Post Submission",
        "Basic Editorial Review",
        "Standard Turnaround (5-7 days)",
        "Do-follow Backlink",
        "AI Content Validation",
        "Refund if Rejected"
      ],
      popular: false,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Professional",
      price: "$15",
      description: "Most popular for serious content marketers",
      features: [
        "1 Premium Guest Post",
        "Priority Review (2-3 days)",
        "Niche Site Targeting",
        "Enhanced Do-follow Links",
        "SEO Optimization Tips",
        "Dedicated Support",
        "Performance Analytics"
      ],
      popular: true,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Premium",
      price: "$30",
      description: "Enterprise-grade placement guarantee",
      features: [
        "Guaranteed High-DA Placement",
        "Same-day Review",
        "Custom Niche Selection",
        "Multiple Backlink Options",
        "White-label Reporting",
        "Account Manager",
        "Traffic Boost Guarantee"
      ],
      popular: false,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            🚀 #1 Trusted Guest Posting Platform • 50K+ Success Stories
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            Scale Your Authority with
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block mt-4">
              Premium Guest Posts
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Get published on high-authority sites with our AI-powered submission platform. 
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
            <Link to="/submit-post">
              <Button size="lg" className="px-10 py-6 text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-2xl">
                Start Publishing Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/guidelines">
              <Button variant="outline" size="lg" className="px-10 py-6 text-xl border-2 border-gray-300 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 rounded-2xl">
                <Eye className="mr-3 h-6 w-6" />
                View Sample Posts
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <TrustIndicators />
        </div>
      </section>
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Advanced Pricing Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23e5e7eb\" fill-opacity=\"0.3\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              💎 Premium Publishing Plans
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Success Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From first-time publishers to enterprise brands, we have the perfect plan to amplify your content reach
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative overflow-hidden ${tier.popular ? 'ring-4 ring-purple-500 ring-opacity-50 scale-105' : ''} bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105`}>
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 font-semibold">
                    <Sparkles className="inline h-5 w-5 mr-2" />
                    Most Popular Choice
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${tier.gradient}`}></div>
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-gray-600 mb-6">{tier.description}</p>
                    <div className="flex items-center justify-center mb-6">
                      <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                      <span className="text-gray-600 ml-2">per post</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/submit-post">
                    <Button className={`w-full py-6 text-lg font-semibold bg-gradient-to-r ${tier.gradient} hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl`}>
                      {tier.popular ? 'Get Started Today' : 'Choose Plan'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Pricing Guarantee */}
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
      
      {/* Sample Posts Carousel */}
      <SamplePostsCarousel />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Dominate Your Niche?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of successful marketers who've scaled their authority with our premium guest posting platform.
          </p>
          
          <Link to="/submit-post">
            <Button size="lg" className="px-12 py-6 text-xl bg-white text-gray-900 hover:bg-gray-100 shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl">
              <Send className="mr-3 h-6 w-6" />
              Submit Your First Post
            </Button>
          </Link>
          
          <div className="mt-8 text-blue-200 text-sm">
            🔒 Secure payment • ⚡ Instant approval process • 💯 Satisfaction guaranteed
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
