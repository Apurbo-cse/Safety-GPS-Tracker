"use client";
import Image from "next/image";
import { motion } from "framer-motion";
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
      className="flex flex-col overflow-hidden rounded-md bg-softer/80 transition-all duration-300 dark:bg-navy-900/90"
    >
      {device.image ? (
        <div className="relative aspect-[858/600] w-full overflow-hidden bg-transparent">
          <Image
            src={device.image}
            alt={device.siteTitle ?? device.name}
            fill
            sizes="(min-width:1024px) 33vw, 100vw"
            className="object-contain"
          />
        </div>
      ) : (
        <DeviceVisual kind={device.visual} />
      )}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-text">{device.category}</p>
        <h3 className="mt-1 text-sm sm:text-base font-bold text-ink line-clamp-1">{device.name}</h3>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <p className="text-base sm:text-xl font-black text-ink">
              {device.price ? formatBDT(device.price) : <span className="text-xs sm:text-sm font-semibold text-body">Price on request</span>}
            </p>
            {device.monthly && (
              <span className="text-[11px] sm:text-xs font-semibold text-body">
                + {formatBDT(device.monthly)}/mo
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => dispatch(openDeviceModal(device.id))}
              className="flex-1 py-1.5 text-xs font-semibold"
            >
              Order Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(openDemoModal(`Quote request: ${device.name}`))}
              className="px-2.5 py-1.5 text-xs font-semibold"
            >
              Quote
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
