import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { validateLeadFields, normalizeName, normalizeEmail, type LeadFieldErrors } from "@/lib/leadValidation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowLeft, ArrowRight, X, Download } from "lucide-react";

type Question = {
  q: string;
  options: string[];
};

const QUESTIONS: Question[] = [
  {
    q: "Are you a US citizen or a US permanent resident (green card holder)?",
    options: [
      "I am a US citizen",
      "I am a permanent resident (green card holder)",
      "I am not sure",
      "Neither",
    ],
  },
  {
    q: "What is your relationship to the person who needs immigration help?",
    options: [
      "Myself",
      "They are my spouse (we are married)",
      "They are my fiance (we plan to get married)",
      "They are my parent",
      "They are my child (under 21)",
      "They are my sibling",
      "They are someone else (other family member, partner, etc.)",
    ],
  },
  {
    q: "How did the beneficiary enter the United States?",
    options: [
      "They entered with a visa (student, tourist, work, J visa, etc.)",
      "They entered without documentation (crossed the border without inspection)",
      "They have never been to the US yet",
      "I am not sure",
    ],
  },
  {
    q: "Is the beneficiary currently in the United States?",
    options: [
      "Yes, they are here now",
      "No, they are in another country",
      "They go back and forth",
    ],
  },
  {
    q: "Have you or your family member filed anything with immigration before?",
    options: [
      "Yes, we filed on our own",
      "Yes, we used a notario or community helper",
      "Yes, we used an attorney",
      "No, we have never filed anything",
      "I am not sure",
    ],
  },
  {
    q: "Has the beneficiary ever been denied an immigration application, been in deportation proceedings, or had any issues with immigration?",
    options: ["Yes", "No", "I am not sure"],
  },
  {
    q: "What best describes how you are feeling right now?",
    options: [
      "I just want to understand my options. No rush.",
      "I know I need to act but I do not know where to start.",
      "I am worried we are running out of time.",
      "I am scared about what is happening under this administration.",
      "I have been dealing with this for a long time and I am exhausted.",
    ],
  },
];

type QuizDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type LeadInfo = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  zipCode: string;
};

const EMPTY_LEAD: LeadInfo = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  zipCode: "",
};

export const QuizDialog = ({ open, onOpenChange }: QuizDialogProps) => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [lead, setLead] = useState<LeadInfo>(EMPTY_LEAD);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [submissionError, setSubmissionError] = useState("");


  const total = QUESTIONS.length;
  const progress = completed ? 100 : !started ? 0 : ((step) / total) * 100;
  const current = QUESTIONS[step];
  const currentAnswer = answers[step];

  const reset = () => {
    setStarted(false);
    setLead(EMPTY_LEAD);
    setStep(0);
    setAnswers({});
    setCompleted(false);
    setErrors({});
    setSubmissionError("");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // small delay so reset doesn't flash before close animation
      setTimeout(reset, 200);
    }
    onOpenChange(next);
  };

  const submitToZapier = async (finalAnswers: Record<number, string>) => {
    const payload = {
      firstName: normalizeName(lead.firstName),
      lastName: normalizeName(lead.lastName),
      email: normalizeEmail(lead.email),
      contact: lead.contact,
      zipCode: lead.zipCode,
      Q1: finalAnswers[0] ?? "",
      Q2: finalAnswers[1] ?? "",
      Q3: finalAnswers[2] ?? "",
      Q4: finalAnswers[3] ?? "",
      Q5: finalAnswers[4] ?? "",
      Q6: finalAnswers[5] ?? "",
      Q7: finalAnswers[6] ?? "",
      submittedAt: new Date().toISOString(),
      source: window.location.origin,
      formType: "Family Based Quiz",
    };
    // Server-side validation + forwarding (client validation can be bypassed)
    const body = {
      webhookUrl: "https://hooks.zapier.com/hooks/catch/1556442/4oyfg6v/",
      payload,
    };
    let { data, error } = await supabase.functions.invoke("validate-lead", { body });
    if (error) {
      // One automatic retry for temporary network hiccups
      ({ data, error } = await supabase.functions.invoke("validate-lead", { body }));
    }
    const result = data as { ok?: boolean; forwarded?: boolean; errors?: LeadFieldErrors } | null;
    if (error || !result?.ok || !result.forwarded) {
      console.error("Lead submission error:", error ?? result);
      setSubmissionError("We couldn't submit your information. Please try again.");
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setSubmissionError("");
      const submittedSuccessfully = await submitToZapier(answers);
      if (submittedSuccessfully) setCompleted(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-0 [&>button:last-child]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogClose
          className="absolute right-4 top-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-primary shadow-[var(--shadow-elegant)] ring-2 ring-background transition hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-4 focus:ring-primary/30"
          aria-label="Close"
        >
          <X className="h-7 w-7 stroke-[3]" />
        </DialogClose>
        <div className="bg-secondary text-secondary-foreground px-6 py-6 pr-20 sm:px-8 sm:py-8 sm:pr-24 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold leading-tight sm:text-3xl text-secondary-foreground">
              What Is Your Family Immigration Path?
            </DialogTitle>
            <DialogDescription className="text-secondary-foreground/75 text-base mt-2">
              Answer 7 simple questions and get your personalized checklist in 2 minutes.
            </DialogDescription>
          </DialogHeader>
          {(started || completed) && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-medium text-secondary-foreground/80 mb-2">
                <span>
                  {completed ? "Complete" : `Question ${step + 1} of ${total}`}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-secondary-foreground/15" />
            </div>
          )}
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {!started ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const found = validateLeadFields({
                  firstName: lead.firstName,
                  lastName: lead.lastName,
                  email: lead.email,
                });
                setErrors(found);
                if (Object.keys(found).length > 0) return;
                setStarted(true);
              }}
            >
              <h3 className="font-heading text-lg font-semibold text-secondary sm:text-xl">
                Tell us a bit about you
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll use this to send your personalized checklist.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-firstName" className="text-secondary">First Name</Label>
                  <Input
                    id="lead-firstName"
                    required
                    maxLength={100}
                    value={lead.firstName}
                    onChange={(e) => setLead({ ...lead, firstName: e.target.value })}
                    className="h-11"
                  />
                {errors.firstName && (
                    <p className="text-sm font-medium text-destructive">{errors.firstName}</p>
                  )}
                  </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-lastName" className="text-secondary">Last Name</Label>
                  <Input
                    id="lead-lastName"
                    required
                    maxLength={100}
                    value={lead.lastName}
                    onChange={(e) => setLead({ ...lead, lastName: e.target.value })}
                    className="h-11"
                  />
                {errors.lastName && (
                    <p className="text-sm font-medium text-destructive">{errors.lastName}</p>
                  )}
                  </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="lead-email" className="text-secondary">Email Address</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    required
                    maxLength={255}
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="h-11"
                  />
                {errors.email && (
                    <p className="text-sm font-medium text-destructive">{errors.email}</p>
                  )}
                  </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-contact" className="text-secondary">Contact</Label>
                  <Input
                    id="lead-contact"
                    type="tel"
                    required
                    maxLength={20}
                    value={lead.contact}
                    onChange={(e) => setLead({ ...lead, contact: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-zip" className="text-secondary">Zip Code</Label>
                  <Input
                    id="lead-zip"
                    required
                    maxLength={10}
                    value={lead.zipCode}
                    onChange={(e) => setLead({ ...lead, zipCode: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Start the Quiz
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          ) : !completed ? (
            <>
              <h3 className="font-heading text-lg font-semibold text-secondary sm:text-xl">
                {current.q}
              </h3>

              <RadioGroup
                value={currentAnswer ?? ""}
                onValueChange={(v) => setAnswers({ ...answers, [step]: v })}
                className="mt-6 space-y-3"
              >
                {current.options.map((opt) => {
                  const id = `q${step}-${opt}`;
                  const selected = currentAnswer === opt;
                  return (
                    <Label
                      key={opt}
                      htmlFor={id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-[var(--transition-smooth)] ${
                        selected
                          ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                          : "border-border hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <RadioGroupItem value={opt} id={id} className="mt-0.5" />
                      <span className="text-sm font-medium leading-relaxed text-secondary sm:text-base">
                        {opt}
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>

              <div className="mt-8 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {step === total - 1 ? "See My Results" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              {submissionError && (
                <p className="mt-3 text-right text-sm font-medium text-destructive" role="alert">
                  {submissionError}
                </p>
              )}
            </>
          ) : (
            <div className="py-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-center font-heading text-2xl font-bold text-secondary sm:text-3xl">
                Your results are ready, {lead.firstName}.
              </h3>
              <p className="mt-3 text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
                Download your personalized Family Immigration Checklist below.
              </p>
              <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
                Based on your answers, here is a quick summary of where you stand.
              </p>

              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  onClick={() => {
                    const firstName = lead.firstName;
                    onOpenChange(false);
                    setTimeout(() => {
                      navigate("/family-based-quiz-thank-you", { state: { firstName, answers } });
                    }, 200);
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download your personalized Checklist
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
