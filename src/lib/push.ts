/** Browser notifications (Web Push): turning them on and off for this browser. The server side lives in backend/src/push. */
import { request } from "@/lib/api";

export type PushState = "unsupported" | "unavailable" | "blocked" | "off" | "on";

export const pushSupported = () =>
  typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

const toBytes = (b64url: string) => {
  const pad = "=".repeat((4 - (b64url.length % 4)) % 4);
  const raw = atob((b64url + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

async function registration() {
  return (await navigator.serviceWorker.getRegistration("/")) ?? (await navigator.serviceWorker.register("/sw.js", { scope: "/" }));
}

/** What this browser is doing right now. "unavailable" = the server has no push keys yet. */
export async function pushState(): Promise<PushState> {
  if (!pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "blocked";
  try {
    const reg = await navigator.serviceWorker.getRegistration("/");
    if (reg && (await reg.pushManager.getSubscription())) return "on";
    const { key } = await request<{ key: string | null }>("GET", "/push/key", { auth: false });
    return key ? "off" : "unavailable";
  } catch { return "off"; }
}

/** Ask permission, subscribe this browser and tell the server. Throws a readable Error when it cannot. */
export async function enablePush(): Promise<void> {
  if (!pushSupported()) throw new Error("This browser can't show notifications.");
  const { key } = await request<{ key: string | null }>("GET", "/push/key", { auth: false });
  if (!key) throw new Error("Notifications aren't set up on the server yet.");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notifications are blocked. Allow them in your browser's site settings, then try again.");
  const reg = await registration();
  await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toBytes(key) }));
  const json = sub.toJSON();
  await request("POST", "/push/subscribe", { body: { endpoint: json.endpoint, keys: json.keys } });
}

export async function disablePush(): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration("/");
  const sub = await reg?.pushManager.getSubscription();
  if (!sub) return;
  try { await request("POST", "/push/unsubscribe", { body: { endpoint: sub.endpoint } }); } catch { /* still turn it off here */ }
  await sub.unsubscribe();
}
