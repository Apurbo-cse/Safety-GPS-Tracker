/**
 * Short notification sounds, made with the Web Audio API (no audio files to download).
 * Browsers only allow sound after the person has touched the page once, so `unlockSound()` is called on the first tap/key press.
 * People can mute it (kept in this browser only).
 */
const KEY = "sgt:sound";
let ctx: AudioContext | null = null;

export type SoundKind =
  /** staff: a new order or message — two rising notes, hard to miss */
  | "alert"
  /** an order of yours moved on, or a new customer signed up — one soft bell */
  | "ding";

export const isMuted = (): boolean => { try { return localStorage.getItem(KEY) === "off"; } catch { return false; } };
export const setMuted = (muted: boolean) => {
  try { if (muted) localStorage.setItem(KEY, "off"); else localStorage.removeItem(KEY); } catch { /* storage blocked: stays on for this visit */ }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGED));
};
const CHANGED = "sgt:sound-change";
/** For useSyncExternalStore: tells a component when the setting changes here or in another tab. */
export const subscribeMuted = (onChange: () => void) => {
  window.addEventListener(CHANGED, onChange); window.addEventListener("storage", onChange);
  return () => { window.removeEventListener(CHANGED, onChange); window.removeEventListener("storage", onChange); };
};

const audio = () => {
  if (typeof window === "undefined") return null;
  try {
    ctx ??= new (window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    return ctx;
  } catch { return null; }
};

/** Call from a user gesture (tap, key press) so later sounds are allowed to play. */
export function unlockSound() { const c = audio(); if (c && c.state === "suspended") void c.resume().catch(() => undefined); }

function note(c: AudioContext, freq: number, at: number, len: number, peak: number) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = "sine"; o.frequency.value = freq; o.connect(g); g.connect(c.destination);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, at + len);
  o.start(at); o.stop(at + len + 0.02);
}

export function playSound(kind: SoundKind = "alert") {
  if (isMuted()) return;
  const c = audio();
  if (!c || c.state === "suspended") return; // not allowed yet (nobody has touched the page): stay silent rather than error
  const t = c.currentTime;
  if (kind === "alert") { note(c, 660, t, 0.16, 0.16); note(c, 880, t + 0.15, 0.2, 0.16); }
  else { note(c, 988, t, 0.35, 0.12); note(c, 1319, t + 0.02, 0.3, 0.05); } // a soft two-partial bell
}
