// End-to-end smoke test against a running API + seeded database.
//   API=http://localhost:4000/api/v1 ADMIN_EMAIL=... ADMIN_PASSWORD=... node test/smoke.mjs
// Start the server with TRUST_PROXY=1 so each simulated client (X-Forwarded-For) gets its own rate-limit bucket.
const API = process.env.API ?? "http://localhost:4000/api/v1";
const ADMIN = { identifier: process.env.ADMIN_EMAIL ?? "admin@safetygps.local", password: process.env.ADMIN_PASSWORD ?? "AdminPass123" };
let n = 0, failed = 0, ip = 10;
const ok = (cond, name, extra = "") => { n++; if (!cond) { failed++; console.log(`  ✗ ${name} ${extra}`); } else console.log(`  ✓ ${name}`); };

async function call(method, path, { token, body, headers = {}, client } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: { "content-type": "application/json", "x-forwarded-for": client ?? `10.0.0.${ip++}`, ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null; try { json = await res.json(); } catch { /* empty body */ }
  return { status: res.status, json, headers: res.headers };
}

const stamp = Date.now().toString(36);
const phone = () => "017" + String(Math.floor(Math.random() * 1e8)).padStart(8, "0");
const A = { name: "Rahim Uddin", mobile: phone(), email: `a.${stamp}@example.com`, password: "Passw0rdA1", vehicleType: "Private Car" };
const B = { name: "Karim Ali", mobile: phone(), email: `b.${stamp}@example.com`, password: "Passw0rdB2" };
const order = (items, over = {}) => ({
  items, payment: "bKash", name: "Rahim Uddin", phone: A.mobile, email: A.email, address: "House 12, Road 5, Dhanmondi", division: "Dhaka",
  vehicleReg: "Dhaka Metro Ga 12-3456", vehicleType: "Private car", preferredDate: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10), ...over,
});

console.log("health & catalogue");
let r = await call("GET", "/health"); ok(r.status === 200 && r.json.db === "up", "health is up");
r = await call("GET", "/catalog"); ok(r.status === 200 && r.json.plans.length > 0 && r.json.devices.length > 0 && r.json.faqs.length > 0, "public catalogue loads without login");
const relay = r.json.devices.find((d) => d.id === "engine-lock-relay"); ok(relay && !("price" in relay), "unpriced device has no price field");
const plan = r.json.plans.find((p) => p.id === "gps-1");

console.log("registration & login");
r = await call("POST", "/auth/register", { body: A }); ok(r.status === 201 && r.json.accessToken && r.json.user.email === A.email, "register works");
ok(!JSON.stringify(r.json).includes("passwordHash") && !JSON.stringify(r.json).includes("$2"), "password hash never returned");
const tokA = r.json.accessToken;
r = await call("POST", "/auth/register", { body: A }); ok(r.status === 409, "duplicate email/mobile → 409");
r = await call("POST", "/auth/register", { body: { ...B, password: "short" } }); ok(r.status === 400, "weak password → 400");
r = await call("POST", "/auth/register", { body: { ...B, mobile: "12345" } }); ok(r.status === 400, "invalid mobile → 400");
r = await call("POST", "/auth/register", { body: { ...B, role: "admin" } }); ok(r.status === 400, "cannot self-assign a role (unknown field rejected)");
r = await call("POST", "/auth/register", { body: B }); ok(r.status === 201, "second customer registers"); const tokB = r.json.accessToken;
r = await call("POST", "/auth/login", { body: { identifier: A.email.toUpperCase(), password: A.password } }); ok(r.status === 200, "login by email (case-insensitive)");
r = await call("POST", "/auth/login", { body: { identifier: "+88" + A.mobile, password: A.password } }); ok(r.status === 200, "login by +88 mobile");
const bad1 = await call("POST", "/auth/login", { body: { identifier: A.email, password: "Wrong1234" } });
const bad2 = await call("POST", "/auth/login", { body: { identifier: "nobody@example.com", password: "Wrong1234" } });
ok(bad1.status === 401 && bad2.status === 401 && bad1.json.message === bad2.json.message, "wrong password and unknown user give the same 401 message");

console.log("authentication");
r = await call("GET", "/me"); ok(r.status === 401, "/me without token → 401");
r = await call("GET", "/me", { token: tokA + "x" }); ok(r.status === 401, "tampered token → 401");
const [h, p] = tokA.split("."); const forged = `${h}.${Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(p, "base64url")), role: "admin" })).toString("base64url")}.${tokA.split(".")[2]}`;
r = await call("GET", "/admin/orders", { token: forged }); ok(r.status === 401, "token with edited role claim → 401");
const none = `${Buffer.from('{"alg":"none","typ":"JWT"}').toString("base64url")}.${p}.`;
r = await call("GET", "/me", { token: none }); ok(r.status === 401, 'unsigned "alg: none" token → 401');
r = await call("GET", "/me", { token: tokA }); ok(r.status === 200 && r.json.email === A.email && r.json.settings.speedLimit === 80, "/me returns profile with default settings");

console.log("profile & settings");
r = await call("PATCH", "/me/profile", { token: tokA, body: { company: "Rahim Transport", address: "House 12, Road 5", division: "Chattogram" } }); ok(r.status === 200 && r.json.company === "Rahim Transport" && r.json.division === "Chattogram", "profile update saved");
r = await call("PATCH", "/me/profile", { token: tokA, body: { email: B.email } }); ok(r.status === 409, "cannot take another account's email");
r = await call("PATCH", "/me/profile", { token: tokA, body: { role: "admin" } }); ok(r.status === 400, "cannot change role via profile");
const settings = { alerts: { ignition: false, geofence: true, speed: true, tamper: true, sos: true, documents: true, billing: false }, channels: { push: true, sms: false, email: true }, speedLimit: 100, language: "bn", units: "mi", twoFactor: true, marketing: true };
r = await call("PUT", "/me/settings", { token: tokA, body: settings }); ok(r.status === 200 && r.json.settings.speedLimit === 100 && r.json.settings.alerts.ignition === false, "settings saved");
r = await call("GET", "/me", { token: tokA }); ok(r.json.settings.language === "bn" && r.json.settings.channels.email === true, "settings persist across requests");
r = await call("PUT", "/me/settings", { token: tokA, body: { ...settings, speedLimit: 999 } }); ok(r.status === 400, "out-of-range speed limit → 400");
r = await call("POST", "/me/password", { token: tokA, body: { current: "nope12345", next: "NewPassw0rd9" } }); ok(r.status === 401, "password change needs the right current password");
r = await call("POST", "/me/password", { token: tokA, body: { current: A.password, next: "NewPassw0rd9" } }); ok(r.status === 204, "password changed");
r = await call("POST", "/auth/login", { body: { identifier: A.email, password: A.password } }); ok(r.status === 401, "old password no longer works");
r = await call("POST", "/auth/login", { body: { identifier: A.email, password: "NewPassw0rd9" } }); ok(r.status === 200, "new password works");

console.log("orders — server-side pricing");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "plan-gps-1", qty: 2 }, { id: "dev-bike-premium", qty: 1 }]) });
ok(r.status === 201 && /^SGT-[A-Z2-9]{6}$/.test(r.json.id), "order created with reference", JSON.stringify(r.json).slice(0, 200));
ok(r.json.deviceTotal === 4000 * 2 + 4000 && r.json.monthlyTotal === 400 * 2 + 300, "totals computed by the server from the catalogue", JSON.stringify([r.json.deviceTotal, r.json.monthlyTotal]));
const orderId = r.json.id;
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "plan-gps-1", qty: 1, price: 1 }]) }); ok(r.status === 400, "client-supplied price is rejected");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "plan-does-not-exist", qty: 1 }]) }); ok(r.status === 400, "unknown product → 400");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "dev-engine-lock-relay", qty: 1 }]) }); ok(r.status === 400, "device without a published price can't be ordered");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "plan-gps-1", qty: 51 }]) }); ok(r.status === 400, "quantity over 50 → 400");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "plan-gps-1", qty: 1 }], { preferredDate: "2020-01-01" }) }); ok(r.status === 400, "past installation date → 400");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "plan-gps-1", qty: 1 }], { payment: "Bitcoin" }) }); ok(r.status === 400, "unknown payment method → 400");
r = await call("POST", "/orders", { body: order([{ id: "plan-gps-1", qty: 1 }]) }); ok(r.status === 401, "ordering needs login");
r = await call("GET", "/orders", { token: tokA }); ok(r.status === 200 && r.json.length === 1 && r.json[0].items.length === 2 && r.json[0].contact.name === "Rahim Uddin", "order history returned in the website's shape");
r = await call("GET", "/orders", { token: tokB }); ok(r.status === 200 && r.json.length === 0, "other customers can't see my orders");
r = await call("POST", `/orders/${orderId}/cancel`, { token: tokB }); ok(r.status === 404, "other customers can't cancel my order");

console.log("admin");
r = await call("GET", "/admin/orders", { token: tokA }); ok(r.status === 403, "customer is forbidden from /admin");
r = await call("PUT", "/admin/catalog/plans/gps-1", { token: tokA, body: {} }); ok(r.status === 403, "customer can't edit the catalogue");
r = await call("POST", "/auth/login", { body: ADMIN }); ok(r.status === 200 && r.json.user.role === "admin", "admin logs in"); const tokAdmin = r.json.accessToken;
r = await call("GET", `/admin/orders?q=${orderId}`, { token: tokAdmin }); ok(r.status === 200 && r.json.total === 1 && r.json.orders[0].customer.email === A.email, "admin finds the order by reference");
r = await call("GET", "/admin/orders?status=received", { token: tokAdmin }); ok(r.status === 200 && r.json.counts.received >= 1, "admin status counts");
r = await call("PATCH", `/admin/orders/${orderId}/status`, { token: tokAdmin, body: { status: "confirmed" } }); ok(r.status === 200 && r.json.status === "confirmed", "admin confirms the order");
r = await call("PATCH", `/admin/orders/${orderId}/status`, { token: tokAdmin, body: { status: "shipped" } }); ok(r.status === 400, "invalid status → 400");
r = await call("GET", "/orders", { token: tokA }); ok(r.json[0].status === "confirmed", "customer sees the new status");
r = await call("POST", `/orders/${orderId}/cancel`, { token: tokA }); ok(r.status === 409, "confirmed orders can't be self-cancelled");

console.log("admin dashboard & customers");
r = await call("GET", "/admin/stats", { token: tokA }); ok(r.status === 403, "customer is forbidden from /admin/stats");
r = await call("GET", "/admin/customers", { token: tokA }); ok(r.status === 403, "customer is forbidden from /admin/customers");
r = await call("GET", "/admin/stats", { token: tokAdmin });
ok(r.status === 200 && r.json.daily.length === 14 && typeof r.json.revenue === "number" && r.json.orders.total >= 1, "admin stats: 14 days of data, totals present");
ok(r.json.orders.byStatus.confirmed >= 1, "stats count orders by status");
r = await call("GET", `/admin/customers?q=${encodeURIComponent(A.email.split("@")[0])}`, { token: tokAdmin }); ok(r.status === 200 && r.json.total === 1 && r.json.customers[0].orders === 1, "admin finds a customer and sees their order count");
r = await call("GET", "/admin/customers?q=%25", { token: tokAdmin }); ok(r.status === 200 && r.json.total === 0, "search treats % literally (no wildcard match-all)");
r = await call("GET", "/admin/customers?limit=1000", { token: tokAdmin }); ok(r.status === 400, "page size is capped");

console.log("categories & sub-categories");
const cat = async (id, body) => call("PUT", `/admin/catalog/categories/${id}`, { token: tokAdmin, body });
const dev = (over = {}) => ({ name: "Smoke Test Tracker", category: "Smoke Cat", subcategory: "Smoke Sub", visual: "tracker", summary: "Created by the smoke test.", specs: [], features: ["Live Tracking"], price: 1234, ...over });
r = await call("PUT", "/admin/catalog/categories/smoke-cat", { token: tokA, body: { name: "Smoke Cat" } }); ok(r.status === 403, "customer can't create categories");
r = await cat("smoke-cat", { name: "Smoke Cat" }); ok(r.status === 200 && r.json.parentId === null, "admin creates a category");
r = await cat("smoke-cat-two", { name: "smoke cat" }); ok(r.status === 409, "category names are unique (case-insensitive)");
r = await cat("smoke-cat-smoke-sub", { name: "Smoke Sub", parentId: "smoke-cat" }); ok(r.status === 200 && r.json.parentId === "smoke-cat", "admin creates a sub-category");
r = await cat("smoke-nested", { name: "Too Deep", parentId: "smoke-cat-smoke-sub" }); ok(r.status === 400, "sub-categories can't have sub-categories");
r = await cat("smoke-cat-nope", { name: "Orphan", parentId: "does-not-exist" }); ok(r.status === 400, "unknown parent → 400");
r = await cat("smoke-cat-smoke-sub", { name: "Smoke Sub", parentId: "gps-tracking-devices" }); ok(r.status === 400, "a sub-category can't be moved to another parent");
r = await call("PUT", "/admin/catalog/devices/smoke-test-tracker", { token: tokAdmin, body: dev({ category: "No Such Category" }) }); ok(r.status === 400, "product in a category that doesn't exist → 400");
r = await call("PUT", "/admin/catalog/devices/smoke-test-tracker", { token: tokAdmin, body: dev({ subcategory: "No Such Sub" }) }); ok(r.status === 400, "product in a sub-category that doesn't exist → 400");
r = await call("PUT", "/admin/catalog/devices/smoke-test-tracker", { token: tokAdmin, body: dev() }); ok(r.status === 200, "product created in the new category");
r = await call("GET", "/catalog"); ok(r.json.categories.some((c) => c.id === "smoke-cat") && r.json.devices.some((d) => d.id === "smoke-test-tracker"), "public catalogue lists the category and the product");
r = await cat("smoke-cat", { name: "Smoke Cat Renamed" }); ok(r.status === 200, "category renamed");
r = await call("GET", "/catalog"); ok(r.json.devices.find((d) => d.id === "smoke-test-tracker")?.category === "Smoke Cat Renamed", "renaming a category renames it on its products");
r = await cat("smoke-cat-smoke-sub", { name: "Smoke Sub Renamed", parentId: "smoke-cat" }); ok(r.status === 200, "sub-category renamed");
r = await call("GET", "/catalog"); ok(r.json.devices.find((d) => d.id === "smoke-test-tracker")?.subcategory === "Smoke Sub Renamed", "renaming a sub-category renames it on its products");
r = await call("DELETE", "/admin/catalog/categories/smoke-cat", { token: tokAdmin }); ok(r.status === 409, "can't delete a category that still has sub-categories");
r = await call("DELETE", "/admin/catalog/categories/smoke-cat-smoke-sub", { token: tokAdmin }); ok(r.status === 409, "can't delete a sub-category that still has products");
r = await cat("smoke-cat-smoke-sub", { name: "Smoke Sub Renamed", parentId: "smoke-cat", active: false }); ok(r.status === 200, "admin hides the sub-category");
r = await call("GET", "/catalog"); ok(!r.json.devices.some((d) => d.id === "smoke-test-tracker") && !r.json.categories.some((c) => c.id === "smoke-cat-smoke-sub"), "hiding a sub-category hides its products from the website");
r = await call("DELETE", "/admin/catalog/devices/smoke-test-tracker", { token: tokAdmin }); ok(r.status === 204, "product removed");
r = await call("DELETE", "/admin/catalog/categories/smoke-cat-smoke-sub", { token: tokAdmin }); ok(r.status === 204, "empty sub-category deleted");
r = await call("DELETE", "/admin/catalog/categories/smoke-cat", { token: tokAdmin }); ok(r.status === 204, "empty category deleted");

console.log("hero slides");
const slide = (over = {}) => ({ tab: "Smoke", badge: "Smoke badge", badgeIcon: "shield", titleMain: "Smoke Headline", titleHighlight: "Works", text: "Created by the smoke test.", bgImage: "/img/hero-car.jpg", accent: "brand", ctaLabel: "Go", ctaHref: "/products", telematics: { vehicle: "Test Car", plate: "Dhaka 00-0000", place: "Nowhere", speed: "0 km/h", ignition: "OFF", status: "Parked", route: "M10 40 H280", sensor: "None", fuel: "50%" }, sort: 99, ...over });
r = await call("PUT", "/admin/catalog/hero/smoke-slide", { token: tokA, body: slide() }); ok(r.status === 403, "customer can't edit hero slides");
r = await call("GET", "/catalog"); ok(r.json.heroSlides.length >= 3, "public catalogue includes the seeded hero slides");
r = await call("PUT", "/admin/catalog/hero/smoke-slide", { token: tokAdmin, body: slide() }); ok(r.status === 200, "admin creates a slide");
r = await call("PUT", "/admin/catalog/hero/smoke-bad1", { token: tokAdmin, body: slide({ ctaHref: "javascript:alert(1)" }) }); ok(r.status === 400, "javascript: link rejected");
r = await call("PUT", "/admin/catalog/hero/smoke-bad2", { token: tokAdmin, body: slide({ ctaHref: "//evil.example/x" }) }); ok(r.status === 400, "protocol-relative link (//host) rejected");
r = await call("PUT", "/admin/catalog/hero/smoke-bad3", { token: tokAdmin, body: slide({ bgImage: "https://evil.example/x.jpg" }) }); ok(r.status === 400, "remote background image rejected (must be a /public file)");
r = await call("PUT", "/admin/catalog/hero/smoke-bad4", { token: tokAdmin, body: slide({ bgImage: "/../../etc/passwd" }) }); ok(r.status === 400, "path traversal (..) in the image path rejected");
r = await call("PUT", "/admin/catalog/hero/smoke-bad5", { token: tokAdmin, body: slide({ badgeIcon: "skull" }) }); ok(r.status === 400, "unknown icon rejected");
r = await call("PUT", "/admin/catalog/hero/smoke-bad6", { token: tokAdmin, body: slide({ telematics: { ...slide().telematics, route: "M0 0 <script>" } }) }); ok(r.status === 400, "non-SVG route rejected");
r = await call("PUT", "/admin/catalog/hero/smoke-slide", { token: tokAdmin, body: slide({ ctaHref: "https://example.com/offer" }) }); ok(r.status === 200, "https link accepted");
r = await call("GET", "/catalog"); ok(r.json.heroSlides.some((h) => h.id === "smoke-slide" && h.ctaHref === "https://example.com/offer"), "new slide is public");
r = await call("PUT", "/admin/catalog/hero/smoke-slide", { token: tokAdmin, body: slide({ active: false }) }); ok(r.status === 200, "admin hides the slide");
r = await call("GET", "/catalog"); ok(!r.json.heroSlides.some((h) => h.id === "smoke-slide"), "hidden slide disappears from the website");
r = await call("PUT", "/admin/catalog/hero/smoke-bad7", { token: tokAdmin, body: slide({ ctaHref: "/\\evil.example" }) }); ok(r.status === 400, "backslash trick in link rejected");
r = await call("DELETE", "/admin/catalog/hero/smoke-slide", { token: tokAdmin }); ok(r.status === 204, "slide deleted");

console.log("product pictures");
const rich = (await call("GET", "/admin/catalog", { token: tokAdmin })).json.devices.find((d) => d.id === "bike-premium");
const { id: _i, createdAt: _c, updatedAt: _u, ...keep } = rich;
r = await call("PUT", "/admin/catalog/devices/bike-premium", { token: tokAdmin, body: { ...keep, image: "https://evil.example/x.png" } }); ok(r.status === 400, "remote product image rejected (must be a /public file)");
r = await call("PUT", "/admin/catalog/devices/bike-premium", { token: tokAdmin, body: { ...keep, image: "/img/../../secret.png" } }); ok(r.status === 400, "path traversal in product image rejected");
r = await call("PUT", "/admin/catalog/devices/bike-premium", { token: tokAdmin, body: { ...keep, summary: rich.summary + " " } }); ok(r.status === 200 && r.json.image === rich.image && rich.image, "saving a product with its image field keeps the picture");
await call("PUT", "/admin/catalog/devices/bike-premium", { token: tokAdmin, body: { ...keep } });

console.log("image upload");
const png = (tag) => Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.from(`IHDR-${tag}-${stamp}-padding-bytes-0123456789`)]);
const upload = async (buf, { name = "x.png", type = "image/png", token = tokAdmin } = {}) => {
  const fd = new FormData(); fd.append("file", new Blob([buf], { type }), name);
  const res = await fetch(API + "/admin/media", { method: "POST", headers: { "x-forwarded-for": `10.1.0.${ip++}`, ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: fd });
  return { status: res.status, json: await res.json().catch(() => null) };
};
const media = (token, headers = {}) => fetch(`${API}/media/${token.slice(6)}`, { headers });
let up = await upload(png("a"), { token: tokA }); ok(up.status === 403, "customer can't upload");
up = await upload(png("a"), { token: null }); ok(up.status === 401, "anonymous can't upload");
const a1 = await upload(png("a")); ok(a1.status === 201 && /^media:[0-9a-f-]{36}$/.test(a1.json.token) && a1.json.mime === "image/png", "admin uploads a PNG and gets a token");
const a2 = await upload(png("a")); ok(a2.json.token === a1.json.token, "the same picture uploaded twice is stored once");
const b1 = await upload(png("b")); ok(b1.status === 201 && b1.json.token !== a1.json.token, "a different picture gets its own token");
const jpg = await upload(Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.from(`JFIF-${stamp}-padding-bytes`)]), { name: "p.jpg", type: "image/jpeg" }); ok(jpg.status === 201 && jpg.json.mime === "image/jpeg", "JPEG accepted");
const webp = await upload(Buffer.concat([Buffer.from("RIFF"), Buffer.from([1, 2, 3, 4]), Buffer.from(`WEBPVP8 ${stamp}-padding`)]), { name: "p.webp", type: "image/webp" }); ok(webp.status === 201 && webp.json.mime === "image/webp", "WebP accepted");
up = await upload(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'), { name: "x.svg", type: "image/svg+xml" }); ok(up.status === 400, "SVG is refused (can carry scripts)");
up = await upload(Buffer.from("this is not a picture, just text pretending to be one"), { name: "fake.png", type: "image/png" }); ok(up.status === 400, "a text file named .png is refused (real type is checked)");
up = await upload(Buffer.alloc(0)); ok(up.status === 400, "empty upload refused");
up = await upload(Buffer.concat([png("big"), Buffer.alloc(3 * 1024 * 1024)])); ok(up.status === 400 || up.status === 413, "file over 3 MB refused");
let m = await media(a1.json.token);
ok(m.status === 200 && m.headers.get("content-type") === "image/png" && /immutable/.test(m.headers.get("cache-control")) && m.headers.get("x-content-type-options") === "nosniff", "served with the right type, long cache and nosniff");
ok(m.headers.get("cross-origin-resource-policy") === "cross-origin", "can be embedded by the website (cross-origin resource policy)");
const etag = m.headers.get("etag"); m = await media(a1.json.token, { "if-none-match": etag }); ok(m.status === 304, "unchanged picture answers 304 to If-None-Match");
m = await fetch(`${API}/media/not-a-uuid`); ok(m.status === 400, "malformed id → 400");
m = await fetch(`${API}/media/00000000-0000-4000-8000-000000000000`); ok(m.status === 404, "unknown id → 404");

const lone = await upload(png("lone")); r = await call("DELETE", `/admin/media/${lone.json.id}`, { token: tokA }); ok(r.status === 403, "customer can't discard pictures");
r = await call("DELETE", `/admin/media/${lone.json.id}`, { token: tokAdmin }); ok(r.status === 204 && (await media(lone.json.token)).status === 404, "an unattached upload can be discarded");

console.log("multiple product images");
const prod = (images, over = {}) => ({ name: "Smoke Gallery Tracker", category: "GPS Tracking Devices", subcategory: "Car Trackers", visual: "tracker", summary: "Gallery test.", specs: [], features: [], price: 999, images, ...over });
r = await call("PUT", "/admin/catalog/devices/smoke-gallery", { token: tokAdmin, body: prod([a1.json.token, b1.json.token, "/img/hero-car.jpg"]) });
ok(r.status === 200 && r.json.image === a1.json.token && r.json.images.length === 3, "product saved with three pictures; main = first");
r = await call("GET", "/catalog"); let g = r.json.devices.find((d) => d.id === "smoke-gallery");
ok(g.images.length === 3 && g.image === g.images[0] && g.images[0].startsWith("http") && g.images[0].endsWith(`/api/v1/media/${a1.json.token.slice(6)}`) && g.images[2] === "/img/hero-car.jpg", "public catalogue returns absolute URLs for uploads and local paths unchanged");
r = await call("PUT", "/admin/catalog/devices/smoke-gallery", { token: tokAdmin, body: prod([b1.json.token, a1.json.token, "/img/hero-car.jpg"]) });
ok(r.status === 200 && r.json.image === b1.json.token, "reordering changes the main picture");
r = await call("PUT", "/admin/catalog/devices/smoke-gallery", { token: tokAdmin, body: prod(["https://evil.example/x.png"]) }); ok(r.status === 400, "remote picture URL rejected");
r = await call("PUT", "/admin/catalog/devices/smoke-gallery", { token: tokAdmin, body: prod(["/img/../../x.png"]) }); ok(r.status === 400, "path traversal in a picture rejected");
r = await call("PUT", "/admin/catalog/devices/smoke-gallery", { token: tokAdmin, body: prod(Array.from({ length: 11 }, (_, i) => `/img/p${i}.png`)) }); ok(r.status === 400, "more than 10 pictures rejected");
r = await call("PUT", "/admin/catalog/devices/smoke-gallery", { token: tokAdmin, body: prod([a1.json.token, "/img/hero-car.jpg"]) });
ok(r.status === 200, "a picture is removed from the gallery");
ok((await media(b1.json.token)).status === 404 && (await media(a1.json.token)).status === 200, "the removed upload is deleted; the kept one is still served");
r = await call("DELETE", `/admin/media/${a1.json.id}`, { token: tokAdmin }); ok(r.status === 204 && (await media(a1.json.token)).status === 200, "discarding a picture that a product uses does nothing");
r = await call("PUT", "/admin/catalog/devices/smoke-gallery-2", { token: tokAdmin, body: prod([a1.json.token], { name: "Second" }) }); ok(r.status === 200, "a second product shares the same picture");
r = await call("PUT", "/admin/catalog/devices/smoke-gallery", { token: tokAdmin, body: prod(["/img/hero-car.jpg"]) }); ok(r.status === 200 && (await media(a1.json.token)).status === 200, "a shared picture survives when only one product drops it");
r = await call("DELETE", "/admin/catalog/devices/smoke-gallery-2", { token: tokAdmin }); ok(r.status === 204 && (await media(a1.json.token)).status === 404, "deleting the last product using a picture deletes the picture");
r = await call("DELETE", "/admin/catalog/devices/smoke-gallery", { token: tokAdmin }); ok(r.status === 204, "gallery test product removed");
for (const t of [jpg.json.token, webp.json.token]) void t;

console.log("backend pagination — shop");
const list = async (qs) => (await call("GET", `/products${qs}`)).json;
r = await call("GET", "/products?limit=4&page=1"); const p1 = r.json;
ok(r.status === 200 && p1.items.length === 4 && p1.total >= 10 && p1.pages === Math.ceil(p1.total / 4) && p1.page === 1 && p1.limit === 4, "page 1: 4 items with total and page count");
const p2 = await list("?limit=4&page=2"); ok(p2.items.length === 4 && !p2.items.some((i) => p1.items.some((j) => j.id === i.id)), "page 2 has different items");
const pLast = await list(`?limit=4&page=${p1.pages}`); ok(pLast.items.length === p1.total - 4 * (p1.pages - 1), "last page holds the remainder");
const pBeyond = await list("?limit=4&page=99"); ok(pBeyond.items.length === 0 && pBeyond.total === p1.total, "a page beyond the end is empty but reports the total");
for (const [qs, name] of [["?limit=49", "limit above 48"], ["?page=0", "page 0"], ["?sort=cheapest", "unknown sort"], ["?maxPrice=-5", "negative price"], ["?foo=1", "unknown parameter"]]) { r = await call("GET", `/products${qs}`); ok(r.status === 400, `${name} → 400`); }
const hw = await list("?category=" + encodeURIComponent("Vehicle GPS Hardware")); ok(hw.total === 3 && hw.items.every((i) => i.category === "Vehicle GPS Hardware"), "category filter");
const sub = await list("?category=" + encodeURIComponent("GPS Tracking Devices") + "&sub=" + encodeURIComponent("Heavy Vehicle Trackers")); ok(sub.total === 2 && sub.items.every((i) => i.subcategory === "Heavy Vehicle Trackers"), "sub-category filter");
const bike = await list("?q=bike"); ok(bike.items.some((i) => i.id === "bike-premium"), "search by name");
ok((await list("?q=%25")).total === 0, "search treats % literally");
const cheap = await list("?maxPrice=4000&limit=48"); ok(cheap.items.length > 0 && cheap.items.every((i) => i.price === undefined || i.price <= 4000), "max price filter (unpriced items stay)");
const priced = await list("?priced=1&limit=48"); ok(priced.items.length > 0 && priced.items.every((i) => i.price !== undefined), "“price listed” filter");
const onRequest = await list("?call=1&limit=48"); ok(onRequest.items.length > 0 && onRequest.items.every((i) => i.price === undefined), "“call for price” filter");
const both = await list("?priced=1&call=1&limit=48"); ok(both.total === p1.total, "both availability filters = everything");
const asc = await list("?sort=price-asc&limit=48").then((x) => x.items.map((i) => i.price)); const firstNull = asc.findIndex((x) => x === undefined);
ok(asc.slice(0, firstNull < 0 ? asc.length : firstNull).every((x, i, a) => i === 0 || a[i - 1] <= x) && (firstNull < 0 || asc.slice(firstNull).every((x) => x === undefined)), "price ascending, unpriced last");
const desc = await list("?sort=price-desc&limit=48").then((x) => x.items.map((i) => i.price)); ok(desc[0] === Math.max(...desc.filter((x) => x !== undefined)), "price descending starts with the dearest");
const byName = await list("?sort=name&limit=48").then((x) => x.items.map((i) => i.name));
ok(byName.length === p1.total && (JSON.stringify(byName) === JSON.stringify([...byName].sort((x, y) => x.localeCompare(y))) || JSON.stringify(byName) === JSON.stringify([...byName].sort())), "name sort (A→Z)");
const ids = await list("?ids=bike-premium,easy-obd,no-such-id"); ok(ids.total === 2 && ids.items.every((i) => ["bike-premium", "easy-obd"].includes(i.id)), "wishlist ids filter");
ok((await list("?ids=")).total === 0, "empty wishlist → no products");
ok(!("sort" in p1.items[0]) && !("active" in p1.items[0]) && !("createdAt" in p1.items[0]) && Array.isArray(p1.items[0].images) && p1.items[0].images.length >= 1 && p1.items[0].image === p1.items[0].images[0], "items use the public shape (no admin fields, images list present)");

console.log("backend pagination — admin");
r = await call("GET", "/admin/products", { token: tokA }); ok(r.status === 403, "customer can't use /admin/products");
r = await call("GET", "/admin/products?limit=3&page=2", { token: tokAdmin }); ok(r.status === 200 && r.json.items.length === 3 && r.json.total >= 10 && "active" in r.json.items[0], "admin page 2 of 3 per page, with hidden/visible flag");
r = await call("GET", "/admin/products?q=bike", { token: tokAdmin }); ok(r.json.items.some((i) => i.id === "bike-premium"), "admin search");
r = await call("GET", "/admin/products?limit=101", { token: tokAdmin }); ok(r.status === 400, "admin page size capped at 100");
r = await call("GET", "/admin/catalog?slim=1", { token: tokAdmin }); ok(r.status === 200 && r.json.devices.length === 0 && r.json.plans.length > 0 && r.json.categories.length > 0, "slim catalogue leaves products out but keeps plans and categories");

console.log("admin catalogue edits reach customers");
const full = (({ id, createdAt, updatedAt, ...rest }) => rest)((await call("GET", "/admin/catalog", { token: tokAdmin })).json.plans.find((x) => x.id === "gps-1"));
r = await call("PUT", "/admin/catalog/plans/gps-1", { token: tokAdmin, body: { ...full, devicePrice: 4500 } }); ok(r.status === 200 && r.json.devicePrice === 4500, "admin changes a plan price");
r = await call("GET", "/catalog"); ok(r.json.plans.find((x) => x.id === "gps-1").devicePrice === 4500, "public catalogue shows the new price");
r = await call("POST", "/orders", { token: tokB, body: order([{ id: "plan-gps-1", qty: 1 }], { phone: B.mobile, email: B.email }) }); ok(r.status === 201 && r.json.deviceTotal === 4500, "new orders use the new price");
const orderB = r.json.id;
r = await call("PUT", "/admin/catalog/plans/gps-1", { token: tokAdmin, body: { ...full, active: false } }); ok(r.status === 200, "admin hides a plan");
r = await call("GET", "/catalog"); ok(!r.json.plans.some((x) => x.id === "gps-1"), "hidden plan disappears from the website");
r = await call("POST", "/orders", { token: tokB, body: order([{ id: "plan-gps-1", qty: 1 }]) }); ok(r.status === 400, "hidden plan can't be ordered");
await call("PUT", "/admin/catalog/plans/gps-1", { token: tokAdmin, body: { ...full } });
r = await call("POST", `/orders/${orderB}/cancel`, { token: tokB }); ok(r.status === 200 && r.json.status === "cancelled", "customer cancels an unconfirmed order");
r = await call("POST", `/orders/${orderB}/cancel`, { token: tokB }); ok(r.status === 409, "cancelling twice → 409");

console.log("transport security");
r = await call("GET", "/catalog", { headers: { origin: "https://evil.example" } }); ok(!r.headers.get("access-control-allow-origin"), "unknown origin gets no CORS header");
r = await call("GET", "/catalog", { headers: { origin: "http://localhost:3000" } }); ok(r.headers.get("access-control-allow-origin") === "http://localhost:3000", "allowed origin gets CORS header");
ok(!!r.headers.get("x-content-type-options") && !r.headers.get("x-powered-by"), "security headers set, x-powered-by removed");
const burstIp = `203.0.113.${Math.floor(Math.random() * 250) + 1}`; // one client for all attempts, a fresh one per run
const burst = []; for (let i = 0; i < 12; i++) burst.push((await call("POST", "/auth/login", { client: burstIp, body: { identifier: "x@example.com", password: "Whatever12" } })).status);
ok(burst.slice(0, 10).every((s) => s === 401) && burst.slice(10).every((s) => s === 429), "login is rate-limited after 10 tries/min", burst.join(","));


/* ===================================================================== staff, roles & permissions */
console.log("staff, roles & permissions");
const staffPw = "Passw0rd77";
const makeStaff = async (roleId, label) => {
  const email = `staff.${label}.${stamp}@example.com`;
  const add = await call("POST", "/admin/staff", { token: tokAdmin, body: { email, name: `Staff ${label}`, mobile: phone(), password: staffPw, roleId } });
  const lg = await call("POST", "/auth/login", { body: { identifier: email, password: staffPw } });
  return { add, id: add.json?.id, email, token: lg.json?.accessToken, user: lg.json?.user };
};
r = await call("GET", "/admin/staff", { token: tokA }); ok(r.status === 403, "customer can't list staff");
r = await call("GET", "/admin/roles", { token: tokAdmin }); ok(r.status === 200 && r.json.roles.length >= 6 && r.json.permissions.length === 7 && r.json.roles.find((x) => x.id === "owner").permissions.length === 7, "owner sees the 6 built-in roles and 7 permissions");
r = await call("GET", "/me", { token: tokAdmin }); ok(r.json.permissions.length === 7 && r.json.staffRoleId === "owner", "/me gives the owner every permission");
r = await call("GET", "/me", { token: tokA }); ok(Array.isArray(r.json.permissions) && r.json.permissions.length === 0, "/me gives a customer no permissions");
const sales = await makeStaff("sales", "sales"), support = await makeStaff("support", "support"), content = await makeStaff("content", "content"), inventory = await makeStaff("inventory", "inventory");
ok([sales, support, content, inventory].every((x) => x.add.status === 201 && x.token), "owner adds four staff accounts (sales, support, content, inventory)");
ok(sales.user.permissions.sort().join() === ["customers.view", "orders.manage", "orders.view"].join(), "a staff login carries exactly the role's permissions");
r = await call("POST", "/admin/staff", { token: tokAdmin, body: { email: sales.email, roleId: "sales" } }); ok(r.status === 409, "adding someone who is already staff → 409");
r = await call("POST", "/admin/staff", { token: tokAdmin, body: { email: `nobody.${stamp}@example.com`, roleId: "sales" } }); ok(r.status === 400, "a new person needs a name, mobile and password");
r = await call("POST", "/admin/staff", { token: tokAdmin, body: { email: `x.${stamp}@example.com`, name: "X Y", mobile: phone(), password: staffPw, roleId: "no-such-role" } }); ok(r.status === 400, "unknown role → 400");

// a placed order for the staff to work with
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "plan-gps-1", qty: 1 }]) }); const staffOrder = r.json.id;
r = await call("GET", "/admin/orders", { token: sales.token }); ok(r.status === 200, "sales can see orders");
r = await call("PATCH", `/admin/orders/${staffOrder}/status`, { token: sales.token, body: { status: "confirmed" } }); ok(r.status === 200, "sales can confirm an order");
r = await call("GET", "/admin/customers", { token: sales.token }); ok(r.status === 200, "sales can see customers");
r = await call("GET", "/admin/products", { token: sales.token }); ok(r.status === 403, "sales can't open products");
r = await call("PUT", "/admin/catalog/categories/nope-x", { token: sales.token, body: { name: "Nope" } }); ok(r.status === 403, "sales can't edit categories");
r = await call("GET", "/admin/staff", { token: sales.token }); ok(r.status === 403, "sales can't manage staff");
r = await call("GET", "/admin/stats", { token: sales.token }); ok(r.status === 200 && r.json.profit === null && r.json.inventory.value === null && r.json.customers !== null, "sales' dashboard hides profit and stock value");
r = await call("GET", "/admin/orders", { token: sales.token }); ok(!JSON.stringify(r.json).includes('"cost"') && !JSON.stringify(r.json).includes('"profit"'), "sales never receive cost or profit");
r = await call("GET", "/admin/orders", { token: support.token }); ok(r.status === 200, "support can see orders");
r = await call("PATCH", `/admin/orders/${staffOrder}/status`, { token: support.token, body: { status: "scheduled" } }); ok(r.status === 403, "support can't change an order");
r = await call("GET", "/admin/stats", { token: support.token }); ok(r.status === 200 && r.json.customers !== null, "support has a dashboard");
r = await call("GET", "/admin/orders", { token: content.token }); ok(r.status === 403, "content editor can't see orders");
r = await call("GET", "/admin/stats", { token: content.token }); ok(r.status === 403, "content editor has no order dashboard");
r = await call("PUT", "/admin/catalog/faqs/staff-test-faq", { token: content.token, body: { category: "Tracking & GPS", q: "Staff test question?", a: "<p>Answer written by the content editor.</p>" } }); ok(r.status === 200, "content editor can write FAQs");
r = await call("DELETE", "/admin/catalog/faqs/staff-test-faq", { token: content.token }); ok(r.status === 204, "…and delete them");
r = await call("PUT", "/admin/catalog/devices/x-y", { token: content.token, body: {} }); ok(r.status === 403, "content editor can't edit products");
r = await call("GET", "/admin/catalog", { token: content.token }); ok(r.status === 200 && !JSON.stringify(r.json.devices).includes('"cost"'), "content editor can read the catalogue, without cost prices");
up = await upload(png("staff"), { token: content.token }); ok(up.status === 201, "content editor can upload pictures");
up = await upload(png("staff2"), { token: sales.token }); ok(up.status === 403, "sales can't upload pictures");
r = await call("GET", "/admin/products", { token: inventory.token }); ok(r.status === 200, "inventory can open products");
r = await call("GET", "/admin/orders", { token: inventory.token }); ok(r.status === 200, "inventory can see orders (to check stock)");
r = await call("PATCH", `/admin/orders/${staffOrder}/status`, { token: inventory.token, body: { status: "scheduled" } }); ok(r.status === 403, "inventory can't change orders");

console.log("custom roles");
r = await call("PUT", "/admin/catalog/../roles/x", { token: tokAdmin, body: {} }); void r;
r = await call("PUT", "/admin/roles/auditor", { token: tokAdmin, body: { name: "Auditor", description: "Reads orders and money", permissions: ["orders.view", "finance.view"] } }); ok(r.status === 200, "owner creates a custom role");
r = await call("PUT", "/admin/roles/bad-role", { token: tokAdmin, body: { name: "Bad", permissions: ["orders.view", "nuke.everything"] } }); ok(r.status === 400, "an unknown permission is refused");
r = await call("PUT", "/admin/roles/owner", { token: tokAdmin, body: { name: "Owner", permissions: ["orders.view"] } }); ok(r.status === 400, "the Owner role can't be edited");
r = await call("PUT", "/admin/roles/auditor", { token: sales.token, body: { name: "Auditor", permissions: ["staff.manage"] } }); ok(r.status === 403, "sales can't edit roles");
const auditor = await makeStaff("auditor", "auditor");
r = await call("GET", "/admin/orders", { token: auditor.token }); ok(r.status === 200 && r.json.orders.every((o) => typeof o.profit === "number" && o.items.every((i) => typeof i.cost === "number")), "a role with finance.view sees cost and profit on orders");
r = await call("GET", "/admin/stats", { token: auditor.token }); ok(r.json.profit !== null && r.json.inventory.value !== null, "…and on the dashboard");
r = await call("PUT", "/admin/roles/auditor", { token: tokAdmin, body: { name: "Auditor", permissions: ["orders.view"] } }); ok(r.status === 200, "owner removes finance from the role");
r = await call("GET", "/admin/orders", { token: auditor.token }); ok(r.status === 200 && !JSON.stringify(r.json).includes('"profit"'), "the change applies to people already holding the role (within seconds)");
r = await call("DELETE", "/admin/roles/auditor", { token: tokAdmin }); ok(r.status === 409, "can't delete a role someone still has");
r = await call("DELETE", "/admin/roles/sales", { token: tokAdmin }); ok(r.status === 400, "built-in roles can't be deleted");

console.log("staff safeguards");
r = await call("PATCH", `/admin/staff/${sales.id}`, { token: tokAdmin, body: { roleId: "support" } }); ok(r.status === 200 && r.json.roleId === "support", "owner changes someone's role");
r = await call("GET", "/admin/orders", { token: sales.token }); const stillOk = r.status === 200; r = await call("PATCH", `/admin/orders/${staffOrder}/status`, { token: sales.token, body: { status: "scheduled" } }); ok(stillOk && r.status === 403, "the new role takes effect straight away");
const me = (await call("GET", "/me", { token: tokAdmin })).json;
r = await call("PATCH", `/admin/staff/${me.id}`, { token: tokAdmin, body: { disabled: true } }); ok(r.status === 400, "nobody can disable themselves");
r = await call("PATCH", `/admin/staff/${me.id}`, { token: tokAdmin, body: { roleId: "support" } }); ok(r.status === 400, "nobody can change their own role");
r = await call("DELETE", `/admin/staff/${me.id}`, { token: tokAdmin }); ok(r.status === 400, "nobody can remove themselves");
r = await call("PATCH", `/admin/staff/${support.id}`, { token: tokAdmin, body: { disabled: true } }); ok(r.status === 200 && r.json.disabled === true, "owner disables a staff account");
r = await call("GET", "/admin/orders", { token: support.token }); ok(r.status === 401, "a disabled account's token stops working at once");
r = await call("POST", "/auth/login", { body: { identifier: support.email, password: staffPw } }); ok(r.status === 403, "…and it can't log in again");
r = await call("PATCH", `/admin/staff/${support.id}`, { token: tokAdmin, body: { disabled: false } }); ok(r.status === 200, "owner re-enables it");
r = await call("POST", `/admin/staff/${content.id}/password`, { token: tokAdmin, body: { password: "NewPassw0rd88" } }); ok(r.status === 204, "owner resets a staff password");
r = await call("POST", "/auth/login", { body: { identifier: content.email, password: staffPw } }); ok(r.status === 401, "the old staff password no longer works");
r = await call("DELETE", `/admin/staff/${content.id}`, { token: tokAdmin }); ok(r.status === 204, "owner removes staff access");
r = await call("GET", "/admin/stats", { token: content.token }); ok(r.status === 403, "a removed staff member keeps their account but loses admin access");
r = await call("GET", "/admin/staff", { token: tokAdmin }); ok(r.json.some((x) => x.email === me.email && x.roleId === "owner") && !r.json.some((x) => x.id === content.id), "the staff list shows owners and hides removed people");

/* ===================================================================== cost & stock */
console.log("cost & stock");
const mk = (over = {}) => ({ name: "Stock Test Tracker", category: "GPS Tracking Devices", subcategory: "Car Trackers", visual: "tracker", summary: "Stock test.", specs: [], features: [], price: 2000, monthly: 200, cost: 1200, stock: 3, ...over });
const stockOf = async (id) => (await call("GET", `/admin/products?q=${id}`, { token: tokAdmin })).json.items.find((i) => i.id === id)?.stock;
r = await call("PUT", "/admin/catalog/devices/stock-test", { token: tokAdmin, body: mk() }); ok(r.status === 200 && r.json.cost === 1200 && r.json.stock === 3, "owner saves a product with cost and stock");
r = await call("GET", "/products?ids=stock-test"); ok(r.json.items[0].stock === 3 && !("cost" in r.json.items[0]), "public sees the stock but never the cost");
r = await call("GET", "/catalog"); ok(!JSON.stringify(r.json).includes('"cost"'), "the public catalogue contains no cost anywhere");
r = await call("GET", "/products/stock-test"); ok(r.status === 200 && !("cost" in r.json) && r.json.stock === 3, "single-product endpoint hides cost too");
r = await call("PUT", "/admin/catalog/devices/stock-test", { token: tokAdmin, body: mk({ cost: -5 }) }); ok(r.status === 400, "negative cost refused");
r = await call("PUT", "/admin/catalog/devices/stock-test", { token: tokAdmin, body: mk({ stock: -1 }) }); ok(r.status === 400, "negative stock refused");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "dev-stock-test", qty: 4 }]) }); ok(r.status === 400 && /Only 3/.test(r.json.message), "ordering more than the stock → \"Only 3 … left\"");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "dev-stock-test", qty: 3 }]) }); const so1 = r.json.id; ok(r.status === 201 && (await stockOf("stock-test")) === 0, "ordering exactly the stock works and takes it to 0");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "dev-stock-test", qty: 1 }]) }); ok(r.status === 400 && /out of stock/.test(r.json.message), "out of stock → refused");
r = await call("GET", "/products?ids=stock-test"); ok(r.json.items[0].stock === 0, "public shows 0 left");
r = await call("POST", `/orders/${so1}/cancel`, { token: tokA }); ok(r.status === 200 && (await stockOf("stock-test")) === 3, "cancelling gives the stock back");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "dev-stock-test", qty: 3 }]) }); const so2 = r.json.id; ok(r.status === 201 && (await stockOf("stock-test")) === 0, "the freed stock can be bought again");
r = await call("PATCH", `/admin/orders/${so1}/status`, { token: tokAdmin, body: { status: "confirmed" } }); ok(r.status === 409 && /out of stock|Only/.test(r.json.message), "reopening a cancelled order is refused when the stock is gone");
r = await call("PATCH", `/admin/orders/${so2}/status`, { token: tokAdmin, body: { status: "cancelled" } }); ok(r.status === 200 && (await stockOf("stock-test")) === 3, "admin cancelling an order also restores stock");
r = await call("PATCH", `/admin/orders/${so1}/status`, { token: tokAdmin, body: { status: "confirmed" } }); ok(r.status === 200 && (await stockOf("stock-test")) === 0, "reopening takes the stock again");
await call("PATCH", `/admin/orders/${so1}/status`, { token: tokAdmin, body: { status: "cancelled" } });
// two buyers, one last unit — all at once
r = await call("PUT", "/admin/catalog/devices/stock-test", { token: tokAdmin, body: mk({ stock: 2 }) });
const race = await Promise.all(Array.from({ length: 6 }, () => call("POST", "/orders", { token: tokA, body: order([{ id: "dev-stock-test", qty: 1 }]) })));
const won = race.filter((x) => x.status === 201).length;
ok(won === 2 && (await stockOf("stock-test")) === 0, `6 simultaneous buyers, 2 units: exactly 2 orders succeed, stock ends at 0 (got ${won})`, race.map((x) => x.status).join());
r = await call("PUT", "/admin/catalog/devices/stock-test", { token: tokAdmin, body: mk({ stock: null }) }); ok(r.status === 200 && r.json.stock === null, "clearing the stock number stops tracking");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "dev-stock-test", qty: 20 }]) }); ok(r.status === 201, "an untracked product can be ordered freely");
r = await call("GET", "/products?ids=stock-test"); ok(!("stock" in r.json.items[0]), "untracked products show no stock number");

console.log("profit & cost privacy");
r = await call("PUT", "/admin/catalog/devices/stock-test", { token: tokAdmin, body: mk({ stock: 50, cost: 1000 }) });
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "dev-stock-test", qty: 2 }]) }); const po = r.json.id;
r = await call("PUT", "/admin/catalog/devices/stock-test", { token: tokAdmin, body: mk({ stock: 48, cost: 1900 }) });
r = await call("GET", `/admin/orders?q=${po}`, { token: tokAdmin }); const line = r.json.orders[0];
ok(line.items[0].cost === 1000 && line.profit === (2000 - 1000) * 2, "an order keeps the cost from when it was placed (profit ৳2,000), even after the cost changes");
r = await call("GET", "/orders", { token: tokA }); ok(!JSON.stringify(r.json).includes('"cost"') && !JSON.stringify(r.json).includes('"profit"'), "customers never see cost or profit on their own orders");
const inv = await makeStaff("inventory", "inventory2");
r = await call("GET", "/admin/products?q=stock-test", { token: inv.token }); ok(r.status === 200 && !("cost" in r.json.items[0]) && r.json.items[0].stock === 48, "inventory staff see stock but not cost");
r = await call("PUT", "/admin/catalog/devices/stock-test", { token: inv.token, body: mk({ stock: 45, cost: 1 }) }); ok(r.status === 200, "inventory staff can update stock");
ok((await call("GET", "/admin/products?q=stock-test", { token: tokAdmin })).json.items[0].cost === 1900 && (await stockOf("stock-test")) === 45, "…and their save does not wipe or change the cost price");
const st = (await call("GET", "/admin/stats", { token: tokAdmin })).json;
ok(typeof st.profit === "number" && st.inventory.units >= 0 && Array.isArray(st.inventory.lowItems), "owner's dashboard has profit and inventory");
r = await call("PUT", "/admin/catalog/devices/stock-test", { token: tokAdmin, body: mk({ stock: 4, cost: 1900 }) });
ok((await call("GET", "/admin/stats", { token: tokAdmin })).json.inventory.lowItems.some((x) => x.id === "stock-test"), "a product with 5 or fewer left shows in the low-stock list");

/* ===================================================================== billing */
console.log("billing");
r = await call("POST", "/orders", { token: tokA, body: order([{ id: "plan-gps-1", qty: 1 }]) });
ok(r.status === 201 && r.json.billing.name === "Rahim Uddin" && r.json.billing.address === "House 12, Road 5, Dhanmondi" && r.json.billing.phone === A.mobile, "no billing block → billed to the customer at the installation address");
const bill = { name: "Rahim Transport Ltd", company: "Rahim Transport Ltd", taxId: "BIN-123456789", address: "Level 4, Motijheel C/A", division: "Dhaka", postcode: "1000", phone: A.mobile, email: "accounts@rahim.example" };
r = await call("POST", "/orders", { token: tokA, body: { ...order([{ id: "plan-gps-1", qty: 1 }]), billing: bill } }); const bo = r.json;
ok(r.status === 201 && bo.billing.company === "Rahim Transport Ltd" && bo.billing.taxId === "BIN-123456789" && bo.billing.postcode === "1000" && bo.billing.email === "accounts@rahim.example", "a separate billing address, company and BIN are saved with the order");
r = await call("POST", "/orders", { token: tokA, body: { ...order([{ id: "plan-gps-1", qty: 1 }]), billing: { ...bill, taxId: "<script>" } } }); ok(r.status === 400, "bad BIN rejected");
r = await call("POST", "/orders", { token: tokA, body: { ...order([{ id: "plan-gps-1", qty: 1 }]), billing: { ...bill, postcode: "12ab" } } }); ok(r.status === 400, "bad postcode rejected");
r = await call("POST", "/orders", { token: tokA, body: { ...order([{ id: "plan-gps-1", qty: 1 }]), billing: { ...bill, phone: "123" } } }); ok(r.status === 400, "bad billing phone rejected");
r = await call("POST", "/orders", { token: tokA, body: { ...order([{ id: "plan-gps-1", qty: 1 }]), billing: { ...bill, address: "x" } } }); ok(r.status === 400, "too-short billing address rejected");
r = await call("GET", `/orders/${bo.id}`, { token: tokA }); ok(r.status === 200 && r.json.billing.taxId === "BIN-123456789", "an order can be fetched by id (for the invoice)");
r = await call("GET", `/orders/${bo.id}`, { token: tokB }); ok(r.status === 404, "…but only by its owner");
r = await call("GET", `/orders/${bo.id}`); ok(r.status === 401, "…and not anonymously");
r = await call("PATCH", "/me/profile", { token: tokA, body: { company: "Rahim Transport Ltd", taxId: "BIN-123456789", billingAddress: "Level 4, Motijheel C/A", billingDivision: "Dhaka", billingPostcode: "1000" } });
ok(r.status === 200 && r.json.taxId === "BIN-123456789" && r.json.billingAddress === "Level 4, Motijheel C/A" && r.json.billingPostcode === "1000", "billing details are saved on the profile");
r = await call("PATCH", "/me/profile", { token: tokA, body: { taxId: "bad value!" } }); ok(r.status === 400, "bad BIN on the profile rejected");
r = await call("GET", `/admin/orders?q=${bo.id}`, { token: sales.token }); void r;
r = await call("GET", `/admin/orders?q=${bo.id}`, { token: tokAdmin }); ok(r.json.orders[0].billing.company === "Rahim Transport Ltd", "staff see the billing details on the order");

/* ===================================================================== rich text */
console.log("rich text (descriptions, FAQ answers, packages)");
const evil = '<h2>Specs</h2><p onclick="alert(1)">Hello <strong>world</strong><script>alert(1)</script></p><a href="javascript:alert(1)">x</a><iframe src="https://evil.example"></iframe><img src="https://evil.example/t.png"><ul><li>One</li></ul>';
r = await call("PUT", "/admin/catalog/devices/rich-test", { token: tokAdmin, body: mk({ description: evil, stock: null }) });
ok(r.status === 200 && r.json.description.includes("<h2>Specs</h2>") && r.json.description.includes("<strong>world</strong>") && !/script|onclick|javascript:|iframe|evil\.example/i.test(r.json.description), "a product description keeps formatting but loses scripts, handlers, iframes and remote images");
r = await call("GET", "/products/rich-test"); ok(r.status === 200 && r.json.description.includes("<h2>Specs</h2>"), "the single-product endpoint returns the description");
r = await call("GET", "/products?ids=rich-test"); ok(!("description" in r.json.items[0]), "lists don't carry the long description (keeps them light)");
r = await call("GET", "/catalog"); ok(!JSON.stringify(r.json.devices).includes("Hello <strong>"), "the catalogue payload doesn't carry descriptions");
const pic = await upload(png("rich")); const pt = pic.json.token;
r = await call("PUT", "/admin/catalog/devices/rich-test", { token: tokAdmin, body: mk({ description: `<p>With a picture</p><img src="${pt}" alt="x">`.replace(pt, pt), stock: null }) });
ok(r.status === 200 && r.json.description.includes(pt), "an uploaded picture inside a description is kept");
ok((await media(pt)).status === 200, "…and the picture stays stored");
r = await call("GET", "/products/rich-test"); ok(r.json.description.includes(`/api/v1/media/${pt.slice(6)}`) && !r.json.description.includes("media:"), "the public description has full picture URLs");
r = await call("PUT", "/admin/catalog/devices/rich-test", { token: tokAdmin, body: mk({ description: "<p>No picture now</p>", stock: null }) });
ok(r.status === 200 && (await media(pt)).status === 404, "removing the picture from the text deletes the stored file");
r = await call("PUT", "/admin/catalog/devices/rich-test", { token: tokAdmin, body: mk({ description: "<p><br></p>", stock: null }) }); ok(r.status === 200, "an empty description is allowed (descriptions are optional)");
r = await call("PUT", "/admin/catalog/faqs/rich-faq", { token: tokAdmin, body: { category: "Tracking & GPS", q: "Does it work?", a: '<p>Yes — see <a href="https://example.com">this</a><script>x</script></p>' } });
ok(r.status === 200 && r.json.a.includes('rel="noopener noreferrer"') && !r.json.a.includes("script"), "FAQ answers are formatted and sanitised");
r = await call("PUT", "/admin/catalog/faqs/rich-faq", { token: tokAdmin, body: { category: "Tracking & GPS", q: "Does it work?", a: "<p></p>" } }); ok(r.status === 400, "an empty FAQ answer is refused");
r = await call("PUT", "/admin/catalog/faqs/rich-faq", { token: tokAdmin, body: { category: "Tracking & GPS", q: "Does it work?", a: "Plain text answers still work." } }); ok(r.status === 200, "a plain-text FAQ answer is still accepted");
r = await call("GET", "/catalog"); ok(r.json.faqs.some((f) => f.id === "rich-faq" && f.a.includes("Plain text")), "FAQs reach the website");
r = await call("PUT", "/admin/catalog/plans/rich-plan", { token: tokAdmin, body: { name: "Rich Plan", devicePrice: 1000, monthlyCharge: 100, features: ["Live Tracking"], description: '<p>About this <em>package</em></p><img src="x" onerror="alert(1)">', cost: 600 } });
ok(r.status === 200 && r.json.description.includes("<em>package</em>") && !/onerror|<img/.test(r.json.description), "a package description is sanitised");
r = await call("GET", "/catalog"); const rp = r.json.plans.find((x) => x.id === "rich-plan"); ok(rp.description.includes("package") && !("cost" in rp), "the public package has its description but not its cost");
for (const [path, tk] of [["/admin/catalog/plans/rich-plan", tokAdmin], ["/admin/catalog/faqs/rich-faq", tokAdmin], ["/admin/catalog/devices/rich-test", tokAdmin], ["/admin/catalog/devices/stock-test", tokAdmin]]) await call("DELETE", path, { token: tk });

/* ===================================================================== news posts */
console.log("news posts");
const post = (over = {}) => ({ title: "Smoke Test Post", content: "<h2>Hello</h2><p>First post from the smoke test.</p>", published: false, ...over });
r = await call("PUT", "/admin/posts/smoke-post", { token: tokA, body: post() }); ok(r.status === 403, "customer can't write posts");
r = await call("PUT", "/admin/posts/smoke-post", { token: sales.token, body: post() }); ok(r.status === 403, "sales can't write posts");
const writer = await makeStaff("content", "writer");
r = await call("PUT", "/admin/posts/smoke-post", { token: writer.token, body: post() }); ok(r.status === 200 && r.json.published === false && r.json.excerpt.startsWith("Hello"), "a content editor saves a draft (excerpt made from the text)");
r = await call("GET", "/posts"); ok(!r.json.items.some((x) => x.id === "smoke-post"), "a draft is not in the public list");
r = await call("GET", "/posts/smoke-post"); ok(r.status === 404, "a draft can't be opened by its address");
r = await call("PUT", "/admin/posts/smoke-post", { token: writer.token, body: post({ title: "x" }) }); ok(r.status === 400, "a too-short title is refused");
r = await call("PUT", "/admin/posts/smoke-post", { token: writer.token, body: post({ content: "<p></p>" }) }); ok(r.status === 400, "an empty post is refused");
r = await call("PUT", "/admin/posts/smoke-post", { token: writer.token, body: post({ content: '<p>Hello there</p><script>alert(1)</script><img src="https://evil.example/a.png" onerror="alert(1)">', published: true }) });
ok(r.status === 200 && r.json.published === true && r.json.publishedAt && !/script|evil|onerror/.test(r.json.content), "publishing sanitises the content and stamps the time");
r = await call("GET", "/posts"); ok(r.json.items.some((x) => x.id === "smoke-post") && !("content" in r.json.items[0]), "a published post is in the public list (without its full text)");
r = await call("GET", "/posts/smoke-post"); ok(r.status === 200 && r.json.content.includes("<p>Hello there</p>") && !/script/.test(r.json.content), "…and can be opened");
const cov = await upload(png("cover"), { token: writer.token });
r = await call("PUT", "/admin/posts/smoke-post", { token: writer.token, body: post({ cover: cov.json.token, content: `<p>With cover</p><img src="${(await upload(png("inline"), { token: writer.token })).json.token}">`, published: true }) });
const inlineTok = r.json.content.match(/media:[0-9a-f-]{36}/)[0];
r = await call("GET", "/posts/smoke-post"); ok(r.json.cover.includes("/api/v1/media/") && r.json.content.includes("/api/v1/media/") && !r.json.content.includes("media:"), "cover and inline pictures come back as full URLs");
r = await call("PUT", "/admin/posts/smoke-post", { token: writer.token, body: post({ cover: "https://evil.example/c.png" }) }); ok(r.status === 400, "a remote cover is refused");
r = await call("PUT", "/admin/posts/smoke-future", { token: writer.token, body: post({ title: "Scheduled for next year", published: true, publishedAt: new Date(Date.now() + 365 * 864e5).toISOString() }) }); ok(r.status === 200, "a post can be scheduled");
r = await call("GET", "/posts/smoke-future"); ok(r.status === 404, "a scheduled post is hidden until its time");
for (let i = 1; i <= 4; i++) await call("PUT", `/admin/posts/smoke-page-${i}`, { token: writer.token, body: post({ title: `Pagination post ${i}`, published: true }) });
r = await call("GET", "/posts?limit=2&page=1"); const pg1 = r.json; ok(pg1.items.length === 2 && pg1.total >= 5 && pg1.pages === Math.ceil(pg1.total / 2), "the public list is paged by the server");
r = await call("GET", "/posts?limit=2&page=2"); ok(r.json.items.length === 2 && !r.json.items.some((x) => pg1.items.some((y) => y.id === x.id)), "page 2 shows different posts");
ok(pg1.items[0].publishedAt >= pg1.items[1].publishedAt, "newest first");
r = await call("GET", "/posts?limit=99"); ok(r.status === 400, "page size is capped");
r = await call("GET", "/admin/posts?status=draft", { token: writer.token }); ok(r.status === 200 && r.json.items.every((x) => x.published === false), "admin can list drafts");
r = await call("GET", "/admin/posts?q=smoke", { token: writer.token }); ok(r.json.total >= 6, "admin search finds posts");
r = await call("GET", "/admin/posts/smoke-post", { token: writer.token }); ok(r.json.content.includes("media:"), "the admin gets the raw text (picture references intact) for editing");
r = await call("PUT", "/admin/posts/smoke-post", { token: writer.token, body: post({ published: true }) });
ok((await media(inlineTok)).status === 404 && (await media(cov.json.token)).status === 404, "pictures removed from a post are deleted from storage");
for (const id of ["smoke-post", "smoke-future", "smoke-page-1", "smoke-page-2", "smoke-page-3", "smoke-page-4"]) await call("DELETE", `/admin/posts/${id}`, { token: tokAdmin });
r = await call("GET", "/posts/smoke-post"); ok(r.status === 404, "a deleted post is gone");

/* clean up the staff accounts made above */
for (const x of [sales, support, content, inventory, inv, auditor, writer]) { if (x.id) await call("DELETE", `/admin/staff/${x.id}`, { token: tokAdmin }); if (x.token) await call("DELETE", "/me", { token: x.token }); }
await call("DELETE", "/admin/roles/auditor", { token: tokAdmin });

console.log("account deletion");
r = await call("DELETE", "/me", { token: tokB }); ok(r.status === 204, "customer deletes own account");
r = await call("GET", "/me", { token: tokB }); ok(r.status === 401, "deleted account's token stops working immediately");
r = await call("GET", `/admin/orders?q=${orderB}`, { token: tokAdmin }); ok(r.json.total === 0, "its orders were deleted with it");
await call("DELETE", "/me", { token: tokA });

console.log(`\n${n - failed}/${n} checks passed`);
process.exit(failed ? 1 : 0);
