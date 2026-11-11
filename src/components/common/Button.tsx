import Link from "next/link";
import { cn } from "@/utils/format";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "gloss-btn text-white",
  secondary: "bg-navy-900 text-white hover:bg-navy-800",
  outline: "glass border border-line-strong text-ink hover:border-brand-500 hover:text-brand-text",
  ghost: "text-body-strong hover:bg-softer",
  danger: "bg-red-600 text-white hover:bg-red-700",
  light: "bg-white text-navy-950 hover:bg-white/90",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs sm:h-9 sm:text-sm",
  md: "h-9 px-4 text-sm sm:h-11 sm:px-5",
  lg: "h-10 px-4 text-sm sm:h-12 sm:px-6 sm:text-base",
};

interface Common { variant?: Variant; size?: Size; className?: string; children: React.ReactNode }

export function Button({
  variant = "primary", size = "md", className, children, ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary", size = "md", className, children, href, ...rest
}: Common & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return <a href={href} className={cls} {...rest}>{children}</a>;
  }
  return <Link href={href} className={cls} {...rest}>{children}</Link>;
}
