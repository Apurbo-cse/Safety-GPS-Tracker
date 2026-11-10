"use client";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/common/Button";
import DeviceVisual from "./DeviceVisual";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal, openDeviceModal } from "@/store/slices/uiSlice";
import { formatBDT } from "@/utils/format";
import type { Device } from "@/types";

export default function DeviceCard({ device }: { device: Device }) {
  const dispatch = useAppDispatch();
  return (
    <article className="spotlight flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-shadow hover:shadow-md">
      {device.image ? (
        <div className="relative h-48 bg-white">
          <Image src={device.image} alt={device.siteTitle ?? device.name} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-contain p-3" />
        </div>
      ) : <DeviceVisual kind={device.visual} />}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-text">{device.category}</p>
        <h3 className="mt-1 text-base font-bold text-ink">{device.name}</h3>
        <dl className="mt-3 space-y-1 text-sm">
          {device.specs.slice(0, 3).map((s) => (
            <div key={s.label} className="flex justify-between gap-3"><dt className="text-slate-500">{s.label}</dt><dd className="text-right font-medium text-ink">{s.value}</dd></div>
          ))}
        </dl>
        <ul className="mt-3 space-y-1 text-sm text-body-strong">
          {device.features.slice(0, 3).map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{f}</li>)}
        </ul>
        <div className="mt-auto pt-4">
          <p className="text-lg font-bold text-ink">{device.price ? formatBDT(device.price) : <span className="text-sm font-semibold text-body">Price on request</span>}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" onClick={() => dispatch(openDeviceModal(device.id))}>View Details</Button>
            <Button size="sm" variant="outline" onClick={() => dispatch(openDemoModal(`Quote request: ${device.name}`))}>Request Quote</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
