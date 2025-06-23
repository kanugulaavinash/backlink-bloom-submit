
import { Shield, Zap, Award, Users } from "lucide-react";

const TrustIndicators = () => {
  const indicators = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your content is safe with us"
    },
    {
      icon: Zap,
      title: "Fast Approval",
      description: "Get published in 2-3 days"
    },
    {
      icon: Award,
      title: "High DA Sites",
      description: "85+ average domain authority"
    },
    {
      icon: Users,
      title: "Trusted Platform",
      description: "Join thousands of satisfied users"
    }
  ];

  return (
    <div className="mt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {indicators.map((indicator, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
              <indicator.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{indicator.title}</h4>
            <p className="text-sm text-gray-600">{indicator.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustIndicators;
