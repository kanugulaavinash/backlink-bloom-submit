
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, CheckCircle, Rocket, ArrowRight, Clock, Target, Award } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Write SEO-Friendly Content",
      description: "Create original, engaging content with minimum 650 words that provides real value to readers.",
      icon: FileText,
      color: "from-primary to-primary/70",
      features: ["Minimum 650 words", "Original content only", "SEO-optimized structure"],
      timeline: "Your time"
    },
    {
      number: "02", 
      title: "Submit & AI Check",
      description: "Upload your post and let our AI system run plagiarism and content quality checks automatically.",
      icon: Search,
      color: "from-accent to-accent/70",
      features: ["AI content detection", "Plagiarism check via PlagiarismCheck.org", "Quality scoring"],
      timeline: "2-5 minutes"
    },
    {
      number: "03",
      title: "Pay Securely",
      description: "Complete your submission with secure PayPal payment. Only $5 per post with instant confirmation.",
      icon: CheckCircle,
      color: "from-primary to-accent", 
      features: ["Secure PayPal payment", "Just $5 per post", "Instant confirmation"],
      timeline: "30 seconds"
    },
    {
      number: "04",
      title: "Get Published & Shared",
      description: "Your post goes live immediately with guaranteed dofollow backlink and gets shared across our network.",
      icon: Rocket,
      color: "from-accent to-primary",
      features: ["Instant publishing", "Guaranteed dofollow link", "Social sharing"],
      timeline: "Immediate"
    }
  ];

  return (
    <section className="py-24 px-4 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            ⚡ Simple Process
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            How It <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From content creation to live publication in just 4 simple steps. Transparent process with instant results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
                <Card className="p-8 h-full bg-card border shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden">
                 {/* Background gradient */}
                 <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`}></div>
                 
                 {/* Step number */}
                 <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-primary-foreground text-2xl font-bold mb-6`}>
                   {step.number}
                 </div>

                 {/* Icon */}
                 <step.icon className="h-12 w-12 mb-6 text-primary" />

                <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{step.description}</p>

                 {/* Features */}
                 <ul className="space-y-2 mb-6">
                   {step.features.map((feature, idx) => (
                     <li key={idx} className="flex items-center text-sm text-muted-foreground">
                       <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} mr-3`}></div>
                       {feature}
                     </li>
                   ))}
                 </ul>

                 {/* Timeline */}
                 <div className="flex items-center text-sm font-medium text-foreground">
                   <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                   {step.timeline}
                 </div>
              </Card>

               {/* Arrow connector (hidden on last item) */}
               {index < steps.length - 1 && (
                 <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                   <ArrowRight className="h-8 w-8 text-muted-foreground" />
                 </div>
               )}
            </div>
          ))}
        </div>

        {/* Process guarantees */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">98% Approval Rate</h4>
            <p className="text-gray-600">Our quality-first approach ensures your content gets published</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Fast Turnaround</h4>
            <p className="text-gray-600">Most submissions reviewed and published within 48 hours</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h4>
            <p className="text-gray-600">Only high-authority sites with DA 50+ in our network</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
