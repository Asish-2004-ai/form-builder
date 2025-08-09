import type { ValidationRules } from "../types";

export const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const validateField = (value: any, rules?: ValidationRules) => {
  const errors: string[] = [];
  if (!rules) return errors;
  if (rules.notEmpty && (value === undefined || value === null || String(value).trim() === "")) {
    errors.push("This field is required");
  }
  if (typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength}`);
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength}`);
    }
    if (rules.email && !isEmail(value)) {
      errors.push("Invalid email");
    }
    if (rules.passwordRule) {
      if (value.length < rules.passwordRule.minLength) {
        errors.push(`Password must be at least ${rules.passwordRule.minLength} chars`);
      }
      if (rules.passwordRule.requireNumber && !/\d/.test(value)) {
        errors.push("Password must contain at least one number");
      }
    }
  }
  return errors;
};
