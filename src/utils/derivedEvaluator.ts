import { Parser } from "expr-eval";
import type { Value } from "expr-eval";

const dateDiffYears = (...args: Value[]): Value => {
  const dobIso = args[0] as string | number | Date | undefined;
  if (!dobIso) return 0; 
  const diff = Date.now() - Date.parse(String(dobIso));
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
};

export const evalDerived = (expr: string, values: Record<string, any>) => {
  try {
    const parser = new Parser();
    const p = parser.parse(expr);
    const context: Record<string, Value> = {
      ...values,
      dateDiff: dateDiffYears,
      now: () => Date.now(),
    };
    return p.evaluate(context);
  } catch (e) {
    console.warn("Derived eval failed:", e);
    return 0;
  }
};
