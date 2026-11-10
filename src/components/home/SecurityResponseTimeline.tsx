"use client";
import { AlertTriangle, Lock, MapPin, PhoneCall, Siren } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";

const TIMELINE_STEPS = [
  {
    step: "01",
    time: "00:00",
    title: "Tamper / Breach Detected",
    badge: "Instant Sensor Trigger",
    description: "The tracker detects an unauthorized ignition start, device wire disconnection, geo-fence breach, or towing vibration sensor.",
    icon: AlertTriangle,
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  },
  {
    step: "02",
    time: "+1.5 Seconds",
    title: "Loud Smartphone Siren Alert",
    badge: "Multi-Channel Broadcast",
    description: "A high-priority alarm sounds on the owner's mobile app (even in silent mode) and automated SMS notifications are dispatched immediately.",
    icon: Siren,
    accent: "text-red-500 bg-red-500/10 border-red-500/30",
  },
  {
    step: "03",
    time: "+400 Milliseconds",
    title: "Remote Engine Immobilized",
    badge: "Smart Relay Lock",
    description: "With one tap in the mobile app, the remote immobilizer opens the fuel solenoid relay, killing engine ignition safely without harming the vehicle.",
    icon: Lock,
    accent: "text-brand-500 bg-brand-500/10 border-brand-500/30",
  },
  {
    step: "04",
    time: "+18 Minutes",
    title: "Police Relay & Asset Recovery",
    badge: "100% Stolen Recovery",
    description: "A temporary live tracking link is shared with local law enforcement and our 24/7 emergency response team for fast, on-site vehicle recovery.",
    icon: MapPin,
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  },
];

export default function SecurityResponseTimeline() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-24 border-t border-white/10">
      {/* Ambient background lines */}
      <div className="grid-bg absolute inset-0 opacity-20" aria-hidden />

      <Container className="relative">
        <SectionHeading
          light
          eyebrow="Emergency Incident Response"
          title="How our anti-theft telemetry prevents vehicle loss in seconds"
          description="In critical moments, speed saves assets. See how our automated telematics pipeline reacts when unauthorized activity is detected."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TIMELINE_STEPS.map((s, idx) => (
              <Reveal key={s.step} delay={idx * 0.1}>
                <div className="relative flex h-full flex-col justify-between rounded-lg border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-all hover:border-brand-500/50 hover:bg-white/[0.06] hover:shadow-2xl">
                  {/* Top Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-400">STAGE {s.step}</span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[11px] font-bold text-brand-300">
                        {s.time}
                      </span>
                    </div>

                    <div className={`mt-4 grid h-12 w-12 place-items-center rounded-lg border ${s.accent}`}>
                      <s.icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-white">{s.title}</h3>
                    <span className="mt-1 inline-block text-[11px] font-bold text-brand-400">{s.badge}</span>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{s.description}</p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-3 text-[11px] font-mono text-slate-400">
                    Response SLA: <b className="text-white">Active (24/7)</b>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Emergency Helpline Banner */}
          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-lg border border-white/15 bg-gradient-to-r from-brand-600/20 via-brand-500/10 to-transparent p-6 backdrop-blur sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-600 text-white shadow-lg">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white sm:text-base">24/7 Dedicated Emergency Helpline</h4>
                  <p className="text-xs text-slate-300">
                    Call <b>01713546487</b> anytime for urgent engine lock assistance, device diagnostics, or stolen vehicle police relay.
                  </p>
                </div>
              </div>

              <a
                href="tel:01713546487"
                className="whitespace-nowrap rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                Call Emergency Desk
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
