
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTASection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Grow Your SEO Authority?
        </h2>
        <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
          Join thousands of successful content creators who've boosted their rankings with our affordable guest posting platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signin">
            <Button size="lg" className="px-12 py-6 text-xl bg-background text-foreground hover:bg-background/90 shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Send className="mr-3 h-6 w-6" />
              Submit Your Guest Post
            </Button>
          </Link>
          
          <Link to="/blog">
            <Button variant="outline" size="lg" className="px-8 py-6 text-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Read Submission Rules
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-primary-foreground/70 text-sm flex items-center justify-center gap-6 flex-wrap">
          <span className="flex items-center gap-1">🔒 Secure payment</span>
          <span className="flex items-center gap-1">⚡ Instant publishing</span>
          <span className="flex items-center gap-1">💯 Satisfaction guaranteed</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
