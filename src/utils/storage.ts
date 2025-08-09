import type { FormSchema } from "../types";

const STORAGE_KEY = "upliance_forms_v1";

export const loadForms = (): FormSchema[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveForms = (forms: FormSchema[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (e) {
    console.error("Failed to save forms", e);
  }
};
