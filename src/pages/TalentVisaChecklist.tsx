import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { validateLeadFields, normalizeName, normalizeEmail, type LeadFieldErrors } from "@/lib/leadValidation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Star, Users, Building2, Send, Award, Scale, Briefcase, Clock, HeartHandshake, Quote } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import checklistImage from "@/assets/hero-attorney.jpg";
import soulmazImage from "@/assets/soulmaz-taghavi.jpg";

type LeadForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  visaStatus: string;
};

const EMPTY: LeadForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  zipCode: "",
  visaStatus: "",
};

const VISA_OPTIONS = ["F-1/OPT", "L-1", "B-1/B-2", "No visa yet", "Other"];

const BULLETS = [
  "Covers O-1, EB-1, EB-2 NIW, L-1, E-2, and TN visa categories",
  "See which visa matches your education, career, and achievements",
  "Know what documents you need before your first attorney conversation",
  "Used by 1,000+ professionals who have navigated this process successfully",
];

const TALENT_VISA_WEBHOOK = "https://hooks.zapier.com/hooks/catch/24718631/4565mlj/";

const TalentVisaChecklist = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LeadForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<LeadFieldErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.visaStatus) return;

    const found = validateLeadFields({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
    });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast({
        title: "Please check your details",
        description: "Some fields need to be corrected before we can send your checklist.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const payload = {
      ...form,
      firstName: normalizeName(form.firstName),
      lastName: normalizeName(form.lastName),
      email: normalizeEmail(form.email),
      formType: "Talent Visa Checklist",
      submittedAt: new Date().toISOString(),
      source: window.location.origin,
    };

    // Post the lead straight to the Talent-Visa Zapier Catch Hook (account
    // 24718631) -> "Taghavi - Talent Visa Checklist LP" Google Sheet. Sent
    // form-encoded to avoid a CORS preflight that Zapier's Catch Hook rejects.
    // NOTE: the Zap must be published (Zapier Pro) before rows are written.
    const body = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => body.append(key, String(value ?? "")));
    try {
      const res = await fetch(TALENT_VISA_WEBHOOK, { method: "POST", body });
      if (!res.ok) throw new Error(`Zapier responded ${res.status}`);
    } catch (err) {
      console.error("Lead submission error:", err);
      setSubmitting(false);
      toast({
        title: "Submission failed",
        description: "We couldn't submit your information. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
    navigate("/talent-visa-checklist-thank-you");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader hideCta />

      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

          <div className="container relative grid gap-12 py-16 lg:grid-cols-2 lg:gap-12 lg:py-24">
            {/* Left: copy + bullets */}
            <div className="flex flex-col justify-center">
              <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-secondary sm:text-5xl lg:text-6xl">
                Not Sure If You Qualify for a{" "}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  U.S. Work Visa?
                </span>{" "}
                Find Out in 5 Minutes.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-black sm:text-xl">
                Download the free Talent Visa Checklist used by hundreds of
                professionals to identify the right visa path before spending a
                dollar on legal fees.
              </p>

              <ul className="mt-8 space-y-3">
                {BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-base leading-relaxed text-secondary">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <div className="flex flex-col justify-center">
              <div className="relative">
                <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-3xl bg-gradient-to-br from-primary to-primary-glow opacity-20 blur-2xl" />
                <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
                  {submitted ? (
                    <div className="py-6 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h2 className="mt-5 font-heading text-2xl font-bold text-secondary">
                        Thanks, {form.firstName}!
                      </h2>
                      <p className="mt-3 text-base leading-relaxed text-black">
                        Your Talent Visa Checklist is on its way to{" "}
                        <span className="font-semibold text-secondary">
                          {form.email}
                        </span>
                        . Check your inbox in the next few minutes.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <h2 className="font-heading text-xl font-bold text-secondary sm:text-2xl">
                        Get Your Free Checklist
                      </h2>
                      <p className="mt-1 text-sm text-black">
                        Takes less than a minute.
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="firstName" className="text-secondary">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            required
                            maxLength={100}
                            value={form.firstName}
                            onChange={(e) =>
                              setForm({ ...form, firstName: e.target.value })
                            }
                            className="h-11"
                          />
                        {errors.firstName && (
                            <p className="text-sm font-medium text-destructive">{errors.firstName}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="lastName" className="text-secondary">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            required
                            maxLength={100}
                            value={form.lastName}
                            onChange={(e) =>
                              setForm({ ...form, lastName: e.target.value })
                            }
                            className="h-11"
                          />
                        {errors.lastName && (
                            <p className="text-sm font-medium text-destructive">{errors.lastName}</p>
                          )}
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor="email" className="text-secondary">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            maxLength={255}
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            className="h-11"
                          />
                        {errors.email && (
                            <p className="text-sm font-medium text-destructive">{errors.email}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-secondary">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            maxLength={20}
                            value={form.phone}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="zip" className="text-secondary">
                            Zip Code
                          </Label>
                          <Input
                            id="zip"
                            required
                            maxLength={10}
                            value={form.zipCode}
                            onChange={(e) =>
                              setForm({ ...form, zipCode: e.target.value })
                            }
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor="visa" className="text-secondary">
                            Current Visa Status
                          </Label>
                          <Select
                            value={form.visaStatus}
                            onValueChange={(v) =>
                              setForm({ ...form, visaStatus: v })
                            }
                          >
                            <SelectTrigger id="visa" className="h-11">
                              <SelectValue placeholder="Select your current visa status" />
                            </SelectTrigger>
                            <SelectContent>
                              {VISA_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitting || !form.visaStatus}
                        className="mt-6 h-14 w-full px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.01]"
                      >
                        <Send className="h-4 w-4" />
                        {submitting ? "Sending..." : "Download Your Checklist"}
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              {/* Trust bar */}
              <div className="mt-6">
                <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-medium text-secondary">
                  <li className="flex items-center gap-2">
                    <Star
                      className="h-4 w-4 fill-primary text-primary"
                      aria-hidden="true"
                    />
                    <span>4.9 stars on Google (156 reviews)</span>
                  </li>
                  <li className="hidden h-4 w-px bg-border sm:block" />
                  <li className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>Trusted by 300+ Employers</span>
                  </li>
                  <li className="hidden h-4 w-px bg-border sm:block" />
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>1,000+ Consultations Delivered</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: What Is Inside the Checklist */}
        <section className="relative overflow-hidden bg-background py-16 lg:py-24">
          <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-secondary sm:text-4xl lg:text-5xl">
                What Is Inside the Checklist
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-black">
                This is not a generic immigration guide. The Talent Visa Checklist walks you through every major employment-based visa category so you can see exactly where you stand before you ever speak with an attorney.
              </p>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                {[
                  { title: "O-1 Visa", desc: "Eligibility criteria for individuals with extraordinary ability or achievement" },
                  { title: "EB-1A / EB-1B", desc: "Requirements for outstanding professors, researchers, and multinational managers" },
                  { title: "EB-2 NIW (National Interest Waiver)", desc: "Who qualifies and what evidence you need" },
                  { title: "L-1A and L-1B", desc: "Intracompany transfer eligibility for managers and specialized knowledge workers" },
                  { title: "E-2 Treaty Investor", desc: "Requirements for entrepreneurs and investors" },
                  { title: "TN Visa", desc: "Eligibility for Canadian and Mexican professionals under USMCA" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-[var(--shadow-soft)]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="font-heading text-base font-semibold text-secondary">{item.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-black">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-3xl bg-gradient-to-br from-primary to-primary-glow opacity-15 blur-2xl" />
                <img
                  src={checklistImage}
                  alt="Visa checklist review"
                  className="h-auto w-full rounded-3xl object-cover shadow-[var(--shadow-elegant)]"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-base leading-relaxed text-black">
                For each visa type, the checklist includes the qualifying criteria, the documents you will need, the typical timeline, and the most common mistakes that cause denials.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Who This Checklist Is For */}
        <section className="relative overflow-hidden bg-background py-16 lg:py-24">
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-secondary sm:text-4xl lg:text-5xl">
                Who This Checklist Is For
              </h2>
            </div>

            <div className="mt-12 mx-auto max-w-3xl space-y-5">
              {[
                "Professionals currently on a temporary visa exploring a path to permanent residency",
                "International graduates on F-1/OPT considering their next step",
                "Skilled workers whose employers have offered sponsorship but who want to understand the process first",
                "Entrepreneurs and investors evaluating whether they qualify for a work visa",
                "Anyone who has been told they might qualify for an O-1 or EB-1 but is not sure where to start",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-[var(--shadow-soft)]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-base leading-relaxed text-black">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: About Taghavi Immigration Law */}
        <section className="relative overflow-hidden bg-background py-16 lg:py-24">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-secondary sm:text-4xl lg:text-5xl">
                About Taghavi Immigration Law
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-black">
                Taghavi Immigration Law is led by Soulmaz Taghavi, Esq., a member of the American Immigration Lawyers Association who has argued before the Fourth Circuit Court. The firm has offices in Richmond, VA, Washington, DC, and San Francisco, CA.
              </p>
            </div>

            <div className="mt-12 mx-auto max-w-4xl space-y-5">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Users, stat: "1,000+", label: "consultations delivered" },
                  { icon: Award, stat: "Hundreds", label: "of work visas approved" },
                  { icon: HeartHandshake, stat: "95%", label: "client satisfaction rate" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center text-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-[var(--shadow-soft)]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-heading text-2xl font-bold text-secondary">{item.stat}</p>
                      <p className="text-sm leading-relaxed text-black">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid gap-5 sm:grid-cols-2 max-w-xl mx-auto">
                {[
                  { icon: Clock, stat: "90%", label: "of cases resolved ahead of schedule" },
                  { icon: Building2, stat: "300+", label: "Trusted employers nationwide" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center text-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-[var(--shadow-soft)]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-heading text-2xl font-bold text-secondary">{item.stat}</p>
                      <p className="text-sm leading-relaxed text-black">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Client Testimonial */}
        <section className="relative overflow-hidden py-16 lg:py-24" style={{ background: "var(--gradient-hero)" }}>
          <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                <Quote className="h-6 w-6" aria-hidden="true" />
              </div>
              <blockquote className="mt-6 font-heading text-2xl font-semibold leading-relaxed text-secondary sm:text-3xl">
                "After 21 long years, I finally received my green card. They are very professional and knowledgeable. I highly recommend them."
              </blockquote>
              <div className="mt-6 flex items-center justify-center gap-2">
                <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
              </div>
              <p className="mt-4 text-base font-medium text-secondary">
                Vipul Patel, <span className="text-black">Google Review</span>
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Final CTA */}
        <section className="relative overflow-hidden bg-background py-16 lg:py-24">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
                Get Your Free Talent Visa Checklist Now
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-black">
                Join 1,000+ professionals who have identified their visa path with our free checklist.
              </p>
              <Button
                size="lg"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-8 h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.01]"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Me the Checklist
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default TalentVisaChecklist;
