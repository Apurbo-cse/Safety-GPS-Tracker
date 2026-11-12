import { normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it.each([
    ["01712345678", "01712345678"],
    ["+8801712345678", "01712345678"],
    ["8801712345678", "01712345678"],
    ["017-1234-5678", "01712345678"],
    [" 01912 345678 ", "01912345678"],
  ])("accepts %s", (input, out) => expect(normalizePhone(input)).toBe(out));

  it.each(["", "12345", "01212345678", "0171234567", "017123456789", "abc", "+8801112345678"])("rejects %j", (input) => expect(normalizePhone(input)).toBeNull());
  it("treats null/undefined as no number", () => { expect(normalizePhone(null)).toBeNull(); expect(normalizePhone(undefined)).toBeNull(); });
});
