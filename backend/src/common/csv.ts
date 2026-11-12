/**
 * Build CSV text that opens correctly in Excel and can't run formulas.
 * A cell starting with = + - @ (or tab / CR) is treated by spreadsheets as a formula, so it is prefixed with an apostrophe.
 * A UTF-8 byte-order mark is added so Bangla and ৳ show properly.
 */
export type CsvValue = string | number | boolean | Date | null | undefined;

export function toCsv(headers: string[], rows: CsvValue[][]): string {
  const cell = (v: CsvValue) => {
    if (v === null || v === undefined) return "";
    let s = v instanceof Date ? v.toISOString() : String(v);
    if (typeof v !== "number" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "﻿" + [headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}
