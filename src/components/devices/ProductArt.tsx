import type { Device } from "@/types";
import { cn } from "@/utils/format";

/**
 * Illustrated product artwork (drawn in SVG, not photos): the vehicle the device is made for,
 * the device itself, a live route and a location pin. Colours follow the theme tokens.
 */
type Vehicle = "car" | "bike" | "excavator" | "truck" | "van" | "suv" | "none";
type Kind = Device["visual"] | "obd";

const SCENE: Record<string, { vehicle: Vehicle; kind?: Kind }> = {
  "premium-pro-voice": { vehicle: "car" },
  "premium-with-voice": { vehicle: "suv" },
  "premium-without-voice": { vehicle: "car" },
  "bike-premium": { vehicle: "bike" },
  "excavator-device": { vehicle: "excavator" },
  "truck-tracking": { vehicle: "truck" },
  "live-video-tracking": { vehicle: "van" },
  "easy-obd": { vehicle: "suv", kind: "obd" },
  "engine-lock-relay": { vehicle: "none" },
  "panic-sos-button": { vehicle: "none" },
};

const ACCENT: Record<string, { a: string; soft: string }> = {
  "GPS Tracking Devices": { a: "#f05a22", soft: "#f05a22" },
  "Voice Monitoring Devices": { a: "#10b981", soft: "#10b981" },
  "Video & Voice Monitoring Devices": { a: "#0ea5e9", soft: "#0ea5e9" },
  "Vehicle GPS Hardware": { a: "#f59e0b", soft: "#f59e0b" },
};

const BODY = "fill-[#22324a] dark:fill-[#3a4a63]";
const GLASS = "fill-[#9fc3e6] dark:fill-[#5d7fa3]";
const TYRE = "fill-[#141a22] dark:fill-[#0b0f14]";
const HUB = "fill-[#cdd5df] dark:fill-[#8a96a6]";

function Wheel({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  return (<g><circle cx={x} cy={y} r={r} className={TYRE} /><circle cx={x} cy={y} r={r * 0.45} className={HUB} /></g>);
}

function VehicleShape({ v, accent }: { v: Vehicle; accent: string }) {
  switch (v) {
    case "car":
      return (<g>
        <path d="M34 150 q0-18 18-22 l26-6 q14-22 40-24 h40 q22 2 36 24 l20 4 q14 4 14 18 v10 q0 6-6 6 h-182 q-6 0-6-6z" className={BODY} />
        <path d="M86 122 q12-17 32-18 h16 v18z M142 104 h14 q16 1 26 18 h-40z" className={GLASS} />
        <rect x="36" y="146" width="12" height="5" rx="2" fill={accent} />
        <rect x="214" y="144" width="12" height="5" rx="2" fill="#fde68a" />
        <Wheel x={76} y={164} /><Wheel x={190} y={164} />
      </g>);
    case "suv":
      return (<g>
        <path d="M32 152 v-22 q0-10 10-12 l30-6 q10-24 34-24 h56 q18 0 30 22 l24 6 q12 3 12 16 v20 q0 6-6 6 h-184 q-6 0-6-6z" className={BODY} />
        <path d="M80 112 q8-18 26-18 h22 v18z M136 94 h26 q12 0 20 18 h-46z" className={GLASS} />
        <rect x="70" y="80" width="110" height="5" rx="2" className={BODY} />
        <rect x="34" y="140" width="12" height="5" rx="2" fill={accent} />
        <Wheel x={78} y={164} r={15} /><Wheel x={192} y={164} r={15} />
      </g>);
    case "van":
      return (<g>
        <path d="M30 156 v-60 q0-14 14-14 h130 q12 0 20 12 l24 32 q6 6 6 16 v14 q0 6-6 6 h-182 q-6 0-6-6z" className={BODY} />
        <path d="M180 98 l20 28 h-30 v-28z" className={GLASS} />
        <rect x="46" y="98" width="34" height="22" rx="3" className={GLASS} /><rect x="88" y="98" width="34" height="22" rx="3" className={GLASS} /><rect x="130" y="98" width="30" height="22" rx="3" className={GLASS} />
        <rect x="30" y="134" width="196" height="5" fill={accent} opacity=".85" />
        <Wheel x={70} y={164} /><Wheel x={190} y={164} />
      </g>);
    case "truck":
      return (<g>
        <rect x="24" y="72" width="138" height="80" rx="6" className={BODY} />
        <rect x="24" y="72" width="138" height="8" rx="4" fill={accent} opacity=".85" />
        <path d="M166 92 h34 q10 0 16 10 l14 22 q4 6 4 14 v14 h-68z" className={BODY} />
        <path d="M174 100 h24 l14 22 h-38z" className={GLASS} />
        <Wheel x={56} y={162} /><Wheel x={92} y={162} /><Wheel x={202} y={162} />
      </g>);
    case "bike":
      return (<g>
        <Wheel x={70} y={156} r={22} /><Wheel x={196} y={156} r={22} />
        <circle cx={70} cy={156} r="22" fill="none" className="stroke-[#141a22] dark:stroke-[#0b0f14]" strokeWidth="6" />
        <circle cx={196} cy={156} r="22" fill="none" className="stroke-[#141a22] dark:stroke-[#0b0f14]" strokeWidth="6" />
        <path d="M70 156 L110 118 L160 118 L196 156" fill="none" className="stroke-[#22324a] dark:stroke-[#3a4a63]" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M100 116 q30-16 66-6 l-8 18 h-50z" fill={accent} />
        <path d="M106 108 h40" className="stroke-[#141a22]" strokeWidth="7" strokeLinecap="round" />
        <path d="M168 120 l14-30 h14" fill="none" className="stroke-[#22324a] dark:stroke-[#3a4a63]" strokeWidth="5" strokeLinecap="round" />
      </g>);
    case "excavator":
      return (<g>
        <rect x="34" y="150" width="140" height="22" rx="11" className={TYRE} />
        {[52, 78, 104, 130, 156].map((x) => <circle key={x} cx={x} cy="161" r="6" className={HUB} />)}
        <rect x="44" y="118" width="120" height="30" rx="5" fill={accent} />
        <path d="M70 118 v-34 q0-6 6-6 h34 q6 0 8 6 l6 34z" fill={accent} />
        <rect x="80" y="86" width="28" height="22" rx="3" className={GLASS} />
        <path d="M140 122 L196 74 L236 118" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M226 112 l22 6 l-6 26 q-18 4-28-10z" className={BODY} />
      </g>);
    default:
      return null;
  }
}

function DeviceShape({ kind, accent }: { kind: Kind; accent: string }) {
  const shell = "fill-[#0f172a]";
  switch (kind) {
    case "voice":
      return (<g>
        <rect x="0" y="0" width="74" height="46" rx="10" className={shell} stroke={accent} strokeWidth="2" />
        <rect x="31" y="9" width="12" height="18" rx="6" fill="#fdba8c" />
        <path d="M24 22a13 13 0 0 0 26 0M37 35v4" fill="none" stroke="#fdba8c" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 14q6 7 0 14M63 10q10 11 0 22" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      </g>);
    case "video":
      return (<g>
        <rect x="0" y="0" width="78" height="46" rx="10" className={shell} stroke={accent} strokeWidth="2" />
        <circle cx="39" cy="23" r="15" fill="#262b34" stroke="#bae6fd" strokeWidth="2.5" />
        <circle cx="39" cy="23" r="7" fill={accent} /><circle cx="36" cy="20" r="2.4" fill="#fff" opacity=".8" />
        <circle cx="68" cy="10" r="3.5" fill="#ef4444" />
      </g>);
    case "relay":
      return (<g>
        <rect x="0" y="0" width="70" height="46" rx="8" className={shell} stroke={accent} strokeWidth="2" />
        <path d="M14 23h12l7-10 7 20 7-10h9" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 12H-14M0 34H-14M70 12h14M70 34h14" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      </g>);
    case "sos":
      return (<g>
        <circle cx="34" cy="34" r="34" className={shell} stroke={accent} strokeWidth="2" />
        <circle cx="34" cy="34" r="24" fill="#dc2626" />
        <text x="34" y="40" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="sans-serif">SOS</text>
      </g>);
    case "obd":
      return (<g>
        <path d="M0 6 q0-6 6-6 h56 q6 0 6 6 v22 l-8 12 h-52 l-8-12z" className={shell} stroke={accent} strokeWidth="2" />
        {[12, 22, 32, 42, 52].map((x) => <rect key={x} x={x} y="10" width="4" height="10" rx="1" fill={accent} opacity=".8" />)}
        <circle cx="56" cy="30" r="3" fill="#22c55e" />
      </g>);
    default:
      return (<g>
        <rect x="0" y="0" width="74" height="44" rx="10" className={shell} stroke={accent} strokeWidth="2" />
        <rect x="10" y="10" width="28" height="9" rx="3" fill={accent} opacity=".5" />
        <rect x="10" y="26" width="44" height="4" rx="2" fill="#334155" />
        <circle cx="60" cy="16" r="5" fill="#22c55e" /><circle cx="60" cy="16" r="9" fill="none" stroke="#22c55e" strokeOpacity=".4" />
      </g>);
  }
}

export default function ProductArt({ d, className }: { d: Pick<Device, "id" | "category" | "visual" | "name">; className?: string }) {
  const scene = SCENE[d.id] ?? { vehicle: "car" as Vehicle };
  const kind: Kind = scene.kind ?? d.visual;
  const { a } = ACCENT[d.category] ?? ACCENT["GPS Tracking Devices"];
  const solo = scene.vehicle === "none";
  const gid = `pa-${d.id}`;

  return (
    <svg viewBox="0 0 320 224" className={cn("h-full w-full", className)} role="img" aria-label={`${d.name} illustration`}>
      <defs>
        <radialGradient id={gid} cx="70%" cy="30%" r="80%">
          <stop offset="0%" stopColor={a} stopOpacity=".22" />
          <stop offset="100%" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="224" fill={`url(#${gid})`} />
      {/* faint map grid */}
      <g className="stroke-[#94a3b8]" strokeOpacity=".18" strokeWidth="1">
        {[40, 80, 120, 160, 200, 240, 280].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="224" />)}
        {[40, 80, 120, 160, 200].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} />)}
      </g>
      {/* live route to the pin */}
      <path d="M20 200 C 90 196, 120 150, 180 120 S 250 60, 268 44" fill="none" stroke={a} strokeOpacity=".25" strokeWidth="6" strokeLinecap="round" />
      <path d="M20 200 C 90 196, 120 150, 180 120 S 250 60, 268 44" fill="none" stroke={a} strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" className="route-flow" />
      <g transform="translate(268 44)">
        <circle r="16" fill={a} opacity=".18"><animate attributeName="r" values="10;20;10" dur="2.2s" repeatCount="indefinite" /></circle>
        <path d="M0 6 C -10 -4, -10 -18, 0 -18 C 10 -18, 10 -4, 0 6Z" fill={a} />
        <circle cy="-10" r="3.5" fill="#fff" />
      </g>
      {/* ground */}
      <ellipse cx="140" cy="182" rx="128" ry="10" fill="#0f172a" opacity=".12" />

      {solo ? (
        <g transform={kind === "sos" ? "translate(126 84) scale(1.4)" : "translate(110 92) scale(1.45)"}><DeviceShape kind={kind} accent={a} /></g>
      ) : (
        <>
          <VehicleShape v={scene.vehicle} accent={a} />
          <g transform="translate(222 150)">
            <rect x="-6" y="-6" width={kind === "video" ? 90 : 86} height="58" rx="14" className="fill-white/80 dark:fill-white/10" />
            <DeviceShape kind={kind} accent={a} />
          </g>
        </>
      )}
    </svg>
  );
}
