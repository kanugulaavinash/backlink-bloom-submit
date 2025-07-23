import { AlertTriangle, TrendingDown, Clock, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ProblemSolutionSection = () => {
  const problems = [
    {
      icon: TrendingDown,
      title: "Low Domain Authority",
      description: "Your website struggles to rank due to weak backlink profile",
      impact: "87% of sites never reach page 1"
    },
    {
      icon: DollarSign,
      title: "Expensive SEO Services",
      description: "Traditional link building costs $500-2000+ per month",
      impact: "ROI takes 6-12 months to show"
    },
    {
      icon: Clock,
      title: "Slow Manual Outreach",
      description: "Finding quality sites and building relationships takes months",
      impact: "Only 2-5% response rate"
    },
    {
      icon: AlertTriangle,
      title: "Risky Link Building",
      description: "Spam links can get your site penalized by Google",
      impact: "Recovery can take years"
    }
  ];

  const solutions = [
    {
      problem: "Low Domain Authority",
      solution: "Access to 85+ DA premium blogs",
      benefit: "Instant authority boost",
      icon: CheckCircle
    },
    {
      problem: "Expensive Costs",
      solution: "Quality backlinks starting at just $5",
      benefit: "10x cheaper than alternatives",
      icon: CheckCircle
    },
    {
      problem: "Time Consuming",
      solution: "Submit & get published in 2-3 days",
      benefit: "100x faster than outreach",
      icon: CheckCircle
    },
    {
      problem: "Risk of Penalties",
      solution: "White-hat, editorial dofollow links",
      benefit: "100% Google-safe practices",
      icon: CheckCircle
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-red-50 text-red-600 border-red-200">
            The Problem
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Traditional SEO & Link Building is 
            <span className="block text-red-500">Broken & Expensive</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Most businesses struggle with SEO because traditional methods are slow, expensive, and risky. 
            Here's why the old way doesn't work anymore:
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-2xl mb-4">
                <problem.icon className="h-7 w-7 text-red-500" />
              </div>
              <h4 className="font-bold text-lg text-red-700 mb-3">{problem.title}</h4>
              <p className="text-red-600/80 text-sm mb-3">{problem.description}</p>
              <Badge variant="outline" className="text-xs text-red-500 border-red-200">
                {problem.impact}
              </Badge>
            </div>
          ))}
        </div>

        {/* Solution Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-green-50 text-green-600 border-green-200">
            Our Solution
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Introducing the 
            <span className="block text-green-500">Smart Way to Build Authority</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Skip the expensive agencies, slow outreach, and risky tactics. 
            Get quality backlinks the modern way - fast, affordable, and completely safe.
          </p>
        </div>

        {/* Before vs After Comparison */}
        <div className="bg-gradient-to-r from-card/50 to-muted/20 rounded-3xl p-8 md:p-12 border border-primary/10 mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Before Column */}
            <div>
              <h3 className="text-2xl font-bold text-red-500 mb-8 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3" />
                Traditional Way (Broken)
              </h3>
              <div className="space-y-6">
                {problems.map((problem, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-1">{problem.title}</h4>
                      <p className="text-red-600/80 text-sm">{problem.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* After Column */}
            <div>
              <h3 className="text-2xl font-bold text-green-500 mb-8 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3" />
                Our Way (Fixed)
              </h3>
              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-1">{solution.solution}</h4>
                      <p className="text-green-600/80 text-sm mb-1">{solution.benefit}</p>
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                        vs. {solution.problem}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROI Calculator Preview */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 text-center border border-primary/10">
          <h3 className="text-2xl font-bold mb-4">See Your Potential ROI</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-card/80 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary mb-2">$5</div>
              <div className="text-sm text-muted-foreground">Per Guest Post</div>
            </div>
            <div className="bg-card/80 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-accent mb-2">85+ DA</div>
              <div className="text-sm text-muted-foreground">Average Site Authority</div>
            </div>
            <div className="bg-card/80 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-500 mb-2">300%+</div>
              <div className="text-sm text-muted-foreground">Traffic Increase</div>
            </div>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
            <Link to="/signin">
              Start Building Authority Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;