import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Star, Users, MapPin, FileText, ListChecks, ArrowRight, HelpCircle, Clock, AlertTriangle, Heart, Award, DollarSign, Languages, ShieldCheck, UserCheck, Quote } from "lucide-react";
import { QuizDialog } from "@/components/QuizDialog";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import attorney from "@/assets/hero-attorney.jpg";
import soulmaz from "@/assets/soulmaz-taghavi.jpg";

const Index = () => {
  const [quizOpen, setQuizOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const scrollToQuiz = () => {
    setQuizOpen(true);
  };

  useEffect(() => {
    const state = location.state as { openQuiz?: boolean } | null;
    if (state?.openQuiz) {
      setQuizOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // This landing page is served at both "/" and "/family-based-quiz". Declare a
  // single canonical URL (the site root) so search engines don't treat the two
  // paths as duplicate content. Scoped to this page and removed on unmount.
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = `${window.location.origin}/`;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <SiteHeader onCtaClick={scrollToQuiz} />

      {/* Hero */}
      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

          <div className="container relative grid gap-12 py-16 lg:grid-cols-2 lg:gap-10 lg:py-24">
            {/* Left: copy */}
            <div className="flex flex-col justify-center">
              <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-secondary sm:text-5xl lg:text-6xl">
                Married to an Immigrant?{" "}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Find Out Where You Stand
                </span>{" "}
                in 2 Minutes.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Take the free Family Immigration Quiz and get your personalized
                checklist. No cost. No obligation. Just clarity on your next step.
              </p>

              <div className="mt-8">
                <Button
                  onClick={scrollToQuiz}
                  size="lg"
                  className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02] hover:-translate-y-0.5"
                >
                  Take the Free Quiz Now
                </Button>
              </div>

              {/* Trust bar */}
              <div className="mt-8 max-w-xl border-t border-border/60 pt-6">
                <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-secondary sm:text-base">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>1,000+ Visas Approved.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-primary text-primary" aria-hidden="true" />
                    <span>4.8 Stars.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>250+ Families Reunited.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Offices in Richmond, San Francisco, and Washington DC.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: image */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-gradient-to-br from-primary to-primary-glow opacity-20 blur-2xl" />
              <div className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-[var(--shadow-soft)] ring-1 ring-border/50">
                <img
                  src={attorney}
                  alt="Taghavi Immigration Law attorney"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap / Story Section */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl lg:text-5xl">
              Nobody Hands You a Roadmap When You Fall in Love With Someone From Another Country
            </h2>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                You got married. Or you are planning to. Or you have been together for years and never dealt with the paperwork.
              </p>
              <p>Either way, you have questions. Big ones.</p>
              <p>
                Does marriage automatically give my spouse legal status? What if they entered undocumented? What if we filed something before and it was not done right? What if we are running out of time?
              </p>
              <p>
                The internet says ten different things. Your family has opinions. The notario charges 500 dollars and promises to handle it. And you are lying awake at 10pm wondering if you are making the right move or making a mistake that could cost your family everything.
              </p>
              <p>
                You are not alone. Over a thousand families have been in the exact same position. And the first step is always the same. Find out where you stand.
              </p>
              <p className="font-semibold text-secondary">
                That is what this quiz is for.
              </p>
            </div>

          </div>
        </section>

        {/* Quiz / Deliverables Section */}
        <section className="relative overflow-hidden bg-secondary py-20 text-secondary-foreground lg:py-28">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

          <div className="container relative max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Take the 2-Minute Quiz and Get Your Personalized Family Immigration Checklist
              </h2>

              <div className="mt-6 space-y-4 text-lg leading-relaxed text-secondary-foreground/75">
                <p>
                  The quiz asks 7 simple questions about your situation. No legal jargon. No trick questions. Just straightforward yes-or-no answers about your relationship, your spouse's status, and where you are in the process.
                </p>
                <p className="font-semibold text-secondary-foreground">
                  When you finish, you get three things instantly.
                </p>
              </div>
            </div>

            {/* Alternating rows */}
            <div className="mt-16 space-y-6">
              {[
                {
                  icon: FileText,
                  title: "Your Situation Summary",
                  body: "A clear, plain-language explanation of what your answers mean for your immigration path. No guesswork. No Googling. Just a straight answer based on how immigration law actually works.",
                },
                {
                  icon: ListChecks,
                  title: "Your Personalized Checklist",
                  body: "A step-by-step list of exactly what you need to do next, customized to your specific situation. Whether you are just getting started, in the middle of the process, or trying to fix something that went wrong, your checklist tells you where to focus.",
                },
                {
                  icon: ArrowRight,
                  title: "Your Recommended Next Step",
                  body: "Based on your answers, we will tell you whether you should gather documents, book a free case evaluation, or take a specific action to protect your family. No sales pitch. Just the honest next step.",
                },
              ].map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-2xl border border-secondary-foreground/10 bg-secondary-foreground/[0.04] p-6 backdrop-blur-sm transition-[var(--transition-smooth)] hover:border-primary/40 hover:bg-secondary-foreground/[0.06] sm:p-8"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
                    <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:gap-3">
                      <span className="font-heading text-5xl font-bold leading-none text-primary sm:text-6xl">
                        0{i + 1}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="hidden w-px self-stretch bg-gradient-to-b from-transparent via-secondary-foreground/15 to-transparent sm:block" />

                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-bold sm:text-2xl">
                        {title}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-secondary-foreground/75">
                        {body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Button
                onClick={scrollToQuiz}
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02] hover:-translate-y-0.5"
              >
                Take the Free Quiz Now
              </Button>
            </div>
          </div>
        </section>

        {/* Who This Is For Section */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl lg:text-5xl">
                This Quiz Is For You If Any of These Sound Familiar
              </h2>
            </div>

            <ul className="mt-14 grid gap-4 sm:grid-cols-2">
              {[
                "You married someone from another country and you are not sure what to do about their immigration status",
                "Your spouse entered the US on a student visa, tourist visa, or J visa and you never handled the paperwork",
                "Your spouse entered undocumented and you do not know if they can get a green card",
                "You met someone while traveling abroad and you want to bring them to the US",
                "You filed something before, either on your own, with a notario, or with a previous attorney, and you are not sure it was done right",
                "Your spouse has a conditional green card that is about to expire",
                "You are a US citizen who wants to bring parents, siblings, or children to the US",
                "You are ready for citizenship but do not know where to start",
                "You just want to understand your options without committing to anything",
              ].map((item) => (
                <li
                  key={item}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-[var(--transition-smooth)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition-[var(--transition-smooth)] group-hover:bg-primary group-hover:text-primary-foreground">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-base leading-relaxed text-secondary">
                    {item}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex justify-center">
              <Button
                onClick={scrollToQuiz}
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02] hover:-translate-y-0.5"
              >
                Find Out Where You Stand. Free.
              </Button>
            </div>
          </div>
        </section>

        {/* About / Built by an Immigrant Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background py-20 lg:py-28">
          <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="container relative max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              {/* Left: Photo */}
              <div className="relative order-1 flex items-center justify-center lg:order-1">
                <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-gradient-to-br from-primary to-primary-glow opacity-25 blur-2xl" />
                <div className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-[var(--shadow-soft)] ring-1 ring-border/50">
                  <img
                    src={soulmaz}
                    alt="Soulmaz Taghavi, immigration attorney"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Right: Copy */}
              <div className="order-2 lg:order-2">
                <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl lg:text-5xl">
                  Built by an Immigrant.{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    For Immigrants.
                  </span>
                </h2>

                <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    Soulmaz Taghavi is a first-generation American. Her parents came from Iran on student visas during the revolution. She grew up watching her family navigate a system nobody explained to them.
                  </p>
                  <p>
                    She became an immigration attorney so no family would have to go through it alone.
                  </p>
                  <p>
                    Today, Taghavi Immigration Law has offices in Richmond, San Francisco, and Washington DC. The firm has helped over a thousand families navigate the immigration process with a 4.8-star rating from 156 Google reviews.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Points */}
            <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Award, text: "1,000+ visas approved" },
                { icon: Star, text: "4.8 stars from 156 Google reviews" },
                { icon: Users, text: "250+ families reunited in the past year" },
                { icon: DollarSign, text: "Flat-fee pricing with no surprises" },
                { icon: Languages, text: "Multilingual team: Spanish, French, Farsi, Portuguese, and more" },
                { icon: ShieldCheck, text: "Every case personally reviewed by Soulmaz before submission" },
                { icon: UserCheck, text: "From first consultation through citizenship, we stay with you" },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-[var(--transition-smooth)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="pt-1.5 text-base font-medium leading-snug text-secondary">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-muted/40 py-20 lg:py-28">
          <div className="container max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl lg:text-5xl">
                Here Is What Our Clients Say
              </h2>
              <div className="mt-5 flex items-center justify-center gap-1" aria-label="4.8 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" aria-hidden="true" />
                ))}
                <span className="ml-2 text-sm font-semibold text-secondary">4.8 from 156 reviews</span>
              </div>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {[
                {
                  quote: "After 21 long years, I finally received my green card. They are very professional and knowledgeable. Highly recommend.",
                  name: "Vipul P.",
                },
                {
                  quote: "Great service. I got my green card so fast after a few months. Thank you for your hard work.",
                  name: "Marady Y.",
                },
                {
                  quote: "Taghavi and her team are always thorough in providing accurate information. She is highly knowledgeable and reliable, which is why I trust her with my own clients.",
                  name: "Islam E.",
                },
                {
                  quote: "Amazing team and quick response when you need to ask questions. Well explained and informative. My experience has been great so far.",
                  name: "Allen N.",
                },
              ].map(({ quote, name }) => (
                <figure
                  key={name}
                  className="relative flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-[var(--transition-smooth)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/15" aria-hidden="true" />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 text-base leading-relaxed text-secondary sm:text-lg">
                    "{quote}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-bold text-primary">
                      {name.charAt(0)}
                    </span>
                    <span className="font-semibold text-secondary">{name}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Three Steps to Clarity Section */}
        <section className="relative overflow-hidden bg-secondary py-20 text-secondary-foreground lg:py-28">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary-glow/10 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="container relative max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              
              <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Three Steps to{" "}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Clarity
                </span>
              </h2>
            </div>

            {/* Horizontal stepper */}
            <div className="relative mt-20">
              {/* Connector line for desktop */}
              <div className="pointer-events-none absolute left-0 right-0 top-12 hidden lg:block">
                <div className="mx-[14%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              </div>

              <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
                {[
                  {
                    icon: HelpCircle,
                    title: "Take the Quiz",
                    body: "Answer 7 simple questions about your situation. No legal knowledge needed. No documents required.",
                  },
                  {
                    icon: ListChecks,
                    title: "Get Your Personalized Checklist",
                    body: "Receive your situation summary, step-by-step checklist, and recommended next step. Delivered to your inbox immediately.",
                  },
                  {
                    icon: Heart,
                    title: "Book Your Free Case Evaluation",
                    body: "If your checklist recommends it, you can book a free 30-minute case evaluation with our team. No cost. No obligation. Just a real conversation with someone who has handled your exact situation hundreds of times.",
                  },
                ].map(({ icon: Icon, title, body }, i) => (
                  <div
                    key={title}
                    className="group relative flex flex-col items-center text-center"
                  >
                    {/* Number badge sitting on the connector line */}
                    <div className="relative z-10 mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-secondary ring-1 ring-primary/30">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-heading text-3xl font-bold text-primary-foreground shadow-[var(--shadow-elegant)]">
                        0{i + 1}
                      </div>
                    </div>

                    <div className="w-full rounded-2xl border border-secondary-foreground/10 bg-secondary-foreground/[0.04] p-7 backdrop-blur-sm transition-[var(--transition-smooth)] group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:bg-secondary-foreground/[0.07]">
                      <div className="flex items-center justify-center">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary-glow ring-1 ring-primary/30">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-5 font-heading text-xl font-bold sm:text-2xl">
                        {title}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-secondary-foreground/75">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 flex justify-center">
              <Button
                onClick={scrollToQuiz}
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02] hover:-translate-y-0.5"
              >
                Start the Quiz Now. It Takes 2 Minutes.
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container max-w-3xl">
            <h2 className="text-center font-heading text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl lg:text-5xl">
              FAQ
            </h2>

            <Accordion type="single" collapsible className="mt-12 space-y-4">
              {[
                {
                  q: "Is this really free?",
                  a: "Yes. The quiz and checklist are completely free. No credit card. No hidden charges. No strings attached.",
                },
                {
                  q: "Do I need to have my documents ready?",
                  a: "No. The quiz asks simple questions about your situation. You do not need any paperwork to complete it.",
                },
                {
                  q: "Will someone call me after I take the quiz?",
                  a: "Only if you choose to book a free case evaluation. We will send your checklist to your email and that is it, unless you decide you want to talk to us.",
                },
                {
                  q: "Is my information confidential?",
                  a: "Absolutely. Your answers and contact information are protected and will never be shared with anyone.",
                },
                {
                  q: "What if the quiz says I do not qualify for anything?",
                  a: "That is valuable information too. Your checklist will explain why and what, if anything, could change in the future. And if you know someone who might qualify, you can share the quiz with them.",
                },
                {
                  q: "Can I take this quiz in Spanish?",
                  a: "We are working on a Spanish version. In the meantime, if you prefer to speak in Spanish, book a free case evaluation and our team will assist you in your language.",
                },
              ].map(({ q, a }, i) => (
                <AccordionItem
                  key={q}
                  value={`item-${i}`}
                  className="overflow-hidden rounded-2xl border border-border bg-card px-6 shadow-sm transition-[var(--transition-smooth)] hover:border-primary/40 hover:shadow-[var(--shadow-soft)] data-[state=open]:border-primary/40 data-[state=open]:shadow-[var(--shadow-soft)]"
                >
                  <AccordionTrigger className="py-5 text-left font-heading text-base font-semibold text-secondary hover:no-underline sm:text-lg [&[data-state=open]]:text-primary">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-[hsl(215_30%_8%)] py-20 text-secondary-foreground lg:py-28">
          {/* Decorative glows */}
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
              Your Family's Future Starts With{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                7 Questions
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-secondary-foreground/80 sm:text-xl">
              Take the free quiz. Get your personalized checklist. And stop wondering where you stand.
            </p>

            <div className="mt-10">
              <Button
                onClick={scrollToQuiz}
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.02] hover:-translate-y-0.5"
              >
                Take the Free Quiz Now
              </Button>
            </div>

            <p className="mt-6 text-sm font-medium text-secondary-foreground/70 sm:text-base">
              No cost. No obligation. No documents needed. Just answers.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />

      <QuizDialog open={quizOpen} onOpenChange={setQuizOpen} />
    </div>
  );
};

export default Index;
