import {
  Headset,
  Lock,
  Timer,
  FileCheck2,
  Fuel,
  Radio,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const whyUs: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Timer,
    title: "10-Second Satellite Telemetry",
    text: "Ultra-low latency GNSS updates ensure that vehicle position, speed, and turns are tracked on the road in real time.",
  },
  {
    icon: Lock,
    title: "Safe-Speed Engine Immobilizer",
    text: "Cut fuel and stop vehicle theft in under 400ms from your smartphone app with intelligent safety latch controls.",
  },
  {
    icon: Radio,
    title: "Multi-Carrier 4G IoT Roaming",
    text: "Automated failover across Grameenphone, Robi, and Banglalink towers guarantees zero blind spots on remote highways.",
  },
  {
    icon: Fuel,
    title: "Precision Fuel Rod Telematics",
    text: "Ultrasonic sensor integration detects sudden fuel drops, tank siphoning, and unauthorized AC idling with ±1% accuracy.",
  },
  {
    icon: FileCheck2,
    title: "Automated BRTA Paper Compliance",
    text: "Never face BRTA traffic police fines again with automated 30-day reminders for tax tokens, fitness, and insurance renewal.",
  },
  {
    icon: Wrench,
    title: "64 Districts Onsite Support",
    text: "Certified telematics technicians provide professional doorstep installation and wiring anywhere in Bangladesh.",
  },
  {
    icon: ShieldCheck,
    title: "100% Stolen Asset Recovery",
    text: "Dedicated rapid emergency response team coordinates directly with Bangladesh Police using encrypted live tracking links.",
  },
  {
    icon: Headset,
    title: "24×7 Live Emergency Helpline",
    text: "Round-the-clock operations center based in Shukrabad, Dhaka. Real human assistance available day and night at 01713546487.",
  },
];
