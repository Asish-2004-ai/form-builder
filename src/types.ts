export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export interface ValidationRules {
  notEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: { minLength: number; requireNumber?: boolean };
}

export interface DerivedConfig {
  isDerived: boolean;
  parents: string[];       
  expression: string;       
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: string[];       
  validations?: ValidationRules;
  derived?: DerivedConfig;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: number;
  fields: Field[];
}
