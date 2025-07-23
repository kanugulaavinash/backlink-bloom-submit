import { FileText, Shield, CreditCard, Rocket, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ModernHowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Create Quality Content",
      description: "Write an SEO-friendly, original article (minimum 650 words) that provides real value to readers.",
      details: [
        "Choose your target keywords",
        "Include 1 dofollow + 2-3 nofollow links max",
        "Focus on helpful, actionable content",
        "Use proper formatting and structure"
      ],
      time: "30-60 min",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      number: "02",
      icon: Shield,
      title: "AI & Plagiarism Check",
      description: "Our system automatically validates your content for originality and quality using advanced AI detection.",
      details: [
        "Real-time plagiarism scanning",
        "AI-generated content detection",
        "SEO quality assessment",
        "Instant pass/fail results"
      ],
      time: "2-3 min",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      number: "03",
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay safely through PayPal. Your content enters our publication queue immediately after payment confirmation.",
      details: [
        "SSL-encrypted transactions",
        "PayPal buyer protection",
        "Instant payment confirmation",
        "Automatic queue placement"
      ],
      time: "1-2 min",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      number: "04",
      icon: Rocket,
      title: "Get Published & Live",
      description: "Your post goes live on our high-authority blog with your dofollow backlink, ready to boost your SEO.",
      details: [
        "Published within 2-3 days",
        "Dofollow backlink included",
        "Social media promotion",
        "Analytics tracking available"
      ],
      time: "48-72h",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const guarantees = [
    {
      icon: CheckCircle,
      title: "95% Approval Rate",
      description: "Original, quality content gets approved",
      metric: "9,500+ approved"
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Published within 2-3 business days",
      metric: "Average: 48h"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Every post is manually reviewed",
      metric: "100% human-checked"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Published in 4 Simple Steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes guest posting effortless. From submission to publication in just 2-3 days.
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="relative mb-20">
          {/* Connection Line */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-primary via-accent to-primary opacity-30 hidden lg:block"></div>
          
          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-4">
                    <Badge variant="outline" className={`mb-2 ${step.borderColor} ${step.color} font-mono`}>
                      Step {step.number}
                    </Badge>
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Time: {step.time}</span>
                    </div>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-6 max-w-lg">
                    {step.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center justify-center lg:justify-start">
                        <CheckCircle className={`w-4 h-4 ${step.color} mr-2 flex-shrink-0`} />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Element */}
                <div className="flex-shrink-0">
                  <div className={`relative w-32 h-32 ${step.bgColor} ${step.borderColor} border-2 rounded-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                    <step.icon className={`w-16 h-16 ${step.color}`} />
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.number}
                    </div>
                    
                    {/* Connecting Arrow */}
                    {index < steps.length - 1 && (
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden">
                        <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Guarantees */}
        <div className="bg-gradient-to-r from-card/50 to-muted/20 rounded-3xl p-8 md:p-12 border border-primary/10 backdrop-blur-sm">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Process Guarantees</h3>
            <p className="text-lg text-muted-foreground">
              Transparent, reliable, and results-driven approach to guest posting
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => (
              <div 
                key={index} 
                className="text-center group hover:scale-105 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                  <guarantee.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">{guarantee.title}</h4>
                <p className="text-muted-foreground mb-3">{guarantee.description}</p>
                <Badge variant="outline" className="text-xs font-medium">
                  {guarantee.metric}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Live Process Demo */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-green-500/10 rounded-full px-6 py-3 border border-green-500/20">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <span className="text-sm font-medium text-green-700">
              🚀 Step 4: 23 posts are being published today
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHowItWorksSection;