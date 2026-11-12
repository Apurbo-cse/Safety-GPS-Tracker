# Safety GPS Tracker

Website (Next.js) + API (NestJS + PostgreSQL).

| Folder | What it is |
|---|---|
| `src/` | The website: marketing pages, shop, checkout, customer account, **admin panel** (`/admin`) |
| `backend/` | The API: accounts, orders, profile & settings, products/plans/FAQs, admin endpoints. See [backend/README.md](backend/README.md) |
| `scripts/` | `export-catalog.ts` (dump built-in data for seeding) and `artwork/` (renders product images) |

## What is dynamic

Stored in PostgreSQL and served by the API:

- **Accounts** — sign-up and log-in with email or mobile number (bcrypt passwords, JWT sessions)
- **Orders** — placed at `/checkout`, priced **by the server** from the database catalogue, tracked at `/orders`
- **Profile & settings** — `/profile`, `/settings` (alerts, channels, speed limit, password, delete account)
- **Categories and sub-categories** — created in the admin panel (Catalogue → Categories); products are placed in them, and the home page, shop sidebar, menus and category pages follow automatically
- **Products, packages and FAQs** — edited in the admin panel; the website refreshes within a minute. Products can have several uploaded pictures, and the shop and the admin product list are paged by the server
- **Home hero slides** — headline, button, background and the sample tracking card are edited in Catalogue → Hero slides
- **Stock and cost** — each product has an optional stock count (empty = not tracked). The shop shows "Only N left" / "Out of stock" and blocks ordering; stock is taken atomically when an order is placed and returned when it is cancelled. The cost price (admin only, finance permission) gives profit per order
- **Formatted text** — product and package descriptions, FAQ answers, news posts and text pages are written in a Summernote editor (headings, lists, tables, links, pictures). The API cleans every save with an allow-list, so no scripts or remote images can get in
- **Billing and invoices** — checkout takes a billing party (or "same as installation"), company and BIN/TIN; they are kept on the profile and the order, and `/orders/<id>/invoice` is a printable invoice
- **News** — `/news` (Admin → News: drafts, publish, schedule)
- **Pages** — Privacy, Terms and any extra page (Refund policy…) are edited in Admin → Pages; extra pages appear at `/page/<name>` and in the footer
- **Site details** — name, phone, email, address, opening hours and social links are edited in Admin → Site details and used across the website
- **Staff and roles** — Admin → Staff & roles: people get a role (Owner, Manager, Sales, Support, Content, Inventory, or your own), and a role is a set of permissions: `orders.view`, `orders.manage`, `products.manage`, `content.manage`, `customers.view`, `finance.view`, `staff.manage`. The sidebar, pages and API all follow them
- **Coupons** — discount codes (percentage or fixed, minimum spend, use limit, expiry) are made in Admin → Coupons and typed at checkout. The server checks them and counts uses atomically; a cancelled order gives its use back
- **Spreadsheets** — Admin → Orders (with a date range), Customers and Products have an **Export CSV** button; cost and profit columns appear only for finance access, and cells that look like formulas are neutralised
- **Live updates (Socket.IO)** — staff see a new order or contact message the moment it arrives (toast, chime, lists refresh, unread badge); customers see their order's status change without refreshing. Sockets log in with the same token, and staff only get the events their permissions allow
- **Contact us** — the Contact page form and the "Talk to our team" pop-up save a real message (Admin → Messages: new / handled, call or email from the row). Spam is limited by a hidden field and 5 messages per hour per IP
- **Admin panel** — `/admin`: dashboard (sales, profit, stock, restock list), orders, catalogue (categories, packages, products, FAQs, hero slides), news, pages, site details, customers, staff & roles

All website API calls go through **RTK Query** (`src/store/apiSlice.ts`): lists are cached, and creating, editing or deleting in the admin panel updates the lists immediately (rolled back if the server refuses).

Still static (lives in `src/data/`): features list, industry solutions, testimonials, about copy.
The built-in products/plans/FAQs/hero slides in `src/data/` are only a **fallback** used when the API is unreachable while building the site or running in development.

## Run it locally

You need Node 20+ and a PostgreSQL database.

```bash
# 1. Database (or use any Postgres you already have)
cd backend && docker compose up -d

# 2. API
cp .env.example .env          # then edit JWT_SECRET (and ADMIN_EMAIL / ADMIN_PASSWORD)
npm install
npm run seed                  # creates tables, loads products/plans/FAQs, creates the first admin
npm run start:dev             # http://localhost:4000/api/v1/health

# 3. Website (new terminal, repo root)
cp .env.example .env.development.local     # NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
npm install
npm run dev                   # http://localhost:3000
```

Log in at `/login` with your `ADMIN_EMAIL` / `ADMIN_PASSWORD` and open `/admin`.

## Deploy

The two parts deploy separately.

1. **Database** — any hosted PostgreSQL (Neon, Supabase, Render, Railway, RDS…).
2. **API** (`backend/`) — any Node host (Render, Railway, Fly.io, a VPS). See [backend/README.md](backend/README.md#deploy).
3. **Website** — Vercel. In *Settings → Environment Variables* set
   `NEXT_PUBLIC_API_URL=https://<your-api-host>/api/v1`, then redeploy.
   It must be set **before the build** — the address is baked into the site.
   Add your Vercel domain(s) to the API's `FRONTEND_ORIGINS`.

> `backend/` is excluded from the Vercel upload (`.vercelignore`).
