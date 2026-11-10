import Image from "next/image";
import { Check } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { PLAY_STORE_URL } from "@/lib/site";

const list = ["Real-time tracking", "History and reports", "Alerts and notifications", "Geo-fencing", "Fuel monitoring", "For personal use or business"];

export default function AppPlatform() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading align="left" eyebrow="Mobile app & web platform" title="Your fleet in your pocket and on your desktop" description="Use the Android and iOS apps on the road and the web platform in the office — one account, same data." />
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {list.map((l) => <li key={l} className="flex gap-2 text-sm text-body-strong"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{l}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Image src="/img/app/icon.png" alt="Safety GPS Tracker app icon" width={56} height={56} className="h-14 w-14 rounded-xl shadow" />
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Get the Android app on Google Play"><Image src="/img/app/play-badge.png" alt="Get it on Google Play" width={170} height={56} className="h-12 w-auto" /></a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-6 rounded-full bg-brand-600/15 blur-3xl" aria-hidden />
          <Image src="/img/platform.png" alt="Safety GPS Tracker web platform and mobile app showing a live vehicle map" width={1200} height={1137} className="relative h-auto w-full" />
        </div>
      </Container>
    </section>
  );
}
