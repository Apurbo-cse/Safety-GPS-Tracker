import { cn } from "@/utils/format";
import type { VehicleStatus } from "@/types";

export const statusStyle: Record<VehicleStatus, { label: string; dot: string; chip: string; hex: string }> = {
  running: { label: "Running", dot: "bg-green-500", chip: "bg-green-50 text-green-700", hex: "#16a34a" },
  idle: { label: "Idle", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700", hex: "#f59e0b" },
  parked: { label: "Parked", dot: "bg-blue-500", chip: "bg-blue-50 text-blue-700", hex: "#2563eb" },
  offline: { label: "Offline", dot: "bg-slate-400", chip: "bg-softer text-body", hex: "#94a3b8" },
};

export default function StatusBadge({ status }: { status: VehicleStatus }) {
  const s = statusStyle[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", s.chip)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
