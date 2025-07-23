import { Check, X, Star, Zap, Shield, Award, ArrowRight, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

const PricingValueSection = () => {
  const plans = [
    {
      name: "Single Post",
      price: "$5",
      period: "per post",
      description: "Perfect for testing our platform",
      features: [
        "1 High-DA Guest Post",
        "AI & Plagiarism Check",
        "Dofollow Backlink",
        "2-3 Day Publishing",
        "Basic Analytics",
        "Email Support"
      ],
      notIncluded: [
        "Priority Review",
        "Custom Categories",
        "Dedicated Support"
      ],
      popular: false,
      color: "border-gray-200",
      buttonStyle: "variant-outline"
    },
    {
      name: "Pro Package",
      price: "$20",
      period: "for 5 posts",
      description: "Best value for consistent content creators",
      features: [
        "5 High-DA Guest Posts",
        "AI & Plagiarism Check",
        "Dofollow Backlinks",
        "Priority 24h Publishing",
        "Advanced Analytics",
        "Category Selection",
        "Priority Support",
        "Performance Tracking"
      ],
      notIncluded: [
        "White-label Reports"
      ],
      popular: true,
      color: "border-primary",
      buttonStyle: "default",
      savings: "Save $5"
    },
    {
      name: "Agency",
      price: "$75",
      period: "for 20 posts",
      description: "Ideal for agencies and large businesses",
      features: [
        "20 High-DA Guest Posts",
        "AI & Plagiarism Check",
        "Dofollow Backlinks",
        "Same-day Publishing",
        "Premium Analytics",
        "Custom Categories",
        "Dedicated Account Manager",
        "White-label Reports",
        "Bulk Upload Tools",
        "API Access"
      ],
      notIncluded: [],
      popular: false,
      color: "border-accent",
      buttonStyle: "secondary",
      savings: "Save $25"
    }
  ];

  const valueComparison = [
    {
      service: "SEO Agency",
      cost: "$2,000-5,000/month",
      timeframe: "6-12 months",
      results: "Unknown quality"
    },
    {
      service: "Freelance Outreach",
      cost: "$500-1,500/month",
      timeframe: "3-6 months",
      results: "2-5% success rate"
    },
    {
      service: "DIY Outreach",
      cost: "100+ hours/month",
      timeframe: "Ongoing struggle",
      results: "Minimal results"
    }
  ];

  const roiCalculator = {
    investment: "$20",
    trafficIncrease: "300%",
    conversionRate: "2%",
    avgOrderValue: "$100",
    monthlyRevenue: "$1,200",
    roi: "6,000%"
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-green-50 text-green-600 border-green-200">
            Transparent Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unbeatable Value for 
            <span className="block text-primary">World-Class SEO Results</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get premium backlinks at a fraction of the cost of traditional SEO services. 
            No contracts, no hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative group hover:shadow-xl transition-all duration-300 ${plan.popular ? 'scale-105 shadow-lg' : ''} border-2 ${plan.color} animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
                {plan.savings && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 mb-2">
                    {plan.savings}
                  </Badge>
                )}
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center opacity-50">
                      <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                      <span className="text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  asChild 
                  variant={plan.buttonStyle as any}
                  size="lg" 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white' : ''} transform hover:scale-105 transition-all duration-300`}
                >
                  <Link to="/signin">
                    Get Started Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Value Comparison */}
        <div className="bg-gradient-to-r from-card/50 to-muted/20 rounded-3xl p-8 md:p-12 border border-primary/10 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Compare Our Value vs Traditional Methods
            </h3>
            <p className="text-lg text-muted-foreground">
              See why smart businesses choose our platform over expensive alternatives
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Method</th>
                  <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Monthly Cost</th>
                  <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Time to Results</th>
                  <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Quality</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-green-100 bg-green-50/50">
                  <td className="py-6 px-4 font-bold text-green-700">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Backlink Bloom
                    </div>
                  </td>
                  <td className="py-6 px-4 text-center font-bold text-green-700">$20-75</td>
                  <td className="py-6 px-4 text-center font-bold text-green-700">2-3 days</td>
                  <td className="py-6 px-4 text-center">
                    <Badge className="bg-green-500 text-white">85+ DA Guaranteed</Badge>
                  </td>
                </tr>
                {valueComparison.map((comparison, index) => (
                  <tr key={index} className="border-b border-primary/5 hover:bg-red-50/30 transition-colors duration-200">
                    <td className="py-6 px-4 text-muted-foreground">{comparison.service}</td>
                    <td className="py-6 px-4 text-center text-red-600 font-semibold">{comparison.cost}</td>
                    <td className="py-6 px-4 text-center text-red-600">{comparison.timeframe}</td>
                    <td className="py-6 px-4 text-center text-red-600">{comparison.results}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12 border border-primary/10 mb-16">
          <div className="text-center mb-12">
            <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Your Potential ROI Calculator
            </h3>
            <p className="text-lg text-muted-foreground">
              Based on average customer results with our Pro Package
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
                <div className="text-2xl font-bold text-primary mb-2">{roiCalculator.investment}</div>
                <div className="text-sm text-muted-foreground">Initial Investment</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
            
            <div className="text-center">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
                <div className="text-2xl font-bold text-green-500 mb-2">{roiCalculator.trafficIncrease}</div>
                <div className="text-sm text-muted-foreground">Traffic Increase</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
            
            <div className="text-center">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
                <div className="text-2xl font-bold text-blue-500 mb-2">{roiCalculator.monthlyRevenue}</div>
                <div className="text-sm text-muted-foreground">Monthly Revenue</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
                <div className="text-2xl font-bold mb-2">{roiCalculator.roi}</div>
                <div className="text-sm opacity-90">ROI in 30 days</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-6">
              * Results based on average customer data. Individual results may vary.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Link to="/signin">
                Calculate Your ROI
                <Calculator className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-blue-50 rounded-full px-8 py-4 border border-green-200">
            <Shield className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <div className="font-semibold text-green-700">30-Day Money-Back Guarantee</div>
              <div className="text-sm text-green-600">Risk-free trial. Not satisfied? Get your money back.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingValueSection;