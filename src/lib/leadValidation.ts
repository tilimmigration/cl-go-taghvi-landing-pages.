// Shared lead validation rules (client-side, instant feedback).
// The authoritative copy of these rules also runs server-side in the
// `validate-lead` edge function so they cannot be bypassed.

/** Common disposable domains checked on the client. The edge function checks a
 * full, up-to-date list (`disposable-email-domains`) on top of this. */
const CLIENT_DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "10minutemail.com",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "mailnesia.com",
  "discard.email",
]);

const NAME_ALLOWED = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

const KEYBOARD_RUNS = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "1234567890",
];

const isKeyboardMash = (value: string) => {
  const v = value.toLowerCase().replace(/[^a-z]/g, "");
  if (v.length < 3) return false;
  // Reject an entire 4+ character keyboard-row run, but do not reject a real
  // name merely because it contains a common three-letter sequence.
  if (v.length >= 4 && KEYBOARD_RUNS.some((row) => {
    const reversed = row.split("").reverse().join("");
    return row.includes(v) || reversed.includes(v);
  })) return true;
  // same character repeated ("aaa"), or any character repeated 3+ times in a row
  if (/^(.)\1+$/.test(v)) return true;
  if (/(.)\1{2,}/.test(v)) return true;
  return false;
};

export const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");

/** Returns an error message, or null when valid. `label` is e.g. "First name". */
export const validateName = (raw: string, label: string): string | null => {
  const value = normalizeName(raw ?? "");
  if (!value) return `${label} is required`;
  const letters = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
  if (letters.length < 3) return `${label} must be at least 3 letters`;
  if (value.length > 100) return `${label} must be under 100 characters`;
  if (!NAME_ALLOWED.test(value)) {
    return `${label} can only contain letters, spaces, hyphens and apostrophes`;
  }
  if (isKeyboardMash(value)) return `Please enter a real ${label.toLowerCase()}`;
  return null;
};

export const normalizeEmail = (value: string) => (value ?? "").trim().toLowerCase();

/** RFC-5322-style local part, but requiring 2+ chars and a real-looking domain. */
const EMAIL_PATTERN =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;

/** Returns an error message, or null when valid. */
export const validateEmail = (raw: string): string | null => {
  const original = raw ?? "";
  if (!original.trim()) return "Email address is required";
  if (original !== original.trim()) return "Email address cannot start or end with a space";
  const email = normalizeEmail(original);
  if (/\s/.test(email)) return "Email address cannot contain spaces";
  if ((email.match(/@/g) || []).length !== 1) return "Enter a valid email address";
  if (email.length > 254) return "Email address is too long";

  const [local, domain] = email.split("@");
  if (local.length < 2) return "Enter a valid email address (the part before @ is too short)";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address";

  const labels = domain.split(".");
  const tld = labels[labels.length - 1];
  if (labels.slice(0, -1).some((l) => l.length < 2)) {
    return "Enter a valid email domain";
  }
  if (tld.length < 2) return "Enter a valid email domain";
  if (CLIENT_DISPOSABLE_DOMAINS.has(domain)) {
    return "Please use a permanent email address (temporary inboxes are not accepted)";
  }
  return null;
};

export type LeadFieldErrors = Record<string, string>;

/** Validates first/last/email together and returns a field -> message map. */
export const validateLeadFields = (input: {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
}): LeadFieldErrors => {
  const errors: LeadFieldErrors = {};
  if (input.firstName !== undefined) {
    const e = validateName(input.firstName, "First name");
    if (e) errors.firstName = e;
  }
  if (input.lastName !== undefined) {
    const e = validateName(input.lastName, "Last name");
    if (e) errors.lastName = e;
  }
  if (input.fullName !== undefined) {
    const e = validateName(input.fullName, "Full name");
    if (e) errors.fullName = e;
  }
  if (input.email !== undefined) {
    const e = validateEmail(input.email);
    if (e) errors.email = e;
  }
  return errors;
};
