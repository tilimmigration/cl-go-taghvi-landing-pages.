import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cookie } from "lucide-react";

const CookiePolicy = () => {
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
          <Cookie className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Cookie Policy</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-10">Last updated: June 12, 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant ads across websites.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may use third-party cookies (e.g., Google Analytics, Google Tag Manager, advertising platforms) to report usage statistics and deliver advertisements.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Managing Cookies</h2>
            <p>
              Most browsers allow you to refuse or accept cookies, delete cookies, and set preferences. Removing or blocking cookies may impact your user experience and some functionality may no longer be available.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. When we post changes, we will revise the "Last Updated" date at the top of this policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at{" "}
              <a href="mailto:tech@brillmedia.co" className="text-primary hover:text-primary/80 transition-colors underline">
                tech@brillmedia.co
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
