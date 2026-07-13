# ABG

Drop-culture catalogue for ABG — React frontend on Cloudflare Pages, API on Cloudflare Workers, Neon PostgreSQL.

## Live URLs

| Service | URL |
|---------|-----|
| Frontend | https://abg-web.pages.dev |
| API | https://abg-api.touch-apinankul.workers.dev |

---

## Prerequisites

1. [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/)
2. A [Cloudflare](https://dash.cloudflare.com/) account
3. Wrangler CLI authenticated:

```bash
cd packages/server
pnpm exec wrangler login
```

4. Root `.env` file (copy from `.env.example`) with your Neon credentials

---

## Local development

From the repo root:

```bash
pnpm install
pnpm dev
```

- Frontend: http://localhost:5173
- API (Wrangler): http://localhost:8787

The API reads env vars from the root `.env` via `--env-file ../../.env`.

---

## Deploy

All deploy commands run from the **repo root**.

### Backend (Cloudflare Worker)

```bash
pnpm deploy:api
```

Equivalent:

```bash
cd packages/server
pnpm run deploy
```

Deploys `packages/server` to `https://abg-api.touch-apinankul.workers.dev`.

### Frontend (Cloudflare Pages)

```bash
pnpm deploy:web
```

This builds the Vite app with the production API URL baked in, then uploads `packages/web/dist` to the `abg-web` Pages project.

### Deploy both (typical release)

```bash
pnpm deploy:api
pnpm deploy:web
```

Deploy the API first if you changed backend routes or CORS. Redeploy the frontend if you changed UI or if `VITE_API_URL` changed.

---

## First-time / secrets setup

Worker secrets are **not** read from `.env` in production. Set them once via Wrangler:

```bash
cd packages/server
pnpm exec wrangler secret put DATABASE_URL
```

Paste your Neon connection string when prompted.

Optional (Phase 2):

```bash
pnpm exec wrangler secret put RESEND_API_KEY
pnpm exec wrangler secret put BETTER_AUTH_SECRET
```

`DATABASE_URL_UNPOOLED` is **only** for local Drizzle migrations (`pnpm db:migrate`). The Worker does not need it.

Verify the API after setting secrets:

```bash
curl https://abg-api.touch-apinankul.workers.dev/api/drops
```

---

## Environment variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | Worker secret | Neon DB at runtime |
| `DATABASE_URL_UNPOOLED` | Root `.env` only | Local Drizzle Kit migrations |
| `WEB_URL` | `packages/server/wrangler.jsonc` | CORS allowed origin (Pages URL) |
| `VITE_API_URL` | Pages build time | Frontend API base URL — must include `/api` |

Production `VITE_API_URL`:

```
https://abg-api.touch-apinankul.workers.dev/api
```

If you change the Worker URL or add a custom domain, update `build:pages` in root `package.json` and redeploy the frontend.

---

## Database migrations

Run locally (not on Workers):

```bash
pnpm db:generate   # generate migration from schema changes
pnpm db:migrate    # apply migrations to Neon
```

---

## Coupons

Discount codes live in the **`coupons`** table. `iykyk_signups` only stores signup info + `coupon_id` FK.

| Field | IYKYK signup | Percent (outreach) |
|-------|--------------|--------------------|
| `code` | 8-char | 8-char |
| `discount_amount` | `null` | `null` |
| `discount_percent` | `10` | `10` |
| `max_discount_amount` | `null` | `150` |
| `used_at` | set on redeem | set on redeem |

### Migrate schema (one-time)

Only run if `iykyk_signups` has no rows you need to keep (or after you backfill into `coupons` yourself). The SQL drops the old discount columns and requires `coupon_id`.

1. Clear or backfill `iykyk_signups` in Neon as needed.
2. Run [`packages/server/drizzle/0004_coupons_fk.sql`](packages/server/drizzle/0004_coupons_fk.sql) in the Neon SQL Editor.

### Generate bulk 10% codes (max 150 THB)

```bash
pnpm --filter server generate:coupons
```

Writes `exports/coupons-10pct-max150-YYYY-MM-DD.csv` and `.txt` (gitignored), and inserts into Neon.

Card PDF rendering lives under local `tools/` (gitignored) — not part of the deployable app.

## Custom domain (later)

When your domain is on Cloudflare:

1. Pages → `abg-web` → Custom domains → add your domain
2. Worker → `abg-api` → Triggers → Custom domain → e.g. `api.yourdomain.com`
3. Update `WEB_URL` in `packages/server/wrangler.jsonc`
4. Update `VITE_API_URL` in root `package.json` `build:pages` script
5. Redeploy both: `pnpm deploy:api && pnpm deploy:web`
