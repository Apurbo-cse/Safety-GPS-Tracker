import { cn } from "@/utils/format";

/**
 * Shows formatted text written in the admin panel's editor.
 * The HTML was cleaned by the API when it was saved (only an allow-list of tags, no scripts, no remote images),
 * and the API turned picture references into full URLs.
 */
export default function RichText({ html, className }: { html?: string | null; className?: string }) {
  if (!html) return null;
  return <div className={cn("rich", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** True when a stored answer/description is HTML rather than plain text. */
export const isHtml = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s);
/** Plain text of some HTML — for search, summaries and structured data. */
export const stripHtml = (s: string) => s.replace(/<\/(p|div|li|h[1-6]|tr|td|th|blockquote|pre)>|<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
