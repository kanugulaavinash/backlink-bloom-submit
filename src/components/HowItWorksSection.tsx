
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, CheckCircle, Rocket, ArrowRight, Clock, Target, Award } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Submit Your Guest Post",
      description: "Write a plagiarism-free, human-written article that offers genuine value to readers. Your content should be at least 600 words and relevant to our approved niches.",
      icon: FileText,
      color: "from-primary to-primary/70",
      features: ["Minimum 600+ words", "SEO, tech, marketing, business niches", "Include one anchor text with dofollow link"],
      timeline: "Your time"
    },
    {
      number: "02", 
      title: "Content Review & Screening",
      description: "Our editorial team reviews your content for originality, human-authorship, relevance, quality of writing, and proper link placement.",
      icon: Search,
      color: "from-accent to-accent/70",
      features: ["Plagiarism check", "AI detection tools", "Quality & relevance review"],
      timeline: "Review process"
    },
    {
      number: "03",
      title: "Make Your Payment",
      description: "After your content is approved, proceed to make the $5 USD payment. You'll receive a confirmation once the payment is successful.",
      icon: CheckCircle,
      color: "from-primary to-accent", 
      features: ["Payment after approval", "$5 USD only", "Instant confirmation"],
      timeline: "30 seconds"
    },
    {
      number: "04",
      title: "Publication",
      description: "Your article is published on Stuffedition with a permanent dofollow backlink. The post will be indexed by search engines and made publicly accessible.",
      icon: Rocket,
      color: "from-accent to-primary",
      features: ["Permanent dofollow backlink", "Search engine indexing", "Live link via email"],
      timeline: "24-48 hours"
    },
    {
      number: "05",
      title: "Permanent Link Placement",
      description: "Your backlink remains live forever — unless the article violates our terms. Otherwise, it's a one-time investment for permanent SEO value.",
      icon: Award,
      color: "from-primary to-accent",
      features: ["Forever guarantee", "One-time investment", "Permanent SEO value"],
      timeline: "Lifetime"
    }
  ];

  return (
    <section className="py-24 px-4 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            🔗 Link Building Process
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our Link Building Process – <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Simple, Transparent, Effective</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At Stuffedition, we make link building affordable, efficient, and quality-focused. Here's a step-by-step look at how our guest posting and dofollow backlink system works.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
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

        {/* Results Section */}
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-8">
            🎯 <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Results</span>: Boost SEO & Authority
          </h3>
          <p className="text-lg text-muted-foreground mb-12">
            Once published, your backlink starts helping immediately:
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-foreground mb-2">Improve Domain Authority</h4>
              <p className="text-muted-foreground">Boost your website's authority with quality backlinks</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl">
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-foreground mb-2">Increase Referral Traffic</h4>
              <p className="text-muted-foreground">Drive targeted visitors to your website</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-foreground mb-2">Enhance Search Visibility</h4>
              <p className="text-muted-foreground">Improve organic search rankings and visibility</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl">
              <Rocket className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-foreground mb-2">Strengthen Off-Page SEO</h4>
              <p className="text-muted-foreground">Build a strong backlink profile for long-term success</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
