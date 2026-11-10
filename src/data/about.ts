import {
  BellRing, Cpu, FileBarChart, Handshake, Headset, Lock, MapPinned, MonitorSmartphone, PackageCheck,
  Radio, Satellite, ShieldCheck, Smartphone, Sparkles, Users, Video, Wrench, type LucideIcon,
} from "lucide-react";

/** Qualitative company content for /about (no invented statistics). */

export const values: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: "Safety first", text: "Every feature starts with one question: does it help keep the vehicle and the people in it safer?" },
  { icon: Sparkles, title: "Keep it simple", text: "Clear apps and plain reports, so owners and managers can act without training." },
  { icon: Handshake, title: "Honest pricing", text: "A device price and a monthly charge, shown up front for every package." },
  { icon: Headset, title: "Always reachable", text: "A 24×7 helpline, because vehicles do not stop at office hours." },
];

export const services: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: MapPinned, title: "Real-time GPS tracking", text: "Live location, speed and ignition status on one map." },
  { icon: Video, title: "Voice & video monitoring", text: "Listen to the cabin or watch live video on supported packages." },
  { icon: Lock, title: "Engine lock & alerts", text: "Lock and unlock the engine remotely and get security alerts." },
  { icon: FileBarChart, title: "Reports & reminders", text: "Mileage, history, working hours and maintenance reminders." },
  { icon: MonitorSmartphone, title: "Android, iOS & web apps", text: "Track from the phone or the web platform, anywhere." },
  { icon: Headset, title: "24×7 helpline", text: "Talk to the team any time you need help." },
];

/** How a reading travels from the vehicle to the customer. */
export const techFlow: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Cpu, title: "Tracking device", text: "Fitted in the vehicle; reads GPS position and events." },
  { icon: Satellite, title: "GPS signal", text: "Satellites give the device its location." },
  { icon: Radio, title: "Mobile network", text: "Data travels over local telecom partners' SIMs." },
  { icon: BellRing, title: "Platform", text: "Positions update about every 10 seconds; alerts are raised." },
  { icon: Smartphone, title: "Your apps", text: "See it on Android, iOS or web, with popup and email notifications." },
];

/** Customer journey from first call to after-sales. */
export const journey: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Headset, title: "Talk to us", text: "Call the helpline or send a request with your vehicle type." },
  { icon: PackageCheck, title: "Pick a package", text: "Choose a device and monthly plan that fit the vehicle." },
  { icon: Wrench, title: "Installation", text: "The tracker is fitted and tested in the vehicle." },
  { icon: Smartphone, title: "App setup", text: "Log in, add vehicles, drivers and alerts." },
  { icon: Users, title: "Ongoing support", text: "Help, renewals and reminders whenever you need them." },
];
