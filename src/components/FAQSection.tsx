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
      question: "What is Stuffedition?",
      answer: "Stuffedition is a guest posting platform that allows users to publish their articles with a permanent do-follow backlink for just $5 USD. It's designed for bloggers, marketers, and SEO professionals looking to boost their online presence affordably."
    },
    {
      question: "What do I get for $5?",
      answer: "You get a guest post published on our website with one permanent do-follow backlink. Your content will be reviewed and published within 24–48 hours after approval."
    },
    {
      question: "Are there any content guidelines?",
      answer: "Yes. Your submission must be 100% original and plagiarism-free, written by a human (AI-generated content is not accepted), be at least 600 words in length, offer real value to readers, and fit into relevant niches like tech, business, marketing, health, etc."
    },
    {
      question: "Do you check for plagiarism or AI content?",
      answer: "Absolutely. Stuffedition uses built-in detection tools to scan for both plagiarized and AI-generated content. Any flagged submission will be rejected without a refund."
    },
    {
      question: "Is the backlink permanent?",
      answer: "Yes. Once your post is published, the do-follow backlink is permanent and will not be removed unless the content violates our terms or contains false claims."
    },
    {
      question: "Can I include multiple links in my article?",
      answer: "Each $5 guest post includes one do-follow backlink. Additional links can be included for a small extra fee—contact us for details."
    },
    {
      question: "How long does it take for my post to go live?",
      answer: "Most approved posts are published within 24 to 48 hours. If there's a delay due to quality review, you'll be notified by our team."
    },
    {
      question: "What topics do you accept?",
      answer: "We accept a wide range of niches including Technology, Digital Marketing, SEO, Startups, Business, Health & Wellness, Finance, and Productivity. If your topic is different, feel free to contact us for approval before submission."
    },
    {
      question: "What happens if my article is rejected?",
      answer: "If your content violates our guidelines (e.g., plagiarism, AI content, irrelevant niche), it will be rejected. We recommend reviewing our submission rules carefully to avoid this."
    },
    {
      question: "How can I get started?",
      answer: "Click on the 'Submit Your Guest Post' button, upload your article, make the $5 payment, and our editorial team will take it from there!"
    }
  ];

  // Split FAQs into two columns
  const leftColumnFaqs = faqs.slice(0, Math.ceil(faqs.length / 2));
  const rightColumnFaqs = faqs.slice(Math.ceil(faqs.length / 2));

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#eff0f0' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            ❓ Frequently Asked Questions (FAQs)
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to Know
          </h2>
          <p className="text-xl text-muted-foreground">
            Complete guide to using Stuffedition for your guest posting needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {leftColumnFaqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/30 bg-white"
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

          {/* Right Column */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {rightColumnFaqs.map((faq, index) => (
                <AccordionItem 
                  key={index + leftColumnFaqs.length} 
                  value={`item-${index + leftColumnFaqs.length}`}
                  className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/30 bg-white"
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
        </div>
      </div>
    </section>
  );
};

export default FAQSection;