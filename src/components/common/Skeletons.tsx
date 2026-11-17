import Container from "@/components/common/Container";
import { cn } from "@/utils/format";

/**
 * Loading placeholders that copy the shape of the real page, so nothing jumps when the content arrives.
 * Website: Home, Shop, Product, Pricing, Faq, News, NewsPost, Content, Contact, Orders, OrderDetail, Checkout, Profile, Settings, PayBill.
 * Admin:   AdminDashboard, AdminTable, AdminDetail, AdminCatalog, AdminTeam, AdminForm, AdminRows.
 */
const S = ({ className = "" }: { className?: string }) => <div className={cn("skeleton", className)} />;
const D = ({ className = "" }: { className?: string }) => <div className={cn("skeleton skeleton-dark", className)} />;
const n = (count: number) => Array.from({ length: count }, (_, i) => i);
const BUSY = { "aria-busy": true, "aria-label": "Loading" } as const;
const CARD = "rounded-lg bg-softer/80 dark:bg-navy-900/90";

/* ================================================================ website */

/** The dark page banner every inner page starts with (breadcrumb, title, text). */
function HeroBand({ tall = false }: { tall?: boolean }) {
  return (
    <section className="bg-gradient-to-br from-[#0c1e31] via-[#122b46] to-[#1a3a5e]">
      <Container className={cn("space-y-4 py-10 sm:py-14", tall && "lg:py-20")}>
        <D className="h-3 w-40" />
        <D className="h-10 w-3/4 max-w-xl" />
        <D className="h-4 w-full max-w-2xl" />
        <D className="h-4 w-2/3 max-w-lg" />
      </Container>
    </section>
  );
}

/** A product card: picture, category, name, price and button. */
function ProductCard() {
  return (
    <div className={cn(CARD, "overflow-hidden")}>
      <S className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <S className="h-3 w-24" />
        <S className="h-5 w-4/5" />
        <S className="h-3 w-full" />
        <div className="flex items-center justify-between pt-1.5"><S className="h-6 w-24" /><S className="h-9 w-24 rounded-md" /></div>
      </div>
    </div>
  );
}

/** Home: the big hero with the live card, partner strip, then feature cards. */
export function HomeSkeleton() {
  return (
    <div {...BUSY}>
      <section className="bg-[#0a1628]">
        <Container className="grid min-h-[480px] items-center gap-8 py-14 sm:min-h-[520px] lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <D className="h-7 w-44 rounded-full" />
            <D className="h-12 w-full max-w-xl" />
            <D className="h-12 w-2/3 max-w-md" />
            <D className="h-4 w-full max-w-lg" />
            <D className="h-4 w-4/5 max-w-md" />
            <div className="flex gap-3 pt-3"><D className="h-11 w-40 rounded-md" /><D className="h-11 w-36 rounded-md" /></div>
          </div>
          <div className="hidden justify-end lg:col-span-5 lg:flex"><D className="h-64 w-[340px] rounded-md" /></div>
        </Container>
      </section>
      <Container className="py-8"><div className="flex flex-wrap items-center justify-center gap-6">{n(6).map((i) => <S key={i} className="h-8 w-24" />)}</div></Container>
      <Container className="py-8">
        <div className="mx-auto mb-8 max-w-xl space-y-3 text-center"><S className="mx-auto h-4 w-24" /><S className="mx-auto h-8 w-3/4" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {n(8).map((i) => <div key={i} className={cn(CARD, "space-y-3 p-5")}><S className="h-10 w-10 rounded-lg" /><S className="h-5 w-3/4" /><S className="h-3 w-full" /><S className="h-3 w-2/3" /></div>)}
        </div>
      </Container>
    </div>
  );
}

/** Shop and category pages: banner, category chips + search, grid of product cards. */
export function ShopSkeleton() {
  return (
    <div {...BUSY}>
      <HeroBand />
      <Container className="py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 flex-wrap gap-2">{n(5).map((i) => <S key={i} className="h-9 w-28 rounded-full" />)}</div>
          <S className="h-10 w-full rounded-md sm:w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{n(8).map((i) => <ProductCard key={i} />)}</div>
      </Container>
    </div>
  );
}

/** One product: gallery with thumbnails, name, price, package and buy buttons, then description tabs. */
export function ProductSkeleton() {
  return (
    <Container className="py-8" >
      <div {...BUSY}>
        <S className="mb-6 h-3 w-64" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <S className="aspect-square w-full rounded-lg" />
            <div className="flex gap-3">{n(4).map((i) => <S key={i} className="h-16 w-16 rounded-md" />)}</div>
          </div>
          <div className="space-y-4">
            <S className="h-4 w-28" />
            <S className="h-9 w-3/4" />
            <S className="h-4 w-full" />
            <S className="h-4 w-5/6" />
            <div className="flex items-end gap-3 pt-2"><S className="h-10 w-36" /><S className="h-5 w-24" /></div>
            <S className="h-9 w-40 rounded-md" />
            <div className="flex gap-3 pt-2"><S className="h-12 flex-1 rounded-md" /><S className="h-12 w-32 rounded-md" /></div>
            <div className="grid grid-cols-2 gap-2 pt-3">{n(6).map((i) => <S key={i} className="h-4 w-full" />)}</div>
          </div>
        </div>
        <div className="mt-10 space-y-3"><div className="flex gap-3">{n(3).map((i) => <S key={i} className="h-9 w-28 rounded-full" />)}</div>{n(4).map((i) => <S key={i} className="h-4 w-full" />)}</div>
      </div>
    </Container>
  );
}

/** Pricing: banner, stat strip, package cards, how-it-works. */
export function PricingSkeleton() {
  return (
    <div {...BUSY}>
      <HeroBand />
      <Container className="py-10">
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{n(4).map((i) => <S key={i} className="h-20 rounded-lg" />)}</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {n(4).map((i) => (
            <div key={i} className={cn(CARD, "space-y-3 p-5")}>
              <S className="aspect-[4/3] w-full rounded-md" />
              <S className="h-5 w-3/4" /><S className="h-8 w-32" /><S className="h-4 w-28" />
              <div className="space-y-2 pt-2">{n(5).map((k) => <S key={k} className="h-3 w-full" />)}</div>
              <S className="h-11 w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">{n(3).map((i) => <div key={i} className={cn(CARD, "space-y-3 p-5")}><S className="h-10 w-10 rounded-lg" /><S className="h-5 w-2/3" /><S className="h-3 w-full" /></div>)}</div>
      </Container>
    </div>
  );
}

/** FAQ: banner, search, category chips, accordion rows. */
export function FaqSkeleton() {
  return (
    <div {...BUSY}>
      <HeroBand />
      <Container className="max-w-4xl space-y-4 py-10">
        <S className="h-12 w-full rounded-lg" />
        <div className="flex flex-wrap gap-2">{n(6).map((i) => <S key={i} className="h-9 w-28 rounded-full" />)}</div>
        {n(7).map((i) => <S key={i} className="h-16 w-full rounded-lg" />)}
      </Container>
    </div>
  );
}

/** News list: banner and cards with a cover picture. */
export function NewsSkeleton() {
  return (
    <div {...BUSY}>
      <HeroBand />
      <Container className="py-10">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {n(6).map((i) => (
            <li key={i} className={cn(CARD, "overflow-hidden")}>
              <S className="aspect-[16/9] w-full rounded-none" />
              <div className="space-y-2.5 p-5"><S className="h-3 w-28" /><S className="h-5 w-4/5" /><S className="h-3 w-full" /><S className="h-3 w-3/4" /></div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

/** One news post: cover, title, date and paragraphs. */
export function NewsPostSkeleton() {
  return (
    <Container className="max-w-3xl py-10">
      <div {...BUSY} className="space-y-4">
        <S className="h-3 w-48" />
        <S className="h-10 w-5/6" />
        <S className="h-3 w-40" />
        <S className="aspect-[16/9] w-full rounded-lg" />
        {n(3).map((p) => <div key={p} className="space-y-2 pt-3">{n(4).map((i) => <S key={i} className={cn("h-4", i === 3 ? "w-2/3" : "w-full")} />)}</div>)}
      </div>
    </Container>
  );
}

/** About, features, solutions, mobile app, privacy, terms and CMS pages: banner, intro text, then cards. */
export function ContentSkeleton() {
  return (
    <div {...BUSY}>
      <HeroBand tall />
      <Container className="space-y-10 py-12">
        <div className="mx-auto max-w-2xl space-y-3 text-center"><S className="mx-auto h-4 w-24" /><S className="mx-auto h-8 w-3/4" />{n(3).map((i) => <S key={i} className="h-3.5 w-full" />)}</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{n(6).map((i) => <div key={i} className={cn(CARD, "space-y-3 p-6")}><S className="h-11 w-11 rounded-lg" /><S className="h-5 w-2/3" /><S className="h-3 w-full" /><S className="h-3 w-4/5" /></div>)}</div>
      </Container>
    </div>
  );
}

/** Legal / plain text pages. */
export function TextPageSkeleton() {
  return (
    <div {...BUSY}>
      <HeroBand />
      <Container className="max-w-3xl space-y-6 py-12">
        {n(4).map((s) => <div key={s} className="space-y-2.5"><S className="h-6 w-1/3" />{n(4).map((i) => <S key={i} className={cn("h-3.5", i === 3 ? "w-3/5" : "w-full")} />)}</div>)}
      </Container>
    </div>
  );
}

/** Contact: banner, the form, and the office / phone cards. */
export function ContactSkeleton() {
  return (
    <div {...BUSY}>
      <HeroBand />
      <Container className="grid gap-6 py-12 lg:grid-cols-[1.2fr_1fr]">
        <div className={cn(CARD, "space-y-4 p-6")}>
          <S className="h-6 w-40" />
          <div className="grid gap-4 sm:grid-cols-2"><S className="h-11 rounded-md" /><S className="h-11 rounded-md" /><S className="h-11 rounded-md" /><S className="h-11 rounded-md" /></div>
          <S className="h-32 w-full rounded-md" /><S className="h-11 w-40 rounded-md" />
        </div>
        <div className="space-y-4">{n(3).map((i) => <div key={i} className={cn(CARD, "flex gap-4 p-5")}><S className="h-11 w-11 shrink-0 rounded-lg" /><div className="flex-1 space-y-2"><S className="h-4 w-1/2" /><S className="h-3 w-3/4" /></div></div>)}</div>
        <S className="h-64 w-full rounded-lg lg:col-span-2" />
      </Container>
    </div>
  );
}

/** My orders: order cards with a thumbnail, id, status chip and total. */
export function OrdersSkeleton() {
  return (
    <Container className="max-w-4xl py-10">
      <div {...BUSY} className="space-y-4">
        <S className="h-8 w-44" />
        <div className="flex gap-2">{n(4).map((i) => <S key={i} className="h-9 w-24 rounded-full" />)}</div>
        {n(4).map((i) => (
          <div key={i} className={cn(CARD, "flex items-center gap-4 p-4")}>
            <S className="h-16 w-16 shrink-0 rounded-md" />
            <div className="flex-1 space-y-2"><S className="h-4 w-40" /><S className="h-3 w-56 max-w-full" /></div>
            <div className="space-y-2 text-right"><S className="ml-auto h-6 w-24 rounded-full" /><S className="ml-auto h-4 w-20" /></div>
          </div>
        ))}
      </div>
    </Container>
  );
}

/** One order: status timeline, items, the installation and billing details, and the payment panel. */
export function OrderDetailSkeleton() {
  return (
    <Container className="max-w-5xl py-10">
      <div {...BUSY} className="space-y-5">
        <div className="flex items-center justify-between"><S className="h-8 w-56" /><S className="h-9 w-28 rounded-md" /></div>
        <div className={cn(CARD, "flex justify-between gap-2 p-5")}>{n(5).map((i) => <div key={i} className="flex-1 space-y-2 text-center"><S className="mx-auto h-8 w-8 rounded-full" /><S className="mx-auto h-3 w-14" /></div>)}</div>
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <div className={cn(CARD, "space-y-3 p-5")}>{n(2).map((i) => <div key={i} className="flex items-center gap-3"><S className="h-14 w-14 rounded-md" /><div className="flex-1 space-y-2"><S className="h-4 w-1/2" /><S className="h-3 w-1/3" /></div><S className="h-5 w-20" /></div>)}</div>
            <div className={cn(CARD, "grid gap-3 p-5 sm:grid-cols-2")}>{n(6).map((i) => <div key={i} className="space-y-1.5"><S className="h-3 w-20" /><S className="h-4 w-4/5" /></div>)}</div>
          </div>
          <div className={cn(CARD, "h-fit space-y-3 p-5")}>{n(4).map((i) => <div key={i} className="flex justify-between"><S className="h-4 w-24" /><S className="h-4 w-16" /></div>)}<S className="h-11 w-full rounded-md" /></div>
        </div>
      </div>
    </Container>
  );
}

/** Checkout: the form sections on the left and the order summary on the right. */
export function CheckoutSkeleton() {
  return (
    <Container className="py-10">
      <div {...BUSY} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <S className="h-8 w-40" />
          {n(3).map((s) => <div key={s} className={cn(CARD, "space-y-4 p-5")}><S className="h-5 w-44" /><div className="grid gap-4 sm:grid-cols-2">{n(4).map((i) => <S key={i} className="h-11 rounded-md" />)}</div></div>)}
        </div>
        <div className={cn(CARD, "h-fit space-y-4 p-5")}>
          <S className="h-5 w-32" />
          {n(2).map((i) => <div key={i} className="flex items-center gap-3"><S className="h-14 w-14 rounded-md" /><div className="flex-1 space-y-2"><S className="h-4 w-3/4" /><S className="h-3 w-1/2" /></div></div>)}
          <S className="h-11 w-full rounded-md" />
          {n(3).map((i) => <div key={i} className="flex justify-between"><S className="h-4 w-24" /><S className="h-4 w-16" /></div>)}
          <S className="h-12 w-full rounded-md" />
        </div>
      </div>
    </Container>
  );
}

/** Profile: avatar card and the details form. */
export function ProfileSkeleton() {
  return (
    <Container className="max-w-4xl py-10">
      <div {...BUSY} className="space-y-5">
        <div className={cn(CARD, "flex items-center gap-4 p-5")}><S className="h-16 w-16 rounded-full" /><div className="space-y-2"><S className="h-5 w-40" /><S className="h-3 w-56" /></div></div>
        <div className={cn(CARD, "space-y-4 p-5")}><S className="h-5 w-36" /><div className="grid gap-4 sm:grid-cols-2">{n(6).map((i) => <S key={i} className="h-11 rounded-md" />)}</div><S className="h-11 w-36 rounded-md" /></div>
      </div>
    </Container>
  );
}

/** Settings: titled groups of switch rows. */
export function SettingsSkeleton() {
  return (
    <Container className="max-w-3xl py-10">
      <div {...BUSY} className="space-y-5">
        <S className="h-8 w-40" />
        {n(3).map((g) => (
          <div key={g} className={cn(CARD, "space-y-4 p-5")}>
            <S className="h-5 w-36" />
            {n(3).map((i) => <div key={i} className="flex items-center justify-between gap-4"><div className="flex-1 space-y-2"><S className="h-4 w-48" /><S className="h-3 w-3/4" /></div><S className="h-6 w-11 rounded-full" /></div>)}
          </div>
        ))}
      </div>
    </Container>
  );
}

/** Pay a bill: a short form card. */
export function PayBillSkeleton() {
  return (
    <div {...BUSY}>
      <HeroBand />
      <Container className="max-w-xl py-10"><div className={cn(CARD, "space-y-4 p-6")}><S className="h-6 w-40" />{n(3).map((i) => <S key={i} className="h-11 w-full rounded-md" />)}<div className="flex gap-3">{n(3).map((i) => <S key={i} className="h-14 flex-1 rounded-md" />)}</div><S className="h-12 w-full rounded-md" /></div></Container>
    </div>
  );
}

/** Login / register card. */
export function AuthSkeleton() {
  return (
    <div {...BUSY} className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-4">
      <S className="mx-auto h-10 w-40" />
      <S className="mx-auto h-7 w-48" />
      {n(3).map((i) => <S key={i} className="h-12 w-full rounded-md" />)}
      <S className="h-12 w-full rounded-md" />
    </div>
  );
}

/** Printable invoice sheet. */
export function InvoiceSkeleton() {
  return (
    <div {...BUSY} className="mx-auto max-w-3xl space-y-5 rounded-lg bg-white p-8">
      <div className="flex justify-between"><S className="h-10 w-40" /><div className="space-y-2"><S className="h-4 w-32" /><S className="h-3 w-24" /></div></div>
      <div className="grid grid-cols-2 gap-6"><div className="space-y-2">{n(4).map((i) => <S key={i} className="h-3 w-3/4" />)}</div><div className="space-y-2">{n(4).map((i) => <S key={i} className="h-3 w-3/4" />)}</div></div>
      {n(4).map((i) => <S key={i} className="h-10 w-full" />)}
      <S className="ml-auto h-16 w-56" />
    </div>
  );
}

/* ================================================================== admin */

/** The page title row of an admin page. */
export function AdminHeader({ actions = 1 }: { actions?: number }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-2"><S className="h-8 w-48" /><S className="h-3.5 w-72 max-w-full" /></div>
      <div className="flex gap-2">{n(actions).map((i) => <S key={i} className="h-10 w-32 rounded-lg" />)}</div>
    </div>
  );
}

const StatRow = ({ count = 4 }: { count?: number }) => (
  <div className={cn("grid gap-3 sm:grid-cols-2", count === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
    {n(count).map((i) => <div key={i} className={cn(CARD, "flex items-center gap-3 p-4")}><S className="h-11 w-11 shrink-0 rounded-lg" /><div className="flex-1 space-y-2"><S className="h-3 w-20" /><S className="h-6 w-24" /></div></div>)}
  </div>
);

/** Dashboard: stat cards, a chart and two lists. */
export function AdminDashboardSkeleton() {
  return (
    <div {...BUSY}>
      <div className="space-y-5">
        <StatRow />
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div className={cn(CARD, "space-y-4 p-5")}><S className="h-5 w-40" /><S className="h-56 w-full rounded-md" /></div>
          <div className={cn(CARD, "space-y-3 p-5")}><S className="h-5 w-32" />{n(5).map((i) => <div key={i} className="flex items-center gap-3"><S className="h-9 w-9 rounded-full" /><div className="flex-1 space-y-1.5"><S className="h-3.5 w-3/4" /><S className="h-3 w-1/2" /></div></div>)}</div>
        </div>
        <div className={cn(CARD, "space-y-3 p-5")}><S className="h-5 w-36" />{n(5).map((i) => <S key={i} className="h-12 w-full rounded-md" />)}</div>
      </div>
    </div>
  );
}

/** Orders, customers, messages, coupons, news, pages: search bar, filter tabs, table rows. */
export function AdminTableSkeleton({ rows = 8, tabs = true, thumbs = false }: { rows?: number; tabs?: boolean; thumbs?: boolean }) {
  return (
    <div {...BUSY} className="space-y-4">
      {tabs && <div className="flex flex-wrap gap-2">{n(6).map((i) => <S key={i} className="h-9 w-24 rounded-full" />)}</div>}
      <div className="flex flex-wrap gap-2"><S className="h-10 min-w-52 flex-1 rounded-lg" /><S className="h-10 w-32 rounded-lg" /></div>
      <div className={cn(CARD, "divide-y divide-line-soft overflow-hidden")}>
        {n(rows).map((i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            {thumbs && <S className="h-12 w-14 shrink-0 rounded-md" />}
            <div className="min-w-0 flex-1 space-y-2"><S className="h-4 w-1/3" /><S className="h-3 w-1/2" /></div>
            <S className="hidden h-4 w-24 sm:block" /><S className="h-6 w-20 rounded-full" /><S className="hidden h-4 w-16 md:block" />
          </div>
        ))}
      </div>
      <div className="flex justify-between"><S className="h-4 w-32" /><div className="flex gap-2">{n(3).map((i) => <S key={i} className="h-9 w-9 rounded-md" />)}</div></div>
    </div>
  );
}

/** Order / customer / product detail: stat cards, a main column and a side column. */
export function AdminDetailSkeleton({ stats = true }: { stats?: boolean }) {
  return (
    <div {...BUSY} className="space-y-5">
      {stats && <StatRow />}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className={cn(CARD, "space-y-4 p-5")}><S className="h-4 w-28" /><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{n(4).map((i) => <S key={i} className="aspect-square rounded-lg" />)}</div></div>
          <div className={cn(CARD, "space-y-3 p-5")}><S className="h-4 w-24" />{n(5).map((i) => <S key={i} className={cn("h-3.5", i === 4 ? "w-2/3" : "w-full")} />)}</div>
        </div>
        <div className="space-y-5">
          <div className={cn(CARD, "space-y-3 p-5")}><S className="h-4 w-28" />{n(6).map((i) => <div key={i} className="flex justify-between"><S className="h-3.5 w-24" /><S className="h-3.5 w-20" /></div>)}</div>
          <div className={cn(CARD, "space-y-3 p-5")}><S className="h-4 w-28" />{n(3).map((i) => <S key={i} className="h-12 w-full rounded-md" />)}</div>
        </div>
      </div>
    </div>
  );
}

/** Products / packages / categories / FAQs / hero: tabs, filters and rows with a picture and a switch. */
export function AdminCatalogSkeleton() {
  return (
    <div {...BUSY} className="space-y-4">
      <div className="flex flex-wrap items-center gap-2"><S className="h-10 min-w-52 flex-1 rounded-lg" /><S className="h-10 w-40 rounded-lg" /><S className="h-10 w-32 rounded-lg" /></div>
      <ul className="space-y-2">
        {n(7).map((i) => (
          <li key={i} className={cn(CARD, "flex items-center gap-4 p-3.5")}>
            <S className="h-12 w-14 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2"><S className="h-4 w-1/3" /><S className="h-3 w-1/2" /></div>
            <S className="hidden h-4 w-24 sm:block" /><S className="h-6 w-11 rounded-full" /><S className="h-9 w-9 rounded-lg" /><S className="h-9 w-9 rounded-lg" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Staff & roles: stat cards, filters and a grid of person cards. */
export function AdminTeamSkeleton({ stats = true }: { stats?: boolean }) {
  return (
    <div {...BUSY} className="space-y-4">
      {stats && <StatRow />}
      <div className="flex flex-wrap gap-2"><S className="h-10 min-w-52 flex-1 rounded-lg" /><S className="h-10 w-32 rounded-lg" /><S className="h-10 w-28 rounded-lg" /></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {n(6).map((i) => (
          <div key={i} className={cn(CARD, "space-y-3 p-4")}>
            <div className="flex items-center gap-3"><S className="h-12 w-12 rounded-full" /><div className="flex-1 space-y-2"><S className="h-4 w-2/3" /><S className="h-3 w-1/2" /></div><S className="h-6 w-11 rounded-full" /></div>
            <S className="h-8 w-full rounded-md" /><S className="h-8 w-full rounded-md" /><S className="h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Site details and other settings forms. */
export function AdminFormSkeleton() {
  return (
    <div {...BUSY} className={cn(CARD, "space-y-5 p-5")}>
      <S className="h-5 w-40" />
      <div className="grid gap-4 sm:grid-cols-2">{n(8).map((i) => <div key={i} className="space-y-2"><S className="h-3.5 w-24" /><S className="h-11 w-full rounded-md" /></div>)}</div>
      <S className="h-11 w-32 rounded-lg" />
    </div>
  );
}

/** A short list of rows (used inside cards and while a single section loads). */
export function AdminRowsSkeleton({ rows = 4 }: { rows?: number }) {
  return <div {...BUSY} className="space-y-3">{n(rows).map((i) => <S key={i} className="h-14 w-full rounded-lg" />)}</div>;
}

/** Whole admin page while its route loads: title row plus a table. */
export function AdminSkeleton() {
  return (<div><AdminHeader /><AdminTableSkeleton /></div>);
}
