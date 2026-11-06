import { describe, expect, it } from "vitest";
import { validateEmail, validateName, validateLeadFields } from "@/lib/leadValidation";

describe("name validation", () => {
  it("rejects short names", () => {
    for (const n of ["A", "B", "M", "j", "d", "Li"]) {
      expect(validateName(n, "First name")).toBe("First name must be at least 3 letters");
    }
  });
  it("rejects repeats, mash, numbers and symbols", () => {
    expect(validateName("aaa", "First name")).toBeTruthy();
    expect(validateName("asdf", "First name")).toBeTruthy();
    expect(validateName("John3", "First name")).toBeTruthy();
    expect(validateName("John@", "First name")).toBeTruthy();
  });
  it("accepts real names", () => {
    for (const n of ["Sam", "Ana", "Mary-Jane", "O'Brien", "Sam Lee", "José"]) {
      expect(validateName(n, "First name")).toBeNull();
    }
  });
});

describe("email validation", () => {
  it("rejects loose/fake addresses", () => {
    for (const e of ["a@b.co", "x@y.com", "no-at-sign", "a@@b.com", " sam@gmail.com", "sam@mailinator.com"]) {
      expect(validateEmail(e)).toBeTruthy();
    }
  });
  it("accepts real addresses", () => {
    for (const e of ["maria.gomez@gmail.com", "redsable92@gmail.com", "jeremydunst@yahoo.com", "bgfewkes2017@gmail.com"]) {
      expect(validateEmail(e)).toBeNull();
    }
  });
});

describe("real submitted data", () => {
  it("flags the reported rows", () => {
    expect(validateLeadFields({ firstName: "A", lastName: "B", email: "a@b.co" })).toEqual({
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
    });
    const r = validateLeadFields({ firstName: "M", lastName: "C", email: "redsable92@gmail.com" });
    expect(r.email).toBeUndefined();
    expect(r.firstName).toBeTruthy();
    expect(validateLeadFields({ firstName: "Sam", lastName: "Lee", email: "maria.gomez@gmail.com" })).toEqual({});
    for (const [firstName, email] of [
      ["L", "luzmaria518@gmail.com"],
      ["j", "jeremydunst@yahoo.com"],
      ["B", "bgfewkes2017@gmail.com"],
    ]) {
      const errors = validateLeadFields({ firstName, email });
      expect(errors.firstName).toBe("First name must be at least 3 letters");
      expect(errors.email).toBeUndefined();
    }
  });
});
