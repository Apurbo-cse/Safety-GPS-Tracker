import { mediaTokensIn, plainText, resolveMedia, sanitizeRich } from "./html";

const ID = "0f8fad5b-d9cb-469f-a165-70867728950e";

describe("sanitizeRich — keeps formatting", () => {
  it("keeps headings, lists, emphasis and tables", () => {
    const html = "<h2>Title</h2><p>Hello <strong>bold</strong> <em>it</em> <u>u</u></p><ul><li>One</li></ul><table><tbody><tr><td>x</td></tr></tbody></table>";
    expect(sanitizeRich(html)).toBe(html);
  });
  it("keeps safe colours and alignment", () => {
    expect(sanitizeRich('<p style="text-align:center;color:#ff0000">hi</p>')).toContain("text-align:center");
    expect(sanitizeRich('<span style="color:rgb(1,2,3)">hi</span>')).toContain("color:rgb(1,2,3)");
  });
  it("keeps uploaded pictures and files in /public", () => {
    expect(sanitizeRich(`<img src="media:${ID}" alt="a">`)).toContain(`src="media:${ID}"`);
    expect(sanitizeRich('<img src="/img/hero-car.jpg">')).toContain('src="/img/hero-car.jpg"');
  });
  it("makes links safe: noopener, new tab only for external", () => {
    const out = sanitizeRich('<a href="https://example.com">x</a><a href="/pricing">y</a>');
    expect(out).toContain('href="https://example.com"');
    expect(out).toMatch(/rel="noopener noreferrer"/);
    expect(out).toMatch(/<a href="https:\/\/example.com"[^>]*target="_blank"/);
    expect(out).not.toMatch(/<a href="\/pricing"[^>]*target=/);
  });
});

describe("sanitizeRich — removes attacks", () => {
  const bad: [string, RegExp][] = [
    ["<script>alert(1)</script><p>ok</p>", /script|alert/i],
    ['<img src="media:' + ID + '" onerror="alert(1)">', /onerror/i],
    ['<p onclick="alert(1)">x</p>', /onclick/i],
    ['<a href="javascript:alert(1)">x</a>', /javascript:/i],
    ['<a href="JaVaScRiPt:alert(1)">x</a>', /javascript:/i],
    ['<a href="data:text/html,<script>alert(1)</script>">x</a>', /data:/i],
    ['<a href="//evil.example/x">x</a>', /evil\.example/],
    ['<iframe src="https://evil.example"></iframe>', /iframe/i],
    ['<object data="x"></object><embed src="x">', /object|embed/i],
    ['<form action="https://evil.example"><input name="p"></form>', /form|input/i],
    ['<style>body{display:none}</style>', /style/i],
    ['<svg onload="alert(1)"><circle/></svg>', /svg|onload/i],
    ['<img src="https://evil.example/track.png">', /evil\.example/],
    ['<img src="data:image/png;base64,AAAA">', /data:/i],
    ['<img src="/../../etc/passwd">', /etc\/passwd/],
    ['<p style="background:url(javascript:alert(1))">x</p>', /javascript/i],
    ['<p style="position:fixed;top:0;left:0;width:100%">x</p>', /position/i],
    ['<p style="color:red;behavior:url(x.htc)">x</p>', /behavior/i],
    ['<meta http-equiv="refresh" content="0;url=https://evil.example">', /meta|evil/i],
    ['<link rel="stylesheet" href="https://evil.example/x.css">', /link|evil/i],
    ['<base href="https://evil.example/">', /base|evil/i],
  ];
  it.each(bad)("strips %s", (input, forbidden) => expect(sanitizeRich(input)).not.toMatch(forbidden));
  it("returns an empty string for non-strings", () => { expect(sanitizeRich(undefined)).toBe(""); expect(sanitizeRich(42)).toBe(""); });
  it("caps the length", () => expect(sanitizeRich("<p>" + "a".repeat(200_000) + "</p>").length).toBeLessThanOrEqual(60_000));
});

describe("helpers", () => {
  it("finds picture tokens", () => expect(mediaTokensIn(`<img src="media:${ID}"><img src="media:${ID}">`)).toEqual([`media:${ID}`]));
  it("turns tokens into URLs", () => expect(resolveMedia(`<img src="media:${ID}">`, "https://api.test")).toBe(`<img src="https://api.test/api/v1/media/${ID}">`));
  it("extracts plain text", () => expect(plainText("<p>Hello <b>world</b></p><p>again</p>")).toBe("Hello world again"));
});
