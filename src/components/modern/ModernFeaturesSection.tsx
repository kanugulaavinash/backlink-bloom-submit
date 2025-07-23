import { 
  Shield, 
  Zap, 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  BarChart3, 
  Globe, 
  Lock,
  Target,
  Clock,
  Smartphone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const ModernFeaturesSection = () => {
  const mainFeatures = [
    {
      icon: Award,
      title: "Premium High-DA Sites",
      description: "Get published on blogs with 85+ domain authority for maximum SEO impact",
      benefit: "10x better ranking potential",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      stats: "85+ DA Average"
    },
    {
      icon: Zap,
      title: "Lightning Fast Publishing",
      description: "From submission to live publication in just 2-3 business days",
      benefit: "100x faster than outreach",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      stats: "48-72 Hour Avg"
    },
    {
      icon: Shield,
      title: "AI-Powered Quality Checks",
      description: "Advanced plagiarism and AI detection ensures only original content gets published",
      benefit: "Zero spam penalties",
      color: "text-green-500",
      bgColor: "bg-green-50",
      stats: "99.9% Accuracy"
    },
    {
      icon: TrendingUp,
      title: "Guaranteed SEO Results",
      description: "Dofollow backlinks from authoritative sources boost your search rankings",
      benefit: "300%+ traffic increase",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      stats: "Dofollow Links"
    }
  ];

  const additionalFeatures = [
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your backlink performance with detailed analytics dashboard"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Get published on blogs with worldwide audience and authority"
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "PayPal protected transactions with SSL encryption"
    },
    {
      icon: Target,
      title: "Niche Targeting",
      description: "Content placed on relevant, industry-specific blogs"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs"
    },
    {
      icon: Smartphone,
      title: "Mobile Dashboard",
      description: "Manage your submissions from any device, anywhere"
    }
  ];

  const comparisonData = [
    {
      feature: "Cost per backlink",
      us: "$5",
      competitor: "$500-2000",
      advantage: "40x cheaper"
    },
    {
      feature: "Time to publish",
      us: "2-3 days",
      competitor: "2-6 months",
      advantage: "60x faster"
    },
    {
      feature: "Domain Authority",
      us: "85+ DA",
      competitor: "Unknown/Low",
      advantage: "Guaranteed quality"
    },
    {
      feature: "Success rate",
      us: "95%",
      competitor: "2-5%",
      advantage: "19x higher"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            Platform Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to 
            <span className="block text-primary">Dominate Search Rankings</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge technology with human expertise 
            to deliver unmatched guest posting results.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-card to-muted/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                
                <h3 className="font-bold text-lg mb-3 text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  <Badge variant="outline" className={`text-xs ${feature.color}`}>
                    {feature.stats}
                  </Badge>
                  <div className={`text-sm font-semibold ${feature.color}`}>
                    {feature.benefit}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {additionalFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-start p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/5 hover:border-primary/20 transition-all duration-300 animate-slide-in-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-gradient-to-r from-card/50 to-muted/20 rounded-3xl p-8 md:p-12 border border-primary/10">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Why Choose Us Over Traditional Methods?
            </h3>
            <p className="text-lg text-muted-foreground">
              See how we stack up against expensive SEO agencies and manual outreach
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">Backlink Bloom</th>
                  <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Traditional Methods</th>
                  <th className="text-center py-4 px-4 font-semibold text-green-600">Our Advantage</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-primary/5 hover:bg-primary/5 transition-colors duration-200"
                  >
                    <td className="py-6 px-4 font-medium">{row.feature}</td>
                    <td className="py-6 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-semibold text-primary">{row.us}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-center text-muted-foreground">{row.competitor}</td>
                    <td className="py-6 px-4 text-center">
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {row.advantage}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Highlight */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-8 py-4 border border-primary/20">
            <Award className="w-6 h-6 text-primary mr-3" />
            <span className="font-semibold text-foreground">
              🏆 #1 Rated Guest Posting Platform - Join 10,000+ Happy Customers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernFeaturesSection;