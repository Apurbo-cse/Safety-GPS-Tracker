"use client";
import ProductImage from "@/components/common/ProductImage";
import Link from "next/link";
import { useState } from "react";
import { Check, Heart, Minus, Phone, Plus, ShieldCheck, ShoppingCart, Truck, Headset, Zap } from "lucide-react";
import { toast } from "sonner";
import Container from "@/components/common/Container";
import DeviceVisual from "./DeviceVisual";
import { DeviceTile } from "./ProductTile";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { categoryUrl } from "@/data/catalogue";
import { SITE } from "@/lib/site";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, setQty } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { cn, formatBDT } from "@/utils/format";
import type { Device } from "@/types";

type Tab = "description" | "specs" | "package";

/** Full product page: gallery, buy box, details tabs and related products. */
export default function ProductDetail({ id, device }: { id: string; device?: Device }) {
  const { devices, plans } = useCatalog();
  const d = device ?? devices.find((x) => x.id === id)!;
  const dispatch = useAppDispatch();
  const wished = useAppSelector((s) => s.wishlist.ids.includes(d.id));
  const inCart = useAppSelector((s) => s.cart.items.find((i) => i.id === `dev-${d.id}`));
  const [qty, setQ] = useState(1);
  const [shot, setShot] = useState(0);
  const [tab, setTab] = useState<Tab>("description");
  const plan = d.planId ? plans.find((p) => p.id === d.planId) : undefined;

  const pics = d.images?.length ? d.images : d.image ? [d.image] : [];
  const shots: ({ kind: "image"; src: string } | { kind: "art" })[] = pics.length ? pics.map((src) => ({ kind: "image" as const, src })) : [{ kind: "art" as const }];
  const related = devices.filter((x) => x.id !== d.id && x.category === d.category).concat(devices.filter((x) => x.id !== d.id && x.category !== d.category)).slice(0, 4);

  const add = (openCart: boolean) => {
    if (!d.price) return;
    const cid = `dev-${d.id}`;
    dispatch(addToCart({ id: cid, kind: "device", name: d.name, price: d.price, monthly: d.monthly }));
    dispatch(setQty({ id: cid, qty: (inCart?.qty ?? 0) + qty }));
    if (openCart) dispatch(setCartOpen(true));
    toast.success(`${qty} × ${d.name} added to cart`);
  };

  return (
    <section className="bg-surface py-6 sm:py-10">
      <Container>
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-x-2 text-sm text-body">
          <Link href="/" className="hover:text-ink">Home</Link><span className="text-slate-400">/</span>
          <Link href="/products" className="hover:text-ink">Products</Link><span className="text-slate-400">/</span>
          <Link href={categoryUrl(d.category)} className="hover:text-ink">{d.category}</Link><span className="text-slate-400">/</span>
          <Link href={categoryUrl(d.category, d.subcategory)} className="hover:text-ink">{d.subcategory}</Link><span className="text-slate-400">/</span>
          <b className="text-ink">{d.name}</b>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* gallery */}
          <div>
            <div className="relative aspect-[858/600] overflow-hidden rounded-md bg-softer/80 dark:bg-navy-900/90">
              {d.price && <span className="absolute left-3 top-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white shadow">HOT</span>}
              {shots[shot]?.kind === "image" ? (
                <ProductImage src={(shots[shot] as { src: string }).src} alt={d.name} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-contain" />
              ) : (
                <DeviceVisual kind={d.visual} className="h-full w-full" />
              )}
            </div>
            {shots.length > 1 && (
              <div className="mt-3 flex gap-3">
                {shots.map((sh, i) => (
                  <button key={i} onClick={() => setShot(i)} aria-label={`Image ${i + 1}`} className={cn("relative h-20 w-20 overflow-hidden rounded border bg-transparent", shot === i ? "border-brand-500 ring-2 ring-brand-500/20" : "border-line")}>
                    {sh.kind === "image" ? <ProductImage src={sh.src} alt="" fill sizes="80px" className="object-contain p-1.5" /> : <DeviceVisual kind={d.visual} className="h-full w-full" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* buy box */}
          <div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href={categoryUrl(d.category)} className="rounded-full bg-brand-500/10 px-2.5 py-1 font-semibold text-brand-text hover:bg-brand-500/20">{d.category}</Link>
              <Link href={categoryUrl(d.category, d.subcategory)} className="rounded-full bg-softer px-2.5 py-1 font-semibold text-body-strong hover:text-ink">{d.subcategory}</Link>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{d.name}</h1>
            <p className="mt-2 text-sm leading-relaxed text-body">{d.summary}</p>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y border-line py-4">
              <span className="text-3xl font-bold text-brand-text">{d.price ? formatBDT(d.price) : "Call for Price"}</span>
              {d.monthly ? <span className="text-sm text-body">+ {formatBDT(d.monthly)}/month service</span> : null}
              <span className="w-full text-xs text-slate-500">{d.priceNote}</span>
            </div>

            {d.price ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="inline-flex h-11 items-center rounded border border-line-strong">
                  <button onClick={() => setQ((n) => Math.max(1, n - 1))} aria-label="Decrease quantity" className="grid h-full w-10 place-items-center hover:bg-softer"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center text-sm font-bold tabular-nums text-ink" aria-live="polite">{qty}</span>
                  <button onClick={() => setQ((n) => Math.min(50, n + 1))} aria-label="Increase quantity" className="grid h-full w-10 place-items-center hover:bg-softer"><Plus className="h-4 w-4" /></button>
                </div>
                <button onClick={() => add(false)} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded bg-brand-600 px-5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-700 sm:flex-none">
                  <ShoppingCart className="h-4 w-4" />Add to cart
                </button>
                <button onClick={() => add(true)} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded bg-navy-900 px-5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-navy-800 sm:flex-none">
                  <Zap className="h-4 w-4" />Buy now
                </button>
              </div>
            ) : (
              <a href={`tel:${SITE.phone}`} className="mt-5 inline-flex h-11 items-center gap-2 rounded bg-brand-600 px-6 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-700">
                <Phone className="h-4 w-4" />Call {SITE.phone} for price
              </a>
            )}
            {inCart && <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-green-600"><Check className="h-3.5 w-3.5" />{inCart.qty} in your cart</p>}

            <button onClick={() => { dispatch(toggleWishlist(d.id)); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }} className={cn("mt-4 inline-flex items-center gap-1.5 text-sm font-semibold", wished ? "text-red-500" : "text-body hover:text-ink")}>
              <Heart className={cn("h-4 w-4", wished && "fill-current")} />{wished ? "In your wishlist" : "Add to wishlist"}
            </button>

            <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex gap-2"><dt className="w-28 shrink-0 text-slate-500">Product ID</dt><dd className="font-mono text-ink">{d.id}</dd></div>
              <div className="flex gap-2"><dt className="w-28 shrink-0 text-slate-500">Category</dt><dd><Link href={categoryUrl(d.category)} className="text-ink hover:text-brand-text">{d.category}</Link></dd></div>
              <div className="flex gap-2"><dt className="w-28 shrink-0 text-slate-500">Subcategory</dt><dd><Link href={categoryUrl(d.category, d.subcategory)} className="text-ink hover:text-brand-text">{d.subcategory}</Link></dd></div>
              {plan && <div className="flex gap-2"><dt className="w-28 shrink-0 text-slate-500">Package</dt><dd><Link href="/pricing" className="text-ink hover:text-brand-text">{plan.name}</Link></dd></div>}
            </dl>

            <ul className="mt-5 grid gap-2 sm:grid-cols-3">
              {[[Truck, "Installation support"], [ShieldCheck, "Android, iOS & web apps"], [Headset, "24/7 helpline"]].map(([I, t]) => {
                const Icon = I as typeof Truck;
                return <li key={t as string} className="flex items-center gap-2 rounded-md bg-soft p-2.5 text-xs font-medium text-body-strong"><Icon className="h-4 w-4 shrink-0 text-brand-text" />{t as string}</li>;
              })}
            </ul>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-10 border-t border-line">
          <div role="tablist" className="-mx-3 flex gap-6 overflow-x-auto px-3 [scrollbar-width:none] sm:mx-0 sm:px-0">
            {([["description", "Description"], ["specs", "Specifications"], ["package", "Package & pricing"]] as const).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("-mt-px shrink-0 border-t-2 pt-3 text-sm font-semibold uppercase tracking-wide", tab === k ? "border-brand-600 text-ink" : "border-transparent text-slate-500 hover:text-ink")}>{l}</button>
            ))}
          </div>
          <div className="py-6 text-sm leading-relaxed text-body">
            {tab === "description" && (
              <div className="max-w-3xl">
                <p>{d.summary}</p>
                <h3 className="mt-5 font-semibold text-ink">Key features</h3>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">{d.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{f}</li>)}</ul>
              </div>
            )}
            {tab === "specs" && (
              <table className="w-full max-w-2xl text-left text-sm">
                <tbody>{d.specs.map((sp) => <tr key={sp.label} className="border-b border-line"><th className="w-48 py-2.5 pr-4 font-medium text-slate-500">{sp.label}</th><td className="py-2.5 text-ink">{sp.value}</td></tr>)}</tbody>
              </table>
            )}
            {tab === "package" && (
              <div className="max-w-2xl">
                {plan ? (
                  <>
                    <p>This device is supplied with the <b className="text-ink">{plan.name}</b> package: <b className="text-ink">{formatBDT(plan.devicePrice)}</b> device price + <b className="text-ink">{formatBDT(plan.monthlyCharge)}/month</b> for the tracking service, including {plan.features.length} listed features.</p>
                    <Link href="/pricing" className="mt-3 inline-flex font-semibold text-brand-text hover:underline">Compare all packages →</Link>
                  </>
                ) : <p>Pricing for this item is not published. Call {SITE.phone} and the sales team will quote it with your package.</p>}
              </div>
            )}
          </div>
        </div>

        {/* related */}
        <div className="border-t border-line pt-8">
          <h2 className="text-xl font-bold text-ink">Related products</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((r) => <DeviceTile key={r.id} d={r} />)}
          </div>
        </div>
      </Container>
    </section>
  );
}
