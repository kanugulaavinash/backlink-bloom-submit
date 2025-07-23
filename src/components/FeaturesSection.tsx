import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Link as LinkIcon, 
  Shield, 
  Clock, 
  BarChart3, 
  UserCheck 
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description: "Get your content published for just $5 per post - the most competitive rate in the market.",
      highlight: "Only $5 per post"
    },
    {
      icon: LinkIcon,
      title: "Quality Backlinks",
      description: "Every post includes guaranteed dofollow backlinks plus additional nofollow links for natural SEO.",
      highlight: "Dofollow + Nofollow support"
    },
    {
      icon: Shield,
      title: "Content Verification",
      description: "Advanced AI and plagiarism checks using PlagiarismCheck.org ensure your content meets quality standards.",
      highlight: "AI & Plagiarism checks"
    },
    {
      icon: Clock,
      title: "Quick Turnaround",
      description: "Fast processing with instant publishing after payment confirmation - no waiting periods.",
      highlight: "Instant publishing"
    },
    {
      icon: BarChart3,
      title: "User Dashboard",
      description: "Track all your submissions, payment history, and post performance in one convenient location.",
      highlight: "Complete post & payment history"
    },
    {
      icon: UserCheck,
      title: "Admin Moderation",
      description: "Professional editorial review ensures your content reaches real audiences on quality platforms.",
      highlight: "Real blog exposure"
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            ✨ Why Choose Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Features That Set Us Apart
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover why thousands of content creators trust our platform for their guest posting needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      {feature.description}
                    </p>
                    <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
                      ✅ {feature.highlight}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;