
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, CheckCircle, Rocket, ArrowRight, Clock, Target, Award } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Submit Your Content",
      description: "Upload your high-quality article with target keywords and preferred niches. Our AI instantly validates content quality and originality.",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      features: ["AI plagiarism check", "SEO optimization scan", "Quality score analysis"],
      timeline: "Instant validation"
    },
    {
      number: "02", 
      title: "Smart Site Matching",
      description: "Our algorithm matches your content with the most relevant high-authority sites in our premium network based on niche and audience.",
      icon: Search,
      color: "from-purple-500 to-pink-500",
      features: ["DA 50+ sites only", "Niche relevance scoring", "Audience alignment"],
      timeline: "Within 2 hours"
    },
    {
      number: "03",
      title: "Editorial Review",
      description: "Expert editors review your content for quality, relevance, and compliance with site guidelines before publication approval.",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500", 
      features: ["Human expert review", "Guidelines compliance", "Final optimization"],
      timeline: "24-48 hours"
    },
    {
      number: "04",
      title: "Live Publication",
      description: "Your content goes live with permanent do-follow backlinks. Track performance with our comprehensive analytics dashboard.",
      icon: Rocket,
      color: "from-orange-500 to-red-500",
      features: ["Permanent placement", "Do-follow backlinks", "Performance tracking"],
      timeline: "Publication confirmed"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            ⚡ Streamlined Process
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From submission to publication in just 4 simple steps. Our streamlined process ensures quality while maximizing your content's reach and impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-8 h-full bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`}></div>
                
                {/* Step number */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white text-2xl font-bold mb-6`}>
                  {step.number}
                </div>

                {/* Icon */}
                <step.icon className={`h-12 w-12 mb-6 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} />

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {step.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} mr-3`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Timeline */}
                <div className="flex items-center text-sm font-medium text-gray-800">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  {step.timeline}
                </div>
              </Card>

              {/* Arrow connector (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-gray-300" />
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
