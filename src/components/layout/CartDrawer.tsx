"use client";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { announceNavigation } from "@/lib/navigate";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart, removeFromCart, setQty } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { formatBDT } from "@/utils/format";

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector((s) => s.ui.cartOpen);
  const items = useAppSelector((s) => s.cart.items);
  const device = items.reduce((n, i) => n + i.price * i.qty, 0);
  const monthly = items.reduce((n, i) => n + (i.monthly ?? 0) * i.qty, 0);
  const close = () => dispatch(setCartOpen(false));

  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-navy-950/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={close} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-label="Cart">
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink"><ShoppingCart className="h-5 w-5" />Your order</h2>
          <button onClick={close} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-softer"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <ShoppingCart className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-body-strong">Your cart is empty</p>
                <p className="mt-1 text-sm text-slate-500">Add a package or device to start an order.</p>
                <Button className="mt-4" variant="outline" size="sm" onClick={() => { close(); announceNavigation(); router.push("/pricing"); }}>View pricing</Button>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li key={i.id} className="rounded-lg border border-line p-3">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{i.name}</p>
                      <p className="text-xs text-slate-500">{i.kind === "plan" ? "Package" : "Device"} · {formatBDT(i.price)}{i.monthly ? ` + ${formatBDT(i.monthly)}/mo` : ""}</p>
                    </div>
                    <button onClick={() => dispatch(removeFromCart(i.id))} aria-label={`Remove ${i.name}`} className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-2 inline-flex items-center rounded-lg border border-line">
                    <button className="grid h-8 w-8 place-items-center" aria-label="Decrease" onClick={() => dispatch(setQty({ id: i.id, qty: i.qty - 1 }))}><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                    <button className="grid h-8 w-8 place-items-center" aria-label="Increase" onClick={() => dispatch(setQty({ id: i.id, qty: i.qty + 1 }))}><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-line-soft p-5">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-body">Device total (one-time)</dt><dd className="font-semibold">{formatBDT(device)}</dd></div>
              <div className="flex justify-between"><dt className="text-body">Monthly subscription</dt><dd className="font-semibold">{formatBDT(monthly)}</dd></div>
            </dl>
            <Button className="mt-4 w-full" size="lg" onClick={() => { toast.success("Order request recorded (demo). Our sales team would contact you."); dispatch(clearCart()); close(); }}>
              Place order request
            </Button>
            <p className="mt-2 text-center text-xs text-slate-500">Demo only — no payment is taken and nothing is sent.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
