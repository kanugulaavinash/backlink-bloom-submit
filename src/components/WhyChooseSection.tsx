import { Badge } from "@/components/ui/badge";
import { Globe, Brain, Lock, MessageCircle, Target, Users } from "lucide-react";

const WhyChooseSection = () => {
  const reasons = [
    {
      icon: Globe,
      title: "Trusted by SEO professionals & freelancers worldwide",
      description: "Join thousands of satisfied users"
    },
    {
      icon: Brain,
      title: "Built-in AI & plagiarism detection system",
      description: "Advanced content screening tools"
    },
    {
      icon: Lock,
      title: "Permanent placement",
      description: "No hidden takedown policy"
    },
    {
      icon: MessageCircle,
      title: "Transparent process",
      description: "Fast communication & support"
    },
    {
      icon: Target,
      title: "Ideal for link builders",
      description: "Content marketers & new bloggers"
    },
    {
      icon: Users,
      title: "Trusted Platform",
      description: "Built by professionals for professionals"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-6 py-3">
            💡 Why Choose Stuffedition?
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            The Smart Choice for Guest Posting
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            We maintain strict editorial guidelines and provide unmatched value for your investment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <reason.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    {reason.title}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;