"use client";
import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Toggle } from "@/components/account/AccountShell";
import { isMuted, playSound, setMuted, subscribeMuted, unlockSound } from "@/lib/sound";

/** Sound on/off for live updates. `compact` is a small speaker button for a toolbar; otherwise a settings row. */
export default function SoundToggle({ compact = false, staff = false }: { compact?: boolean; staff?: boolean }) {
  // null on the server and the first paint (the setting lives in this browser), then the real value
  const muted = useSyncExternalStore<boolean | null>(subscribeMuted, isMuted, () => null);
  const flip = () => {
    const next = !(muted ?? false);
    setMuted(next);
    if (!next) { unlockSound(); setTimeout(() => playSound(staff ? "alert" : "ding"), 60); } // a little preview when switching on
  };
  if (muted === null) return null;
  if (compact) {
    const label = muted ? "Turn notification sound on" : "Turn notification sound off";
    return (
      <button type="button" onClick={flip} aria-label={label} title={label} className={`grid h-10 w-10 place-items-center rounded-lg transition-colors hover:bg-softer dark:hover:bg-navy-900 ${muted ? "text-body" : "text-brand-600 dark:text-brand-400"}`}>
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface p-3.5 dark:bg-navy-950/70">
      <Volume2 className="h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">Notification sound</p><p className="text-xs text-body">{staff ? "A chime when a new order or message arrives." : "A soft bell when your order moves forward."}</p></div>
      <Toggle on={!muted} onChange={flip} label="Notification sound" />
    </div>
  );
}
