"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import Container from "@/components/common/Container";
import PageHero from "@/components/common/PageHero";
import { DeviceTile } from "./ProductTile";
import { devices } from "@/data/devices";
import { catalogue, categoryUrl } from "@/data/catalogue";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openDeviceModal } from "@/store/slices/uiSlice";
import { cn, formatBDT } from "@/utils/format";

type Sort = "default" | "price-asc" | "price-desc" | "name";
const MAX_PRICE = Math.max(...devices.map((d) => d.price ?? 0));

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line pb-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink">{title}</h3>
      {children}
    </div>
  );
}

/** Shop grid; pass `category` / `subcategory` (display names) for category pages. */
export default function DeviceShop({ category, subcategory }: { category?: string; subcategory?: string } = {}) {
  const cat = category ?? null;
  const sub = subcategory ?? null;
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [applied, setApplied] = useState(MAX_PRICE);
  const [avail, setAvail] = useState<{ priced: boolean; call: boolean }>({ priced: false, call: false });
  const [sort, setSort] = useState<Sort>("default");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [open, setOpen] = useState(false);
  const [wishOnly, setWishOnly] = useState(false);
  const wishIds = useAppSelector((s) => s.wishlist.ids);
  // /products#wishlist (header heart) opens the wishlist view
  useEffect(() => {
    const sync = () => { if (location.hash === "#wishlist") setWishOnly(true); };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  let list = devices.filter((d) =>
    (!wishOnly || wishIds.includes(d.id)) &&
    (!cat || d.category === cat) &&
    (!sub || d.subcategory === sub) &&
    (d.price === undefined || d.price <= applied) &&
    (!(avail.priced || avail.call) || (avail.priced && d.price) || (avail.call && !d.price)),
  );
  if (sort === "price-asc") list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (sort === "price-desc") list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(list.length / pageSize) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, list.length);
  const shown = list.slice(startIndex, startIndex + pageSize);
  const top = devices.filter((d) => d.price).slice(0, 3);
  const dispatch = useAppDispatch();

  const sidebar = (
    <div className="space-y-6">
      <Block title="Filter by price">
        <input type="range" min={0} max={MAX_PRICE} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} aria-label="Maximum price" className="w-full cursor-pointer accent-brand-600" />
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-sm text-body">Price: <b className="text-ink">{formatBDT(0)}</b> — <b className="text-ink">{formatBDT(maxPrice)}</b></span>
          <button onClick={() => { setApplied(maxPrice); setPage(1); setOpen(false); }} className="rounded bg-softer px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-line">Filter</button>
        </div>
      </Block>

      <Block title="Product categories">
        <ul className="space-y-0.5">
          <li>
            <Link href="/products" onClick={() => setOpen(false)} className={cn("flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm transition-colors", !cat ? "bg-brand-500/10 font-semibold text-brand-text" : "text-body hover:text-ink")}>
              All products<span className="grid h-6 min-w-6 place-items-center rounded-full border border-line px-1.5 text-xs text-slate-500">{devices.length}</span>
            </Link>
          </li>
          {catalogue.map((c) => {
            const on = cat === c.name;
            return (
              <li key={c.slug}>
                <Link href={categoryUrl(c.name)} onClick={() => setOpen(false)} className={cn("flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm transition-colors", on && !sub ? "bg-brand-500/10 font-semibold text-brand-text" : on ? "font-semibold text-ink" : "text-body hover:text-ink")}>
                  {c.name}<span className="grid h-6 min-w-6 place-items-center rounded-full border border-line px-1.5 text-xs text-slate-500">{c.count}</span>
                </Link>
                <ul className="ml-3 border-l border-line pl-2">
                  {c.subs.map((sc) => (
                    <li key={sc.slug}>
                      <Link href={categoryUrl(c.name, sc.name)} onClick={() => setOpen(false)} className={cn("flex items-center justify-between gap-2 rounded px-2 py-1 text-xs transition-colors", on && sub === sc.name ? "bg-brand-500/10 font-semibold text-brand-text" : "text-slate-500 hover:text-ink")}>
                        {sc.name}<span>{sc.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </Block>

      <Block title="My wishlist">
        <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-body">
          <input type="checkbox" checked={wishOnly} onChange={(e) => setWishOnly(e.target.checked)} className="h-4 w-4 accent-brand-600" />
          Show wishlist only <span className="ml-auto grid h-6 min-w-6 place-items-center rounded-full border border-line px-1.5 text-xs text-slate-500">{wishIds.length}</span>
        </label>
      </Block>

      <Block title="Availability">
        {([["priced", "Price listed"], ["call", "Call for price"]] as const).map(([k, l]) => (
          <label key={k} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-body">
            <input type="checkbox" checked={avail[k]} onChange={(e) => setAvail((a) => ({ ...a, [k]: e.target.checked }))} className="h-4 w-4 accent-brand-600" />{l}
          </label>
        ))}
      </Block>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink">Top products</h3>
        <ul className="divide-y divide-line">
          {top.map((d) => (
            <li key={d.id}>
              <button onClick={() => dispatch(openDeviceModal(d.id))} className="flex w-full items-center gap-3 py-3 text-left">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-line bg-transparent">{d.image && <Image src={d.image} alt="" fill sizes="48px" className="object-contain p-1" />}</span>
                <span><span className="block text-sm text-ink">{d.name}</span><span className="text-sm font-semibold text-brand-text">{d.price ? formatBDT(d.price) : "Call for Price"}</span></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const heroArt = cat?.toLowerCase().includes("bike")
    ? "bike"
    : cat?.toLowerCase().includes("truck") || cat?.toLowerCase().includes("fleet")
    ? "truck"
    : cat?.toLowerCase().includes("cng")
    ? "cng"
    : cat?.toLowerCase().includes("bus")
    ? "bus"
    : "car";

  return (
    <>
      <PageHero
        art={heroArt}
        eyebrow={sub ? `${cat} · ${sub}` : cat ? cat : "GPS Tracking Devices"}
        badgeText="BTRC Approved Hardware"
        title={sub ?? cat ?? "Certified GPS Tracking Devices"}
        titleHighlight={sub || cat ? undefined : "For All Vehicles"}
        description="Explore our range of certified 2G, 4G, OBD, motorcycle, and commercial fleet GPS tracking hardware with nationwide doorstep installation and 24/7 telematics support."
      />

      <section className="bg-surface py-8 sm:py-10">
        <Container className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* sidebar (desktop) */}
          <aside className="hidden lg:block">{sidebar}</aside>

          <div id="shop-top" className="scroll-mt-24">
            {/* top bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <h2 className="text-xl font-bold text-ink sm:text-2xl">
                  {sub ?? cat ?? "All Products"}{" "}
                  <span className="text-sm font-normal text-slate-500">({list.length} devices)</span>
                </h2>
                <p className="text-xs text-body mt-0.5">Showing {shown.length} of {list.length} products</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
              <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 rounded border border-line px-3 py-1.5 font-semibold text-ink lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />Filters
              </button>
              <label className="relative">
                <span className="sr-only">Sort products</span>
                <select value={sort} onChange={(e) => { setSort(e.target.value as Sort); setPage(1); }} className="cursor-pointer appearance-none rounded border border-line bg-surface py-1.5 pl-3 pr-8 text-xs sm:text-sm text-ink focus:border-brand-500 focus:outline-none">
                  <option value="default">Default sorting</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </label>
            </div>
          </div>

          {/* grid */}
          {shown.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {shown.map((d) => <DeviceTile key={d.id} d={d} />)}
            </div>
          ) : (
            <p className="rounded-md border border-dashed border-line-strong p-10 text-center text-sm text-body">{wishOnly && !wishIds.length ? "Your wishlist is empty — tap the ♥ on any product to save it." : "No products match these filters."}</p>
          )}

          {/* Bottom Pagination */}
          {list.length > 0 && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
              {/* Product count readout */}
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-ink">{startIndex + 1}–{endIndex}</span> of <span className="font-semibold text-ink">{list.length}</span> products
              </p>

              {/* Page buttons */}
              {totalPages > 1 && (
                <nav aria-label="Pagination" className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      document.getElementById("shop-top")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="flex h-9 items-center gap-1 rounded-md bg-softer/80 dark:bg-navy-900/90 px-3 text-xs font-semibold text-ink transition-colors hover:text-brand-text disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPage(p);
                        document.getElementById("shop-top")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-md text-xs font-bold transition-colors",
                        p === currentPage
                          ? "bg-brand-600 text-white shadow-sm"
                          : "bg-softer/80 dark:bg-navy-900/90 text-ink hover:text-brand-text"
                      )}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      document.getElementById("shop-top")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="flex h-9 items-center gap-1 rounded-md bg-softer/80 dark:bg-navy-900/90 px-3 text-xs font-semibold text-ink transition-colors hover:text-brand-text disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Next page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              )}

              {/* Items per page selector */}
              <div className="flex items-center gap-2 text-xs text-body">
                <span>Per page:</span>
                {[12, 24, 48, 99].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { setPageSize(n); setPage(1); }}
                    className={cn(
                      "rounded px-2 py-1 font-semibold transition-colors",
                      pageSize === n
                        ? "bg-brand-500/10 text-brand-text font-bold"
                        : "text-slate-500 hover:text-ink"
                    )}
                  >
                    {n === 99 ? "All" : n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* sidebar (phone / tablet drawer) */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-navy-950/50" onClick={() => setOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute inset-y-0 left-0 w-[84%] max-w-xs overflow-y-auto bg-surface p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-bold text-ink">Filters</p>
                <button onClick={() => setOpen(false)} aria-label="Close filters" className="grid h-8 w-8 place-items-center rounded-full hover:bg-softer"><X className="h-4 w-4" /></button>
              </div>
              {sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
    </>
  );
}
