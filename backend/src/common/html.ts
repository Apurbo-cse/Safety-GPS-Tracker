import sanitizeHtml from "sanitize-html";

/** Rich text from the editor is stored as HTML, so it is cleaned on the server before it is saved. Only this allow-list survives. */

const MEDIA_SRC = /^media:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const LOCAL_SRC = /^\/(?!\/)(?!.*\.\.)[A-Za-z0-9/_.-]{2,230}$/;
export const MAX_RICH_CHARS = 60_000;

const TEXT_STYLES = {
  color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i],
  "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i],
  "text-align": [/^(left|right|center|justify)$/],
  "font-weight": [/^(normal|bold|[1-9]00)$/],
  "font-style": [/^(normal|italic)$/],
  "text-decoration": [/^(none|underline|line-through)$/],
  "font-size": [/^\d{1,2}(\.\d)?(px|pt|em|rem|%)$/],
};

/** Returns safe HTML: no scripts, handlers, iframes, forms or remote/inline images; links forced to rel="noopener noreferrer". */
export function sanitizeRich(input: unknown): string {
  if (typeof input !== "string") return "";
  const clean = sanitizeHtml(input.slice(0, MAX_RICH_CHARS * 2), {
    allowedTags: ["p", "br", "div", "span", "strong", "b", "em", "i", "u", "s", "strike", "sub", "sup", "h1", "h2", "h3", "h4", "blockquote", "pre", "code", "hr", "ul", "ol", "li", "a", "img", "table", "thead", "tbody", "tr", "th", "td"],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      td: ["colspan", "rowspan", "style"], th: ["colspan", "rowspan", "style"],
      p: ["style"], div: ["style"], span: ["style"], h1: ["style"], h2: ["style"], h3: ["style"], h4: ["style"], li: ["style"],
    },
    allowedStyles: { "*": TEXT_STYLES },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // pictures use our own "media:<id>" reference; it is only accepted on <img> (and the filter below checks its shape)
    allowedSchemesByTag: { img: ["media"] },
    allowProtocolRelative: false,
    // pictures: only uploaded ones ("media:<id>") or files in the website's /public folder — never remote or data: images
    exclusiveFilter: (f) => f.tag === "img" && !(MEDIA_SRC.test(f.attribs.src ?? "") || LOCAL_SRC.test(f.attribs.src ?? "")),
    transformTags: {
      a: (tag, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//i.test(href);
        return { tagName: "a", attribs: { ...attribs, rel: "noopener noreferrer", ...(external ? { target: "_blank" } : {}) } };
      },
    },
    disallowedTagsMode: "discard",
  });
  return clean.trim().slice(0, MAX_RICH_CHARS);
}

/** Every uploaded-picture token ("media:<id>") mentioned in some HTML. */
export const mediaTokensIn = (html: string | null | undefined) => [...new Set((html ?? "").match(/media:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g) ?? [])];

/** Plain text of some HTML (for search, summaries and structured data). */
export const plainText = (html: string) =>
  sanitizeHtml(html.replace(/<\/(p|div|li|h[1-6]|tr|td|th|blockquote|pre)>|<br\s*\/?>/gi, " "), { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();

/** For public responses: turn "media:<id>" picture references inside HTML into full URLs on this API. */
export const resolveMedia = (html: string | null | undefined, base: string) =>
  (html ?? "").replace(/media:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/g, `${base}/api/v1/media/$1`);
