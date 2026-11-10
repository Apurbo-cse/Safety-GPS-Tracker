import { cn } from "@/utils/format";

export default function SectionHeading({
  eyebrow, title, description, align = "center", light = false,
}: { eyebrow?: string; title: string; description?: string; align?: "center" | "left"; light?: boolean }) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      <span aria-hidden className={cn("mb-3 block h-1 w-10 rounded-full bg-gradient-to-r from-brand-400 to-brand-600", align === "center" && "mx-auto")} />
      {eyebrow && (
        <p className={cn("mb-2 text-xs font-semibold uppercase tracking-wider", light ? "text-brand-200" : "text-brand-text")}>
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", light ? "text-white" : "text-ink")}>{title}</h2>
      {description && <p className={cn("mt-3 text-base leading-relaxed", light ? "text-slate-300" : "text-body")}>{description}</p>}
    </div>
  );
}
