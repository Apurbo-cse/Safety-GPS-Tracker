"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, CreditCard, FileText, Globe, HardDrive, Layers, Mail, Moon, Phone, Search, ShoppingCart, Sparkles, Sun, Tag, type LucideIcon } from "lucide-react";
import { announceNavigation } from "@/lib/navigate";
import { features } from "@/data/features";
import { devices } from "@/data/devices";
import { plans } from "@/data/pricing";
import { NAV_LINKS, SITE } from "@/lib/site";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openDemoModal, openDeviceModal, openFeatureModal, setCartOpen, setPalette, setTheme } from "@/store/slices/uiSlice";
import { selectPlan } from "@/store/slices/pricingSlice";
import { applyTheme } from "./ThemeSync";
import { formatBDT, cn } from "@/utils/format";

interface Cmd { id: string; group: string; label: string; hint?: string; icon: LucideIcon; keywords?: string; run: () => void }

export default function CommandPalette() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector((s) => s.ui.paletteOpen);
  const theme = useAppSelector((s) => s.ui.theme);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = () => { dispatch(setPalette(false)); setQ(""); setActive(0); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dispatch(setPalette(!open)); }
      else if (e.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => { document.body.style.overflow = ""; clearTimeout(t); };
  }, [open]);

  const commands = useMemo<Cmd[]>(() => {
    const go = (href: string) => () => { announceNavigation(); router.push(href); };
    return [
      ...[...NAV_LINKS, { href: "/pay-bill", label: "Pay Bill" }, { href: "/login", label: "Login" }, { href: "/register", label: "Register" }].map((l): Cmd => ({ id: `p-${l.href}`, group: "Pages", label: l.label, hint: l.href, icon: Globe, run: go(l.href) })),
      { id: "a-call", group: "Actions", label: `Call sales ${SITE.phone}`, icon: Phone, keywords: "phone contact support", run: () => { window.location.href = `tel:${SITE.phone}`; } },
      { id: "a-mail", group: "Actions", label: `Email ${SITE.email}`, icon: Mail, run: () => { window.location.href = `mailto:${SITE.email}`; } },
      { id: "a-demo", group: "Actions", label: "Request a demo", icon: Sparkles, run: () => dispatch(openDemoModal("Demo request (command palette)")) },
      { id: "a-cart", group: "Actions", label: "Open cart", icon: ShoppingCart, run: () => dispatch(setCartOpen(true)) },
      { id: "a-theme", group: "Actions", label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme", icon: theme === "dark" ? Sun : Moon, keywords: "dark light mode appearance", run: () => { const n = theme === "dark" ? "light" : "dark"; applyTheme(n); dispatch(setTheme(n)); } },
      ...plans.map((p): Cmd => ({ id: `pl-${p.id}`, group: "Packages", label: p.name, hint: `${formatBDT(p.devicePrice)} + ${formatBDT(p.monthlyCharge)}/mo`, icon: Tag, keywords: `${p.siteTitle ?? ""} price package`, run: () => { dispatch(selectPlan(p.id)); announceNavigation(); router.push("/pricing"); } })),
      ...devices.map((d): Cmd => ({ id: `d-${d.id}`, group: "Devices", label: d.name, hint: d.category, icon: HardDrive, keywords: "tracker hardware", run: () => dispatch(openDeviceModal(d.id)) })),
      ...features.map((f): Cmd => ({ id: `f-${f.id}`, group: "Features", label: f.title, hint: f.category, icon: f.category === "Reports & Analytics" ? FileText : f.category === "Platform" ? Layers : CreditCard, keywords: f.description, run: () => dispatch(openFeatureModal(f.id)) })),
    ];
  }, [dispatch, router, theme]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return commands.filter((c) => c.group === "Pages" || c.group === "Actions");
    const terms = t.split(/\s+/);
    return commands.filter((c) => { const hay = `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""} ${c.group}`.toLowerCase(); return terms.every((x) => hay.includes(x)); }).slice(0, 40);
  }, [q, commands]);

  useEffect(() => { listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active]);

  const run = (c?: Cmd) => { if (!c) return; close(); setTimeout(c.run, 60); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); run(results[active]); }
  };

  let lastGroup = "";
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-start justify-center bg-navy-950/60 px-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div role="dialog" aria-modal="true" aria-label="Search and commands" onClick={(e) => e.stopPropagation()} onKeyDown={onKey}
            className="w-full max-w-xl overflow-hidden rounded-md glass border border-line  "
            initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.18 }}>
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} placeholder="Search pages, features, devices, packages…" aria-label="Search" className="no-ring h-14 flex-1 bg-transparent text-base text-ink outline-none focus-visible:outline-none placeholder:text-slate-400" />
              <kbd className="rounded border border-line px-1.5 py-0.5 text-xs text-slate-500">Esc</kbd>
            </div>
            <ul ref={listRef} role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-10 text-center text-sm text-body">No results for “{q}”</li>}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                return (
                  <li key={c.id} role="presentation">
                    {header && <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{header}</p>}
                    <button role="option" aria-selected={i === active} data-i={i} onMouseMove={() => setActive(i)} onClick={() => run(c)}
                      className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm", i === active ? "bg-brand-50 text-ink" : "text-body-strong")}>
                      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md", i === active ? "bg-brand-600 text-white" : "bg-softer text-body")}><c.icon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1 truncate font-medium">{c.label}</span>
                      {c.hint && <span className="hidden truncate text-xs text-slate-500 sm:block">{c.hint}</span>}
                      {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-slate-400" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between border-t border-line bg-soft px-4 py-2 text-xs text-slate-500">
              <span className="flex gap-3"><span><kbd className="rounded border border-line px-1">↑</kbd> <kbd className="rounded border border-line px-1">↓</kbd> navigate</span><span><kbd className="rounded border border-line px-1">↵</kbd> select</span></span>
              <span>{results.length} result{results.length === 1 ? "" : "s"}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
