import { Shield, TrendingUp, Globe, Zap, CheckCircle, Star } from "lucide-react";

const WebTwoBacklinksSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "High Authority Domains",
      description: "Web 2.0 platforms with established domain authority and trust"
    },
    {
      icon: TrendingUp,
      title: "Boost Search Rankings",
      description: "Contextual backlinks that improve your website's visibility"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access to diverse, international Web 2.0 properties"
    },
    {
      icon: Zap,
      title: "Fast Indexing",
      description: "Quick search engine recognition and crawling"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Why Buy Backlinks From Us?
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                Web 2.0 Blog Websites
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Harness the power of Web 2.0 platforms to create authoritative backlinks that strengthen your SEO profile. Our carefully curated network of high-quality Web 2.0 properties provides contextual links within blogs that have real ranking power.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-foreground mb-4">What Makes Our Service Special:</h4>
              <div className="space-y-3">
                {[
                  "Powerful ways to control conversation around your content",
                  "High-quality Web 2.0 properties with proven track records",
                  "Authoritative domains that strengthen your SEO profile",
                  "Contextual links within blogs with real ranking power",
                  "Improved website visibility in search results"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visual Representation */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12">
              {/* Web 2.0 Platform Icons */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div 
                    key={item} 
                    className="bg-white rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="w-full h-12 bg-gradient-to-r from-primary/20 to-primary/10 rounded-md mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded w-3/4"></div>
                      <div className="h-2 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Central Connection Visual */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {/* Connection Lines */}
                <svg className="w-full h-32" viewBox="0 0 300 120">
                  {[
                    { x1: 50, y1: 20, x2: 150, y2: 60 },
                    { x1: 150, y1: 20, x2: 150, y2: 60 },
                    { x1: 250, y1: 20, x2: 150, y2: 60 },
                    { x1: 50, y1: 100, x2: 150, y2: 60 },
                    { x1: 150, y1: 100, x2: 150, y2: 60 },
                    { x1: 250, y1: 100, x2: 150, y2: 60 }
                  ].map((line, index) => (
                    <line 
                      key={index}
                      x1={line.x1} 
                      y1={line.y1} 
                      x2={line.x2} 
                      y2={line.y2} 
                      stroke="hsl(var(--primary))" 
                      strokeWidth="2" 
                      strokeOpacity="0.3"
                      className="animate-pulse"
                    />
                  ))}
                </svg>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="text-2xl font-bold text-foreground">98%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-2xl font-bold text-foreground">500+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Web 2.0 Sites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebTwoBacklinksSection;