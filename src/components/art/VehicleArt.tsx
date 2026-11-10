export type VehicleKind = "car" | "van" | "truck" | "bus" | "bike" | "cng" | "pickup" | "excavator" | "ship";

const Wheel = ({ x, y = 76, r = 12 }: { x: number; y?: number; r?: number }) => (
  <g><circle cx={x} cy={y} r={r} fill="#0b0c0f" /><circle cx={x} cy={y} r={r * 0.45} fill="#a3acba" /></g>
);
const GLASS = "#cfe0f2";
const DARK = "#1a1d24";

/** Flat side-view vehicle illustrations (200×100, ground at y≈88). */
export default function VehicleArt({ kind, color = "#f05a22", className }: { kind: VehicleKind; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className} role="img" aria-label={`${kind} illustration`}>
      {kind === "car" && (<>
        <path d="M20 70 L26 52 Q30 46 40 44 L62 26 Q68 22 78 22 H116 Q126 22 134 30 L148 44 Q166 46 172 58 L174 70 Q174 74 170 74 H24 Q20 74 20 70Z" fill={color} />
        <path d="M66 30 H92 V44 H54Z M98 30 H118 Q124 30 128 36 L138 44 H98Z" fill={GLASS} />
        <rect x="168" y="56" width="6" height="6" rx="2" fill="#fde68a" /><rect x="20" y="56" width="5" height="6" rx="2" fill="#ef4444" />
        <Wheel x={54} /><Wheel x={146} />
      </>)}
      {kind === "van" && (<>
        <path d="M16 70 V40 Q16 28 28 28 H118 Q130 28 138 38 L158 52 Q176 54 178 64 V70 Q178 74 174 74 H20 Q16 74 16 70Z" fill={color} />
        <path d="M28 36 H66 V50 H28Z M72 36 H112 V50 H72Z M122 36 H128 L148 50 H122Z" fill={GLASS} />
        <rect x="172" y="60" width="6" height="6" rx="2" fill="#fde68a" />
        <Wheel x={52} /><Wheel x={146} />
      </>)}
      {kind === "pickup" && (<>
        <path d="M16 70 V50 H72 L96 30 Q100 26 108 26 H128 Q136 26 142 34 L152 48 Q172 50 176 62 V70 Q176 74 172 74 H20 Q16 74 16 70Z" fill={color} />
        <path d="M18 50 H70 V68 H18Z" fill={DARK} fillOpacity=".25" />
        <path d="M100 32 H124 L136 46 H100Z" fill={GLASS} />
        <Wheel x={48} /><Wheel x={144} />
      </>)}
      {kind === "truck" && (<>
        <rect x="14" y="20" width="118" height="52" rx="4" fill="#e8ebf0" />
        <rect x="14" y="58" width="118" height="14" fill={color} />
        <path d="M136 72 V32 Q136 28 140 28 H162 L182 50 V72Z" fill={color} />
        <path d="M142 34 H160 L174 50 H142Z" fill={GLASS} />
        <Wheel x={42} /><Wheel x={90} /><Wheel x={156} />
      </>)}
      {kind === "bus" && (<>
        <rect x="10" y="22" width="180" height="52" rx="10" fill={color} />
        <rect x="10" y="58" width="180" height="6" fill="#fff" fillOpacity=".85" />
        <path d="M22 30 H46 V48 H22Z M52 30 H76 V48 H52Z M82 30 H106 V48 H82Z M112 30 H136 V48 H112Z M142 30 H178 V48 H142Z" fill={GLASS} />
        <rect x="120" y="30" width="2" height="44" fill={color} /><Wheel x={48} /><Wheel x={152} />
      </>)}
      {kind === "bike" && (<>
        <circle cx="52" cy="70" r="17" fill="none" stroke="#0b0c0f" strokeWidth="6" /><circle cx="152" cy="70" r="17" fill="none" stroke="#0b0c0f" strokeWidth="6" />
        <path d="M52 70 L86 48 H120 L152 70 M120 48 L134 32 H148 M128 40 L152 70" fill="none" stroke="#a3acba" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M82 46 Q92 34 112 38 L122 48Z" fill={color} /><path d="M62 46 H88 Q92 40 84 40 H66Z" fill="#0b0c0f" />
        <circle cx="86" cy="62" r="9" fill="#0b0c0f" /><circle cx="86" cy="62" r="4" fill="#a3acba" />
      </>)}
      {kind === "cng" && (<>
        <path d="M30 72 V40 Q30 28 44 26 H112 Q128 26 136 40 L150 58 V72Z" fill="#16a34a" />
        <path d="M36 40 H70 V56 H36Z M76 40 H112 L124 56 H76Z" fill={GLASS} />
        <rect x="30" y="64" width="120" height="8" fill="#14532d" />
        <rect x="144" y="56" width="8" height="6" rx="2" fill="#fde68a" />
        <Wheel x={60} /><Wheel x={134} r={10} y={78} />
      </>)}
      {kind === "excavator" && (<>
        <rect x="26" y="66" width="104" height="22" rx="11" fill="#0b0c0f" /><rect x="34" y="72" width="88" height="10" rx="5" fill="#374151" />
        <rect x="34" y="42" width="76" height="26" rx="4" fill="#facc15" /><path d="M42 44 H72 V32 Q72 28 68 28 H46 Q42 28 42 32Z" fill="#eab308" /><rect x="48" y="32" width="18" height="12" fill={GLASS} />
        <path d="M100 48 L146 18 L178 46" fill="none" stroke="#facc15" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M172 40 L190 52 L176 66 L164 52Z" fill="#6b7280" />
      </>)}
      {kind === "ship" && (<>
        <path d="M10 64 H190 L168 86 H34Z" fill={color} /><rect x="10" y="64" width="180" height="5" fill="#fff" fillOpacity=".8" />
        <rect x="26" y="40" width="26" height="24" fill="#38bdf8" /><rect x="54" y="40" width="26" height="24" fill="#f59e0b" /><rect x="82" y="40" width="26" height="24" fill="#e8ebf0" /><rect x="40" y="16" width="26" height="24" fill="#ef4444" /><rect x="68" y="16" width="26" height="24" fill="#22c55e" /><rect x="54" y="40" width="0" height="0" />
        <rect x="128" y="30" width="34" height="34" fill="#e8ebf0" /><rect x="136" y="18" width="18" height="12" fill="#e8ebf0" /><path d="M132 38 H158 M132 46 H158" stroke="#9aa3b2" strokeWidth="3" />
        <path d="M0 90 Q12 84 24 90 T48 90 T72 90 T96 90 T120 90 T144 90 T168 90 T192 90 T216 90" fill="none" stroke="#7dd3fc" strokeOpacity=".7" strokeWidth="3" />
      </>)}
    </svg>
  );
}
