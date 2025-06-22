
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Minus, MessageCircle, Clock, Shield, DollarSign, FileText, Target } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      icon: Clock,
      question: "How long does it take to get my post published?",
      answer: "Most posts are reviewed and published within 24-48 hours. Our Premium plan offers same-day review for urgent submissions. You'll receive notifications at each stage of the process.",
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      question: "What happens if my post gets rejected?",
      answer: "We offer a 100% money-back guarantee if your post is rejected. However, with our 98% approval rate and pre-submission AI validation, rejections are rare. We also provide detailed feedback to help improve future submissions.",
      color: "text-green-600"
    },
    {
      icon: Target,
      question: "How do you ensure my content reaches the right audience?",
      answer: "Our AI algorithm analyzes your content and matches it with the most relevant sites in our network. We consider factors like niche relevance, audience demographics, and site authority (DA 50+) to ensure optimal placement.",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      question: "Are the backlinks permanent and do-follow?",
      answer: "Yes, all backlinks are permanent do-follow links. We have contractual agreements with our publisher network to ensure link permanency. We also monitor your links and provide replacements if any issues arise.",
      color: "text-orange-600"
    },
    {
      icon: FileText,
      question: "What are your content quality requirements?",
      answer: "We require original, high-quality content (minimum 800 words) that provides genuine value. Our AI checks for plagiarism, readability, and SEO optimization. Content must be well-researched and professionally written.",
      color: "text-red-600"
    },
    {
      icon: MessageCircle,
      question: "Do you provide content writing services?",
      answer: "While our primary service is guest post placement, we have partnerships with professional content writers who can create custom articles for your campaigns. Contact our support team for writing service quotes.",
      color: "text-indigo-600"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            ❓ Frequently Asked Questions
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Got <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Questions?</span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our guest posting platform
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center flex-1">
                  <faq.icon className={`h-6 w-6 ${faq.color} mr-4 flex-shrink-0`} />
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                </div>
                <div className="flex-shrink-0">
                  {openItems.includes(index) ? (
                    <Minus className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-6 animate-fade-in">
                  <div className="pl-10">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact support */}
        <div className="text-center mt-16 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
          <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our expert support team is here to help you succeed. Get personalized assistance with your guest posting strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white">
                Contact Support
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-3">
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
