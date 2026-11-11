import { cn } from "@/utils/format";

export default function Container({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return <div id={id} className={cn("mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8", className)}>{children}</div>;
}
