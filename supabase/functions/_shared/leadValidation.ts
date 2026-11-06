// Server-side lead validation. Mirrors src/lib/leadValidation.ts so the rules
// cannot be bypassed by calling the API directly.
const DISPOSABLE_DOMAINS = [
  "10minutemail.com",
  "dispostable.com",
  "fakeinbox.com",
  "getnada.com",
  "guerrillamail.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "sharklasers.com",
  "tempmail.com",
  "temp-mail.org",
  "trashmail.com",
  "throwawaymail.com",
  "discard.email",
  "yopmail.com",
];

const DISPOSABLE = new Set<string>(DISPOSABLE_DOMAINS);

const NAME_ALLOWED = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const KEYBOARD_RUNS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"];

const isKeyboardMash = (value: string) => {
  const v = value.toLowerCase().replace(/[^a-z]/g, "");
  if (v.length < 3) return false;
  if (v.length >= 4 && KEYBOARD_RUNS.some((row) => {
    const reversed = row.split("").reverse().join("");
    return row.includes(v) || reversed.includes(v);
  })) return true;
  if (/^(.)\1+$/.test(v)) return true;
  if (/(.)\1{2,}/.test(v)) return true;
  return false;
};

export const normalizeName = (value: string) => (value ?? "").trim().replace(/\s+/g, " ");

export const validateName = (raw: string, label: string): string | null => {
  const value = normalizeName(raw);
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

const EMAIL_PATTERN =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;

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
  if (labels.slice(0, -1).some((l: string) => l.length < 2)) return "Enter a valid email domain";
  if (tld.length < 2) return "Enter a valid email domain";
  if (DISPOSABLE.has(domain)) {
    return "Please use a permanent email address (temporary inboxes are not accepted)";
  }
  return null;
};

export const validateLeadFields = (input: Record<string, unknown>) => {
  const errors: Record<string, string> = {};
  const check = (key: string, label: string) => {
    if (input[key] === undefined) return;
    const e = validateName(String(input[key] ?? ""), label);
    if (e) errors[key] = e;
  };
  check("firstName", "First name");
  check("lastName", "Last name");
  check("fullName", "Full name");
  if (input.email !== undefined) {
    const e = validateEmail(String(input.email ?? ""));
    if (e) errors.email = e;
  }
  return errors;
};
