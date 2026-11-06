// Maps quiz answers (keyed by question index) to the appropriate checklist variant.
// Question indices match QUESTIONS in src/components/QuizDialog.tsx:
//  0: citizenship          1: relationship      2: how entered
//  3: currently in US      4: prior filings     5: denial/deportation
//  6: feelings (unused)

export type QuizAnswers = Record<number, string>;

export const selectVariantKey = (answers: QuizAnswers): string => {
  const a = (i: number) => (answers[i] ?? "").toLowerCase();

  // 1. Highest priority: prior denial / deportation / immigration issues
  if (a(5).startsWith("yes")) return "prior-denial-deportation";

  // 2. Notario or self-filed or unsure about prior filings
  if (a(4).includes("notario") || a(4).includes("on our own") || a(4).startsWith("yes, we filed on our own") || a(4).includes("not sure")) {
    return "notario-complications";
  }

  // 3. Fiance (typically abroad, but K-1 path applies whenever fiance is the relationship)
  if (a(1).includes("fiance")) return "fiance-abroad";

  // 4. Parent / sibling / child / other family member abroad
  const isFamilyRelative =
    a(1).includes("parent") ||
    a(1).includes("sibling") ||
    a(1).includes("child") ||
    a(1).includes("someone else");
  const isAbroad = a(3).startsWith("no") || a(3).includes("another country");
  if (isFamilyRelative && isAbroad) return "family-abroad";

  // 5. Spouse who entered undocumented
  if (a(1).includes("spouse") && a(2).includes("without")) {
    return "undocumented-spouse";
  }

  // 6. Default: clean visa-entry spouse case
  return "visa-spouse-clean";
};
