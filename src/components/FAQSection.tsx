import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const FAQSection = () => {
  const faqs = [
    {
      question: "What kind of content is accepted?",
      answer: "We accept high-quality, original content across most niches including technology, business, marketing, lifestyle, health & wellness, and more. We do not accept content related to adult topics, medical advice, gambling, or political content. All content must be at least 650 words and provide genuine value to readers."
    },
    {
      question: "How many backlinks are allowed per post?",
      answer: "Each post can include 1 dofollow backlink to your target URL, plus 2-3 additional nofollow backlinks. This natural link profile helps maintain SEO value while following best practices. All links must be relevant to the content and provide value to readers."
    },
    {
      question: "How do I know if my content passes the checks?",
      answer: "Our system uses PlagiarismCheck.org for plagiarism detection and advanced AI for content quality analysis. You'll receive an instant pass/fail report with detailed feedback. If your content doesn't pass, you can revise and resubmit at no additional cost."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer refunds according to our cashback policy. If your content is rejected due to quality issues that can't be resolved, or if there are technical problems on our end, you're eligible for a full refund. Please review our terms of service for complete refund conditions."
    },
    {
      question: "How quickly will my post be published?",
      answer: "Once your content passes all checks and payment is confirmed, your post goes live immediately. The entire process from submission to publication typically takes 5-10 minutes, making us one of the fastest guest posting platforms available."
    },
    {
      question: "Do you provide any guarantees?",
      answer: "Yes! We guarantee that your approved post will be published with the promised dofollow backlink. We also guarantee that your content will be shared across our social media network. If we fail to deliver on these promises, you're eligible for a full refund."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            ❓ Frequently Asked Questions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our guest posting service
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/30"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;