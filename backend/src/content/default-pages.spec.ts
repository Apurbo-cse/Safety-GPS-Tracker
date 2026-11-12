import { sanitizeRich } from "../common/html";
import { DEFAULT_PAGES } from "./default-pages";

describe("default legal pages", () => {
  it.each(DEFAULT_PAGES.map((p) => [p.id, p.content]))("%s survives the sanitiser unchanged in structure", (_id, html) => {
    const clean = sanitizeRich(html);
    expect((clean.match(/<h2>/g) ?? []).length).toBe((html.match(/<h2>/g) ?? []).length);
    expect((clean.match(/<li>/g) ?? []).length).toBe((html.match(/<li>/g) ?? []).length);
    expect(clean).toContain("{{");
  });
});
