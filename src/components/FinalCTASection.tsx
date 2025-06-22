
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTASection = () => {
  return (
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
  );
};

export default FinalCTASection;
