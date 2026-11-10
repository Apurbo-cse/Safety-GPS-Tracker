import type { Device } from "@/types";

/** Illustrative product artwork (not photographs of real models). */
export default function DeviceVisual({ kind, className }: { kind: Device["visual"]; className?: string }) {
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-gradient-to-br from-navy-900 to-navy-700 ${className ?? "h-44"}`}>
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
      <svg viewBox="0 0 160 110" className="relative h-4/5 w-auto" role="img" aria-label={`${kind} device illustration`}>
        {kind === "tracker" && (<>
          <rect x="30" y="28" width="100" height="54" rx="10" fill="#0f172a" stroke="#f98a55" strokeWidth="2" />
          <rect x="40" y="38" width="38" height="12" rx="3" fill="#5a2410" />
          <circle cx="112" cy="44" r="6" fill="#22c55e" /><circle cx="112" cy="44" r="10" fill="none" stroke="#22c55e" strokeOpacity=".4" />
          <rect x="40" y="58" width="80" height="4" rx="2" fill="#334155" /><rect x="40" y="66" width="52" height="4" rx="2" fill="#334155" />
          <path d="M30 55H12M130 55h18" stroke="#f98a55" strokeWidth="3" strokeLinecap="round" />
        </>)}
        {kind === "voice" && (<>
          <rect x="30" y="26" width="100" height="58" rx="10" fill="#0f172a" stroke="#f98a55" strokeWidth="2" />
          <rect x="62" y="36" width="36" height="22" rx="18" fill="#5a2410" />
          <rect x="74" y="38" width="12" height="16" rx="6" fill="#fdba8c" />
          <path d="M66 50a14 14 0 0 0 28 0" fill="none" stroke="#fdba8c" strokeWidth="2" />
          <path d="M80 64v8" stroke="#fdba8c" strokeWidth="2" />
          <path d="M112 40q8 8 0 16M118 36q12 12 0 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
        </>)}
        {kind === "video" && (<>
          <rect x="24" y="26" width="112" height="58" rx="10" fill="#0f172a" stroke="#f98a55" strokeWidth="2" />
          <circle cx="80" cy="55" r="20" fill="#262b34" stroke="#fdba8c" strokeWidth="3" />
          <circle cx="80" cy="55" r="9" fill="#f05a22" /><circle cx="76" cy="51" r="3" fill="#fff" opacity=".7" />
          <circle cx="122" cy="36" r="4" fill="#ef4444" />
        </>)}
        {kind === "relay" && (<>
          <rect x="44" y="30" width="72" height="50" rx="8" fill="#0f172a" stroke="#f98a55" strokeWidth="2" />
          <path d="M60 55h14l8-12 8 24 8-12h6" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M44 42H20M44 68H20M116 42h24M116 68h24" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </>)}
        {kind === "sos" && (<>
          <circle cx="80" cy="55" r="36" fill="#0f172a" stroke="#f98a55" strokeWidth="2" />
          <circle cx="80" cy="55" r="26" fill="#dc2626" />
          <circle cx="80" cy="55" r="26" fill="none" stroke="#fca5a5" strokeWidth="3" strokeOpacity=".5" />
          <text x="80" y="61" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff" fontFamily="sans-serif">SOS</text>
        </>)}
      </svg>
    </div>
  );
}
