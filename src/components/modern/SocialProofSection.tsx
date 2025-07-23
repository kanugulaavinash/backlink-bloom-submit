import { Star, TrendingUp, Users, Award, Quote, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const SocialProofSection = () => {
  const results = [
    {
      metric: "10,000+",
      label: "Posts Published",
      icon: Users,
      color: "text-blue-500"
    },
    {
      metric: "95%",
      label: "Approval Rate",
      icon: Award,
      color: "text-green-500"
    },
    {
      metric: "300%+",
      label: "Avg Traffic Boost",
      icon: TrendingUp,
      color: "text-purple-500"
    },
    {
      metric: "4.9★",
      label: "Customer Rating",
      icon: Star,
      color: "text-yellow-500"
    }
  ];

  const detailedTestimonials = [
    {
      name: "Marcus Thompson",
      role: "SEO Director",
      company: "TechFlow Solutions",
      avatar: "MT",
      rating: 5,
      result: "Traffic increased by 340%",
      timeframe: "Within 3 months",
      quote: "I was skeptical about the $5 price point, but the quality exceeded my expectations. My article not only got published on a high DA site but also started ranking on page 1 within weeks. The ROI is incredible!",
      industry: "SaaS",
      beforeAfter: {
        before: "2.5K monthly visitors",
        after: "8.7K monthly visitors"
      }
    },
    {
      name: "Sarah Chen",
      role: "Content Marketing Manager",
      company: "E-commerce Plus",
      avatar: "SC",
      rating: 5,
      result: "Domain Authority +15 points",
      timeframe: "In 2 months",
      quote: "The process is incredibly streamlined. I submitted 5 articles and all got approved and published. The backlinks are high-quality and I can see the DA improvement in my analytics. Will definitely use again!",
      industry: "E-commerce",
      beforeAfter: {
        before: "DA 45",
        after: "DA 60"
      }
    },
    {
      name: "David Rodriguez",
      role: "Digital Marketing Consultant",
      company: "Growth Hacker Pro",
      avatar: "DR",
      rating: 5,
      result: "Client retention +50%",
      timeframe: "Ongoing results",
      quote: "I now recommend this platform to all my clients. The results speak for themselves - fast approval, quality sites, and real SEO impact. It's become an essential part of my service offering.",
      industry: "Marketing",
      beforeAfter: {
        before: "Manual outreach hell",
        after: "Automated success"
      }
    }
  ];

  const successStories = [
    {
      title: "How a $25 Investment Generated $50K in Revenue",
      author: "Jessica Park, Founder of FitTech",
      summary: "5 guest posts led to first-page rankings and a massive sales boost",
      readTime: "4 min read",
      category: "Case Study",
      metrics: ["2000% ROI", "Page 1 Rankings", "$50K Revenue"]
    },
    {
      title: "From Zero to Authority: Building a Personal Brand",
      author: "Michael Chen, Business Coach",
      summary: "Strategic guest posting transformed unknown coach into industry thought leader",
      readTime: "6 min read",
      category: "Success Story",
      metrics: ["100K followers", "Speaking gigs", "Book deal"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        {/* Results Dashboard */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-green-50 text-green-600 border-green-200">
            Proven Results
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real Results from Real Customers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. See the incredible results our customers achieve.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {results.map((result, index) => (
            <div 
              key={index} 
              className="text-center group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gradient-to-br from-card to-muted/20 rounded-3xl p-8 border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group-hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                  <result.icon className={`w-8 h-8 ${result.color}`} />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {result.metric}
                </div>
                <div className="text-muted-foreground font-medium">
                  {result.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Customer Stories */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Customer Success Stories</h3>
            <p className="text-lg text-muted-foreground">
              Real people, real businesses, real transformations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {detailedTestimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-xs text-primary">{testimonial.company}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.industry}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                    <p className="text-muted-foreground italic pl-6">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  {/* Results */}
                  <div className="bg-green-50 rounded-2xl p-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {testimonial.result}
                      </div>
                      <div className="text-sm text-green-600/80">
                        {testimonial.timeframe}
                      </div>
                    </div>
                  </div>

                  {/* Before/After */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-red-50 rounded-xl p-3">
                      <div className="text-xs text-red-600 font-medium mb-1">BEFORE</div>
                      <div className="text-sm font-semibold text-red-700">
                        {testimonial.beforeAfter.before}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3">
                      <div className="text-xs text-green-600 font-medium mb-1">AFTER</div>
                      <div className="text-sm font-semibold text-green-700">
                        {testimonial.beforeAfter.after}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Story Articles */}
        <div className="bg-gradient-to-r from-card/50 to-muted/20 rounded-3xl p-8 md:p-12 border border-primary/10 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Detailed Case Studies & Success Stories
            </h3>
            <p className="text-lg text-muted-foreground">
              Learn exactly how our customers achieved their remarkable results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <div 
                key={index} 
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/5 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group animate-slide-in-left"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Badge variant="outline" className="mb-4 text-primary border-primary/20">
                  {story.category}
                </Badge>
                
                <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {story.title}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-4">
                  by {story.author}
                </p>
                
                <p className="text-muted-foreground mb-6">
                  {story.summary}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {story.metrics.map((metric, metricIndex) => (
                    <Badge key={metricIndex} variant="secondary" className="text-xs">
                      {metric}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{story.readTime}</span>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    Read Full Story
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof Banner */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 text-center border border-primary/10">
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            {/* Customer Avatars */}
            <div className="flex -space-x-4">
              {['JD', 'SM', 'KL', 'RT', 'MN'].map((initials, index) => (
                <div 
                  key={index} 
                  className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-background"
                >
                  {initials}
                </div>
              ))}
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold text-sm border-4 border-background">
                +2K
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                Join 10,000+ Happy Customers
              </div>
              <div className="text-muted-foreground">
                Who've already boosted their SEO with our platform
              </div>
            </div>
          </div>
          
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-300">
            <Link to="/signin">
              Start Your Success Story Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;