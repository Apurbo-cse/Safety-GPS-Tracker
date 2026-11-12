"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronRight, FolderTree, HelpCircle, Images, Pencil, Plus, Tags, Trash2, Package } from "lucide-react";
import Modal from "@/components/common/Modal";
import ImageManager from "./ImageManager";
import { inputCls, textareaCls } from "@/components/forms/Field";
import { api, ApiError, mediaUrl, type AdminCatalog, type AdminCategory, type AdminDevice, type AdminFaq, type AdminHeroSlide, type AdminPlan } from "@/lib/api";
import { slug } from "@/utils/format";
import { cn, formatBDT } from "@/utils/format";
import { CARD, EmptyState, ErrorState, PageHeader, Pagination, Skeleton, Switch, useLoad } from "./ui";
import ProductImage from "@/components/common/ProductImage";

export type Kind = "plans" | "devices" | "faqs" | "categories" | "hero";
type Item = AdminPlan | AdminDevice | AdminFaq | AdminCategory | AdminHeroSlide;
const PAGE: Record<Kind, { title: string; subtitle: string }> = {
  categories: { title: "Categories", subtitle: "Group products into categories and sub-categories. They appear in the shop, menus and home page." },
  devices: { title: "Products", subtitle: "Everything in the shop. Each product sits in a category and sub-category." },
  plans: { title: "Packages", subtitle: "Tracking packages: a one-time device price plus a monthly charge." },
  faqs: { title: "FAQs", subtitle: "Questions and answers shown on the FAQ page and the home page." },
  hero: { title: "Hero slides", subtitle: "The big slider at the top of the home page." },
};

const PRODUCTS_PER_PAGE = 12;

const TABS: { id: Kind; label: string; icon: typeof Tags; add: string }[] = [
  { id: "categories", label: "Categories", icon: FolderTree, add: "Add category" },
  { id: "plans", label: "Packages", icon: Tags, add: "Add package" },
  { id: "devices", label: "Products", icon: Package, add: "Add product" },
  { id: "faqs", label: "FAQs", icon: HelpCircle, add: "Add FAQ" },
  { id: "hero", label: "Hero slides", icon: Images, add: "Add slide" },
];

/** Strip server-managed fields before sending an item back. */
const payload = (it: Item) => { const { id: _id, ...rest } = it as Item & { createdAt?: string; updatedAt?: string }; void _id; delete rest.createdAt; delete rest.updatedAt; return rest; };

const lines = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean);
const toInt = (label: string, v: string, { required = false } = {}) => {
  if (v.trim() === "") { if (required) throw new Error(`${label} is required`); return undefined; }
  const n = Number(v);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${label} must be a whole number of 0 or more`);
  return n;
};

function F({ label, hint, children, wide }: { label: string; hint?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={cn("block", wide && "sm:col-span-2")}>
      <span className="mb-1.5 block text-sm font-medium text-body-strong">{label}</span>{children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

/* ---------------------------------------------------------------- forms */
type FormProps<T> = { initial: T | null; categories: string[]; catTree: AdminCategory[]; plans: AdminPlan[]; onSaved: () => void; onCancel: () => void };

function useSave<T extends Item>(kind: Kind, isNew: boolean, onSaved: () => void) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (id: string, build: () => object) => {
    setError(null);
    try {
      if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(id)) throw new Error("The id must be 2–80 characters: lower-case letters, numbers and dashes");
      const body = build();
      setSaving(true);
      if (kind === "plans") await api.admin.putPlan(id, body); else if (kind === "devices") await api.admin.putDevice(id, body); else if (kind === "categories") await api.admin.putCategory(id, body); else if (kind === "hero") await api.admin.putSlide(id, body); else await api.admin.putFaq(id, body);
      toast.success(isNew ? "Added" : "Saved");
      onSaved();
    } catch (e) { setError(e instanceof ApiError || e instanceof Error ? e.message : "Could not save"); } finally { setSaving(false); }
  };
  void (null as unknown as T);
  return { saving, error, run };
}

function FormFooter({ saving, error, onCancel }: { saving: boolean; error: string | null; onCancel: () => void }) {
  return (
    <div className="sm:col-span-2">
      {error && <p role="alert" className="mb-3 rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-10 rounded-lg px-4 text-sm font-semibold text-body hover:text-ink">Cancel</button>
        <button type="submit" disabled={saving} className="h-10 rounded-lg bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
      </div>
    </div>
  );
}

function PlanForm({ initial, onSaved, onCancel }: FormProps<AdminPlan>) {
  const isNew = !initial;
  const [v, setV] = useState({ id: initial?.id ?? "", name: initial?.name ?? "", devicePrice: String(initial?.devicePrice ?? ""), monthlyCharge: String(initial?.monthlyCharge ?? ""), highlight: initial?.highlight ?? "", siteTitle: initial?.siteTitle ?? "", image: initial?.image ?? "", features: (initial?.features ?? []).join("\n"), sourceNo: String(initial?.sourceNo ?? 0), sort: String(initial?.sort ?? 0), active: initial?.active ?? true });
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  const { saving, error, run } = useSave("plans", isNew, onSaved);
  return (
    <form onSubmit={(e) => { e.preventDefault(); void run(v.id, () => ({ name: v.name.trim(), devicePrice: toInt("Device price", v.devicePrice, { required: true }), monthlyCharge: toInt("Monthly charge", v.monthlyCharge, { required: true }), features: lines(v.features), highlight: v.highlight.trim() || undefined, siteTitle: v.siteTitle.trim() || undefined, image: v.image.trim() || undefined, sourceNo: toInt("Source no.", v.sourceNo) ?? 0, sort: toInt("Order", v.sort) ?? 0, active: v.active })); }} className="grid gap-4 p-5 sm:grid-cols-2">
      {isNew && <F label="Id (URL name)" hint="Lower-case, e.g. gps-4. Can't be changed later."><input className={inputCls} value={v.id} onChange={set("id")} onBlur={() => !v.id && setV((s) => ({ ...s, id: slug(s.name) }))} /></F>}
      <F label="Name" wide={!isNew}><input className={inputCls} value={v.name} onChange={set("name")} required /></F>
      <F label="Device price (৳)"><input className={inputCls} inputMode="numeric" value={v.devicePrice} onChange={set("devicePrice")} required /></F>
      <F label="Monthly charge (৳)"><input className={inputCls} inputMode="numeric" value={v.monthlyCharge} onChange={set("monthlyCharge")} required /></F>
      <F label="Badge (optional)" hint="Shown on the card, e.g. Lowest monthly charge"><input className={inputCls} value={v.highlight} onChange={set("highlight")} /></F>
      <F label="Product title on image (optional)"><input className={inputCls} value={v.siteTitle} onChange={set("siteTitle")} /></F>
      <F label="Image path (optional)" hint="A file in /public, e.g. /img/packages/gps-1.png"><input className={inputCls} value={v.image} onChange={set("image")} /></F>
      <F label="Display order"><input className={inputCls} inputMode="numeric" value={v.sort} onChange={set("sort")} /></F>
      <F label="Features" hint="One per line — these are what the comparison table lists." wide><textarea className={`${textareaCls} min-h-40`} value={v.features} onChange={set("features")} /></F>
      <label className="flex items-center gap-3 sm:col-span-2"><Switch on={v.active} onChange={() => setV((s) => ({ ...s, active: !s.active }))} label="Visible on the website" /><span className="text-sm font-medium text-ink">Visible on the website</span></label>
      <FormFooter saving={saving} error={error} onCancel={onCancel} />
    </form>
  );
}

function DeviceForm({ initial, catTree, plans, onSaved, onCancel }: FormProps<AdminDevice>) {
  const tops = catTree.filter((c) => !c.parentId);
  const isNew = !initial;
  const startImages = initial?.images?.length ? initial.images : initial?.image ? [initial.image] : [];
  const [images, setImages] = useState<string[]>(startImages);
  // Pictures uploaded while this form was open but not kept on the product (removed, or the form was cancelled) are discarded on the server.
  const uploaded = useRef(new Set<string>());
  const live = useRef({ images: startImages, startImages, saved: false });
  useEffect(() => { live.current.images = images; });
  useEffect(() => () => {
    const keep = live.current.saved ? live.current.images : live.current.startImages;
    for (const t of uploaded.current) if (!keep.includes(t)) void api.admin.discardImage(t).catch(() => { /* best effort */ });
  }, []);
  const [v, setV] = useState({ id: initial?.id ?? "", name: initial?.name ?? "", category: initial?.category ?? tops[0]?.name ?? "", subcategory: initial?.subcategory ?? "", visual: initial?.visual ?? "tracker", price: initial?.price == null ? "" : String(initial.price), monthly: initial?.monthly == null ? "" : String(initial.monthly), planId: initial?.planId ?? "", siteTitle: initial?.siteTitle ?? "", summary: initial?.summary ?? "", priceNote: initial?.priceNote ?? "", features: (initial?.features ?? []).join("\n"), specs: (initial?.specs ?? []).map((s) => `${s.label}: ${s.value}`).join("\n"), sort: String(initial?.sort ?? 0), active: initial?.active ?? true });
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  const { saving, error, run } = useSave("devices", isNew, () => { live.current.saved = true; onSaved(); });
  const build = () => ({
    name: v.name.trim(), category: v.category.trim(), subcategory: v.subcategory.trim(), visual: v.visual, summary: v.summary.trim(),
    images, siteTitle: v.siteTitle.trim() || undefined,
    price: toInt("Price", v.price) ?? null, monthly: toInt("Monthly charge", v.monthly) ?? null, planId: v.planId || null, priceNote: v.priceNote.trim(),
    features: lines(v.features),
    specs: lines(v.specs).map((l) => { const i = l.indexOf(":"); if (i < 1) throw new Error(`Specification "${l}" needs the form  Label: value`); return { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() }; }),
    sort: toInt("Order", v.sort) ?? 0, active: v.active,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); void run(v.id, build); }} className="grid gap-4 p-5 sm:grid-cols-2">
      {isNew && <F label="Id (URL name)" hint="Lower-case, e.g. obd-pro. Can't be changed later."><input className={inputCls} value={v.id} onChange={set("id")} onBlur={() => !v.id && setV((s) => ({ ...s, id: slug(s.name) }))} /></F>}
      <F label="Name" wide={!isNew}><input className={inputCls} value={v.name} onChange={set("name")} required /></F>
      <F label="Category" hint={tops.length ? undefined : "Create a category first (Admin → Categories)."}>
        <select className={inputCls} value={v.category} onChange={(e) => setV((s) => ({ ...s, category: e.target.value, subcategory: "" }))} required>
          {!tops.some((c) => c.name === v.category) && <option value={v.category}>{v.category || "Choose…"}</option>}
          {tops.map((c) => <option key={c.id} value={c.name}>{c.name}{c.active ? "" : " (hidden)"}</option>)}
        </select>
      </F>
      <F label="Sub-category" hint="Create more under Categories.">
        <select className={inputCls} value={v.subcategory} onChange={set("subcategory")} required>
          <option value="">Choose…</option>
          {catTree.filter((c) => c.parentId && tops.find((t) => t.id === c.parentId)?.name === v.category).map((c) => <option key={c.id} value={c.name}>{c.name}{c.active ? "" : " (hidden)"}</option>)}
        </select>
      </F>
      <F label="Price (৳)" hint="Leave empty for “Price on request”."><input className={inputCls} inputMode="numeric" value={v.price} onChange={set("price")} /></F>
      <F label="Monthly charge (৳)"><input className={inputCls} inputMode="numeric" value={v.monthly} onChange={set("monthly")} /></F>
      <F label="Linked package"><select className={inputCls} value={v.planId} onChange={set("planId")}><option value="">None</option>{plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></F>
      <F label="Artwork style" hint="Used when there is no image file."><select className={inputCls} value={v.visual} onChange={set("visual")}>{["tracker", "voice", "video", "relay", "sos"].map((x) => <option key={x}>{x}</option>)}</select></F>
      <ImageManager value={images} onChange={setImages} onUploaded={(t) => uploaded.current.add(t)} />
      <F label="Title on picture (optional)"><input className={inputCls} value={v.siteTitle} onChange={set("siteTitle")} /></F>
      <F label="Summary" wide><textarea className={`${textareaCls} min-h-20`} value={v.summary} onChange={set("summary")} required /></F>
      <F label="Price note"><input className={inputCls} value={v.priceNote} onChange={set("priceNote")} /></F>
      <F label="Display order"><input className={inputCls} inputMode="numeric" value={v.sort} onChange={set("sort")} /></F>
      <F label="Features" hint="One per line." wide><textarea className={`${textareaCls} min-h-28`} value={v.features} onChange={set("features")} /></F>
      <F label="Specifications" hint="One per line as  Label: value" wide><textarea className={`${textareaCls} min-h-28`} value={v.specs} onChange={set("specs")} /></F>
      <label className="flex items-center gap-3 sm:col-span-2"><Switch on={v.active} onChange={() => setV((s) => ({ ...s, active: !s.active }))} label="Visible on the website" /><span className="text-sm font-medium text-ink">Visible on the website</span></label>
      <FormFooter saving={saving} error={error} onCancel={onCancel} />
    </form>
  );
}

function CategoryForm({ initial, catTree, parent, onSaved, onCancel }: { initial: AdminCategory | null; catTree: AdminCategory[]; parent: AdminCategory | null; onSaved: () => void; onCancel: () => void }) {
  const isNew = !initial;
  const parentOf = initial ? catTree.find((c) => c.id === initial.parentId) ?? null : parent;
  const siblings = catTree.filter((c) => (c.parentId ?? null) === (parentOf?.id ?? null));
  const nextSort = Math.max(-1, ...siblings.map((c) => c.sort)) + 1; // new ones go to the end
  const [v, setV] = useState({ name: initial?.name ?? "", sort: String(initial?.sort ?? nextSort), active: initial?.active ?? true });
  const { saving, error, run } = useSave("categories", isNew, onSaved);
  // new rows get an id from the name (sub-categories are prefixed with their category); it never changes afterwards
  const newId = parentOf ? `${parentOf.id}-${slug(v.name)}`.slice(0, 80) : slug(v.name).slice(0, 80);
  return (
    <form onSubmit={(e) => { e.preventDefault(); void run(initial?.id ?? newId, () => ({ name: v.name.trim(), parentId: parentOf?.id ?? null, sort: toInt("Order", v.sort) ?? 0, active: v.active })); }} className="grid gap-4 p-5 sm:grid-cols-2">
      {parentOf && <p className="rounded-lg bg-softer/80 p-3 text-sm text-body dark:bg-navy-900/90 sm:col-span-2">Sub-category of <b className="text-ink">{parentOf.name}</b></p>}
      <F label={parentOf ? "Sub-category name" : "Category name"} wide hint={!isNew ? "Renaming also renames it on every product that uses it." : undefined}><input className={inputCls} value={v.name} onChange={(e) => setV((s) => ({ ...s, name: e.target.value }))} required autoFocus /></F>
      <F label="Display order" hint="Lower numbers come first."><input className={inputCls} inputMode="numeric" value={v.sort} onChange={(e) => setV((s) => ({ ...s, sort: e.target.value }))} /></F>
      <label className="flex items-center gap-3 self-end pb-2"><Switch on={v.active} onChange={() => setV((s) => ({ ...s, active: !s.active }))} label="Visible on the website" /><span className="text-sm font-medium text-ink">Visible on the website</span></label>
      {!parentOf && <p className="text-xs text-slate-500 sm:col-span-2">Hiding a category also hides its sub-categories and products from the website.</p>}
      <FormFooter saving={saving} error={error} onCancel={onCancel} />
    </form>
  );
}

const HERO_IMAGES = ["/img/hero-car.jpg", "/img/hero-truck.jpg", "/img/hero-bike.jpg", "/img/industries/private-cars-hd.jpg", "/img/industries/logistics-bd.jpg", "/img/industries/motorcycles-v3.jpg", "/img/industries/business-fleet-v3.jpg", "/img/industries/construction-hd.jpg", "/img/industries/public-transport-bd2.jpg", "/img/industries/cng-v3.jpg", "/img/industries/ships-cargo-hd.jpg"];
const DEFAULT_ROUTE = "M10 160 C 80 150, 120 70, 230 70 S 300 120, 310 120";

function HeroForm({ initial, onSaved, onCancel }: { initial: AdminHeroSlide | null; onSaved: () => void; onCancel: () => void }) {
  const isNew = !initial;
  const t = initial?.telematics;
  const [v, setV] = useState({ id: initial?.id ?? "", tab: initial?.tab ?? "", badge: initial?.badge ?? "", badgeIcon: initial?.badgeIcon ?? "shield", titleMain: initial?.titleMain ?? "", titleHighlight: initial?.titleHighlight ?? "", text: initial?.text ?? "", bgImage: initial?.bgImage ?? HERO_IMAGES[0], accent: initial?.accent ?? "brand", ctaLabel: initial?.ctaLabel ?? "Explore Products", ctaHref: initial?.ctaHref ?? "/products", vehicle: t?.vehicle ?? "", plate: t?.plate ?? "", place: t?.place ?? "", speed: t?.speed ?? "0 km/h", ignition: t?.ignition ?? "ON", status: t?.status ?? "In Transit", sensor: t?.sensor ?? "AC: ON · Door: Closed", fuel: t?.fuel ?? "78% Fuel", sort: String(initial?.sort ?? 0), active: initial?.active ?? true });
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  const { saving, error, run } = useSave("hero", isNew, onSaved);
  const build = () => ({
    tab: v.tab.trim(), badge: v.badge.trim(), badgeIcon: v.badgeIcon, titleMain: v.titleMain.trim(), titleHighlight: v.titleHighlight.trim(), text: v.text.trim(),
    bgImage: v.bgImage.trim(), accent: v.accent, ctaLabel: v.ctaLabel.trim(), ctaHref: v.ctaHref.trim(),
    telematics: { vehicle: v.vehicle.trim(), plate: v.plate.trim(), place: v.place.trim(), speed: v.speed.trim(), ignition: v.ignition, status: v.status.trim(), route: t?.route ?? DEFAULT_ROUTE, sensor: v.sensor.trim(), fuel: v.fuel.trim() },
    sort: toInt("Order", v.sort) ?? 0, active: v.active,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); void run(v.id || slug(v.tab), build); }} className="grid gap-4 p-5 sm:grid-cols-2">
      {isNew && <F label="Id (URL name)" hint="Lower-case, e.g. summer-offer. Can't be changed later."><input className={inputCls} value={v.id} onChange={set("id")} onBlur={() => !v.id && setV((s) => ({ ...s, id: slug(s.tab) }))} /></F>}
      <F label="Tab label" hint="Short name under the progress bar."><input className={inputCls} value={v.tab} onChange={set("tab")} required /></F>
      <F label="Badge text"><input className={inputCls} value={v.badge} onChange={set("badge")} required /></F>
      <F label="Badge icon"><select className={inputCls} value={v.badgeIcon} onChange={set("badgeIcon")}>{["shield", "bike", "truck"].map((x) => <option key={x}>{x}</option>)}</select></F>
      <F label="Headline"><input className={inputCls} value={v.titleMain} onChange={set("titleMain")} required /></F>
      <F label="Highlighted words" hint="Shown in orange after the headline."><input className={inputCls} value={v.titleHighlight} onChange={set("titleHighlight")} required /></F>
      <F label="Description" wide><textarea className={`${textareaCls} min-h-24`} value={v.text} onChange={set("text")} required /></F>
      <F label="Background image" hint="Files in the website's /public/img folder. Add new pictures there, then type the path.">
        <input className={inputCls} list="hero-images" value={v.bgImage} onChange={set("bgImage")} required /><datalist id="hero-images">{HERO_IMAGES.map((i) => <option key={i} value={i} />)}</datalist>
      </F>
      <div className="relative aspect-[16/6] overflow-hidden rounded-lg bg-navy-950">{v.bgImage.startsWith("/") && <Image key={v.bgImage} src={v.bgImage} alt="" fill sizes="400px" className="object-cover opacity-80" />}</div>
      <F label="Glow colour"><select className={inputCls} value={v.accent} onChange={set("accent")}>{["brand", "sky", "emerald"].map((x) => <option key={x}>{x}</option>)}</select></F>
      <F label="Display order"><input className={inputCls} inputMode="numeric" value={v.sort} onChange={set("sort")} /></F>
      <F label="Button text"><input className={inputCls} value={v.ctaLabel} onChange={set("ctaLabel")} required /></F>
      <F label="Button link" hint="A page like /products, or a full https:// link."><input className={inputCls} value={v.ctaHref} onChange={set("ctaHref")} required /></F>
      <p className="text-sm font-bold text-ink sm:col-span-2">Live-tracking card (sample data shown beside the headline)</p>
      <F label="Vehicle"><input className={inputCls} value={v.vehicle} onChange={set("vehicle")} required /></F>
      <F label="Plate"><input className={inputCls} value={v.plate} onChange={set("plate")} required /></F>
      <F label="Place"><input className={inputCls} value={v.place} onChange={set("place")} required /></F>
      <F label="Speed"><input className={inputCls} value={v.speed} onChange={set("speed")} required /></F>
      <F label="Engine"><select className={inputCls} value={v.ignition} onChange={set("ignition")}>{["ON", "OFF", "LOCKED"].map((x) => <option key={x}>{x}</option>)}</select></F>
      <F label="Status"><input className={inputCls} value={v.status} onChange={set("status")} required /></F>
      <F label="Sensor line"><input className={inputCls} value={v.sensor} onChange={set("sensor")} required /></F>
      <F label="Fuel / battery"><input className={inputCls} value={v.fuel} onChange={set("fuel")} required /></F>
      <label className="flex items-center gap-3 sm:col-span-2"><Switch on={v.active} onChange={() => setV((s) => ({ ...s, active: !s.active }))} label="Visible on the website" /><span className="text-sm font-medium text-ink">Visible on the website</span></label>
      <FormFooter saving={saving} error={error} onCancel={onCancel} />
    </form>
  );
}

function FaqForm({ initial, categories, onSaved, onCancel }: FormProps<AdminFaq>) {
  const isNew = !initial;
  const [v, setV] = useState({ id: initial?.id ?? "", category: initial?.category ?? categories[0] ?? "", q: initial?.q ?? "", a: initial?.a ?? "", tag: initial?.tag ?? "", sort: String(initial?.sort ?? 0), active: initial?.active ?? true });
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  const { saving, error, run } = useSave("faqs", isNew, onSaved);
  return (
    <form onSubmit={(e) => { e.preventDefault(); void run(v.id, () => ({ category: v.category.trim(), q: v.q.trim(), a: v.a.trim(), tag: v.tag.trim() || undefined, sort: toInt("Order", v.sort) ?? 0, active: v.active })); }} className="grid gap-4 p-5 sm:grid-cols-2">
      <F label="Question" wide><input className={inputCls} value={v.q} onChange={(e) => { set("q")(e); }} onBlur={() => isNew && !v.id && setV((s) => ({ ...s, id: slug(s.q).slice(0, 60) }))} required /></F>
      <F label="Answer" wide><textarea className={`${textareaCls} min-h-32`} value={v.a} onChange={set("a")} required /></F>
      <F label="Category"><input className={inputCls} list="faq-cat-list" value={v.category} onChange={set("category")} required /><datalist id="faq-cat-list">{categories.map((c) => <option key={c} value={c} />)}</datalist></F>
      <F label="Tag (optional)"><input className={inputCls} value={v.tag} onChange={set("tag")} /></F>
      {isNew && <F label="Id (URL name)" hint="Also the link to this question, e.g. /faq#my-question"><input className={inputCls} value={v.id} onChange={set("id")} /></F>}
      <F label="Display order"><input className={inputCls} inputMode="numeric" value={v.sort} onChange={set("sort")} /></F>
      <label className="flex items-center gap-3 sm:col-span-2"><Switch on={v.active} onChange={() => setV((s) => ({ ...s, active: !s.active }))} label="Visible on the website" /><span className="text-sm font-medium text-ink">Visible on the website</span></label>
      <FormFooter saving={saving} error={error} onCancel={onCancel} />
    </form>
  );
}

/* ------------------------------------------------------------ category tree */
function CategoryTree({ cat, busy, onAdd, onEdit, onToggle, onDelete }: { cat: AdminCatalog; busy: string | null; onAdd: (parent: AdminCategory | null) => void; onEdit: (c: AdminCategory) => void; onToggle: (c: AdminCategory) => void; onDelete: (c: AdminCategory) => void }) {
  const tops = cat.categories.filter((c) => !c.parentId);
  const subsOf = (id: string) => cat.categories.filter((c) => c.parentId === id);
  const countFor = (c: AdminCategory) => {
    const parent = c.parentId ? cat.categories.find((x) => x.id === c.parentId) : null;
    return cat.devices.filter((d) => (parent ? d.category === parent.name && d.subcategory === c.name : d.category === c.name)).length;
  };
  if (!tops.length) return <div className={CARD}><EmptyState icon={FolderTree} title="No categories yet" text="Create a category, then add sub-categories under it. Products are placed in a sub-category." /></div>;

  const actions = (c: AdminCategory, label: string) => (
    <div className="flex items-center gap-1">
      <Switch on={c.active} disabled={busy === c.id} onChange={() => onToggle(c)} label={`${label} visible on website`} />
      <button onClick={() => onEdit(c)} aria-label={`Edit ${label}`} className="ml-2 grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><Pencil className="h-4 w-4" /></button>
      <button onClick={() => onDelete(c)} disabled={busy === c.id} aria-label={`Delete ${label}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
    </div>
  );

  return (
    <ul className="space-y-3">
      {tops.map((t) => {
        const subs = subsOf(t.id);
        const n = countFor(t);
        return (
          <li key={t.id} className={cn(`${CARD} p-3.5 sm:p-5`, !t.active && "opacity-60")}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="min-w-0 flex-1 basis-56">
                <p className="truncate text-base font-black tracking-tight text-ink">{t.name}</p>
                <p className="text-xs text-slate-500">{subs.length} sub-categor{subs.length === 1 ? "y" : "ies"} · {n} product{n === 1 ? "" : "s"}{!t.active && " · hidden"}</p>
              </div>
              {actions(t, t.name)}
            </div>
            <ul className="mt-3 space-y-1.5 border-l-2 border-brand-500/20 pl-3 sm:pl-5">
              {subs.map((c) => {
                const k = countFor(c);
                return (
                  <li key={c.id} className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-surface p-2.5 dark:bg-navy-950/70", !c.active && "opacity-60")}>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <div className="min-w-0 flex-1 basis-40"><p className="truncate text-sm font-semibold text-ink">{c.name}</p><p className="text-xs text-slate-500">{k} product{k === 1 ? "" : "s"}{!c.active && " · hidden"}</p></div>
                    {actions(c, c.name)}
                  </li>
                );
              })}
              <li><button onClick={() => onAdd(t)} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-brand-600 hover:bg-brand-500/10 dark:text-brand-400"><Plus className="h-4 w-4" />Add sub-category to {t.name}</button></li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

/* ----------------------------------------------------------------- page */
export default function CatalogAdminView({ kind: tab }: { kind: Kind }) {
  const [editing, setEditing] = useState<{ kind: Kind; item: Item | null; parent?: AdminCategory | null } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  // the product list is paged by the server; the other tabs are short and load whole
  const slim = tab === "devices";
  const { data, error, reload: reloadCatalog } = useLoad(() => api.admin.catalog({ slim }), [slim]);
  const [page, setPage] = useState(1);
  const [term, setTerm] = useState("");
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [status, setStatus] = useState<"all" | "visible" | "hidden">("all");
  useEffect(() => { const t = setTimeout(() => { setQ(term.trim()); setPage(1); }, 350); return () => clearTimeout(t); }, [term]);
  const products = useLoad(() => (slim ? api.admin.products({ q: q || undefined, category: catFilter || undefined, status, page, limit: PRODUCTS_PER_PAGE }) : Promise.resolve(null)), [slim, q, catFilter, status, page]);
  const reload = () => { reloadCatalog(); products.reload(); };

  const toggleActive = async (kind: Kind, it: Item) => {
    setBusy(it.id);
    try {
      const body = { ...payload(it), active: !it.active };
      if (kind === "plans") await api.admin.putPlan(it.id, body); else if (kind === "devices") await api.admin.putDevice(it.id, body); else if (kind === "categories") await api.admin.putCategory(it.id, body); else if (kind === "hero") await api.admin.putSlide(it.id, body); else await api.admin.putFaq(it.id, body);
      toast.success(it.active ? "Hidden from the website" : "Visible on the website"); reload();
    } catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not update"); } finally { setBusy(null); }
  };
  const remove = async (kind: Kind, it: Item, label: string) => {
    if (!window.confirm(`Delete “${label}” permanently? Hiding it instead keeps it for later.`)) return;
    setBusy(it.id);
    try { if (kind === "plans") await api.admin.delPlan(it.id); else if (kind === "devices") await api.admin.delDevice(it.id); else if (kind === "categories") await api.admin.delCategory(it.id); else if (kind === "hero") await api.admin.delSlide(it.id); else await api.admin.delFaq(it.id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not delete"); } finally { setBusy(null); }
  };

  const cat: AdminCatalog | null = data;
  const rows: { item: Item; title: string; sub: string; meta: string }[] = !cat ? [] :
    tab === "plans" ? cat.plans.map((p) => ({ item: p, title: p.name, sub: `${p.features.length} features${p.highlight ? ` · ${p.highlight}` : ""}`, meta: `${formatBDT(p.devicePrice)} + ${formatBDT(p.monthlyCharge)}/mo` })) :
    tab === "categories" ? [] :
    tab === "hero" ? cat.heroSlides.map((h) => ({ item: h, title: `${h.titleMain} ${h.titleHighlight}`, sub: `${h.tab} · ${h.badge}`, meta: `${h.ctaLabel} → ${h.ctaHref}` })) :
    tab === "devices" ? (products.data?.items ?? []).map((d) => ({ item: d, title: d.name, sub: `${d.category} › ${d.subcategory}`, meta: d.price == null ? "On request" : `${formatBDT(d.price)}${d.monthly ? ` + ${formatBDT(d.monthly)}/mo` : ""}` })) :
    cat.faqs.map((f) => ({ item: f, title: f.q, sub: f.category, meta: f.tag })) ;

  const catTree = cat?.categories ?? [];
  const faqCategories = [...new Set((cat?.faqs ?? []).map((f) => f.category))];
  const current = TABS.find((t) => t.id === tab)!;
  const closeEdit = () => setEditing(null);
  const saved = () => { setEditing(null); reload(); };
  const deviceFilters = tab === "devices";
  const loadError = error ?? (deviceFilters ? products.error : null);

  return (
    <>
      <PageHeader title={PAGE[tab].title} subtitle={`${PAGE[tab].subtitle} Changes appear on the website within a minute.`}
        actions={<button onClick={() => setEditing({ kind: tab, item: null })} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"><Plus className="h-4 w-4" />{current.add}</button>} />

      {deviceFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search by name or id" aria-label="Search products" className="h-10 w-full rounded-lg bg-softer/80 px-3 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:bg-navy-900/90 sm:w-64" />
          <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }} aria-label="Filter by category" className="h-10 rounded-lg bg-softer/80 px-3 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:bg-navy-900/90">
            <option value="">All categories</option>
            {(cat?.categories ?? []).filter((c) => !c.parentId).map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }} aria-label="Filter by visibility" className="h-10 rounded-lg bg-softer/80 px-3 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:bg-navy-900/90">
            <option value="all">Visible and hidden</option><option value="visible">Visible only</option><option value="hidden">Hidden only</option>
          </select>
        </div>
      )}

      {loadError ? <ErrorState message={loadError} onRetry={reload} /> : !cat || (deviceFilters && !products.data) ? <Skeleton rows={5} /> : tab === "categories" ? (
        <CategoryTree cat={cat} busy={busy} onAdd={(parent) => setEditing({ kind: "categories", item: null, parent })} onEdit={(c) => setEditing({ kind: "categories", item: c })}
          onToggle={(c) => void toggleActive("categories", c)} onDelete={(c) => void remove("categories", c, c.name)} />
      ) : rows.length === 0 ? (
        <div className={CARD}><EmptyState icon={current.icon} title={`No ${current.label.toLowerCase()} yet`} text={`Use “${current.add}” to create the first one.`} /></div>
      ) : (
        <ul className={cn("space-y-2 transition-opacity", deviceFilters && products.loading && "opacity-60")}>
          {rows.map(({ item, title, sub, meta }) => (
            <li key={item.id} className={cn(`${CARD} flex flex-wrap items-center gap-x-4 gap-y-2 p-3.5 sm:px-5`, !item.active && "opacity-60")}>
              {tab === "devices" && (() => { const pic = (item as AdminDevice).images?.[0] ?? (item as AdminDevice).image; return (
                <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-md bg-surface dark:bg-navy-950/70">{pic ? <ProductImage src={mediaUrl(pic)} alt="" fill sizes="56px" className="object-contain p-0.5" /> : <span className="grid h-full place-items-center text-[10px] text-slate-400">No photo</span>}</div>
              ); })()}
              <div className="min-w-0 flex-1 basis-60">
                <p className="truncate text-sm font-bold text-ink">{title}</p>
                <p className="truncate text-xs text-slate-500">{sub} · <span className="font-mono">{item.id}</span></p>
              </div>
              {meta && <p className="text-sm font-semibold tabular-nums text-ink">{meta}</p>}
              <div className="flex items-center gap-1">
                <Switch on={item.active} disabled={busy === item.id} onChange={() => void toggleActive(tab, item)} label={`${title} visible on website`} />
                <button onClick={() => setEditing({ kind: tab, item })} aria-label={`Edit ${title}`} className="ml-2 grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-surface hover:text-brand-600 dark:hover:bg-navy-950"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => void remove(tab, item, title)} disabled={busy === item.id} aria-label={`Delete ${title}`} className="grid h-9 w-9 place-items-center rounded-lg text-body hover:bg-red-500/10 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deviceFilters && products.data && <Pagination page={products.data.page} limit={products.data.limit} total={products.data.total} onPage={setPage} />}

      <Modal open={!!editing} onClose={closeEdit} wide title={editing ? `${editing.item ? "Edit" : "Add"} ${editing.kind === "plans" ? "package" : editing.kind === "devices" ? "product" : editing.kind === "hero" ? "hero slide" : editing.kind === "categories" ? (editing.parent || (editing.item as AdminCategory | null)?.parentId ? "sub-category" : "category") : "FAQ"}` : ""}>
        {editing && cat && (
          editing.kind === "hero" ? <HeroForm key={editing.item?.id ?? "new"} initial={editing.item as AdminHeroSlide | null} onSaved={saved} onCancel={closeEdit} /> :
          editing.kind === "categories" ? <CategoryForm key={editing.item?.id ?? `new-${editing.parent?.id ?? "top"}`} initial={editing.item as AdminCategory | null} catTree={catTree} parent={editing.parent ?? null} onSaved={saved} onCancel={closeEdit} /> :
          editing.kind === "plans" ? <PlanForm key={editing.item?.id ?? "new"} initial={editing.item as AdminPlan | null} categories={[]} catTree={catTree} plans={cat.plans} onSaved={saved} onCancel={closeEdit} /> :
          editing.kind === "devices" ? <DeviceForm key={editing.item?.id ?? "new"} initial={editing.item as AdminDevice | null} categories={[]} catTree={catTree} plans={cat.plans} onSaved={saved} onCancel={closeEdit} /> :
          <FaqForm key={editing.item?.id ?? "new"} initial={editing.item as AdminFaq | null} categories={faqCategories} catTree={catTree} plans={cat.plans} onSaved={saved} onCancel={closeEdit} />
        )}
      </Modal>
    </>
  );
}
