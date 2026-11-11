import { cn } from "@/utils/format";

export default function SectionHeading({
  eyebrow, title, description, align = "center", light = false,
}: { eyebrow?: string; title: string; description?: string; align?: "center" | "left"; light?: boolean }) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            light ? "border-white/15 bg-white/5 text-brand-200" : "border-brand-500/20 bg-brand-500/5 text-brand-text",
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping-slow absolute inset-0 rounded-full bg-brand-500" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-brand-500" />
          </span>
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", light ? "text-white" : "text-ink")}>{title}</h2>
      <span
        aria-hidden
        className={cn("mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-brand-600 to-brand-400", align === "center" && "mx-auto")}
      />
      {description && <p className={cn("mt-3 text-base leading-relaxed", light ? "text-slate-300" : "text-body")}>{description}</p>}
    </div>
  );
}
