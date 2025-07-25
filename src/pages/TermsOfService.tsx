import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const TermsOfService = () => {
  return (
    <>
      <SEO 
        title="Terms of Service - Backlink Bloom"
        description="Terms of Service for Backlink Bloom - Review our terms and conditions for using our platform."
        url="/terms-of-service"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using Backlink Bloom, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Use License</h2>
                <p className="text-muted-foreground mb-4">
                  Permission is granted to temporarily use Backlink Bloom for personal, non-commercial 
                  transitory viewing only.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Content Guidelines</h2>
                <p className="text-muted-foreground mb-4">
                  Users are responsible for ensuring their content meets our quality standards and 
                  does not violate any applicable laws or regulations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us at legal@backlinkbloom.com
                </p>
              </section>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;