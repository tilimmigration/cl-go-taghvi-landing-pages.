import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, Star, Quote } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { generateChecklistPdf } from "@/lib/generateChecklistPdf";
import { selectVariantKey, type QuizAnswers } from "@/lib/selectVariant";

const ThankYou = () => {
  const location = useLocation();
  const state = (location.state as { firstName?: string; answers?: QuizAnswers } | null) ?? null;
  const firstName = state?.firstName || "Friend";
  const variantKey = selectVariantKey(state?.answers ?? {});

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader
        ctaLabel="Book Your Free Case Evaluation"
        ctaHref="https://tilimmigration.com/schedule-a-case-evaluation"
      />
      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

          <div className="container relative max-w-3xl py-20 lg:py-28 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">
              Thank You
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-secondary sm:text-5xl lg:text-6xl">
              Your Results Are Ready, {firstName}.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Based on your answers, we put together a personalized Family
              Immigration Checklist just for you. Download it below.
            </p>

            <div className="mt-10 flex justify-center">
              <Button
                size="lg"
                onClick={() => generateChecklistPdf(firstName, variantKey)}
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <Download className="h-5 w-5" />
                Download Your Personalized Checklist
              </Button>
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Your checklist includes your situation summary, your step-by-step
              action items, and your recommended next step. Keep it. Share it
              with your partner. And refer back to it whenever you need clarity.
            </p>
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

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>The free case evaluation is a 30-minute conversation with our intake team. Here is what happens.</p>
              <p>You tell us about your situation. We listen. We do not judge. We ask a few clarifying questions to understand the details.</p>
              <p>Then we tell you three things. Your options. Your estimated timeline. And what it would cost if you decide to work with us. Flat fee. No surprises.</p>
              <p>You do not need to bring any documents. You do not need to understand immigration law. You do not need your partner on the call, although they are welcome to join. You just need to show up.</p>
              <p>If we can help, we will tell you exactly how. If we cannot help, we will tell you that too. That is how we have earned 4.8 stars from 156 families.</p>
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <a
                  href="https://tilimmigration.com/schedule-a-case-evaluation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Your Free Case Evaluation
                </a>
              </Button>
            </div>

            <p className="mt-6 text-center text-sm font-medium text-muted-foreground sm:text-base">
              30 minutes. No cost. No obligation. Priority scheduling for quiz takers.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-[hsl(215_30%_8%)] py-20 text-secondary-foreground lg:py-28">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="container relative max-w-3xl text-center">
            <h2 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Your Checklist Is Downloaded.{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Your Next Step Is Clear.
              </span>
            </h2>

            <div className="mt-10 flex justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <a
                  href="https://tilimmigration.com/schedule-a-case-evaluation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Your Free Case Evaluation Now
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm font-medium text-secondary-foreground/70 sm:text-base">
              Or call us directly:{" "}
              <a href="tel:8044083522" className="font-semibold text-primary-glow hover:underline">
                804-408-3522
              </a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ThankYou;
