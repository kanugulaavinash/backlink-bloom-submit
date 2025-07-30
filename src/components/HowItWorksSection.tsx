
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Search, CheckCircle, Rocket, Clock, Target, Award } from "lucide-react";

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
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          {/* Left Column */}
          <div className="space-y-8">
            <Badge variant="secondary" className="px-4 py-2">
              🔗 Link Building Process
            </Badge>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Stuffedition Link Building Process
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Start your journey to boost your website visibility with our simple, transparent, and effective guest posting process. Get permanent dofollow backlinks for just $5.
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold">
                Link Building Process
              </Button>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="space-y-4">
            <Accordion type="single" collapsible defaultValue="step1" className="w-full">
              {steps.map((step, index) => (
                <AccordionItem key={index} value={`step${index + 1}`} className="border rounded-lg mb-4 bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-4 text-left">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} text-primary-foreground text-lg font-bold`}>
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Step {step.number} - {step.title}
                        </h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="flex items-start gap-4">
                      <step.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                        
                        <ul className="space-y-2">
                          {step.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-muted-foreground">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} mr-3 flex-shrink-0`}></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex items-center text-sm font-medium text-foreground">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {step.timeline}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
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
