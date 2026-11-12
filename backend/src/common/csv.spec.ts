import { toCsv } from "./csv";

describe("toCsv", () => {
  it("writes a header, rows and a byte-order mark", () => {
    expect(toCsv(["a", "b"], [[1, "x"], [2, "y"]])).toBe("﻿a,b\r\n1,x\r\n2,y\r\n");
  });
  it("quotes commas, quotes and line breaks", () => {
    expect(toCsv(["t"], [['He said "hi", then\nleft']])).toContain('"He said ""hi"", then\nleft"');
  });
  it("neutralises spreadsheet formulas", () => {
    const out = toCsv(["name"], [['=HYPERLINK("http://evil")'], ["+1+1"], ["@SUM(A1)"], ["-2+3"], ["fine"]]);
    for (const bad of ["'=HYPERLINK", "'+1+1", "'@SUM", "'-2+3"]) expect(out).toContain(bad);
    expect(out).toContain("\r\nfine\r\n");
  });
  it("leaves real negative numbers alone and blanks null/undefined", () => {
    expect(toCsv(["n", "m", "k"], [[-5, null, undefined]])).toBe("﻿n,m,k\r\n-5,,\r\n");
  });
});
