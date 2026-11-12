import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import {
  ApiError, qs, request,
  type AdminCatalog, type AdminCoupon, type AdminMessage, type ContactBody, type Quote, type AdminPageFull, type AdminPageRow, type SiteDetails, type AdminCustomer, type AdminDevice, type AdminOrder, type AdminPost, type AdminStats, type ApiOrder, type ApiSettings, type ApiUser,
  type CreateOrderBody, type OrderStatus, type Paged, type Permission, type PostFull, type PostSummary, type ProductsQuery, type RoleRow, type StaffMember,
} from "@/lib/api";
import type { Device } from "@/types";
import { loginSuccess } from "./slices/authSlice";
import { hydrateAccount } from "./slices/accountSlice";

/** Everything the website reads or writes goes through here, so a change shows up everywhere at once. */
interface Call { method?: string; path: string; body?: unknown; auth?: boolean; text?: boolean }
export interface QueryError { status: number; message: string }

const baseQuery: BaseQueryFn<Call, unknown, QueryError> = async ({ method = "GET", path, body, auth, text }) => {
  try { return { data: await request(method, path, { body, auth, text }) }; }
  catch (e) { return { error: { status: e instanceof ApiError ? e.status : 0, message: e instanceof Error ? e.message : "Something went wrong" } }; }
};

export const errorMessage = (e: unknown, fallback = "Something went wrong"): string =>
  (e as Partial<QueryError> | undefined)?.message ?? (e instanceof Error ? e.message : fallback);

export type CatalogKind = "plans" | "devices" | "categories" | "hero" | "faqs";
const KIND_KEY = { plans: "plans", devices: "devices", categories: "categories", hero: "heroSlides", faqs: "faqs" } as const;
type Row = { id: string };

export interface AdminOrdersArg { status?: string; q?: string; page?: number; limit?: number }
export interface AdminOrdersResult { page: number; limit: number; total: number; counts: Partial<Record<OrderStatus, number>>; orders: AdminOrder[] }
export interface AdminProductsArg { q?: string; category?: string; status?: "all" | "visible" | "hidden"; page?: number; limit?: number }
export interface Page { q?: string; page?: number; limit?: number }

export const profileKeys = ["name", "phone", "email", "company", "address", "division", "taxId", "billingAddress", "billingDivision", "billingPostcode"] as const;
export type ProfilePatch = Partial<Pick<ApiUser, (typeof profileKeys)[number]>>;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Catalog", "AdminProducts", "Products", "Posts", "MyOrders", "AdminOrders", "Stats", "Customers", "Staff", "Roles", "Site", "Pages", "Coupons", "Messages"],
  // admin lists are cheap to refetch; keep them only while a screen uses them so the next visit is never stale
  keepUnusedDataFor: 60,
  endpoints: (b) => ({
    /* ---------------------------------------------------------- public */
    products: b.query<Paged<Device>, ProductsQuery>({
      query: (q) => ({ path: `/products${qs({ ...q })}`, auth: false }),
      providesTags: ["Products"],
    }),
    product: b.query<Device, string>({
      query: (id) => ({ path: `/products/${encodeURIComponent(id)}`, auth: false }),
      providesTags: ["Products"],
    }),
    posts: b.query<Paged<PostSummary>, { page?: number; limit?: number } | void>({
      query: (q) => ({ path: `/posts${qs({ ...(q ?? {}) })}`, auth: false }),
      providesTags: ["Posts"],
    }),
    post: b.query<PostFull, string>({
      query: (id) => ({ path: `/posts/${encodeURIComponent(id)}`, auth: false }),
      providesTags: ["Posts"],
    }),

    /* ------------------------------------------------------------ session */
    login: b.mutation<{ accessToken: string; user: ApiUser }, { identifier: string; password: string }>({
      query: (body) => ({ method: "POST", path: "/auth/login", body, auth: false }),
    }),
    register: b.mutation<{ accessToken: string; user: ApiUser }, { name: string; mobile: string; email: string; password: string; vehicleType?: string }>({
      query: (body) => ({ method: "POST", path: "/auth/register", body, auth: false }),
    }),
    me: b.query<ApiUser, void>({ query: () => ({ path: "/me" }) }),
    deleteAccount: b.mutation<void, void>({ query: () => ({ method: "DELETE", path: "/me" }) }),

    /* --------------------------------------------------------- account */
    myOrders: b.query<ApiOrder[], void>({
      query: () => ({ path: "/orders" }),
      providesTags: ["MyOrders"],
    }),
    myOrder: b.query<ApiOrder, string>({
      query: (id) => ({ path: `/orders/${encodeURIComponent(id)}` }),
      providesTags: (_r, _e, id) => [{ type: "MyOrders", id }],
    }),
    createOrder: b.mutation<ApiOrder, CreateOrderBody>({
      query: (body) => ({ method: "POST", path: "/orders", body }),
      // the new order is in "My orders" the moment it is placed; stock and the admin lists change too
      async onQueryStarted(_a, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(baseApi.util.updateQueryData("myOrders", undefined, (d) => { if (!d.some((o) => o.id === data.id)) d.unshift(data); }));
          dispatch(baseApi.util.invalidateTags(["Products", "AdminOrders", "Stats", "AdminProducts"]));
        } catch { /* the caller shows the error */ }
      },
    }),
    /** The Contact page form and the "Talk to our team" pop-up. */
    sendContact: b.mutation<{ ok: true }, ContactBody>({
      query: (body) => ({ method: "POST", path: "/contact", body, auth: false }),
    }),
    /** Price the cart and check a coupon (nothing is saved). */
    quoteOrder: b.mutation<Quote, { items: { id: string; qty: number }[]; coupon?: string }>({
      query: (body) => ({ method: "POST", path: "/orders/quote", body }),
    }),
    cancelOrder: b.mutation<ApiOrder, string>({
      query: (id) => ({ method: "POST", path: `/orders/${encodeURIComponent(id)}/cancel` }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const undo = dispatch(baseApi.util.updateQueryData("myOrders", undefined, (d) => { const o = d.find((x) => x.id === id); if (o) o.status = "cancelled"; }));
        try {
          const { data } = await queryFulfilled;
          dispatch(baseApi.util.updateQueryData("myOrders", undefined, (d) => { const i = d.findIndex((x) => x.id === id); if (i >= 0) d[i] = data; }));
          dispatch(baseApi.util.invalidateTags(["Products", "AdminOrders", "Stats", "AdminProducts"])); // stock is back on the shelf
        } catch { undo.undo(); }
      },
    }),
    updateProfile: b.mutation<ApiUser, ProfilePatch>({
      query: (body) => ({ method: "PATCH", path: "/me/profile", body }),
      async onQueryStarted(_a, { dispatch, queryFulfilled }) {
        try { applyUser(dispatch, (await queryFulfilled).data); } catch { /* the caller shows the error */ }
      },
    }),
    updateSettings: b.mutation<ApiUser, ApiSettings>({
      query: (body) => ({ method: "PUT", path: "/me/settings", body }),
    }),
    changePassword: b.mutation<void, { current: string; next: string }>({
      query: (body) => ({ method: "POST", path: "/me/password", body }),
    }),

    /* ----------------------------------------------------------- admin */
    adminCatalog: b.query<AdminCatalog, { slim?: boolean }>({
      query: ({ slim }) => ({ path: `/admin/catalog${slim ? "?slim=1" : ""}` }),
      providesTags: ["Catalog"],
    }),
    adminProducts: b.query<Paged<AdminDevice>, AdminProductsArg>({
      query: (q) => ({ path: `/admin/products${qs({ ...q })}` }),
      providesTags: ["AdminProducts"],
    }),
    adminStats: b.query<AdminStats, void>({ query: () => ({ path: "/admin/stats" }), providesTags: ["Stats"] }),
    adminOrders: b.query<AdminOrdersResult, AdminOrdersArg>({
      query: (q) => ({ path: `/admin/orders${qs({ ...q })}` }),
      providesTags: ["AdminOrders"],
    }),
    adminCustomers: b.query<{ page: number; limit: number; total: number; customers: AdminCustomer[] }, Page>({
      query: (q) => ({ path: `/admin/customers${qs({ ...q })}` }),
      providesTags: ["Customers"],
    }),
    setOrderStatus: b.mutation<ApiOrder, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({ method: "PATCH", path: `/admin/orders/${encodeURIComponent(id)}/status`, body: { status } }),
      async onQueryStarted({ id, status }, { dispatch, getState, queryFulfilled }) {
        const undo: { undo: () => void }[] = [];
        for (const arg of baseApi.util.selectCachedArgsForQuery(getState(), "adminOrders")) {
          undo.push(dispatch(baseApi.util.updateQueryData("adminOrders", arg, (d) => {
            const o = d.orders.find((x) => x.id === id);
            if (!o || o.status === status) return;
            d.counts[o.status] = Math.max(0, (d.counts[o.status] ?? 1) - 1);
            d.counts[status] = (d.counts[status] ?? 0) + 1;
            o.status = status;
            // a filtered list (e.g. "Received") no longer contains the order once it moves on
            if (arg.status && arg.status !== status) { d.orders = d.orders.filter((x) => x.id !== id); d.total = Math.max(0, d.total - 1); }
          })));
        }
        try { await queryFulfilled; dispatch(baseApi.util.invalidateTags(["AdminOrders", "Stats", "AdminProducts", "Products", "MyOrders"])); }
        catch { undo.forEach((u) => u.undo()); }
      },
    }),

    /** Create or update a package, product, category, hero slide or FAQ. The lists change before the server answers and roll back if it refuses. */
    saveCatalogItem: b.mutation<unknown, { kind: CatalogKind; id: string; body: object; isNew?: boolean }>({
      query: ({ kind, id, body }) => ({ method: "PUT", path: `/admin/catalog/${kind}/${id}`, body }),
      async onQueryStarted({ kind, id, body, isNew }, { dispatch, getState, queryFulfilled }) {
        const undo = patchCatalog(dispatch, getState, kind, (rows, total) => {
          const i = rows.findIndex((r) => r.id === id);
          if (i >= 0) { rows[i] = { ...rows[i], ...body, id } as Row; return total; }
          if (isNew !== false) { rows.unshift({ ...body, id } as Row); return total + 1; }
          return total;
        });
        try { await queryFulfilled; } catch { undo(); }
        finally { dispatch(baseApi.util.invalidateTags(["Catalog", "AdminProducts", "Products"])); }
      },
    }),
    deleteCatalogItem: b.mutation<void, { kind: CatalogKind; id: string }>({
      query: ({ kind, id }) => ({ method: "DELETE", path: `/admin/catalog/${kind}/${id}` }),
      async onQueryStarted({ kind, id }, { dispatch, getState, queryFulfilled }) {
        const undo = patchCatalog(dispatch, getState, kind, (rows, total) => {
          const i = rows.findIndex((r) => r.id === id);
          if (i < 0) return total;
          rows.splice(i, 1); return Math.max(0, total - 1);
        });
        try { await queryFulfilled; } catch { undo(); }
        finally { dispatch(baseApi.util.invalidateTags(["Catalog", "AdminProducts", "Products"])); }
      },
    }),

    /** One picture (JPEG/PNG/WebP, ≤ 3 MB); the result's `token` is what gets saved on the product or post. */
    uploadImage: b.mutation<{ token: string; id: string; mime: string; size: number }, { file: Blob; name: string }>({
      query: ({ file, name }) => { const body = new FormData(); body.append("file", file, name); return { method: "POST", path: "/admin/media", body }; },
    }),
    /** Delete an uploaded picture nobody uses (no-op if a product still uses it). */
    discardImage: b.mutation<void, string>({
      query: (token) => ({ method: "DELETE", path: `/admin/media/${token.replace(/^media:/, "")}` }),
    }),

    staff: b.query<StaffMember[], void>({ query: () => ({ path: "/admin/staff" }), providesTags: ["Staff"] }),
    addStaff: b.mutation<StaffMember, { email: string; roleId: string; name?: string; mobile?: string; password?: string }>({
      query: (body) => ({ method: "POST", path: "/admin/staff", body }),
      invalidatesTags: ["Staff", "Roles", "Customers"],
    }),
    updateStaff: b.mutation<StaffMember, { id: string; roleId?: string; disabled?: boolean }>({
      query: ({ id, ...body }) => ({ method: "PATCH", path: `/admin/staff/${id}`, body }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const undo = dispatch(baseApi.util.updateQueryData("staff", undefined, (d) => { const s = d.find((x) => x.id === id); if (s) Object.assign(s, patch); }));
        try { await queryFulfilled; dispatch(baseApi.util.invalidateTags(["Staff", "Roles"])); } catch { undo.undo(); }
      },
    }),
    removeStaff: b.mutation<void, string>({
      query: (id) => ({ method: "DELETE", path: `/admin/staff/${id}` }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const undo = dispatch(baseApi.util.updateQueryData("staff", undefined, (d) => d.filter((x) => x.id !== id)));
        try { await queryFulfilled; dispatch(baseApi.util.invalidateTags(["Staff", "Roles", "Customers"])); } catch { undo.undo(); }
      },
    }),
    setStaffPassword: b.mutation<void, { id: string; password: string }>({
      query: ({ id, password }) => ({ method: "POST", path: `/admin/staff/${id}/password`, body: { password } }),
    }),
    roles: b.query<{ permissions: { id: Permission; label: string }[]; roles: RoleRow[] }, void>({ query: () => ({ path: "/admin/roles" }), providesTags: ["Roles"] }),
    saveRole: b.mutation<unknown, { id: string; name: string; description?: string; permissions: Permission[] }>({
      query: ({ id, ...body }) => ({ method: "PUT", path: `/admin/roles/${id}`, body }),
      invalidatesTags: ["Roles", "Staff"],
    }),
    deleteRole: b.mutation<void, string>({
      query: (id) => ({ method: "DELETE", path: `/admin/roles/${id}` }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const undo = dispatch(baseApi.util.updateQueryData("roles", undefined, (d) => { d.roles = d.roles.filter((r) => r.id !== id); }));
        try { await queryFulfilled; dispatch(baseApi.util.invalidateTags(["Roles"])); } catch { undo.undo(); }
      },
    }),

    /** A spreadsheet (CSV text) — orders, customers or products; the optional range limits orders by date. */
    exportCsv: b.mutation<string, { kind: "orders" | "customers" | "products"; from?: string; to?: string }>({
      query: ({ kind, from, to }) => ({ path: `/admin/export/${kind}.csv${qs({ from, to })}`, text: true }),
    }),
    adminMessages: b.query<Paged<AdminMessage> & { counts: Partial<Record<"new" | "handled", number>> }, { status?: "all" | "new" | "handled"; page?: number; limit?: number }>({
      query: (q) => ({ path: `/admin/messages${qs({ ...q })}` }),
      providesTags: ["Messages"],
    }),
    unreadMessages: b.query<{ new: number }, void>({ query: () => ({ path: "/admin/messages/unread" }), providesTags: ["Messages"] }),
    setMessageStatus: b.mutation<AdminMessage, { id: string; status: "new" | "handled" }>({
      query: ({ id, status }) => ({ method: "PATCH", path: `/admin/messages/${id}`, body: { status } }),
      async onQueryStarted({ id, status }, { dispatch, getState, queryFulfilled }) {
        const undo: { undo: () => void }[] = [];
        for (const arg of baseApi.util.selectCachedArgsForQuery(getState(), "adminMessages")) {
          undo.push(dispatch(baseApi.util.updateQueryData("adminMessages", arg, (d) => {
            const m = d.items.find((x) => x.id === id);
            if (!m || m.status === status) return;
            d.counts[m.status] = Math.max(0, (d.counts[m.status] ?? 1) - 1); d.counts[status] = (d.counts[status] ?? 0) + 1;
            m.status = status;
            if (arg.status && arg.status !== "all" && arg.status !== status) { d.items = d.items.filter((x) => x.id !== id); d.total = Math.max(0, d.total - 1); }
          })));
        }
        undo.push(dispatch(baseApi.util.updateQueryData("unreadMessages", undefined, (d) => { d.new = Math.max(0, d.new + (status === "handled" ? -1 : 1)); })));
        try { await queryFulfilled; } catch { undo.forEach((u) => u.undo()); }
        finally { dispatch(baseApi.util.invalidateTags(["Messages"])); }
      },
    }),
    deleteMessage: b.mutation<void, string>({
      query: (id) => ({ method: "DELETE", path: `/admin/messages/${id}` }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const undo: { undo: () => void }[] = [];
        for (const arg of baseApi.util.selectCachedArgsForQuery(getState(), "adminMessages")) {
          undo.push(dispatch(baseApi.util.updateQueryData("adminMessages", arg, (d) => { const n = d.items.length; d.items = d.items.filter((m) => m.id !== id); d.total = Math.max(0, d.total - (n - d.items.length)); })));
        }
        try { await queryFulfilled; } catch { undo.forEach((u) => u.undo()); }
        finally { dispatch(baseApi.util.invalidateTags(["Messages"])); }
      },
    }),
    adminCoupons: b.query<AdminCoupon[], void>({ query: () => ({ path: "/admin/coupons" }), providesTags: ["Coupons"] }),
    saveCoupon: b.mutation<AdminCoupon, { code: string; body: { kind: "percent" | "fixed"; value: number; minTotal?: number; maxUses?: number | null; expiresAt?: string | null; active: boolean; note?: string } }>({
      query: ({ code, body }) => ({ method: "PUT", path: `/admin/coupons/${encodeURIComponent(code)}`, body }),
      async onQueryStarted({ code, body }, { dispatch, queryFulfilled }) {
        // the switch flips at once; a failed save puts it back
        const undo = dispatch(baseApi.util.updateQueryData("adminCoupons", undefined, (d) => { const c = d.find((x) => x.code === code); if (c) Object.assign(c, body); }));
        try { await queryFulfilled; } catch { undo.undo(); }
        finally { dispatch(baseApi.util.invalidateTags(["Coupons"])); }
      },
    }),
    deleteCoupon: b.mutation<void, string>({
      query: (code) => ({ method: "DELETE", path: `/admin/coupons/${encodeURIComponent(code)}` }),
      async onQueryStarted(code, { dispatch, queryFulfilled }) {
        const undo = dispatch(baseApi.util.updateQueryData("adminCoupons", undefined, (d) => d.filter((c) => c.code !== code)));
        try { await queryFulfilled; dispatch(baseApi.util.invalidateTags(["Coupons"])); } catch { undo.undo(); }
      },
    }),
    adminSite: b.query<SiteDetails, void>({ query: () => ({ path: "/admin/site" }), providesTags: ["Site"] }),
    saveSite: b.mutation<SiteDetails, SiteDetails>({
      query: (body) => ({ method: "PUT", path: "/admin/site", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const undo = dispatch(baseApi.util.updateQueryData("adminSite", undefined, () => body));
        try { await queryFulfilled; } catch { undo.undo(); }
        finally { dispatch(baseApi.util.invalidateTags(["Site"])); }
      },
    }),
    adminPages: b.query<AdminPageRow[], void>({ query: () => ({ path: "/admin/pages" }), providesTags: ["Pages"] }),
    adminPage: b.query<AdminPageFull, string>({ query: (id) => ({ path: `/admin/pages/${id}` }), providesTags: ["Pages"] }),
    savePage: b.mutation<AdminPageFull, { id: string; body: { title: string; content: string; published: boolean; sort?: number } }>({
      query: ({ id, body }) => ({ method: "PUT", path: `/admin/pages/${id}`, body }),
      invalidatesTags: ["Pages"],
    }),
    deletePage: b.mutation<void, string>({
      query: (id) => ({ method: "DELETE", path: `/admin/pages/${id}` }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const undo = dispatch(baseApi.util.updateQueryData("adminPages", undefined, (d) => d.filter((p) => p.id !== id)));
        try { await queryFulfilled; dispatch(baseApi.util.invalidateTags(["Pages"])); } catch { undo.undo(); }
      },
    }),

    adminPosts: b.query<Paged<AdminPost>, { q?: string; status?: "all" | "published" | "draft"; page?: number; limit?: number }>({
      query: (q) => ({ path: `/admin/posts${qs({ ...q })}` }),
      providesTags: ["Posts"],
    }),
    adminPost: b.query<AdminPost, string>({ query: (id) => ({ path: `/admin/posts/${id}` }), providesTags: ["Posts"] }),
    savePost: b.mutation<AdminPost, { id: string; body: object }>({
      query: ({ id, body }) => ({ method: "PUT", path: `/admin/posts/${id}`, body }),
      invalidatesTags: ["Posts"],
    }),
    deletePost: b.mutation<void, string>({
      query: (id) => ({ method: "DELETE", path: `/admin/posts/${id}` }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const undo: { undo: () => void }[] = [];
        for (const arg of baseApi.util.selectCachedArgsForQuery(getState(), "adminPosts")) {
          undo.push(dispatch(baseApi.util.updateQueryData("adminPosts", arg, (d) => {
            const n = d.items.length; d.items = d.items.filter((p) => p.id !== id); d.total = Math.max(0, d.total - (n - d.items.length));
          })));
        }
        try { await queryFulfilled; dispatch(baseApi.util.invalidateTags(["Posts"])); } catch { undo.forEach((u) => u.undo()); }
      },
    }),
  }),
});

/** Apply `edit` to the list for `kind` in every cached catalog / product page; returns a function that puts them all back. */
function patchCatalog(
  dispatch: (a: unknown) => unknown,
  getState: () => unknown,
  kind: CatalogKind,
  edit: (rows: Row[], total: number) => number,
): () => void {
  const undo: { undo: () => void }[] = [];
  const d = dispatch as (a: unknown) => { undo: () => void };
  for (const arg of baseApi.util.selectCachedArgsForQuery(getState() as never, "adminCatalog")) {
    undo.push(d(baseApi.util.updateQueryData("adminCatalog", arg, (c) => {
      const rows = c[KIND_KEY[kind]] as Row[];
      // the slim catalog leaves products out (they are paged separately)
      if (kind === "devices" && arg.slim) return;
      edit(rows, rows.length);
    })));
  }
  if (kind === "devices") {
    for (const arg of baseApi.util.selectCachedArgsForQuery(getState() as never, "adminProducts")) {
      undo.push(d(baseApi.util.updateQueryData("adminProducts", arg, (p) => {
        const rows = p.items as unknown as Row[];
        // a new product only belongs on the first page, and only when no filter hides it
        const unfiltered = !arg.q && !arg.category && (!arg.status || arg.status === "all");
        const before = rows.length;
        p.total = edit(rows, p.total);
        if (rows.length > before && !(unfiltered && (arg.page ?? 1) === 1)) { rows.shift(); }
        if (rows.length > p.limit) rows.length = p.limit;
      })));
    }
  }
  return () => undo.forEach((u) => u.undo());
}

/** Make `u` the signed-in user (also used right after log-in). */
export function applyUser(dispatch: (a: unknown) => unknown, u: ApiUser) {
  dispatch(loginSuccess({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, vehicleType: u.vehicleType, staffRoleId: u.staffRoleId, permissions: u.permissions ?? [] }));
  dispatch(hydrateAccount(u));
}

export const {
  useProductsQuery, useProductQuery, usePostsQuery, usePostQuery,
  useLoginMutation, useRegisterMutation, useMeQuery, useDeleteAccountMutation, useUploadImageMutation, useDiscardImageMutation,
  useMyOrdersQuery, useMyOrderQuery, useCreateOrderMutation, useCancelOrderMutation, useUpdateProfileMutation, useUpdateSettingsMutation, useChangePasswordMutation,
  useAdminCatalogQuery, useAdminProductsQuery, useAdminStatsQuery, useAdminOrdersQuery, useAdminCustomersQuery, useSetOrderStatusMutation,
  useSaveCatalogItemMutation, useDeleteCatalogItemMutation,
  useStaffQuery, useAddStaffMutation, useUpdateStaffMutation, useRemoveStaffMutation, useSetStaffPasswordMutation,
  useRolesQuery, useSaveRoleMutation, useDeleteRoleMutation,
  useSendContactMutation, useAdminMessagesQuery, useUnreadMessagesQuery, useSetMessageStatusMutation, useDeleteMessageMutation,
  useQuoteOrderMutation, useExportCsvMutation, useAdminCouponsQuery, useSaveCouponMutation, useDeleteCouponMutation,
  useAdminSiteQuery, useSaveSiteMutation, useAdminPagesQuery, useAdminPageQuery, useSavePageMutation, useDeletePageMutation,
  useAdminPostsQuery, useAdminPostQuery, useSavePostMutation, useDeletePostMutation,
} = baseApi;
