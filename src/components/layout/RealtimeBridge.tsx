"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { baseApi } from "@/store/apiSlice";
import { formatBDT } from "@/utils/format";

const LABEL: Record<string, string> = { received: "received", confirmed: "confirmed", scheduled: "scheduled for installation", active: "active", cancelled: "cancelled" };

/** A short two-note chime for new orders / messages (browsers only allow it after the person has interacted with the page). */
function chime() {
  try {
    const ctx = new AudioContext();
    [660, 880].forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.15); g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + i * 0.15 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.15 + 0.14);
      o.start(ctx.currentTime + i * 0.15); o.stop(ctx.currentTime + i * 0.15 + 0.15);
    });
    setTimeout(() => void ctx.close(), 600);
  } catch { /* no audio available */ }
}

/**
 * Live updates (Socket.IO) while someone is logged in:
 *  - customers: their order's new status appears without a refresh
 *  - staff: new orders and contact messages appear the moment they arrive
 * Events only say "something changed"; the lists are refetched through the normal API.
 */
export default function RealtimeBridge() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userId = useAppSelector((s) => s.auth.user?.id);
  const role = useAppSelector((s) => s.auth.user?.role);

  useEffect(() => {
    if (!userId) { disconnectSocket(); return; }
    const s = connectSocket();
    if (!s) return;
    const bump = (...tags: Parameters<typeof baseApi.util.invalidateTags>[0]) => dispatch(baseApi.util.invalidateTags(tags));

    const onCreated = (o: { id: string; customer: string; payNow: number; items: number }) => {
      bump("AdminOrders", "Stats", "AdminProducts", "Products");
      chime();
      toast.success(`New order ${o.id}`, { description: `${o.customer} · ${o.items} item${o.items === 1 ? "" : "s"} · ${formatBDT(o.payNow)}`, action: { label: "View", onClick: () => router.push(`/admin/orders?q=${o.id}`) }, duration: 10_000 });
    };
    const onUpdated = (o: { id: string; status: string }) => {
      bump("MyOrders", "AdminOrders", "Stats", "AdminProducts", "Products");
      if (role === "customer") toast.info(`Your order ${o.id} is now ${LABEL[o.status] ?? o.status}`, { action: { label: "View", onClick: () => router.push("/orders") } });
    };
    const onMessage = (m: { name: string; subject: string; kind: string }) => {
      bump("Messages");
      chime();
      toast.info(`New ${m.kind === "lead" ? "call-back request" : "message"} from ${m.name}`, { description: m.subject, action: { label: "Open", onClick: () => router.push("/admin/messages") }, duration: 10_000 });
    };
    const onMessageUpdated = () => bump("Messages");

    s.on("order:created", onCreated); s.on("order:updated", onUpdated); s.on("message:created", onMessage); s.on("message:updated", onMessageUpdated);
    // after a dropped connection, whatever happened meanwhile is fetched again
    s.io.on("reconnect", () => bump("MyOrders", "AdminOrders", "Stats", "Messages"));
    return () => { s.off("order:created", onCreated); s.off("order:updated", onUpdated); s.off("message:created", onMessage); s.off("message:updated", onMessageUpdated); };
  }, [userId, role, dispatch, router]);

  return null;
}
