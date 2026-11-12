/** Bangladeshi mobile: 01XXXXXXXXX, optionally prefixed +88 / 88, with dashes or spaces. */
const RE = /^(?:\+?88)?01[3-9]\d{8}$/;

/** Returns the canonical 11-digit form, or null when the value is not a valid BD mobile. */
export function normalizePhone(input: string | null | undefined): string | null {
  if (!input) return null;
  const compact = input.replace(/[\s-]/g, "");
  if (!RE.test(compact)) return null;
  return compact.slice(-11);
}
