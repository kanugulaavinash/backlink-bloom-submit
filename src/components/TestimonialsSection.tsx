
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, TrendingUp, Users, BarChart3 } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Marketing Director",
      company: "TechFlow Solutions",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c5fd?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "GuestPost Pro transformed our content strategy completely. We saw a 300% increase in organic traffic within 3 months. The quality of sites in their network is unmatched.",
      results: {
        metric: "Organic Traffic",
        increase: "+300%",
        timeframe: "3 months"
      }
    },
    {
      name: "Michael Chen",
      role: "Founder & CEO",
      company: "Growth Hackers Inc",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The ROI on guest posting through this platform is incredible. Every dollar spent has returned at least $8 in new business. Their targeting is spot-on.",
      results: {
        metric: "ROI",
        increase: "800%",
        timeframe: "6 months"
      }
    },
    {
      name: "Emily Rodriguez",
      role: "Content Marketing Manager",
      company: "StartupBoost",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "What impressed me most is the speed and quality. Our articles get published on high-DA sites within days, not weeks. Customer support is exceptional too.",
      results: {
        metric: "Domain Authority",
        increase: "+45 pts",
        timeframe: "4 months"
      }
    },
    {
      name: "David Park",
      role: "SEO Specialist",
      company: "Digital Dynamo",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "I've tried many guest posting services, but none come close to this level of quality and results. Our keyword rankings improved dramatically.",
      results: {
        metric: "Keyword Rankings",
        increase: "+67%",
        timeframe: "2 months"
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
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            ⭐ Client Success Stories
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            What Our Clients <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of marketers who've accelerated their growth with our premium guest posting platform
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
