import { forwardRef } from "react";
import { AlertCircle, ChevronDown, type LucideIcon } from "lucide-react";

/** Shared control styling: plain border that turns brand orange on focus, red when invalid. */
export const inputCls =
  "w-full rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 " +
  "transition-colors focus:border-brand-500 focus:outline-none " +
  "aria-[invalid=true]:border-red-500 disabled:cursor-not-allowed disabled:opacity-60";

export const textareaCls = `${inputCls} min-h-36 resize-y leading-relaxed`;

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
  /** Leading icon drawn inside the control */
  icon?: LucideIcon;
  required?: boolean;
  /** Right-aligned text next to the label, e.g. a character counter */
  aside?: React.ReactNode;
};

export function Field({ label, error, children, hint, icon: Icon, required, aside }: FieldProps) {
  return (
    <label className="group block">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-sm font-medium text-body-strong">
        <span>
          {label}
          {required && <span className="ml-0.5 text-brand-600" aria-hidden>*</span>}
        </span>
        {aside}
      </span>
      {Icon ? (
        <span className="relative block [&_input]:pl-10 [&_select]:pl-10">
          <Icon
            aria-hidden
            className={`pointer-events-none absolute left-3.5 top-3 z-10 h-4 w-4 transition-colors ${error ? "text-red-500" : "text-slate-400 group-focus-within:text-brand-600"}`}
          />
          {children}
        </span>
      ) : (
        children
      )}
      {hint && !error && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
      {error && (
        <span role="alert" className="slide-in mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </span>
      )}
    </label>
  );
}

/** Native select (keeps keyboard/mobile pickers) with a custom chevron. */
export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className = "", children, ...props }, ref) {
  return (
    <span className="relative block">
      <select ref={ref} className={`${inputCls} cursor-pointer appearance-none pr-10 ${className}`} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform group-focus-within:rotate-180 group-focus-within:text-brand-600" />
    </span>
  );
});
