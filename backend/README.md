# Safety GPS Tracker API

NestJS 12 · TypeORM · PostgreSQL · JWT.  Base path: `/api/v1`.

## Setup

```bash
cp .env.example .env      # edit values (see below)
npm install
docker compose up -d      # optional: local PostgreSQL
npm run seed              # migrations + products/plans/FAQs + first admin
npm run start:dev
```

| Variable | Notes |
|---|---|
| `DATABASE_URL` | `postgres://user:pass@host:5432/db` |
| `DB_SSL` | `1` for hosted databases that require TLS |
| `JWT_SECRET` | **Required.** 32+ random characters: `openssl rand -base64 48`. Changing it logs everyone out |
| `JWT_EXPIRES_IN` | Default `7d` |
| `FRONTEND_ORIGINS` | Comma-separated website origins allowed by CORS, e.g. `https://safetygpstracker.com.bd,https://www.safetygpstracker.com.bd` |
| `TRUST_PROXY` | `1` behind a reverse proxy/load balancer (so rate limits see the real client IP). Leave `0` if the API is exposed directly |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by `npm run seed` to create the first admin (8–72 chars) |

The app refuses to start with a missing/short `JWT_SECRET` or a bad `DATABASE_URL`.

## Endpoints

Public: `POST /auth/register`, `POST /auth/login`, `GET /catalog`, `GET /products` (paged shop list), `GET /media/:id`, `GET /health`

Signed-in customer: `GET /me`, `PATCH /me/profile`, `PUT /me/settings`, `POST /me/password`, `DELETE /me`,
`GET /orders`, `POST /orders`, `POST /orders/:id/cancel`

Admin only (`role = admin`): `GET /admin/stats`, `GET /admin/orders`, `PATCH /admin/orders/:id/status`,
`GET /admin/customers`, `GET /admin/catalog` (`?slim=1` leaves products out), `GET /admin/products` (paged), `PUT|DELETE /admin/catalog/{categories|plans|devices|faqs|hero}/:id`, `POST /admin/media` (upload a picture), `DELETE /admin/media/:id`

Send `Authorization: Bearer <token>`.

## Behaviour worth knowing

- **Orders are priced on the server.** The browser sends only product ids and quantities; names and prices come from the database at order time and are stored on the order. Hidden products and products with no price can't be ordered.
- **Cancelling:** customers can cancel only while an order is `received`; after that they must call support. Admins can set any status.
- **Rate limits:** 120 requests/min per IP overall; 10/min on register & login; 20 orders/hour. (In-memory — per instance.)
- **Validation:** unknown fields are rejected, passwords need 8–72 chars with a letter and a number, mobiles must be Bangladeshi (`01XXXXXXXXX`, `+88` allowed).
- **Make someone an admin:** `UPDATE users SET role = 'admin' WHERE email = 'person@example.com';`
- **Public catalogue edits** show on the website within ~60 seconds (the site refreshes every minute).
- **Categories** are two levels (category → sub-category). A product must use an existing category and sub-category. Renaming one renames it on its products; a category with sub-categories or products can't be deleted; hiding a category hides its sub-categories and products from the website. A category can't be moved to a different parent after it is created.
- **Hero slides** accept only site pages (`/products`) or `https://` links for the button, and only files inside the website's `/public` folder for pictures (no remote URLs, no `..`). Product and package pictures follow the same rule.
- **Product pictures:** a product has up to 10 pictures, the first is the main one. Upload them in Admin → Products (several at once; the browser shrinks them to ≤ 1600 px WebP first). The server accepts only JPEG, PNG and WebP up to 3 MB — the real file type is checked, SVG is refused — and stores them in PostgreSQL (so they survive redeploys on any host). They are served from `GET /media/:id` with a one-year cache. A picture that no product uses any more is deleted automatically. A product with no picture shows a drawn placeholder. Pictures already in the website's `public/img/` can still be added by path.
- **Pagination:** the shop (`GET /products`) and the admin product list (`GET /admin/products`) filter, sort and page in the database (`page`, `limit` ≤ 48 / 100). Shop filters: `category`, `sub`, `q`, `maxPrice`, `priced`, `call`, `sort` (`default|price-asc|price-desc|name`), `ids` (wishlist). `GET /catalog` still lists every product for menus, the home page and search.

## Database changes

Schema changes go through migrations only (`synchronize` is off). Pending migrations run automatically on start.

```bash
# after changing an entity:
npm run migration:generate -- src/database/migrations/DescribeTheChange
npm run migration:run      # optional — also runs on app start
```

## Tests

```bash
npm test                                   # unit tests
# end-to-end against a running API + seeded DB (start the API with TRUST_PROXY=1):
node test/smoke.mjs
```

## Deploy

```bash
npm ci && npm run build
npm run seed:prod          # once: migrations + catalogue + hero slides + admin (--if-empty: never overwrites existing catalogue edits)
npm start                  # node dist/main.js
```

Render / Railway / Fly: build command `npm ci && npm run build`, start command `npm start`, set the env vars above (plus `DB_SSL=1`, `TRUST_PROXY=1`), health check path `/api/v1/health`.

## Known limits (not built yet)

- **No email/SMS**: no email verification and no self-service password reset (the website sends people to the helpline; admins can't reset passwords from the UI yet).
- **Sessions**: a single 7-day token kept in the browser's localStorage; no refresh tokens or "log out everywhere". Deleting an account or changing its role takes effect immediately.
- **Payments** are not processed online — orders are confirmed by phone.
- Rate limiting is per server instance; use a shared store (e.g. Redis) if you run several instances.
