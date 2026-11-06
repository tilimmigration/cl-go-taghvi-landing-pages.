import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Quote } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const BookCaseEvaluation = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader
        ctaLabel="Book Your Free Case Evaluation"
        onCtaClick={() => document.getElementById("calendly")?.scrollIntoView({ behavior: "smooth" })}
      />
      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

          <div className="container relative max-w-7xl py-16 lg:py-20 text-center">
            <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-secondary sm:text-5xl lg:text-6xl">
              Book Your Free Case Evaluation
            </h1>

            <div
              id="calendly"
              className="calendly-inline-widget mt-10 w-full rounded-2xl overflow-hidden border border-border bg-card shadow-[var(--shadow-elegant)]"
              data-url="https://calendly.com/taghavi-screening/immigration-screening-phone"
              style={{ minWidth: "320px", height: "750px" }}
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto flex items-center justify-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary" aria-hidden="true" />
                ))}
              </div>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl lg:text-5xl">
                4.8 Stars From Families Whose Entire Lives Were on the Line
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: "After 21 long years, I finally received my green card. They are very professional and knowledgeable. Highly recommend.",
                  author: "Vipul P.",
                },
                {
                  quote: "Great service. I got my green card so fast after a few months. Thank you for your hard work.",
                  author: "Marady Y.",
                },
                {
                  quote: "Amazing team and quick response when you need to ask questions. Well explained and informative.",
                  author: "Allen N.",
                },
              ].map(({ quote, author }) => (
                <div
                  key={author}
                  className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-[var(--transition-smooth)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] sm:p-8"
                >
                  <Quote className="h-8 w-8 text-primary/30" aria-hidden="true" />
                  <div className="mt-3 flex items-center gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-secondary">
                    {quote}
                  </p>
                  <p className="mt-6 font-heading text-sm font-semibold text-secondary">
                    — {author}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
              <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-secondary sm:text-base">
                {[
                  "1,000+ Visas Approved",
                  "250+ Families Reunited",
                  "Flat Fee Pricing",
                  "Offices in Richmond, San Francisco, and DC",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Case Evaluation CTA */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background py-20 lg:py-28">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="container relative max-w-3xl">
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl lg:text-5xl">
                Not Sure What to Do Next?{" "}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  The Case Evaluation Is Designed for Exactly That.
                </span>
              </h2>
            </div>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-black">
              <p>The free case evaluation is a 30-minute conversation with our intake team. Here is what happens.</p>
              <p>You tell us about your situation. We listen. We do not judge. We ask a few clarifying questions to understand the details.</p>
              <p>Then we tell you three things. Your options. Your estimated timeline. And what it would cost if you decide to work with us. Flat fee. No surprises.</p>
              <p>You do not need to bring any documents. You do not need to understand immigration law. You do not need your partner on the call, although they are welcome to join. You just need to show up.</p>
              <p>If we can help, we will tell you exactly how. If we cannot help, we will tell you that too. That is how we have earned 4.8 stars from 156 families.</p>
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                onClick={() => document.getElementById("calendly")?.scrollIntoView({ behavior: "smooth" })}
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02] hover:-translate-y-0.5"
              >
                Book Your Free Case Evaluation
              </Button>
            </div>

            <p className="mt-6 text-center text-sm font-medium text-muted-foreground sm:text-base">
              30 minutes. No cost. No obligation.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default BookCaseEvaluation;
