"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  Search,
  X,
} from "lucide-react";
import Container from "@/components/common/Container";
import { SITE } from "@/lib/site";
import { cn } from "@/utils/format";

type FaqCategory =
  | "All"
  | "Tracking & GPS"
  | "Security & Relay"
  | "Hardware & Sensors"
  | "Billing & Support";

type CategorizedFaq = {
  id: string;
  category: Exclude<FaqCategory, "All">;
  q: string;
  a: string;
  tag: string;
};

const FAQS: CategorizedFaq[] = [
  {
    id: "faq-1",
    category: "Tracking & GPS",
    q: "How fast does the GPS location update on the map?",
    a: "Safety GPS Tracker features an ultra-low latency 10-second satellite refresh rate. This ensures road turns, highway speed changes, and traffic stops are reflected accurately in real-time without sluggish delays.",
    tag: "10s Ultra-Fast Ping",
  },
  {
    id: "faq-2",
    category: "Security & Relay",
    q: "How does the Remote Engine Immobilizer work?",
    a: "Through your mobile app or web portal, you can tap 'Immobilize Engine'. An encrypted command is transmitted via the onboard 4G IoT relay in under 400 milliseconds to cut power to the fuel solenoid. A smart speed-latch ensures the command only executes safely when the vehicle slows down.",
    tag: "Solid-State Relay",
  },
  {
    id: "faq-3",
    category: "Hardware & Sensors",
    q: "Can I monitor fuel pilferage and diesel consumption?",
    a: "Yes. Our Fuel Monitoring Package pairs with capacitive and ultrasonic fuel sensor rods (±1% accuracy) installed in your vehicle's fuel tank, giving you instant alerts for sudden fuel drops, tank drainage, and refuel receipts.",
    tag: "99.5% Accuracy Rods",
  },
  {
    id: "faq-4",
    category: "Tracking & GPS",
    q: "What happens if a vehicle enters cellular dead zones on remote highways?",
    a: "Our hardware uses Multi-Carrier 4G IoT SIM cards with automatic network switching across Grameenphone, Robi, and Banglalink towers. In rare instances where all networks are unreachable, internal flash memory stores up to 30,000 GPS points and uploads them automatically the moment signal returns.",
    tag: "Dual-SIM Roaming",
  },
  {
    id: "faq-5",
    category: "Hardware & Sensors",
    q: "Do you provide doorstep installation across all 64 districts in Bangladesh?",
    a: "Yes! Our certified telematics technicians provide free doorstep installation, covert wiring, and device calibration in Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, and all 64 districts.",
    tag: "64 Districts Coverage",
  },
  {
    id: "faq-6",
    category: "Billing & Support",
    q: "Can multiple dispatchers track the fleet simultaneously on Android, iOS, and PC?",
    a: "Absolutely. One account gives your dispatchers and executives simultaneous multi-login access on native Android and iOS mobile apps as well as any desktop web browser with role-based access control.",
    tag: "Multi-Platform Access",
  },
  {
    id: "faq-7",
    category: "Hardware & Sensors",
    q: "Is this tracking hardware approved by BTRC and BRTA compliant?",
    a: "Yes, 100%. All tracking units supplied by Safety GPS Tracker are officially BTRC approved (Reg. BTRC/LL/GPS-2021) and comply with BRTA digital safety guidelines for commercial and private motor vehicles.",
    tag: "BTRC Licensed",
  },
  {
    id: "faq-8",
    category: "Security & Relay",
    q: "What happens if a thief attempts to cut or disconnect the tracker?",
    a: "The moment the primary wiring is severed, the device triggers an instant 'Power Cut / Tamper Alert' notification to your phone. The onboard backup battery keeps the GPS running for up to 72 hours while alerting our 24/7 recovery dispatch desk.",
    tag: "Tamper & Battery",
  },
];

const CATEGORIES: FaqCategory[] = [
  "All",
  "Tracking & GPS",
  "Security & Relay",
  "Hardware & Sensors",
  "Billing & Support",
];

export default function HomeFaq() {
  const [activeCat, setActiveCat] = useState<FaqCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((f) => {
      const matchCat = activeCat === "All" || f.category === activeCat;
      const matchSearch =
        searchQuery.trim() === "" ||
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCat, searchQuery]);

  return (
    <section className="relative overflow-hidden bg-sec-warm py-16 sm:py-24" id="faq">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Heading, Categories & Live Support Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-text">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Got Questions? <br />
                <span className="text-brand-text">We Have the Answers.</span>
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-body">
                Everything you need to know about our GPS tracking platform, remote engine immobilizer, fuel sensor calibration, and nationwide doorstep technician network.
              </p>
            </div>

            {/* Category Filter Pills (rounded-md) */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const count =
                  cat === "All"
                    ? FAQS.length
                    : FAQS.filter((f) => f.category === cat).length;
                const isSelected = activeCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCat(cat);
                      setOpenId(null);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                      isSelected
                        ? "bg-brand-600 text-white shadow-sm"
                        : "border border-line bg-surface text-body hover:border-brand-400 hover:text-ink"
                    )}
                  >
                    <span>{cat}</span>
                    <span
                      className={cn(
                        "rounded px-1 text-[10px] font-mono",
                        isSelected ? "bg-white/20 text-white" : "text-slate-400"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 24/7 Helpline Support Box (rounded-md) */}
            <div className="rounded-md border border-brand-500/30 bg-gradient-to-br from-brand-950/20 via-surface to-brand-900/10 p-5 shadow-sm">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>24/7 DISPATCH DESK ONLINE</span>
              </div>

              <h4 className="mt-2 text-sm font-bold text-ink">
                Still have unanswered questions?
              </h4>
              <p className="mt-1 text-xs text-body leading-relaxed">
                Speak directly with our Dhaka engineering team for fleet quotations or custom telematics queries.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${SITE.phone}`}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-brand-500 active:scale-95"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call {SITE.phone}</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-2 text-xs font-semibold text-body hover:border-brand-400 hover:text-ink transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-brand-text" />
                  <span>Contact Form</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Search & Interactive Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search Input Bar (rounded-md) */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. engine lock, fuel accuracy, 4G, warranty)..."
                className="w-full rounded-md border border-line bg-surface py-2.5 pl-10 pr-9 text-xs sm:text-sm text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear FAQ search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Empty Search State */}
            {filteredFaqs.length === 0 ? (
              <div className="rounded-md border border-dashed border-line-strong p-8 text-center bg-surface/50">
                <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm font-bold text-ink">
                  No matching questions found
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Try searching with different terms or select &quot;All&quot; category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCat("All");
                  }}
                  className="mt-3 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-500"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openId === faq.id;
                  const itemNumber = (index + 1).toString().padStart(2, "0");

                  return (
                    <div
                      key={faq.id}
                      className={cn(
                        "overflow-hidden rounded-md border bg-surface transition-all duration-200",
                        isOpen
                          ? "border-brand-500/60 shadow-sm ring-1 ring-brand-500/20"
                          : "border-line hover:border-brand-400/50"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start justify-between gap-4 p-4 text-left transition-colors hover:bg-soft/50 sm:p-5"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className={cn(
                              "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px] font-bold transition-colors",
                              isOpen
                                ? "bg-brand-600 text-white"
                                : "bg-soft text-slate-400"
                            )}
                          >
                            {itemNumber}
                          </span>
                          <div className="min-w-0">
                            <span
                              className={cn(
                                "block text-xs sm:text-sm font-bold transition-colors",
                                isOpen ? "text-brand-text" : "text-ink"
                              )}
                            >
                              {faq.q}
                            </span>
                            <span className="mt-1 inline-block rounded-md bg-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
                              {faq.tag}
                            </span>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-all duration-200",
                            isOpen
                              ? "border-brand-500 bg-brand-500/10 text-brand-text rotate-180"
                              : "border-line bg-soft text-slate-400"
                          )}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-line/60 bg-soft/30 px-5 py-4 pl-12 text-xs sm:text-sm leading-relaxed text-body">
                              <p>{faq.a}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
