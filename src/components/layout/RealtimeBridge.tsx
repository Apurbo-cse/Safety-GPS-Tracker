"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { playSound, unlockSound } from "@/lib/sound";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { baseApi } from "@/store/apiSlice";
import { formatBDT } from "@/utils/format";

const LABEL: Record<string, string> = { pending: "pending", confirmed: "confirmed", scheduled: "scheduled for installation", delivered: "delivered", returned: "returned", refunded: "refunded", cancelled: "cancelled" };

/**
 * Live updates (Socket.IO) while someone is logged in:
 *  - customers: their order's new status appears without a refresh
 *  - staff: new orders, new customers and contact messages appear the moment they arrive
 *  - staff: stock numbers follow orders
 * Events only say "something changed"; the lists are refetched through the normal API.
 */
export default function RealtimeBridge() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userId = useAppSelector((s) => s.auth.user?.id);
  const role = useAppSelector((s) => s.auth.user?.role);

  // browsers keep pages silent until the person has touched them once
  useEffect(() => {
    const unlock = () => { unlockSound(); window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
    window.addEventListener("pointerdown", unlock); window.addEventListener("keydown", unlock);
    return () => { window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
  }, []);

  useEffect(() => {
    if (!userId) { disconnectSocket(); return; }
    const s = connectSocket();
    if (!s) return;
    const bump = (...tags: Parameters<typeof baseApi.util.invalidateTags>[0]) => dispatch(baseApi.util.invalidateTags(tags));

    const onCreated = (o: { id: string; customer: string; payNow: number; items: number }) => {
      bump("AdminOrders", "Stats", "AdminProducts", "Products");
      playSound("alert");
      toast.success(`New order ${o.id}`, { description: `${o.customer} · ${o.items} item${o.items === 1 ? "" : "s"} · ${formatBDT(o.payNow)}`, action: { label: "View", onClick: () => router.push(`/admin/orders?q=${o.id}`) }, duration: 10_000 });
    };
    const onUpdated = (o: { id: string; status: string }) => {
      bump("MyOrders", "AdminOrders", "Stats", "AdminProducts", "Products");
      if (role === "customer") playSound("ding");
      if (role === "customer") toast.info(`Your order ${o.id} is now ${LABEL[o.status] ?? o.status}`, { action: { label: "View", onClick: () => router.push("/orders") } });
    };
    const onMessage = (m: { name: string; subject: string; kind: string }) => {
      bump("Messages");
      playSound("alert");
      toast.info(`New ${m.kind === "lead" ? "call-back request" : "message"} from ${m.name}`, { description: m.subject, action: { label: "Open", onClick: () => router.push("/admin/messages") }, duration: 10_000 });
    };
    const onMessageUpdated = () => bump("Messages");
    // stock moved (an order was placed, cancelled or returned): admin product numbers catch up without a refresh (staff only)
    const onStock = () => bump("Products", "AdminProducts", "Stats");
    // someone signed up: staff who may see customers get the new row and a note
    const onUser = (u: { id: string; name: string }) => {
      bump("Customers", "Stats");
      playSound("ding");
      toast.info(`New customer: ${u.name}`, { action: { label: "View", onClick: () => router.push(`/admin/customers/${u.id}`) }, duration: 8000 });
    };

    s.on("order:created", onCreated); s.on("order:updated", onUpdated); s.on("message:created", onMessage); s.on("message:updated", onMessageUpdated); s.on("stock:changed", onStock); s.on("user:created", onUser);
    // after a dropped connection, whatever happened meanwhile is fetched again
    s.io.on("reconnect", () => bump("MyOrders", "AdminOrders", "Stats", "Messages", "Customers", "Products"));
    return () => { s.off("order:created", onCreated); s.off("order:updated", onUpdated); s.off("message:created", onMessage); s.off("message:updated", onMessageUpdated); s.off("stock:changed", onStock); s.off("user:created", onUser); };
  }, [userId, role, dispatch, router]);

  return null;
}
