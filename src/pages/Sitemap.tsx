import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Map } from "lucide-react";

const pages = [
  { name: "Family Immigration Quiz", path: "/family-based-quiz", description: "Free 2-minute quiz with a personalized checklist" },
  { name: "Family Quiz - Thank You", path: "/family-based-quiz-thank-you", description: "Confirmation page after quiz submission" },
  { name: "Book Your Case Evaluation", path: "/family-based-quiz-book-your-case-evaluation", description: "Schedule a consultation" },
  { name: "Talent Visa Checklist", path: "/talent-visa-checklist", description: "Free O-1/EB-1/EB-2 NIW eligibility checklist" },
  { name: "Talent Visa - Thank You", path: "/talent-visa-checklist-thank-you", description: "Confirmation page for talent visa checklist" },
  { name: "Talent Visa - Submit Case Info", path: "/talent-visa-submit-your-case-information", description: "Submit your case for review" },
  { name: "Case Studies — Family Immigration", path: "/case-studies/family-immigration", description: "Real family immigration outcomes" },
  { name: "Case Studies — Employment & Talent", path: "/case-studies/employment-talent", description: "Employment and talent visa case results" },
  { name: "Case Studies — Removal Defense & Asylum", path: "/case-studies/removal-defense-asylum", description: "Removal defense and asylum case results" },
];

const legalPages = [
  { name: "Cookie Policy", path: "/cookie-policy", description: "How we use cookies on this website" },
  { name: "Do Not Sell My Info", path: "/do-not-sell-my-info", description: "Opt out of personal information sharing" },
  { name: "CCPA", path: "/ccpa", description: "California Consumer Privacy Act rights" },
  { name: "Sitemap", path: "/sitemap", description: "All pages on this website" },
];

const externalLinks = [
  { name: "Privacy Policy", href: "https://tilimmigration.com/privacy-policy" },
  { name: "Terms and Conditions", href: "https://tilimmigration.com/terms-and-conditions" },
  { name: "Main Site", href: "https://tilimmigration.com" },
];

const SitemapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Map className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Sitemap</h1>
        </div>

        <p className="text-muted-foreground mb-10">
          A complete list of all pages available on this website.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Main Pages</h2>
            <div className="space-y-3">
              {pages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="block border border-border rounded-md p-4 hover:bg-muted/50 transition-colors group"
                >
                  <p className="font-heading font-medium text-foreground group-hover:text-primary transition-colors">
                    {page.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{page.path}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Legal & Compliance</h2>
            <div className="space-y-3">
              {legalPages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="block border border-border rounded-md p-4 hover:bg-muted/50 transition-colors group"
                >
                  <p className="font-heading font-medium text-foreground group-hover:text-primary transition-colors">
                    {page.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{page.path}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">External Links</h2>
            <div className="space-y-3">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-border rounded-md p-4 hover:bg-muted/50 transition-colors group"
                >
                  <p className="font-heading font-medium text-foreground group-hover:text-primary transition-colors">
                    {link.name}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{link.href}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
