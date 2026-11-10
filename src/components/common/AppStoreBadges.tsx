"use client";
import { useState } from "react";
import { QrCode, Smartphone, X } from "lucide-react";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";
import { cn } from "@/utils/format";

export function AppleAppStoreBadge({ className }: { className?: string }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Safety GPS Tracker on the Apple App Store"
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border border-white/20 bg-black/80 px-4 py-2 text-white shadow-md transition-all hover:scale-[1.02] hover:border-brand-500 hover:bg-black hover:shadow-brand-500/15 active:scale-95",
        className
      )}
    >
      <svg className="h-6 w-6 shrink-0 fill-current text-white" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.77 1.05-1.84.93-2.92-.93.04-2.02.63-2.66 1.39-.57.66-.99 1.76-.86 2.81 1.04.08 2.06-.54 2.59-1.28" />
      </svg>
      <div className="text-left">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-300 leading-none">
          Download on the
        </p>
        <p className="font-sans text-sm font-extrabold tracking-tight text-white leading-tight mt-0.5">
          App Store
        </p>
      </div>
    </a>
  );
}

export function GooglePlayStoreBadge({ className }: { className?: string }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get Safety GPS Tracker on Google Play"
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border border-white/20 bg-black/80 px-4 py-2 text-white shadow-md transition-all hover:scale-[1.02] hover:border-brand-500 hover:bg-black hover:shadow-brand-500/15 active:scale-95",
        className
      )}
    >
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M3.609 1.814L13.792 12 3.61 22.186c-.368-.37-.61-.925-.61-1.579V3.393c0-.654.242-1.21.61-1.579z"
        />
        <path
          fill="#FBBC04"
          d="M17.228 8.563L4.99 1.498c-.463-.267-.93-.326-1.381-.184L13.792 12l3.436-3.437z"
        />
        <path
          fill="#34A853"
          d="M3.609 22.686c.451.142.918.083 1.381-.184l12.238-7.065-3.436-3.437L3.61 22.686z"
        />
        <path
          fill="#EA4335"
          d="M20.655 10.542l-3.427-1.979L13.792 12l3.436 3.437 3.427-1.979c.995-.575.995-1.941 0-2.916z"
        />
      </svg>
      <div className="text-left">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-300 leading-none">
          GET IT ON
        </p>
        <p className="font-sans text-sm font-extrabold tracking-tight text-white leading-tight mt-0.5">
          Google Play
        </p>
      </div>
    </a>
  );
}

export default function AppStoreBadges({
  showQr = true,
  className,
}: {
  showQr?: boolean;
  className?: string;
}) {
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <GooglePlayStoreBadge />
        <AppleAppStoreBadge />
      </div> 
    </div>
  );
}
