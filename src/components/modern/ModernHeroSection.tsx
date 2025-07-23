import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Star, Users, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const ModernHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left animate-slide-in-left">
            {/* Trust Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Trusted by 10,000+ Content Creators
            </Badge>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
              Get Your Content Published on 
              <span className="block text-primary">High-Quality Blogs</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Submit guest posts starting at just <span className="font-bold text-primary">$5</span>. 
              Guaranteed dofollow backlinks & instant SEO boost for your website.
            </p>

            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <div className="flex items-center bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/10">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">85+ DA Sites</span>
              </div>
              <div className="flex items-center bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/10">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium">2-3 Day Approval</span>
              </div>
              <div className="flex items-center bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/10">
                <Shield className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium">100% Safe & Secure</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                asChild 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse-glow"
              >
                <Link to="/signin">
                  Submit Your Guest Post
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
                  View Guidelines
                </Link>
              </Button>
            </div>

            {/* Social Proof Numbers */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Posts Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Approval Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative animate-slide-in-right">
            <div className="relative">
              {/* Glass Card Effect */}
              <div className="bg-card/30 backdrop-blur-lg rounded-3xl p-8 border border-primary/10 shadow-2xl">
                <div className="space-y-6">
                  {/* Featured Content Preview */}
                  <div className="bg-gradient-to-br from-card to-muted/20 rounded-2xl p-6 border border-primary/5">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-primary/10 text-primary border-primary/20">SEO & Marketing</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        1,247 views
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      "10 Proven SEO Strategies That Increased Our Traffic by 300%"
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Learn the exact strategies we used to triple our organic traffic in just 6 months. Real case study with actionable insights...
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        Published & Live
                      </div>
                      <div className="text-primary font-medium">Dofollow Link Included</div>
                    </div>
                  </div>

                  {/* Process Indicators */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm">AI Content Check: Passed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm">Plagiarism Check: 0% Similar</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm">Payment: Confirmed ✨</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-primary to-accent rounded-full p-3 shadow-lg animate-float">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-accent to-primary rounded-full p-3 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;