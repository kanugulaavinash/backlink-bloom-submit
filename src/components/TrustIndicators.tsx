
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Clock, Users, CheckCircle, Star } from "lucide-react";

const TrustIndicators = () => {
  const certifications = [
    { name: "Google Partner", logo: "🅶", verified: true },
    { name: "Content Marketing Institute", logo: "📚", verified: true },
    { name: "SEMrush Certified", logo: "📊", verified: true },
    { name: "Ahrefs Academy", logo: "🔍", verified: true }
  ];

  const guarantees = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "100% money-back if not satisfied",
      color: "text-green-600"
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "48-hour average turnaround",
      color: "text-blue-600"
    },
    {
      icon: Award,
      title: "Premium Sites Only",
      description: "DA 50+ verified publishers",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated account managers",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Trust badges */}
      <div className="flex flex-wrap justify-center items-center gap-8">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <span className="font-semibold text-gray-800">SSL Secured</span>
        </div>
        
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <Star className="h-6 w-6 text-yellow-500 fill-current" />
          <span className="font-semibold text-gray-800">4.9/5 Rating</span>
        </div>
        
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-gray-800">Money-Back Guarantee</span>
        </div>
      </div>

      {/* Certifications */}
      <div className="text-center">
        <p className="text-gray-600 mb-6 text-lg">Certified by Industry Leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {certifications.map((cert, index) => (
            <Badge key={index} variant="secondary" className="px-4 py-2 bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <span className="text-2xl mr-2">{cert.logo}</span>
              {cert.name}
              {cert.verified && <CheckCircle className="h-4 w-4 text-green-600 ml-2" />}
            </Badge>
          ))}
        </div>
      </div>

      {/* Guarantees grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {guarantees.map((guarantee, index) => (
          <div key={index} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
            <guarantee.icon className={`h-8 w-8 ${guarantee.color} mx-auto mb-3`} />
            <h4 className="font-semibold text-gray-900 mb-1 text-sm">{guarantee.title}</h4>
            <p className="text-gray-600 text-xs">{guarantee.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustIndicators;
