import { MapPin } from "lucide-react";
import VehicleArt, { type VehicleKind } from "./VehicleArt";
import { cn } from "@/utils/format";

/** Illustrated scene: vehicle driving on a road with a tracking pin and label. */
export default function VehicleScene({
  kind,
  label = "Tracking live",
  color,
  className,
  speed = 4,
}: {
  kind: VehicleKind;
  label?: string;
  color?: string;
  className?: string;
  speed?: number;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-gradient-to-br from-navy-950 via-navy-800 to-[#4a2312]",
        className
      )}
      aria-hidden
    >
      <div className="grid-bg absolute inset-0 opacity-70" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-600/30 blur-3xl" />
      <svg
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[34%] w-full"
      >
        <rect width="400" height="120" fill="#0b0c0f" />
        <line
          x1="0"
          y1="62"
          x2="400"
          y2="62"
          stroke="#fff"
          strokeOpacity=".55"
          strokeWidth="4"
          strokeDasharray="22 22"
          className="road-dash"
          style={{ animationDuration: `${speed}s` }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-[14%] flex justify-center">
        <div className="drive-bob w-[62%] max-w-[300px]">
          <VehicleArt
            kind={kind}
            color={color}
            className="h-auto w-full drop-shadow-[0_10px_14px_rgba(0,0,0,.45)]"
          />
        </div>
      </div>
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" />
          <span className="relative h-2 w-2 rounded-full bg-green-400" />
        </span>
        {label}
      </div>
      <MapPin className="absolute right-4 top-4 h-6 w-6 text-brand-400 drop-shadow" />
    </div>
  );
}
