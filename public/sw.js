/* Safety GPS Tracker — service worker. Its only job is to show push notifications and open the right page when one is tapped. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch { d = { title: "Safety GPS", body: event.data ? event.data.text() : "" }; }
  event.waitUntil((async () => {
    // if the website is open and in front, the person already sees the live toast — don't buzz them twice
    const open = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    if (open.some((c) => c.visibilityState === "visible" && c.focused)) return;
    await self.registration.showNotification(d.title || "Safety GPS", {
      body: d.body || "", tag: d.tag, renotify: !!d.tag, icon: "/icon.png", badge: "/icon.png", vibrate: [120, 60, 120], silent: false, data: { url: typeof d.url === "string" && d.url.startsWith("/") ? d.url : "/" },
    });
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const w of wins) { if (new URL(w.url).origin === self.location.origin) { await w.focus(); if ("navigate" in w) await w.navigate(target); return; } }
    await self.clients.openWindow(target);
  })());
});
