import { cn } from "@/utils/format";

/** Section title: small caps eyebrow between short brand rules + heavy heading. */
export default function SectionHeading({
  eyebrow, title, description, align = "center", light = false,
}: { eyebrow?: string; title: string; description?: string; align?: "center" | "left"; light?: boolean }) {
  return (
    <div className={cn("mb-8 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <span className={cn("inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider", light ? "text-brand-300" : "text-brand-600 dark:text-brand-400")}>
          <span className="h-[2px] w-5 bg-brand-500" />{eyebrow}{align === "center" && <span className="h-[2px] w-5 bg-brand-500" />}
        </span>
      )}
      <h2 className={cn("mt-2 text-3xl font-black tracking-tight sm:text-4xl", light ? "text-white" : "text-ink")}>{title}</h2>
      {description && <p className={cn("mt-3 text-sm leading-relaxed", align === "center" && "mx-auto max-w-xl", light ? "text-slate-300" : "text-body")}>{description}</p>}
    </div>
  );
}
