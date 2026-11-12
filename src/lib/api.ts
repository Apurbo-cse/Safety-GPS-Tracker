/**
 * Client for the Safety GPS Tracker API (NestJS + PostgreSQL, see /backend).
 * Set NEXT_PUBLIC_API_URL, e.g. http://localhost:4000/api/v1
 */
import type { CartItem, Device } from "@/types";

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

async function request<T>(method: string, path: string, opts: { body?: unknown; auth?: boolean } = {}): Promise<T> {
  if (!apiConfigured) throw new ApiError(0, "The service isn't connected yet. Please try again later.");
  const token = opts.auth === false ? null : getToken();
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: { ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }
  if (res.status === 204) return undefined as T;
  let json: unknown = null;
  try { json = await res.json(); } catch { /* non-JSON body */ }
  if (!res.ok) {
    if (res.status === 401 && token) { clearToken(); if (typeof window !== "undefined") window.dispatchEvent(new Event(UNAUTHORIZED_EVENT)); }
    throw new ApiError(res.status, res.status === 429 ? "Too many attempts. Please wait a minute and try again." : messageOf(json, "Something went wrong. Please try again."));
  }
  return json as T;
}

/* ----------------------------------------------------------------- types */
export interface ApiSettings {
  alerts: Record<"ignition" | "geofence" | "speed" | "tamper" | "sos" | "documents" | "billing", boolean>;
  channels: Record<"push" | "sms" | "email", boolean>;
  speedLimit: number; language: "en" | "bn"; units: "km" | "mi"; twoFactor: boolean; marketing: boolean;
}
export interface ApiUser {
  id: string; name: string; email: string; phone: string | null; role: "customer" | "admin";
  vehicleType: string | null; company: string; address: string; division: string; settings: ApiSettings; createdAt: string;
}
export type OrderStatus = "received" | "confirmed" | "scheduled" | "active" | "cancelled";
export type PaymentMethod = "bKash" | "Nagad" | "Rocket" | "Card" | "Cash on installation";
export interface ApiOrder {
  id: string; createdAt: string; status: OrderStatus; payment: PaymentMethod; deviceTotal: number; monthlyTotal: number;
  items: CartItem[];
  contact: { name: string; phone: string; email: string; address: string; division: string; vehicleReg: string; vehicleType: string; preferredDate: string; note?: string };
}
export interface AdminOrder extends ApiOrder { customer: { id: string; name: string; email: string } }
export interface CreateOrderBody {
  items: { id: string; qty: number }[]; payment: PaymentMethod; name: string; phone: string; email: string; address: string; division: string;
  vehicleReg: string; vehicleType: string; preferredDate: string; note?: string;
}

export interface ProductsQuery { category?: string; sub?: string; q?: string; maxPrice?: number; priced?: boolean; call?: boolean; sort?: "default" | "price-asc" | "price-desc" | "name"; ids?: string[]; page?: number; limit?: number }
export interface Paged<T> { items: T[]; total: number; page: number; limit: number; pages: number }
const qs = (o: Record<string, unknown>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) { if (v === undefined || v === "" || v === false || v === null) continue; p.set(k, Array.isArray(v) ? v.join(",") : v === true ? "1" : String(v)); }
  return p.size ? `?${p}` : "";
};

/** Upload one picture (JPEG/PNG/WebP, ≤ 3 MB) as an admin. */
async function upload(file: Blob, name: string): Promise<{ token: string; id: string; mime: string; size: number }> {
  if (!apiConfigured) throw new ApiError(0, "The service isn't connected yet. Please try again later.");
  const fd = new FormData(); fd.append("file", file, name);
  let res: Response;
  try { res = await fetch(`${API_URL}/admin/media`, { method: "POST", headers: { Authorization: `Bearer ${getToken() ?? ""}` }, body: fd }); }
  catch { throw new ApiError(0, "Can't reach the server. Check your connection and try again."); }
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, res.status === 413 ? "The picture is larger than 3 MB" : messageOf(json, "Upload failed"));
  return json;
}

/* ------------------------------------------------------------------- api */
export const api = {
  register: (b: { name: string; mobile: string; email: string; password: string; vehicleType?: string }) => request<{ accessToken: string; user: ApiUser }>("POST", "/auth/register", { body: b, auth: false }),
  login: (b: { identifier: string; password: string }) => request<{ accessToken: string; user: ApiUser }>("POST", "/auth/login", { body: b, auth: false }),
  me: () => request<ApiUser>("GET", "/me"),
  updateProfile: (b: Partial<Pick<ApiUser, "name" | "phone" | "email" | "company" | "address" | "division">>) => request<ApiUser>("PATCH", "/me/profile", { body: b }),
  updateSettings: (b: ApiSettings) => request<ApiUser>("PUT", "/me/settings", { body: b }),
  changePassword: (b: { current: string; next: string }) => request<void>("POST", "/me/password", { body: b }),
  deleteAccount: () => request<void>("DELETE", "/me"),
  /** Shop listing — filtered, sorted and paged by the server. */
  products: (q: ProductsQuery = {}) => request<Paged<Device>>("GET", `/products${qs({ ...q })}`, { auth: false }),
  orders: () => request<ApiOrder[]>("GET", "/orders"),
  createOrder: (b: CreateOrderBody) => request<ApiOrder>("POST", "/orders", { body: b }),
  cancelOrder: (id: string) => request<ApiOrder>("POST", `/orders/${encodeURIComponent(id)}/cancel`),

  admin: {
    orders: (q: { status?: string; q?: string; page?: number; limit?: number } = {}) => {
      const p = new URLSearchParams(); Object.entries(q).forEach(([k, v]) => v !== undefined && v !== "" && p.set(k, String(v)));
      return request<{ page: number; limit: number; total: number; counts: Partial<Record<OrderStatus, number>>; orders: AdminOrder[] }>("GET", `/admin/orders${p.size ? `?${p}` : ""}`);
    },
    setStatus: (id: string, status: OrderStatus) => request<ApiOrder>("PATCH", `/admin/orders/${encodeURIComponent(id)}/status`, { body: { status } }),
    stats: () => request<AdminStats>("GET", "/admin/stats"),
    customers: (q: { q?: string; page?: number; limit?: number } = {}) => {
      const p = new URLSearchParams(); Object.entries(q).forEach(([k, v]) => v !== undefined && v !== "" && p.set(k, String(v)));
      return request<{ page: number; limit: number; total: number; customers: AdminCustomer[] }>("GET", `/admin/customers${p.size ? `?${p}` : ""}`);
    },
    catalog: (opts: { slim?: boolean } = {}) => request<AdminCatalog>("GET", `/admin/catalog${opts.slim ? "?slim=1" : ""}`),
    products: (q: { q?: string; category?: string; status?: "all" | "visible" | "hidden"; page?: number; limit?: number } = {}) => request<Paged<AdminDevice>>("GET", `/admin/products${qs({ ...q })}`),
    uploadImage: upload,
    /** Delete an uploaded picture nobody uses (no-op if a product still uses it). */
    discardImage: (token: string) => request<void>("DELETE", `/admin/media/${token.replace(/^media:/, "")}`),
    putSlide: (id: string, b: object) => request<unknown>("PUT", `/admin/catalog/hero/${id}`, { body: b }),
    delSlide: (id: string) => request<void>("DELETE", `/admin/catalog/hero/${id}`),
    putCategory: (id: string, b: object) => request<unknown>("PUT", `/admin/catalog/categories/${id}`, { body: b }),
    delCategory: (id: string) => request<void>("DELETE", `/admin/catalog/categories/${id}`),
    putPlan: (id: string, b: object) => request<unknown>("PUT", `/admin/catalog/plans/${id}`, { body: b }),
    delPlan: (id: string) => request<void>("DELETE", `/admin/catalog/plans/${id}`),
    putDevice: (id: string, b: object) => request<unknown>("PUT", `/admin/catalog/devices/${id}`, { body: b }),
    delDevice: (id: string) => request<void>("DELETE", `/admin/catalog/devices/${id}`),
    putFaq: (id: string, b: object) => request<unknown>("PUT", `/admin/catalog/faqs/${id}`, { body: b }),
    delFaq: (id: string) => request<void>("DELETE", `/admin/catalog/faqs/${id}`),
  },
};

export interface AdminPlan { id: string; name: string; devicePrice: number; monthlyCharge: number; features: string[]; highlight: string | null; image: string | null; siteTitle: string | null; sourceNo: number; sort: number; active: boolean }
export interface AdminDevice { id: string; name: string; category: string; subcategory: string; visual: string; image: string | null; images: string[]; siteTitle: string | null; summary: string; specs: { label: string; value: string }[]; features: string[]; price: number | null; monthly: number | null; planId: string | null; priceNote: string; sort: number; active: boolean }
export interface AdminFaq { id: string; category: string; q: string; a: string; tag: string; sort: number; active: boolean }
export interface AdminCategory { id: string; name: string; parentId: string | null; sort: number; active: boolean }
export interface AdminHeroSlide { id: string; tab: string; badge: string; badgeIcon: string; titleMain: string; titleHighlight: string; text: string; bgImage: string; accent: string; ctaLabel: string; ctaHref: string; telematics: { vehicle: string; plate: string; place: string; speed: string; ignition: "ON" | "OFF" | "LOCKED"; status: string; route: string; sensor: string; fuel: string }; sort: number; active: boolean }
export interface AdminCatalog { plans: AdminPlan[]; devices: AdminDevice[]; faqs: AdminFaq[]; categories: AdminCategory[]; heroSlides: AdminHeroSlide[] }

export interface AdminStats {
  customers: number; newCustomers7d: number;
  orders: { total: number; byStatus: Partial<Record<OrderStatus, number>> };
  revenue: number; monthlyActive: number; monthlyPipeline: number;
  daily: { date: string; orders: number; revenue: number }[];
}
export interface AdminCustomer { id: string; name: string; email: string; phone: string | null; role: "customer" | "admin"; division: string; createdAt: string; orders: number; spent: number }
