"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Cpu, Satellite, Signal } from "lucide-react";
import Container from "@/components/common/Container";
import { DEVICE_PARTNER_LOGOS, TELECOM_PARTNER_LOGOS } from "@/lib/site";
import { cn } from "@/utils/format";

type Item = { name: string; logo: string };

/** Transparent-background versions of the partner logos */
const clean = (items: Item[]) => items.map((p) => ({ ...p, logo: p.logo.replace("/img/partners/", "/img/partners/clean/") }));
const DEVICES = clean(DEVICE_PARTNER_LOGOS);
const NETWORKS = clean(TELECOM_PARTNER_LOGOS);

/** What each partner does in the tracking chain */
function roleOf(name: string) {
  if (DEVICES.some((d) => d.name === name)) return { type: "Tracking device", text: "GPS hardware fitted in the vehicle. It records position, speed, ignition and alerts.", icon: Cpu };
  if (name === "Wherever SIM") return { type: "IoT SIM", text: "SIM connectivity that keeps tracking devices online and reporting.", icon: Signal };
  return { type: "Mobile network", text: "Carries location and event data from the device to the Safety GPS cloud.", icon: Signal };
}
const ALL = [...DEVICES, ...NETWORKS];

function PartnerInfo({ name }: { name: string }) {
  const p = ALL.find((x) => x.name === name)!;
  const r = roleOf(name);
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-16 shrink-0 place-items-center rounded-md border border-line bg-white px-1.5">
        <Image src={p.logo} alt="" width={64} height={28} className="h-auto max-h-6 w-auto max-w-full object-contain" />
      </span>
      <span className="min-w-0 text-left">
        <span className="flex items-center gap-1.5 text-sm font-bold text-ink">{p.name}<span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-text">{r.type}</span></span>
        <span className="block text-xs text-body">{r.text}</span>
      </span>
    </div>
  );
}

const H = 340;          // diagram height (px)
const COL = 0.22;       // side column width (fraction)
const HUB_R = 46;       // hub radius where lines end (px)

/* ------------------------------------------------------------------ tile */
function LogoTile({ p, side, on, dim, onHover, signal }: { p: Item; side: "l" | "r"; on: boolean; dim: boolean; onHover: (v: string | null) => void; signal?: boolean }) {
  return (
    <div
      title={p.name}
      onMouseEnter={() => onHover(p.name)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "relative flex h-10 items-center justify-center rounded-md border bg-white px-3 transition-all duration-300",
        on ? "scale-105 border-brand-500 shadow-[0_0_18px_-4px_rgb(240_90_34/0.6)]" : "border-line shadow-sm",
        dim && "opacity-40",
      )}
    >
      <Image src={p.logo} alt={p.name} width={120} height={40} className="h-auto max-h-6 w-auto max-w-[96px] object-contain" />
      {signal && (
        <span aria-hidden className="absolute right-1 top-1 flex h-2.5 items-end gap-px">
          {[40, 60, 80, 100].map((h, k) => (
            <span key={k} className={cn("w-[2px] rounded-sm", on ? "bg-brand-500" : "bg-green-500")} style={{ height: `${h}%`, animation: `pulse 1.6s ease-in-out ${k * 0.15}s infinite` }} />
          ))}
        </span>
      )}
      <span aria-hidden className={cn("absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border-2 border-surface", side === "l" ? "-right-1" : "-left-1", on ? "bg-brand-400" : "bg-green-400")} />
    </div>
  );
}

/* ---------------------------------------------------------- diagram (lg) */
function NetworkDiagram() {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(820);
  const [hover, setHover] = useState<string | null>(null);
  const [tour, setTour] = useState(0);
  const [count, setCount] = useState(12840);
  useEffect(() => {
    if (hover) return;
    const t = setInterval(() => setTour((n) => (n + 1) % ALL.length), 2600);
    return () => clearInterval(t);
  }, [hover]);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + (c % 7) + 3), 700);
    return () => clearInterval(t);
  }, []);
  const focus = hover ?? ALL[tour].name;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cx = w / 2, cy = H / 2;
  const L = w * COL, R = w * (1 - COL);
  const yOf = (i: number, n: number) => ((i + 0.5) / n) * H;
  const curve = (x: number, y: number, dir: 1 | -1) => {
    const ex = cx - dir * HUB_R, mid = x + (ex - x) * 0.55;
    return `M${x} ${y} C ${mid} ${y}, ${mid} ${cy}, ${ex} ${cy}`;
  };

  const lines = [
    ...DEVICES.map((p, i) => ({ id: p.name, d: curve(L + 6, yOf(i, DEVICES.length), 1), color: "#f98a55", i })),
    ...NETWORKS.map((p, i) => ({ id: p.name, d: curve(R - 6, yOf(i, NETWORKS.length), -1), color: "#38bdf8", i: i + DEVICES.length })),
  ];

  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-surface p-5 shadow-sm">
      <div aria-hidden className="dot-bg absolute inset-0 opacity-70" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl" />

      {/* header */}
      <div className="relative mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5 text-brand-400" />Devices · {DEVICES.length}</span>
        <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-green-400">
          <span className="relative flex h-1.5 w-1.5"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-400" /><span className="relative h-1.5 w-1.5 rounded-full bg-green-400" /></span>
          All systems online
        </span>
        <span className="flex items-center gap-1.5">Networks · {NETWORKS.length}<Signal className="h-3.5 w-3.5 text-brand-400" /></span>
      </div>

      <div ref={box} className="relative" style={{ height: H }}>
        {/* lines + packets */}
        <svg aria-hidden className="absolute inset-0" width={w} height={H} viewBox={`0 0 ${w} ${H}`}>
          <defs>
            <filter id="pk-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.5" /></filter>
          </defs>
          {lines.map((l) => {
            const on = focus === l.id, dim = hover !== null && !on;
            return (
              <g key={l.id} style={{ opacity: dim ? 0.15 : 1, transition: "opacity .3s" }}>
                <path d={l.d} fill="none" stroke={on ? l.color : "#94a3b8"} strokeOpacity={on ? 0.9 : 0.3} strokeWidth={on ? 2.5 : 1.5} />
                <path d={l.d} fill="none" stroke={l.color} strokeOpacity=".8" strokeWidth="1.2" strokeDasharray="2 8" className="route-flow" />
                {[0, 1].map((k) => (
                  <g key={k}>
                    <circle r="5" fill={l.color} filter="url(#pk-glow)">
                      <animateMotion dur={on ? "1.1s" : `${2.4 + (l.i % 3) * 0.5}s`} begin={`${(l.i * 0.37 + k * 1.3) % 2.4}s`} repeatCount="indefinite" path={l.d} />
                    </circle>
                    <circle r="2.2" fill={l.color}>
                      <animateMotion dur={on ? "1.1s" : `${2.4 + (l.i % 3) * 0.5}s`} begin={`${(l.i * 0.37 + k * 1.3) % 2.4}s`} repeatCount="indefinite" path={l.d} />
                    </circle>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>

        {/* device tiles */}
        <div className="absolute inset-y-0 left-0" style={{ width: `${COL * 100}%` }}>
          {DEVICES.map((p, i) => (
            <div key={p.name} className="absolute inset-x-0 -translate-y-1/2" style={{ top: yOf(i, DEVICES.length) }}>
              <LogoTile p={p} side="l" on={focus === p.name} dim={hover !== null && hover !== p.name} onHover={setHover} />
            </div>
          ))}
        </div>

        {/* network tiles */}
        <div className="absolute inset-y-0 right-0" style={{ width: `${COL * 100}%` }}>
          {NETWORKS.map((p, i) => (
            <div key={p.name} className="absolute inset-x-0 -translate-y-1/2" style={{ top: yOf(i, NETWORKS.length) }}>
              <LogoTile p={p} side="r" on={focus === p.name} dim={hover !== null && hover !== p.name} onHover={setHover} signal />
            </div>
          ))}
        </div>

        {/* hub */}
        <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
          {[0, 1, 2].map((k) => (
            <span key={k} aria-hidden className="ring-pulse absolute h-36 w-36 rounded-full border border-brand-400/50" style={{ animationDelay: `${k}s` }} />
          ))}
          <span aria-hidden className="absolute h-[124px] w-[124px] animate-[spin_16s_linear_infinite] rounded-full border border-dashed border-line-strong">
            <Satellite className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 text-brand-500" />
          </span>
          <div className="relative grid h-[76px] w-[76px] place-items-center rounded-2xl border border-line bg-white shadow-[0_0_36px_-6px_rgb(240_90_34/0.55)]">
            <Image src="/img/app/icon.png" alt="" width={40} height={43} className="h-10 w-auto" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 w-56 -translate-x-1/2 text-center">
          <p className="text-sm font-bold text-ink">Safety GPS Cloud</p>
          <div aria-hidden className="mx-auto mt-1.5 flex h-4 w-fit items-end gap-0.5">
            {[0, 1, 2, 3, 4, 5, 6].map((k) => (
              <span key={k} className="eq-bar w-1 rounded-sm bg-gradient-to-t from-brand-600 to-brand-300" style={{ animationDelay: `${k * 0.12}s` }} />
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-500"><b className="tabular-nums text-ink">{count.toLocaleString("en-US")}</b> packets received · demo</p>
        </div>
      </div>

      {/* legend */}
      <div className="relative mt-4 flex min-h-[52px] items-center justify-center border-t border-line pt-3">
        <div className="flex w-full items-center justify-between gap-4">
          <PartnerInfo name={focus} />
          <span className="hidden shrink-0 items-center gap-1.5 text-[11px] text-slate-500 xl:flex">
            <span className={cn("h-1.5 w-1.5 rounded-full", hover ? "bg-brand-500" : "animate-pulse bg-green-500")} />
            {hover ? "Exploring" : "Auto tour · hover to explore"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------- phone / tablet */
function PathNode({ p, label }: { p: Item; label: string }) {
  return (
    <div className="flex w-[72px] shrink-0 flex-col items-center gap-1">
      <span className="grid h-10 w-full place-items-center rounded-md border border-line bg-white px-1.5 shadow-sm">
        <Image src={p.logo} alt={p.name} width={64} height={28} className="h-auto max-h-6 w-auto max-w-full object-contain" />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    </div>
  );
}

function PathLink({ color }: { color: string }) {
  return (
    <svg aria-hidden className="mb-4 h-3 min-w-0 flex-1" viewBox="0 0 100 12" preserveAspectRatio="none">
      <line x1="0" y1="6" x2="100" y2="6" stroke="#94a3b8" strokeOpacity=".35" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="6" x2="100" y2="6" stroke={color} strokeWidth="2" strokeDasharray="4 6" className="route-flow" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Animated device → network → cloud strip */
function DataPath({ device, network }: { device: Item; network: Item }) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-soft px-3 py-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
        <span className="relative flex h-1.5 w-1.5"><span className="animate-ping-slow absolute inset-0 rounded-full bg-green-500" /><span className="relative h-1.5 w-1.5 rounded-full bg-green-500" /></span>
        Live data path
      </p>
      <div className="flex items-center gap-1.5">
        <PathNode p={device} label="Device" />
        <PathLink color="#f98a55" />
        <PathNode p={network} label="Network" />
        <PathLink color="#38bdf8" />
        <div className="flex w-[72px] shrink-0 flex-col items-center gap-1">
          <span className="grid h-10 w-full place-items-center rounded-md border border-line bg-white shadow-[0_0_18px_-6px_rgb(240_90_34/0.6)]">
            <Image src="/img/app/icon.png" alt="" width={22} height={24} className="h-6 w-auto" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Cloud</span>
        </div>
      </div>
    </div>
  );
}

function PartnerPicker() {
  const [sel, setSel] = useState(DEVICES[0].name);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (touched) return;
    const t = setInterval(() => setSel((cur) => ALL[(ALL.findIndex((x) => x.name === cur) + 1) % ALL.length].name), 2600);
    return () => clearInterval(t);
  }, [touched]);
  const selItem = ALL.find((x) => x.name === sel)!;
  const isDevice = DEVICES.some((d) => d.name === sel);
  const [lastDevice, setLastDevice] = useState(DEVICES[0]);
  const [lastNetwork, setLastNetwork] = useState(NETWORKS[0]);
  // keep the other half of the path on the most recently selected partner of that type
  if (isDevice && lastDevice.name !== sel) setLastDevice(selItem);
  if (!isDevice && lastNetwork.name !== sel) setLastNetwork(selItem);
  const groups = [
    { icon: Cpu, label: "Device partners", items: DEVICES },
    { icon: Signal, label: "Telecom partners", items: NETWORKS },
  ];
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface">
      <DataPath device={lastDevice} network={lastNetwork} />
      {groups.map((g) => (
        <div key={g.label} className="border-b border-line p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-500/10 text-brand-600"><g.icon className="h-3.5 w-3.5" /></span>
            {g.label}
            <span className="ml-auto font-medium normal-case tracking-normal text-slate-400">{g.items.length} brands</span>
          </p>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {g.items.map((p) => {
              const on = sel === p.name;
              return (
                <li key={p.name}>
                  <button
                    onClick={() => { setSel(p.name); setTouched(true); }}
                    aria-pressed={on}
                    title={p.name}
                    className={cn("grid h-11 w-full place-items-center rounded-md border bg-white px-2 transition-all", on ? "border-brand-500 ring-2 ring-brand-500/20" : "border-line")}
                  >
                    <Image src={p.logo} alt={p.name} width={96} height={32} className="h-auto max-h-6 w-auto max-w-full object-contain" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="p-4" aria-live="polite"><PartnerInfo name={sel} /></div>
    </div>
  );
}

export default function Partners() {
  return (
    <section className="bg-sec-gray border-b border-line py-14 sm:py-20" aria-labelledby="partners-title">
      <Container className="grid items-center gap-8 lg:grid-cols-[300px_1fr] lg:gap-10">
        {/* intro */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-text">
            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping-slow absolute inset-0 rounded-full bg-brand-500" /><span className="relative h-1.5 w-1.5 rounded-full bg-brand-500" /></span>
            Partners
          </p>
          <h2 id="partners-title" className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Built on trusted hardware and networks</h2>
          <span aria-hidden className="mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-brand-600 to-brand-400" />
          <p className="mt-3 text-sm leading-relaxed text-body">Proven tracking devices send location and events over Bangladesh&apos;s leading mobile networks to one cloud platform.</p>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {[
              [DEVICES.length, "Device brands"],
              [NETWORKS.length, "Mobile networks"],
            ].map(([n, l]) => (
              <div key={l} className="spotlight card-pro rounded-md border border-line bg-surface p-3">
                <dd className="text-gradient text-3xl font-black tabular-nums">{n}</dd>
                <dt className="text-xs text-body">{l}</dt>
              </div>
            ))}
          </dl>
          <ol className="mt-5 space-y-2 text-sm text-body">
            {["Device captures GPS position", "Mobile network carries the data", "Cloud shows it on your app"].map((s, i) => (
              <li key={s} className="flex items-center gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">{i + 1}</span>{s}
              </li>
            ))}
          </ol>
        </div>

        <div className="min-w-0">
          <div className="hidden lg:block"><NetworkDiagram /></div>
          <div className="lg:hidden"><PartnerPicker /></div>
        </div>
      </Container>
    </section>
  );
}
