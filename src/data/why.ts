import { Headset, Lock, PackageCheck, Smartphone, Timer, FileCheck2, type LucideIcon } from "lucide-react";

export const whyUs: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Timer, title: "Frequent location updates", text: "10-second updates keep what you see close to what is happening." },
  { icon: Lock, title: "Security built in", text: "Engine lock & unlock, panic button, accident and device removal alerts." },
  { icon: Smartphone, title: "Apps and web", text: "Android, iOS and a web platform from the same account." },
  { icon: FileCheck2, title: "Compliance reminders", text: "BRTA papers, insurance and engine oil alerts so nothing lapses." },
  { icon: PackageCheck, title: "Clear package pricing", text: "Published device prices and monthly charges, no hidden tiers." },
  { icon: Headset, title: "24×7 helpline", text: "Every published package includes helpline support." },
];
