"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BellOff, BellRing } from "lucide-react";
import { Toggle } from "@/components/account/AccountShell";
import { disablePush, enablePush, pushState, type PushState } from "@/lib/push";

const HINT: Record<PushState, string> = {
  unsupported: "This browser can't show notifications.",
  unavailable: "Notifications aren't switched on for this site yet.",
  blocked: "Blocked in your browser. Allow notifications for this site in the address bar, then come back.",
  off: "Get a notification on this device when your order moves forward — even when the site is closed.",
  on: "On for this device. You'll be told when your order changes.",
};

/** One switch: browser notifications on this device. `staff` words it for people who run the shop. */
export default function PushToggle({ staff = false, compact = false }: { staff?: boolean; compact?: boolean }) {
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { let alive = true; void pushState().then((s) => { if (alive) setState(s); }); return () => { alive = false; }; }, []);

  const flip = async () => {
    if (!state || busy) return;
    setBusy(true);
    try {
      if (state === "on") { await disablePush(); toast.success("Notifications are off on this device"); }
      else { await enablePush(); toast.success("Notifications are on"); }
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not change notifications"); }
    finally { setState(await pushState()); setBusy(false); }
  };

  const usable = state === "on" || state === "off";
  if (compact) {
    // a small bell for a toolbar: lit when on; hidden where notifications can't work at all
    if (state === null || state === "unsupported" || state === "unavailable") return null;
    const label = state === "on" ? "Turn browser notifications off" : state === "blocked" ? "Notifications are blocked in this browser" : "Turn browser notifications on";
    return (
      <button type="button" onClick={() => void flip()} disabled={busy || state === "blocked"} aria-label={label} title={label}
        className={`grid h-10 w-10 place-items-center rounded-lg transition-colors hover:bg-softer disabled:opacity-50 dark:hover:bg-navy-900 ${state === "on" ? "text-brand-600 dark:text-brand-400" : "text-body"}`}>
        {state === "on" ? <BellRing className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
      </button>
    );
  }
  const hint = state ? (staff && state === "off" ? "Get a notification on this device for new orders and messages — even when the site is closed." : staff && state === "on" ? "On for this device. You'll be told about new orders and messages." : HINT[state]) : "Checking…";
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface p-3.5 dark:bg-navy-950/70">
      <BellRing className="h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">Browser notifications</p><p className="text-xs text-body">{hint}</p></div>
      {usable && <Toggle on={state === "on"} onChange={() => void flip()} label="Browser notifications on this device" />}
    </div>
  );
}
