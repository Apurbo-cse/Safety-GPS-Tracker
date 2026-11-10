"use client";
import Image from "next/image";
import { motion } from "framer-motion";
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
    <motion.article
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="flex flex-col overflow-hidden rounded-lg glass border border-white/60 dark:border-white/10 shadow-sm transition-all hover:border-brand-400 hover:shadow-xl"
    >
      {device.image ? (
        <div className="relative h-48 bg-white border-b border-line-soft">
          <Image
            src={device.image}
            alt={device.siteTitle ?? device.name}
            fill
            sizes="(min-width:1024px) 33vw, 100vw"
            className="object-contain p-3"
          />
        </div>
      ) : (
        <DeviceVisual kind={device.visual} />
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-text">{device.category}</p>
        <h3 className="mt-1 text-base font-bold text-ink">{device.name}</h3>
        <dl className="mt-3 space-y-1.5 text-xs">
          {device.specs.slice(0, 3).map((s) => (
            <div key={s.label} className="flex justify-between gap-3">
              <dt className="text-slate-500">{s.label}</dt>
              <dd className="text-right font-bold text-ink ">{s.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-3 space-y-1.5 text-xs text-body-strong">
          {device.features.slice(0, 3).map((f) => (
            <li key={f} className="flex gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5 border-t border-line-soft">
          <p className="text-xl font-black text-ink">
            {device.price ? formatBDT(device.price) : <span className="text-sm font-semibold text-body">Price on request</span>}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" onClick={() => dispatch(openDeviceModal(device.id))}>
              Specs & Sensor
            </Button>
            <Button size="sm" variant="outline" onClick={() => dispatch(openDemoModal(`Quote request: ${device.name}`))}>
              Get Quote
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
