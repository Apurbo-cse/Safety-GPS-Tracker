"use client";
import Image from "next/image";
import { Check } from "lucide-react";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import DeviceVisual from "./DeviceVisual";
import { devices } from "@/data/devices";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openDemoModal, openDeviceModal, setCartOpen } from "@/store/slices/uiSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { formatBDT } from "@/utils/format";
import { toast } from "sonner";

export default function DeviceModal() {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.ui.deviceModalId);
  const d = devices.find((x) => x.id === id);
  const close = () => dispatch(openDeviceModal(null));

  return (
    <Modal open={!!d} onClose={close} title={d?.name ?? ""} wide>
      {d && (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {d.image ? (
              <div className="relative h-56 overflow-hidden rounded-lg border border-line bg-white"><Image quality={90} src={d.image} alt={d.siteTitle ?? d.name} fill sizes="400px" className="object-contain p-3" /></div>
            ) : <DeviceVisual kind={d.visual} className="h-56 rounded-lg" />}
            <p className="mt-3 text-xs text-slate-500">{d.image ? "Product image from the company price list. Exact hardware model is confirmed by the sales team." : "Illustration. Actual hardware model is confirmed by the sales team."}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-text">{d.category}</p>
            <p className="mt-2 text-sm leading-relaxed text-body">{d.summary}</p>
            <dl className="mt-4 divide-y divide-line-soft rounded-lg border border-line text-sm">
              {d.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 px-3 py-2"><dt className="text-slate-500">{s.label}</dt><dd className="text-right font-medium text-ink">{s.value}</dd></div>
              ))}
            </dl>
            <ul className="mt-4 grid gap-1.5 text-sm text-body-strong">
              {d.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{f}</li>)}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line-soft pt-4">
              <div className="mr-auto">
                <p className="text-xl font-bold text-ink">{d.price ? formatBDT(d.price) : "Request quote"}</p>
                <p className="text-xs text-slate-500">{d.priceNote}</p>
              </div>
              {d.price && (
                <Button onClick={() => { dispatch(addToCart({ id: `dev-${d.id}`, kind: "device", name: d.name, price: d.price!, monthly: d.monthly })); dispatch(openDeviceModal(null)); dispatch(setCartOpen(true)); toast.success(`${d.name} added to cart`); }}>Add to cart</Button>
              )}
              <Button variant="outline" onClick={() => { dispatch(openDeviceModal(null)); dispatch(openDemoModal(`Quote request: ${d.name}`)); }}>Request Quote</Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
