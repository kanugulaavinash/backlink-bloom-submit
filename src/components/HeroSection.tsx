
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              💎 Premium Guest Posting Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Get Your Content Published on 
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block mt-2">
                High-Quality Blogs
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Submit guest posts starting at just $5. Guaranteed dofollow backlink & SEO boost with our trusted publishing network.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>AI & Plagiarism Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Dofollow Backlinks</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>Instant Publishing</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signin">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Submit Your Guest Post
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/blog">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  View Submission Guidelines
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 backdrop-blur-sm border border-border">
              <div className="w-full h-full bg-card rounded-xl shadow-2xl flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-24 w-24 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Content Marketing</h3>
                  <p className="text-muted-foreground">Professional guest posting made simple</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
