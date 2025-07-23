
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, TrendingUp, Users, BarChart3 } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "DigitalMarketerX",
      role: "SEO Specialist",
      company: "Marketing Agency",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Great ROI for just $5. My article ranked within weeks and is still driving organic traffic months later!",
      results: {
        metric: "Keyword Ranking",
        increase: "#3 Position",
        timeframe: "3 weeks"
      }
    },
    {
      name: "Sarah",
      role: "SEO Specialist", 
      company: "Content Marketing Pro",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c5fd?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Clean interface and helpful team. The submission process is straightforward and I love the instant publishing. Will use again!",
      results: {
        metric: "Publications",
        increase: "8 Quality Blogs",
        timeframe: "2 months"
      }
    },
    {
      name: "Content Creator Mike",
      role: "Blogger",
      company: "Tech Reviews Hub",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Finally found a guest posting platform that actually delivers. No waiting periods, just instant results after payment.",
      results: {
        metric: "Traffic Increase",
        increase: "+250%",
        timeframe: "1 month"
      }
    },
    {
      name: "Lisa M.",
      role: "Marketing Manager",
      company: "SaaS Startup",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The AI content checks are thorough but fair. Helped me improve my writing and get better engagement rates.",
      results: {
        metric: "Approval Rate",
        increase: "90%",
        timeframe: "Overall"
      }
    }
  ];

  const stats = [
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "50K+", label: "Happy Clients", icon: Users },
    { number: "250%", label: "Avg Traffic Boost", icon: TrendingUp },
    { number: "98%", label: "Client Retention", icon: BarChart3 }
  ];

  return (
    <section className="py-24 px-4 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            💬 Trusted By
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            What Our Users Are Saying
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join successful marketers and content creators who trust our platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <stat.icon className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden">
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 h-12 w-12 text-gray-200" />
              
              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Results badge */}
              <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <TrendingUp className="h-4 w-4 mr-2" />
                {testimonial.results.metric}: {testimonial.results.increase} in {testimonial.results.timeframe}
              </div>

              {/* Author info */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 ring-4 ring-white shadow-lg"
                />
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  <div className="text-blue-600 text-sm font-medium">{testimonial.company}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Social proof banner */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-${400 + i * 100} to-purple-${400 + i * 100} ring-4 ring-white`}></div>
              ))}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Join 50,000+ Successful Marketers</h3>
          <p className="text-gray-600">Ready to see similar results for your business?</p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
