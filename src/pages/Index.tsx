
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SamplePostsCarousel from "@/components/SamplePostsCarousel";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            🚀 Launch Your Content & Build Authority
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Premium Guest Posting
            <span className="text-blue-600 block">Made Simple</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Submit high-quality guest posts, earn permanent do-follow backlinks, and grow your online presence through our streamlined submission and approval process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/submit-post">
              <Button size="lg" className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                Submit Guest Post
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/guidelines">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2 hover:bg-blue-50 transition-all duration-300">
                View Guidelines
              </Button>
            </Link>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Shield className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">AI and plagiarism detection ensures only high-quality, original content gets published.</p>
            </Card>
            
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Zap className="h-12 w-12 text-green-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Fast Approval</h3>
              <p className="text-gray-600">Streamlined review process gets your content live quickly with permanent backlinks.</p>
            </Card>
            
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Expert Network</h3>
              <p className="text-gray-600">Join a community of writers and publishers building authority through quality content.</p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Sample Posts Carousel */}
      <SamplePostsCarousel />
      
      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 mb-12">One price, unlimited potential for your content marketing strategy</p>
          
          <Card className="max-w-md mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Guest Post Submission</h3>
              <div className="flex items-center justify-center mb-6">
                <span className="text-5xl font-bold text-blue-600">$5</span>
                <span className="text-gray-600 ml-2">per post</span>
              </div>
              
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Permanent do-follow backlinks</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>AI & plagiarism validation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Professional editorial review</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Full refund if rejected</span>
                </li>
              </ul>
              
              <Link to="/submit-post">
                <Button className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
