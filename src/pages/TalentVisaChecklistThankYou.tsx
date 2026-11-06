import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Star, Users, ShieldCheck, Send, Quote, Download, LoaderCircle, CalendarCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { validateLeadFields, normalizeName, normalizeEmail, type LeadFieldErrors } from "@/lib/leadValidation";
import { SiteFooter } from "@/components/SiteFooter";
import { generateTalentVisaChecklistPdf } from "@/lib/generateTalentVisaChecklistPdf";

const BOOKING_URL = "https://tilimmigration.com/schedule-a-case-evaluation";

type CaseForm = {
  fullName: string;
  email: string;
  phone: string;
  citizenship: string;
  visaStatus: string;
  education: string;
  field: string;
  careerHighlights: string;
  visaInterest: string;
};

const EMPTY: CaseForm = {
  fullName: "",
  email: "",
  phone: "",
  citizenship: "",
  visaStatus: "",
  education: "",
  field: "",
  careerHighlights: "",
  visaInterest: "",
};

const VISA_STATUS = ["F-1/OPT", "L-1", "B-1/B-2", "TN", "No current visa", "Other"];
const VISA_INTEREST = ["O-1", "EB-1A", "EB-2 NIW", "L-1", "E-2", "TN", "Not sure"];

const STEPS = [
  "Our team reviews your background, career highlights, and visa situation before the call.",
  "You receive a complimentary 30-minute consultation with our immigration team.",
  "On the call, we assess your eligibility, recommend the strongest visa path (O-1, EB-1A, EB-2 NIW, or another option), and give you a clear eligibility score on a 1-to-10 scale.",
  "You walk away with a specific recommendation, a realistic timeline, and transparent fee information.",
];

const TalentVisaChecklistThankYou = () => {
  const [form, setForm] = useState<CaseForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const bookingClickedRef = useRef(false);
  const redirectTimerRef = useRef<number | null>(null);

  // If the visitor doesn't open the booking page themselves, take them there.
  useEffect(() => {
    if (!submitted) return;
    bookingClickedRef.current = false;
    redirectTimerRef.current = window.setTimeout(() => {
      if (!bookingClickedRef.current) window.location.href = BOOKING_URL;
    }, 2000);
    return () => {
      if (redirectTimerRef.current !== null) window.clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    };
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found = validateLeadFields({ fullName: form.fullName, email: form.email });
    setErrors(found);
    if (Object.keys(found).length > 0 || !form.visaStatus || !form.visaInterest) return;

    setSubmitting(true);

    const payload = {
      "Full Name": normalizeName(form.fullName),
      "Email Address": normalizeEmail(form.email),
      "Phone Number": form.phone,
      "Country of Citizenship": form.citizenship,
      "Current Visa Status": form.visaStatus,
      "Highest Level of Education": form.education,
      "Field of Work or Expertise": form.field,
      "Brief Description": form.careerHighlights,
      "Most interested in": form.visaInterest,
      "Call Scheduled": "Pending",
      formType: "Talent Visa Case Info",
      trackingEvent: "case_info_submitted",
      submittedAt: new Date().toISOString(),
      source: window.location.origin,
    };

    try {
      // Never leave the visitor stuck if the lead service is slow to respond.
      const response = await Promise.race([
        supabase.functions.invoke("validate-lead", {
          body: {
            webhookUrl: "https://hooks.zapier.com/hooks/catch/1556442/42k5yk8/",
            payload,
          },
        }),
        new Promise<never>((_, reject) =>
          window.setTimeout(() => reject(new Error("Lead submission timed out")), 10000),
        ),
      ]);
      const result = response.data as { errors?: LeadFieldErrors; trackingId?: string } | null;
      const serverErrors = result?.errors;
      if (serverErrors && Object.keys(serverErrors).length > 0) {
        const mapped: LeadFieldErrors = {};
        if (serverErrors.fullName) mapped.fullName = serverErrors.fullName;
        if (serverErrors.email) mapped.email = serverErrors.email;
        setErrors(mapped);
        return;
      }
      if (response.error) console.error("Case info submission error:", response.error);
    } catch (error) {
      console.error("Case info submission error:", error);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader hideCta />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

          <div className="container relative max-w-3xl py-16 lg:py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-secondary sm:text-5xl">
              Your Talent Visa Checklist Is Ready.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-black">
              Click below to download your Talent Visa Checklist.
            </p>
            <Button
              size="lg"
              onClick={() => generateTalentVisaChecklistPdf()}
              className="mt-8 h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.01]"
            >
              <Download className="h-4 w-4 mr-2" />
              Download the Talent Visa Checklist
            </Button>
          </div>
        </section>

        {/* Primary CTA copy */}
        <section className="relative overflow-hidden bg-background py-16 lg:py-20">
          <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative max-w-3xl">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              Want to Know Exactly Where You Stand? Submit Your Case Information Now.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-black">
              The checklist gives you a general overview. But every immigration case depends on the specifics: your background, your field, your achievements, your timeline, and your current visa status.
            </p>
            <p className="mt-4 text-base font-semibold text-black">
              When you submit your case information, here is what happens next:
            </p>
            <ul className="mt-4 space-y-3">
              {STEPS.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-base leading-relaxed text-black">{s}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-black">
              There is no cost and no obligation for this consultation. We simply believe you deserve to know your options before making any decisions.
            </p>
          </div>
        </section>

        {/* Case Info Form */}
        <section className="relative overflow-hidden py-16 lg:py-24" style={{ background: "var(--gradient-hero)" }}>
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative max-w-2xl">
            <div className="relative">
              <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-3xl bg-gradient-to-br from-primary to-primary-glow opacity-20 blur-2xl" />
              <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
                {submitted ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 font-heading text-2xl font-bold text-secondary">
                      Thank You {form.fullName || "Friend"}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-black">
                      We have received your information. Please book your complimentary call with our team using the booking link below.
                    </p>
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        bookingClickedRef.current = true;
                        if (redirectTimerRef.current !== null) window.clearTimeout(redirectTimerRef.current);
                      }}
                      className="mt-6 inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:bg-primary/90 hover:scale-[1.01]"
                    >
                      <CalendarCheck className="mr-2 h-5 w-5" />
                      Book Your Free Case Evaluation
                    </a>
                    <p className="mt-3 text-sm leading-relaxed text-black">
                      If you don't book above, we'll take you to our scheduling page in a moment.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className="font-heading text-xl font-bold text-secondary sm:text-2xl">
                      Submit Your Case Information
                    </h3>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="fullName" className="text-secondary">Full Name</Label>
                        <Input id="fullName" required maxLength={150} value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="h-11" />
                      {errors.fullName && (
                          <p className="text-sm font-medium text-destructive">{errors.fullName}</p>
                        )}
                        </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-secondary">Email Address</Label>
                        <Input id="email" type="email" required maxLength={255} value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11" />
                      {errors.email && (
                          <p className="text-sm font-medium text-destructive">{errors.email}</p>
                        )}
                        </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-secondary">Phone Number</Label>
                        <Input id="phone" type="tel" required maxLength={20} value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="citizenship" className="text-secondary">Country of Citizenship</Label>
                        <Input id="citizenship" required maxLength={100} value={form.citizenship}
                          onChange={(e) => setForm({ ...form, citizenship: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="visaStatus" className="text-secondary">Current Visa Status</Label>
                        <Select value={form.visaStatus} onValueChange={(v) => setForm({ ...form, visaStatus: v })}>
                          <SelectTrigger id="visaStatus" className="h-11">
                            <SelectValue placeholder="Select your current visa status" />
                          </SelectTrigger>
                          <SelectContent>
                            {VISA_STATUS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="education" className="text-secondary">Highest Level of Education</Label>
                        <Input id="education" required maxLength={100} value={form.education}
                          onChange={(e) => setForm({ ...form, education: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="field" className="text-secondary">Field of Work or Expertise</Label>
                        <Input id="field" required maxLength={150} value={form.field}
                          onChange={(e) => setForm({ ...form, field: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="careerHighlights" className="text-secondary">
                          Brief Description of Your Career Highlights <span className="text-black">(optional)</span>
                        </Label>
                        <Textarea id="careerHighlights" maxLength={1000} rows={4} value={form.careerHighlights}
                          onChange={(e) => setForm({ ...form, careerHighlights: e.target.value })} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="visaInterest" className="text-secondary">Which visa are you most interested in?</Label>
                        <Select value={form.visaInterest} onValueChange={(v) => setForm({ ...form, visaInterest: v })}>
                          <SelectTrigger id="visaInterest" className="h-11">
                            <SelectValue placeholder="Select a visa" />
                          </SelectTrigger>
                          <SelectContent>
                            {VISA_INTEREST.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="mt-6 h-14 w-full px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-elegant)] transition-[var(--transition-smooth)] hover:scale-[1.01]"
                    >
                      {submitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      {submitting ? "Submitting..." : "Submit My Case Info and Book My Free Consultation"}
                    </Button>
                  </form>
                )}
              </div>

              {/* Trust bar */}
              <div className="mt-6">
                <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-medium text-secondary">
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                    <span>4.9 stars on Google (156 reviews)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>1,000+ Consultations Delivered</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>95% Client Satisfaction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>Your information is confidential and protected</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="relative overflow-hidden py-16 lg:py-20" style={{ background: "var(--gradient-hero)" }}>
          <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
              <Quote className="h-6 w-6" aria-hidden="true" />
            </div>
            <blockquote className="mt-6 font-heading text-2xl font-semibold leading-relaxed text-secondary sm:text-3xl">
              "TIL is a great office. I dealt with them in an urgent and complicated case. They have done an excellent job. I strongly recommend them."
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-2">
              {[0,1,2,3,4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
              ))}
            </div>
            <p className="mt-4 text-base font-medium text-black">
              Osman Sati Mohamed, <span className="text-black">Google Review</span>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default TalentVisaChecklistThankYou;
