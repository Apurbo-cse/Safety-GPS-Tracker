/**
 * Client for the Safety GPS Tracker API (NestJS + PostgreSQL, see /backend).
 * Set NEXT_PUBLIC_API_URL, e.g. http://localhost:4000/api/v1
 */
import type { CartItem } from "@/types";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
export const apiConfigured = API_URL !== "";

const TOKEN_KEY = "sgt:token";
export const UNAUTHORIZED_EVENT = "sgt:unauthorized";

export const getToken = (): string | null => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
export const setToken = (t: string) => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* storage blocked */ } };
export const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage blocked */ } };

/** Picture reference → URL the browser can load: uploads are "media:<id>" (served by the API), files in /public are plain paths. */
export const mediaUrl = (ref: string) => (ref.startsWith("media:") ? `${API_URL}/media/${ref.slice(6)}` : ref);

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = "ApiError"; }
}

/** Nest returns { message: string | string[] }; show the first validation message. */
function messageOf(body: unknown, fallback: string) {
  const m = (body as { message?: unknown } | null)?.message;
  if (Array.isArray(m) && m.length) return String(m[0]);
  return typeof m === "string" && m ? m : fallback;
}

export async function request<T>(method: string, path: string, opts: { body?: unknown; auth?: boolean; /** return the body as text (CSV downloads) */ text?: boolean } = {}): Promise<T> {
  if (!apiConfigured) throw new ApiError(0, "The service isn't connected yet. Please try again later.");
  const token = opts.auth === false ? null : getToken();
  let res: Response;
  try {
    const file = typeof FormData !== "undefined" && opts.body instanceof FormData; // uploads: the browser sets the multipart header
    res = await fetch(API_URL + path, {
      method,
      headers: { ...(opts.body !== undefined && !file ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: opts.body === undefined ? undefined : file ? (opts.body as FormData) : JSON.stringify(opts.body),
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }
  if (res.status === 204) return undefined as T;
  if (opts.text && res.ok) return (await res.text()) as T;
  let json: unknown = null;
  try { json = await res.json(); } catch { /* non-JSON body */ }
  if (!res.ok) {
    if (res.status === 401 && token) { clearToken(); if (typeof window !== "undefined") window.dispatchEvent(new Event(UNAUTHORIZED_EVENT)); }
    throw new ApiError(res.status, res.status === 429 ? "Too many attempts. Please wait a minute and try again." : res.status === 413 ? "The picture is larger than 3 MB" : messageOf(json, "Something went wrong. Please try again."));
  }
  return json as T;
}

/* ----------------------------------------------------------------- types */
export interface ApiSettings {
  alerts: Record<"ignition" | "geofence" | "speed" | "tamper" | "sos" | "documents" | "billing", boolean>;
  channels: Record<"push" | "sms" | "email", boolean>;
  speedLimit: number; language: "en" | "bn"; units: "km" | "mi"; twoFactor: boolean; marketing: boolean;
}
export type Permission = "orders.view" | "orders.manage" | "products.manage" | "content.manage" | "customers.view" | "messages.manage" | "finance.view" | "staff.manage";
export interface ApiUser {
  id: string; name: string; email: string; phone: string | null; role: "customer" | "admin"; staffRoleId: string | null;
  vehicleType: string | null; company: string; address: string; division: string;
  taxId: string; billingAddress: string; billingDivision: string; billingPostcode: string;
  settings: ApiSettings; createdAt: string;
  /** What this person may do in the admin panel (empty for customers). */
  permissions: Permission[];
}
export interface Billing { name: string; company?: string; taxId?: string; address: string; division: string; postcode?: string; phone: string; email: string }
export type OrderStatus = "received" | "confirmed" | "scheduled" | "active" | "cancelled";
export type PaymentMethod = "bKash" | "Nagad" | "Rocket" | "Card" | "Cash on installation";
export interface ApiOrder {
  id: string; createdAt: string; status: OrderStatus; payment: PaymentMethod; deviceTotal: number; monthlyTotal: number;
  /** Taken off deviceTotal by a coupon (what is due now is deviceTotal − discount). */
  discount: number; couponCode?: string;
  items: CartItem[];
  billing: Billing;
  contact: { name: string; phone: string; email: string; address: string; division: string; vehicleReg: string; vehicleType: string; preferredDate: string; note?: string };
}
/** `profit` and each item's `cost` are only sent to staff who may see finance. */
export interface AdminOrder extends Omit<ApiOrder, "items"> { items: (CartItem & { cost?: number })[]; profit?: number; customer: { id: string; name: string; email: string } }
export interface CreateOrderBody {
  items: { id: string; qty: number }[]; payment: PaymentMethod; name: string; phone: string; email: string; address: string; division: string;
  vehicleReg: string; vehicleType: string; preferredDate: string; note?: string;
  /** Leave out to bill the person ordering, at the installation address. */
  billing?: Billing;
  coupon?: string;
}
export interface Quote { deviceTotal: number; monthlyTotal: number; discount: number; couponCode?: string; payNow: number }
export interface AdminCoupon { code: string; kind: "percent" | "fixed"; value: number; minTotal: number; maxUses: number | null; used: number; expiresAt: string | null; active: boolean; note: string; createdAt: string }

export interface ProductsQuery { category?: string; sub?: string; q?: string; maxPrice?: number; priced?: boolean; call?: boolean; sort?: "default" | "price-asc" | "price-desc" | "name"; ids?: string[]; page?: number; limit?: number }
export interface PostSummary { id: string; title: string; excerpt: string; cover?: string; publishedAt: string }
export interface PostFull extends PostSummary { content: string; updatedAt: string }
export interface AdminPost { id: string; title: string; excerpt: string; cover: string | null; content?: string; published: boolean; publishedAt: string | null; updatedAt: string }
export interface StaffMember { id: string; name: string; email: string; phone: string | null; roleId: string; disabled: boolean; createdAt: string }
export interface RoleRow { id: string; name: string; description: string; permissions: Permission[]; system: boolean; staff: number }
/** Company details edited under Admin → Site details. */
export interface SiteDetails { name: string; tagline: string; phone: string; email: string; address: string; hours: string; facebook: string; youtube: string; linkedin: string; instagram: string }
export interface AdminPageRow { id: string; title: string; published: boolean; sort: number; updatedAt: string; system: boolean }
export interface AdminPageFull extends AdminPageRow { content: string }
export interface Paged<T> { items: T[]; total: number; page: number; limit: number; pages: number }
export const qs = (o: Record<string, unknown>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) { if (v === undefined || v === "" || v === false || v === null) continue; p.set(k, Array.isArray(v) ? v.join(",") : v === true ? "1" : String(v)); }
  return p.size ? `?${p}` : "";
};

export interface AdminPlan { id: string; name: string; description: string; cost?: number | null; devicePrice: number; monthlyCharge: number; features: string[]; highlight: string | null; image: string | null; siteTitle: string | null; sourceNo: number; vehicles: string[]; sort: number; active: boolean }
export interface AdminDevice { id: string; name: string; description: string; cost?: number | null; stock: number | null; category: string; subcategory: string; visual: string; image: string | null; images: string[]; siteTitle: string | null; summary: string; specs: { label: string; value: string }[]; features: string[]; price: number | null; monthly: number | null; planId: string | null; priceNote: string; sort: number; active: boolean }
export interface AdminFaq { id: string; category: string; q: string; a: string; tag: string; sort: number; active: boolean }
export interface AdminCategory { id: string; name: string; parentId: string | null; sort: number; active: boolean }
export interface AdminHeroSlide { id: string; tab: string; badge: string; badgeIcon: string; titleMain: string; titleHighlight: string; text: string; bgImage: string; accent: string; ctaLabel: string; ctaHref: string; telematics: { vehicle: string; plate: string; place: string; speed: string; ignition: "ON" | "OFF" | "LOCKED"; status: string; route: string; sensor: string; fuel: string }; sort: number; active: boolean }
export interface AdminCatalog { plans: AdminPlan[]; devices: AdminDevice[]; faqs: AdminFaq[]; categories: AdminCategory[]; heroSlides: AdminHeroSlide[] }

export interface AdminStats {
  /** null when the viewer may not see customers */
  customers: number | null; newCustomers7d: number | null;
  orders: { total: number; byStatus: Partial<Record<OrderStatus, number>> };
  revenue: number; monthlyActive: number; monthlyPipeline: number;
  /** null unless the viewer may see finance */
  profit: number | null;
  inventory: { tracked: number; units: number; lowStock: number; outOfStock: number; value: number | null; lowItems: { id: string; name: string; stock: number }[]; lowThreshold: number };
  daily: { date: string; orders: number; revenue: number }[];
}
export interface ContactBody { kind: "contact" | "lead"; department?: "sales" | "support" | "billing"; name: string; email?: string; phone: string; fleet?: string; subject?: string; message: string; /** honeypot: must stay empty */ website?: string }
export interface AdminMessage { id: string; kind: "contact" | "lead"; department: string; name: string; email: string; phone: string; fleet: string; subject: string; message: string; status: "new" | "handled"; createdAt: string; handledAt: string | null }
export interface AdminCustomer { id: string; name: string; email: string; phone: string | null; role: "customer" | "admin"; division: string; createdAt: string; orders: number; spent: number }
