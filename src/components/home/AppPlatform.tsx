import Image from "next/image";
import { Check, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import AppStoreBadges from "@/components/common/AppStoreBadges";

const list = [
  "10-Second Real-Time Live Tracking",
  "Instant Remote Engine Immobilizer",
  "365 Days Unlimited Trip History Replay",
  "Geo-fencing Radar & Safe Zone Alarms",
  "Precision Fuel Level & Idling Analytics",
  "Automated BRTA Paper Expiry Reminders",
];

export default function AppPlatform() {
  return (
    <section className="bg-sec-warm py-16 sm:py-24 border-t border-line">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Multi-Device Telematics"
            title="Complete fleet command in your pocket and on your desktop"
            description="Manage your assets from anywhere in Bangladesh. Native iOS and Android smartphone apps deliver instant loud siren notifications even in silent mode, while the cloud web cockpit powers operations teams."
          />

          <ul className="grid gap-3 sm:grid-cols-2 mt-6">
            {list.map((l) => (
              <li key={l} className="flex gap-2 text-xs sm:text-sm font-semibold text-body-strong">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{l}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-md border border-line bg-soft/50 p-4 max-w-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              Install Native Mobile Telematics App
            </p>
            <AppStoreBadges showQr={true} />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-6 rounded-full bg-brand-600/15 blur-3xl" aria-hidden />
          <Image
            quality={90}
            src="/img/platform.png"
            alt="Safety GPS Tracker web platform and mobile app showing a live vehicle map"
            width={1200}
            height={1137}
            className="relative h-auto w-full drop-shadow-2xl"
          />
        </div>
      </Container>
    </section>
  );
}
