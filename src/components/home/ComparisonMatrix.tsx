"use client";
import { Check, X, Shield } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import { LinkButton } from "@/components/common/Button";

interface Row {
  feature: string;
  safetyGps: string;
  genericGps: string;
  cheapSms: string;
  highlight?: boolean;
}

const COMPARISON_ROWS: Row[] = [
  {
    feature: "GPS Refresh Rate",
    safetyGps: "10 Seconds (True Live Stream)",
    genericGps: "60 to 300 Seconds Delay",
    cheapSms: "Manual SMS Reply Only",
    highlight: true,
  },
  {
    feature: "Remote Engine Immobilizer",
    safetyGps: "Instant Safe-Speed Latch (<400ms)",
    genericGps: "Abrupt Sudden Cut-off",
    cheapSms: "SMS Command (Unreliable)",
    highlight: true,
  },
  {
    feature: "Network Connectivity",
    safetyGps: "Multi-Carrier 4G IoT (GP + Robi + BL)",
    genericGps: "Single 2G SIM (Dead Zones)",
    cheapSms: "Single Prepaid SIM Card",
  },
  {
    feature: "BRTA Compliance Reminders",
    safetyGps: "Automated Tax, Fitness & Route Permit",
    genericGps: "Not Supported",
    cheapSms: "Not Supported",
    highlight: true,
  },
  {
    feature: "Fuel Level Monitoring",
    safetyGps: "CAN-Bus + Ultrasonic Rod (±1% Accuracy)",
    genericGps: "Calculated Estimate Only",
    cheapSms: "Not Supported",
  },
  {
    feature: "Historical Route Playback",
    safetyGps: "365 Days Unlimited Cloud Storage",
    genericGps: "15 to 30 Days Maximum",
    cheapSms: "No Trip History",
  },
  {
    feature: "Emergency SOS Panic Button",
    safetyGps: "Instant App Siren & Multi-Number Alert",
    genericGps: "Delayed Notification",
    cheapSms: "Single SMS to 1 Number",
  },
  {
    feature: "24/7 Helpline & Recovery Assist",
    safetyGps: "24/7 Dhaka Operations + Police Relay",
    genericGps: "No Local Support",
    cheapSms: "None",
    highlight: true,
  },
  {
    feature: "Mobile App Performance",
    safetyGps: "Native iOS & Android with Push Sirens",
    genericGps: "Slow Webview Apps (Chinese UI)",
    cheapSms: "SMS Text Commands",
  },
  {
    feature: "Installation & Warranty",
    safetyGps: "64 Districts Onsite Service + 1 Yr Replace",
    genericGps: "Self-Install / No Warranty",
    cheapSms: "No Warranty",
  },
];

export default function ComparisonMatrix() {
  return (
    <section className="relative overflow-hidden bg-soft/40 py-16 sm:py-24 border-t border-line">
      <Container>
        <SectionHeading
          eyebrow="Technology Comparison"
          title="Why enterprise fleets choose Safety GPS Tracker"
          description="A clear breakdown of how our enterprise-grade telematics hardware and software compare against generic market trackers."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          <Reveal>
            <div className="overflow-x-auto rounded-md glass border border-line  ">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-softer/60 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="p-4 sm:p-5">Capability / Feature</th>
                    <th className="bg-brand-500/10 p-4 sm:p-5 text-brand-600 dark:text-brand-400 font-bold text-sm border-x border-brand-500/20">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-4 w-4" />
                        Safety GPS Tracker
                      </div>
                    </th>
                    <th className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">Generic Market Trackers</th>
                    <th className="p-4 sm:p-5 text-slate-400">Basic SMS Trackers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {COMPARISON_ROWS.map((row) => (
                    <tr
                      key={row.feature}
                      className={row.highlight ? "bg-brand-50/20 dark:bg-brand-500/[0.03]" : undefined}
                    >
                      <td className="p-4 sm:p-5 font-semibold text-ink text-xs sm:text-sm">
                        {row.feature}
                      </td>

                      {/* Safety GPS Tracker Column */}
                      <td className="border-x border-brand-500/20 bg-brand-500/[0.05] p-4 sm:p-5 text-xs sm:text-sm font-bold text-ink">
                        <div className="flex items-center gap-2 text-brand-text">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                          <span>{row.safetyGps}</span>
                        </div>
                      </td>

                      {/* Generic Chinese Trackers Column */}
                      <td className="p-4 sm:p-5 text-xs sm:text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-500/15 text-amber-600">
                            <span className="text-xs font-bold font-mono">!</span>
                          </span>
                          <span>{row.genericGps}</span>
                        </div>
                      </td>

                      {/* Cheap SMS Trackers Column */}
                      <td className="p-4 sm:p-5 text-xs sm:text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-500/15 text-slate-400">
                            <X className="h-3 w-3" />
                          </span>
                          <span>{row.cheapSms}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-md border border-line bg-gradient-to-r from-soft to-surface p-5 sm:flex-row">
              <div>
                <p className="text-sm font-bold text-ink">Ready to protect your vehicle with Bangladesh&apos;s #1 GPS system?</p>
                <p className="text-xs text-slate-500">Packages starting from ৳3,000 device price with ৳300/mo service.</p>
              </div>
              <div className="flex gap-2">
                <LinkButton href="/pricing" variant="outline" size="sm">
                  View All Packages
                </LinkButton>
                <LinkButton href="/register" size="sm">
                  Get Started
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
