/** Only allow same-site paths (e.g. "/checkout") as a post-login destination — never "//evil.com" or "https://…". */
export function safeNext(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
