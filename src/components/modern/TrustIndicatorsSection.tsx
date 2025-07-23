import { Shield, Zap, Award, Users, CheckCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TrustIndicatorsSection = () => {
  const indicators = [
    {
      icon: Shield,
      title: "100% Secure Payments",
      description: "PayPal protected transactions",
      metric: "SSL Encrypted",
      color: "text-green-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "2-3 day approval process",
      metric: "48-72 Hours",
      color: "text-yellow-500"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "85+ average domain authority",
      metric: "High DA Sites",
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "10,000+ satisfied customers",
      metric: "5-Star Reviews",
      color: "text-blue-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "SEO Specialist",
      company: "TechStart Inc.",
      avatar: "SC",
      rating: 5,
      text: "Incredible ROI for just $5. My article ranked on the first page within 2 weeks!"
    },
    {
      name: "Mike Rodriguez",
      role: "Content Manager",
      company: "Digital Growth Co.",
      avatar: "MR",
      rating: 5,
      text: "Clean interface, fast approval, and real results. Will definitely use again!"
    },
    {
      name: "Emma Johnson",
      role: "Marketing Director",
      company: "E-commerce Plus",
      avatar: "EJ",
      rating: 5,
      text: "The quality of sites is amazing. Perfect for building domain authority."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        {/* Trust Indicators */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            Why Choose Us?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of content creators who trust our platform for their guest posting needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {indicators.map((indicator, index) => (
            <div 
              key={index} 
              className="text-center group hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-card to-muted/20 rounded-2xl border border-primary/10 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <indicator.icon className={`h-8 w-8 ${indicator.color}`} />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">{indicator.title}</h4>
              <p className="text-muted-foreground mb-2">{indicator.description}</p>
              <Badge variant="outline" className="text-xs font-medium">
                {indicator.metric}
              </Badge>
            </div>
          ))}
        </div>

        {/* Customer Testimonials */}
        <div className="bg-gradient-to-r from-card/50 to-muted/20 rounded-3xl p-8 md:p-12 border border-primary/10 backdrop-blur-sm">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">What Our Customers Say</h3>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-semibold">4.9/5</span>
              <span className="text-muted-foreground ml-1">(2,847 reviews)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/5 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-primary">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-green-500/10 rounded-full px-6 py-3 border border-green-500/20">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <span className="text-sm font-medium text-green-700">
              🔥 127 posts submitted in the last 24 hours
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicatorsSection;