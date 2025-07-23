import { ArrowRight, Clock, Users, Zap, CheckCircle, Star, Trophy, AlertCircle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FinalConversionSection = () => {
  const urgencyStats = [
    {
      number: "127",
      label: "Posts submitted today",
      icon: Users
    },
    {
      number: "23",
      label: "Spots remaining this week",
      icon: AlertCircle
    },
    {
      number: "2.5h",
      label: "Average response time",
      icon: Clock
    }
  ];

  const guarantees = [
    "85+ Domain Authority sites guaranteed",
    "2-3 day publishing timeline",
    "100% dofollow backlinks included",
    "AI & plagiarism checks included",
    "30-day money-back guarantee",
    "24/7 customer support included"
  ];

  const bonuses = [
    {
      title: "Free SEO Audit Report",
      value: "$97",
      description: "Comprehensive analysis of your current backlink profile"
    },
    {
      title: "Content Optimization Guide",
      value: "$47",
      description: "Professional tips to maximize your guest post impact"
    },
    {
      title: "Priority Publishing Queue",
      value: "$25",
      description: "Skip the line and get published faster"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Urgency Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-red-50 text-red-600 border-red-200 animate-pulse">
            <AlertCircle className="w-4 h-4 mr-2" />
            Limited Time Offer
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Ready to Dominate Search Results?
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join the thousands of smart marketers who've already boosted their SEO with our platform. 
            <span className="font-semibold text-primary"> Don't let your competitors get ahead.</span>
          </p>

          {/* Live Activity */}
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
            {urgencyStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-primary/10 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold text-primary">{stat.number}</span>
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA Section */}
        <div className="bg-gradient-to-r from-card/50 to-muted/20 rounded-3xl p-8 md:p-12 border border-primary/10 backdrop-blur-sm mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Offer */}
            <div>
              <div className="flex items-center mb-6">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                <h3 className="text-2xl md:text-3xl font-bold">
                  Special Launch Offer
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span>Get your <strong>first guest post for just $5</strong></span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span>Free bonus: <strong>SEO audit report ($97 value)</strong></span>
                </div>
                <div className="flex items-center text-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span>Priority publishing queue access</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-sm text-muted-foreground mb-2">Limited time pricing:</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">$5</span>
                  <span className="text-2xl text-muted-foreground line-through">$25</span>
                  <Badge className="bg-red-500 text-white">80% OFF</Badge>
                </div>
              </div>

              {/* Countdown Timer Effect */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
                <div className="flex items-center justify-center text-red-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Offer expires in: 2 days, 14 hours, 23 minutes</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse-glow"
                >
                  <Link to="/signin">
                    Claim Your $5 Guest Post Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transform hover:scale-105 transition-all duration-300"
                >
                  <Link to="/blog">
                    View Success Stories
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Guarantees */}
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <Shield className="w-6 h-6 text-green-500 mr-3" />
                What You Get - 100% Guaranteed
              </h4>
              
              <div className="space-y-4 mb-8">
                {guarantees.map((guarantee, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-3 bg-green-50 rounded-xl border border-green-200 animate-slide-in-right"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-green-700">{guarantee}</span>
                  </div>
                ))}
              </div>

              {/* Free Bonuses */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
                <h5 className="font-bold text-lg mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  FREE Bonuses (Limited Time)
                </h5>
                <div className="space-y-3">
                  {bonuses.map((bonus, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{bonus.title}</div>
                        <div className="text-xs text-muted-foreground">{bonus.description}</div>
                      </div>
                      <Badge variant="outline" className="text-primary border-primary/20">
                        {bonus.value}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="border-t border-primary/10 mt-4 pt-4">
                  <div className="flex items-center justify-between font-bold">
                    <span>Total Bonus Value:</span>
                    <span className="text-primary">$169</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Social Proof */}
        <div className="text-center mb-12">
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            {/* Customer Avatars */}
            <div className="flex -space-x-4">
              {['AB', 'CD', 'EF', 'GH', 'IJ'].map((initials, index) => (
                <div 
                  key={index} 
                  className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-background"
                >
                  {initials}
                </div>
              ))}
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold text-sm border-4 border-background">
                +5K
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 font-semibold">4.9/5</span>
              </div>
              <div className="text-muted-foreground text-sm">
                from 5,000+ satisfied customers
              </div>
            </div>
          </div>
        </div>

        {/* Last Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-8 py-4 inline-flex items-center border border-primary/20 mb-8">
            <Zap className="w-6 h-6 text-primary mr-3" />
            <span className="font-semibold">
              🚀 Don't wait - Start building your SEO authority today!
            </span>
          </div>
          
          <Button 
            asChild 
            size="lg" 
            className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-3xl animate-pulse-glow"
          >
            <Link to="/signin">
              Get Started Now - Only $5
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            No contracts • No hidden fees • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalConversionSection;