# ABG ("Acoustic But Goated") — Website Project Specification

## Project Overview

A drop-culture catalogue website for ABG, a Thai university streetwear micro-brand rooted in Samyan campus culture. The aesthetic reference is **Post Archive Faction (PAF)** — cold, architectural, editorial restraint — crossed with the luxurious, minimal, and clean aesthetics of brands like **imnotamorningperson**, **Represent**, and **Nude Project** to capture a premium 'Pinterest it-girl' vibe. Think: clean typography, luxurious space, and effortless editorial layout with student culture heat underneath. The site should feel like a high-end concept store catalog designed for the modern fashion-forward student.

**Ordering model (MVP):** No payment processing in v1. Products link to a **Google Form** for ordering. The site's job is to build hype, display drops, capture waitlist data, and direct users to the form. Payment and fulfilment are handled manually off-platform.

---

## Monorepo Structure

This is a **pnpm workspaces monorepo** with two packages: `web` (React/Vite frontend) and `server` (Express backend).

```
abg/
├── package.json              -- root: pnpm workspaces config + shared scripts
├── pnpm-workspace.yaml
├── .env                      -- single shared .env at root (both packages read from here)
├── .gitignore
├── packages/
│   ├── web/                  -- Vite + React frontend
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── index.html
│   │   └── src/
│   └── server/               -- Express backend
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
```

### Root `package.json`
```json
{
  "name": "abg",
  "private": true,
  "scripts": {
    "dev": "concurrently \"pnpm --filter web dev\" \"pnpm --filter server dev\"",
    "build": "pnpm --filter web build && pnpm --filter server build",
    "db:push": "pnpm --filter server db:push",
    "db:generate": "pnpm --filter server db:generate",
    "db:migrate": "pnpm --filter server db:migrate"
  },
  "devDependencies": {
    "concurrently": "^8.x"
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - 'packages/*'
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Repo structure | pnpm workspaces monorepo |
| Frontend | React + Vite (`packages/web`) |
| Backend | Express.js + TypeScript (`packages/server`) |
| Styling | Tailwind CSS v4 + CSS Variables |
| Database | Neon DB (PostgreSQL, serverless) |
| ORM | Drizzle ORM (lives in `packages/server`) |
| Auth | Better Auth (admin-only, session-based) |
| Image Storage | Cloudflare R2 (or `/public` for MVP) |
| Payments | ❌ None in v1 — ordering via Google Form |
| Deployment | Vercel (web) + Railway or Render (server) + Neon DB |
| State Management | Zustand (UI state, lives in `packages/web`) |
| Animations | Motion (Framer Motion v11) |
| i18n | react-i18next (Thai / English) |
| Email | Resend |

---

## Package: `packages/server` — Express Backend

### Structure
```
packages/server/
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── src/
│   ├── index.ts              -- Express app entry point
│   ├── lib/
│   │   ├── db.ts             -- Drizzle + Neon client
│   │   ├── schema.ts         -- Drizzle schema (all tables)
│   │   └── email.ts          -- Resend client + email templates
│   ├── middleware/
│   │   ├── auth.ts           -- requireAdmin middleware (session check)
│   │   └── errorHandler.ts   -- global error handler
│   └── routes/
│       ├── drops.ts          -- GET /api/drops, GET /api/drops/:slug
│       ├── products.ts       -- GET /api/products/:slug
│       ├── waitlist.ts       -- POST /api/waitlist
│       └── admin/
│           ├── auth.ts       -- POST /api/admin/login, POST /api/admin/logout
│           ├── drops.ts      -- CRUD /api/admin/drops
│           ├── products.ts   -- CRUD /api/admin/products (+ image upload)
│           └── waitlist.ts   -- GET, export, blast /api/admin/waitlist
```

### `packages/server/package.json` dependencies
```json
{
  "dependencies": {
    "express": "^4.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "drizzle-orm": "latest",
    "@neondatabase/serverless": "latest",
    "better-auth": "latest",
    "resend": "latest",
    "multer": "^1.x",
    "zod": "^3.x"
  },
  "devDependencies": {
    "@types/express": "^4.x",
    "@types/cors": "^2.x",
    "@types/multer": "^1.x",
    "drizzle-kit": "latest",
    "tsx": "^4.x",
    "typescript": "^5.x"
  },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

### Express App Setup (`src/index.ts`)
```ts
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()

app.use(cors({ origin: process.env.WEB_URL, credentials: true }))
app.use(express.json())

// Routes
app.use('/api/drops', dropsRouter)
app.use('/api/products', productsRouter)
app.use('/api/waitlist', waitlistRouter)
app.use('/api/admin', adminRouter)  // sub-routes handle auth, drops, products, waitlist

app.use(errorHandler)

app.listen(process.env.PORT || 4000, () => {
  console.log(`ABG server running on :${process.env.PORT || 4000}`)
})
```

### API Routes

```
-- Public (no auth)
GET    /api/drops                        -- list upcoming + active drops
GET    /api/drops/:slug                  -- drop detail + products + stock
GET    /api/products/:slug               -- product detail + variants + stock
POST   /api/waitlist                     -- add to waitlist

-- Admin (requireAdmin middleware on all routes below)
POST   /api/admin/login                  -- create session
POST   /api/admin/logout                 -- destroy session

GET    /api/admin/drops                  -- list all drops
POST   /api/admin/drops                  -- create drop
PATCH  /api/admin/drops/:id             -- update drop
DELETE /api/admin/drops/:id             -- soft delete (set is_active = false)

GET    /api/admin/products               -- list all products
POST   /api/admin/products              -- create product
PATCH  /api/admin/products/:id          -- update product
DELETE /api/admin/products/:id          -- soft delete
POST   /api/admin/products/:id/images   -- upload product images (multer)
PATCH  /api/admin/products/:id/stock    -- update variant stock

GET    /api/admin/waitlist               -- list waitlist (query: ?drop_id=)
GET    /api/admin/waitlist/export        -- return CSV
POST   /api/admin/waitlist/blast         -- send Resend email blast to drop waitlist
```

---

## Package: `packages/web` — React/Vite Frontend

### Structure
```
packages/web/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx               -- React Router v7 route definitions
    ├── i18n.ts               -- react-i18next setup
    ├── locales/
    │   ├── th.json
    │   └── en.json
    ├── components/           -- see Component Library
    ├── pages/                -- page components
    ├── store/
    │   └── ui.ts             -- Zustand: language, mobile menu state
    ├── lib/
    │   └── api.ts            -- typed fetch helpers hitting /api/*
    └── styles/
        └── globals.css       -- Tailwind base + CSS vars + global resets
```

### Vite Proxy (dev only)
In `vite.config.ts`, proxy `/api` to the Express server so there's no CORS issue during development:
```ts
server: {
  proxy: {
    '/api': 'http://localhost:4000'
  }
}
```

### `packages/web/package.json` dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^7.x",
    "react-i18next": "^14.x",
    "i18next": "^23.x",
    "zustand": "^4.x",
    "motion": "^11.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/vite": "^4.x",
    "typescript": "^5.x",
    "vite": "^5.x"
  }
}
```

---

## Database Schema (Neon / Drizzle ORM)

Schema lives in `packages/server/src/lib/schema.ts`.

```sql
-- Drops (collection release events)
drops (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  name_th         TEXT,
  description     TEXT,
  description_th  TEXT,
  drop_at         TIMESTAMPTZ NOT NULL,
  is_active       BOOLEAN DEFAULT false,
  google_form_url TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)

-- Products
products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  name_th         TEXT,
  description     TEXT,
  description_th  TEXT,
  price           INTEGER NOT NULL,      -- THB in satang (฿1,590 = 159000)
  drop_id         UUID REFERENCES drops(id),
  is_active       BOOLEAN DEFAULT true,
  google_form_url TEXT,                  -- overrides drop-level form if set
  created_at      TIMESTAMPTZ DEFAULT NOW()
)

-- Product Variants
product_variants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id),
  size        TEXT NOT NULL,             -- 'XS','S','M','L','XL','FREESIZE'
  color       TEXT,
  sku         TEXT UNIQUE,
  stock       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
)

-- Product Images
product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id),
  url         TEXT NOT NULL,
  position    INTEGER DEFAULT 0,
  alt_text    TEXT
)

-- Waitlist
waitlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  drop_id     UUID REFERENCES drops(id),
  phone       TEXT,
  campus      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, drop_id)
)

-- Admin Users
admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
)
```

---

## Bilingual (i18n) Strategy

- **Library:** `react-i18next`
- **Default language:** Thai (`th`)
- **Toggle:** `TH / EN` in navbar top-right. Persists in `localStorage` key `abg_lang`.
- **Translation files:** `packages/web/src/locales/th.json` + `en.json`
- **Rule:** Zero hardcoded copy in components. All strings use `t('key')`.
- **Proper nouns:** `ABG`, `SAMYAN BADDIE`, drop names, product names, size labels — untranslated.
- **Prices:** always `฿` prefix, `Intl.NumberFormat` — language-neutral.
- **Dates:** `Intl.DateTimeFormat` with active locale (`th-TH` / `en-GB`).

### Copy Translation Reference

| Key | Thai (th) | English (en) |
|---|---|---|
| `hero.tagline` | `ไม่ใช่ merch. นี่คือ uniform.` | `not merch. a uniform.` |
| `hero.sub` | `เสื้อผ้าของ Samyan Baddie ที่แท้จริง` | `the unofficial samyan baddie uniform.` |
| `drop.countdown.label` | `drop เริ่มใน` | `drop starts in` |
| `drop.waitlist.cta` | `รับแจ้งเตือนก่อนใคร` | `get notified before everyone else.` |
| `drop.notes.label` | `หมายเหตุจากเรา` | `from us.` |
| `product.soldout` | `SOLD OUT` | `SOLD OUT` |
| `product.lowstock` | `เหลือ {{count}} ตัว` | `{{count}} LEFT` |
| `product.orderbutton` | `สั่งเลย` | `order now` |
| `product.ordervia` | `สั่งผ่าน Google Form` | `order via google form` |
| `waitlist.cta` | `แจ้งเตือนฉันก่อน` | `notify me first.` |
| `waitlist.confirm` | `เข้าคิวแล้ว อย่าบอกใคร` | `you're in. don't tell everyone.` |
| `waitlist.already` | `มีชื่อคุณอยู่แล้ว` | `you're already in.` |
| `nav.drops` | `ดรอป` | `drops` |
| `nav.archive` | `คลังเก่า` | `archive` |
| `nav.about` | `เกี่ยวกับเรา` | `about` |
| `nav.waitlist` | `waitlist` | `waitlist` |
| `footer.rights` | `ABG. สงวนลิขสิทธิ์.` | `ABG. all rights reserved.` |
| `archive.soldout` | `SOLD OUT` | `SOLD OUT` |
| `cart.empty` | `ยังไม่มีอะไร` | `nothing here yet.` |

---

## Brand Design System

### Color Tokens (CSS Variables in `globals.css`)
```css
:root {
  --color-cream:    #F5F1E8;
  --color-charcoal: #3F3F44;
  --color-white:    #FFFFFF;
  --color-black:    #0A0A0A;
  --color-red:      #C0392B;
}
```

### Typography
- **Display:** `HK Grotesk Wide` Bold/ExtraBold — headings, hero, product names
- **Body/UI:** `Helvetica Neue` → `Helvetica` → `Arial`
- **Mono:** `Courier New` → `Courier` — stock counts, timestamps, SKU labels
- **Scale:** Hero 6vw–10vw. Tight leading. All uppercase for labels.
- **Thai text:** Helvetica Neue renders Thai fine. No separate Thai font needed.

### Design Language
- No rounded corners anywhere. `border-radius: 0` globally.
- No drop shadows. No gradients. No glow effects.
- 1px `charcoal/20` borders as dividers — never decorative boxes.
- Asymmetric grids. Columns that don't align perfectly.
- Generous negative space, interrupted deliberately.
- Hover: underline slides in or color inverts. Never glow.
- Product image cursor: `crosshair`.

### Global CSS Resets
```css
*, *::before, *::after {
  border-radius: 0 !important;
  box-shadow: none !important;
}
body {
  background-color: var(--color-cream);
  color: var(--color-charcoal);
}
```

---

## Site Architecture & Pages

### Public Routes

#### `/` — Homepage
1. **Hero** — Full-viewport, pure typography. `ACOUSTIC BUT GOATED.` at 8vw HK Grotesk Wide ExtraBold. Translated sub-line below. Animated scroll indicator (thin line, bottom-center).
2. **Drop Banner** — Sticky strip below navbar. Monospace countdown + drop name if a drop is live or upcoming. Hidden if no active drop.
3. **Editorial Grid** — 3–4 products from latest drop. Asymmetric 2-col masonry. Name, price, stock badge. Clicking navigates to product page — no order action on homepage.
4. **Brand Statement** — Large bilingual pull-quote + raw campus photo (full-bleed 16:9).
5. **Footer**

#### `/drop/[slug]` — Drop Page
- **Pre-drop:** Countdown + waitlist capture. No product grid yet.
- **Live:** Product grid + drop notes.
- **Ended:** Greyed-out product grid, all items `SOLD OUT`, no order button.
- No password gate.

Sections: Drop header (name + date + description) → Countdown OR Product grid → Drop Notes (bilingual, brand voice, large typography).

#### `/products/[slug]` — Product Detail
- Two-column desktop (image left sticky, details right), single column mobile.
- Image gallery: primary `3:4` + thumbnail row.
- Detail: name, price `฿X,XXX`, drop label (mono), size pills (OOS crossed out), stock indicator (`X LEFT` / `เหลือ X ตัว` in red if ≤15), material callout in mono.
- **Order button** → opens `google_form_url` in new tab. If no URL: button hidden, shows `"coming soon"`. If fully SOLD OUT: button replaced with `SOLD OUT` badge.
- Size Guide modal. Material Info accordion.

#### `/archive` — Past Drops
- Grid of ended drops. Each card: name, date, image, `SOLD OUT` badge.
- Clicking shows products in greyed-out non-interactive state.
- Exists to build FOMO and cultural cachet.

#### `/about` — Manifesto
- Document/manifesto structure. No boxes, no team headshots.
- Sections: The Name → The Problem → The Product → The Community.
- Bilingual throughout (TH paragraph + EN paragraph, or side-by-side on desktop).
- One raw campus photo full-bleed between sections 2 and 3.

#### `/waitlist` — Waitlist
- Upcoming drop: show drop name + countdown + form.
- No upcoming drop: `"มีอะไรกำลังจะมา" / "something is coming."` + form.
- Fields: Email (required), LINE ID / Phone (optional), Campus (optional free text).
- On submit: write to DB, show confirmation copy. Block duplicate email+drop combos silently.

### Layout

**Navbar** — Fixed top. 1px bottom border. Logo left (`ABG` HK Grotesk Wide). Center links (desktop). `TH / EN` toggle right. Mobile: hamburger → full-screen overlay.

**Footer** — Two-column. Brand statement left. Instagram + inline email capture right. Copyright bottom.

### Admin Routes (`/admin/*`)

All protected by `requireAdmin` middleware (Better Auth session).

- `/admin` — Dashboard: active drop status, waitlist counts, low stock alerts.
- `/admin/drops` — List, create, edit drops. Fields: name EN/TH, slug, drop_at, description EN/TH, Google Form URL, is_active toggle.
- `/admin/products` — List, create, edit products. Fields: name EN/TH, slug, description EN/TH, price (฿ display, satang storage), drop assignment, Google Form URL override, image upload (drag-drop multi), variant stock editor.
- `/admin/waitlist` — Table view, filter by drop, export CSV, email blast via Resend.

---

## Component Library

```
packages/web/src/components/
  ui/
    Button.tsx           -- primary | ghost | disabled
    Badge.tsx            -- soldout | lowstock | live | upcoming
    SizePill.tsx         -- available | selected | soldout
    CountdownTimer.tsx   -- monospace DD:HH:MM:SS, prop: targetDate (UTC ISO)
    Modal.tsx            -- size guide
    Accordion.tsx        -- material info, FAQ
    LanguageToggle.tsx   -- TH / EN switcher

  layout/
    Navbar.tsx
    Footer.tsx
    AdminLayout.tsx      -- sidebar for admin pages

  product/
    ProductCard.tsx      -- image, name, price, stock badge
    ProductGrid.tsx      -- asymmetric 2-col grid
    ImageGallery.tsx     -- primary + thumbnails
    SizeSelector.tsx     -- pills with OOS + stock indicator
    OrderButton.tsx      -- Google Form CTA + sold-out state

  drop/
    DropBanner.tsx       -- sticky countdown strip
    DropHeader.tsx       -- name + date + description
    DropCountdown.tsx    -- large monospace countdown
    DropNotes.tsx        -- bilingual founder notes block

  forms/
    WaitlistForm.tsx

  admin/
    StockEditor.tsx      -- variant table with inline stock editing
    ImageUploader.tsx    -- drag-drop multi-image
    DropForm.tsx         -- bilingual fields
    ProductForm.tsx      -- bilingual fields
```

---

## Environment Variables (single `.env` at repo root)

```env
# Database
DATABASE_URL=              # Neon DB pooled connection string
DATABASE_URL_UNPOOLED=     # Neon DB direct (for migrations)

# Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=           # e.g. https://api.abg.studio

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=         # e.g. drop@abg.studio

# App
PORT=4000                  # Express server port
WEB_URL=http://localhost:5173   # allowed CORS origin (Vite dev URL in dev, prod URL in prod)
VITE_API_URL=http://localhost:4000   # frontend uses this to call the API in prod
```

> In development, Vite proxies `/api` to `localhost:4000` so `VITE_API_URL` is only needed for production builds.

---

## Tailwind Config (`packages/web/tailwind.config.ts`)

```ts
export default {
  theme: {
    extend: {
      colors: {
        cream:    '#F5F1E8',
        charcoal: '#3F3F44',
        red:      '#C0392B',
      },
      fontFamily: {
        display: ['"HK Grotesk Wide"', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
        body:    ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono:    ['"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
}
```

---

## MVP Build Order (Phase 1)

1. Monorepo scaffold — pnpm workspaces, root scripts, shared `.env`
2. `packages/server` setup — Express, TypeScript, Drizzle, Neon, schema, migrations
3. Public API routes — drops, products, waitlist
4. `packages/web` setup — Vite, React, Tailwind, i18n, CSS variables, global resets
5. Homepage — Navbar (with lang toggle), hero, drop banner, editorial grid, footer
6. Drop page — countdown (pre-drop), product grid (live), drop notes
7. Product detail page — gallery, size selector, stock indicator, Google Form order button
8. Waitlist page + form
9. Admin auth — Better Auth, login page, `requireAdmin` middleware
10. Admin: Drop management
11. Admin: Product management (images, variants, stock)
12. Admin: Waitlist (view, export, email blast)

**Phase 2 (post-launch):**
- Archive page
- About / manifesto page
- Payment integration (Stripe + PromptPay)
- Order management
- LINE Notify / SMS drop alerts
- Referral waitlist ("skip the line")
- Analytics dashboard

---

## Design References for Claude Code

1. **PAF (Post Archive Faction)** — primary reference. Cold grid, architectural type, extreme restraint.
2. **SSENSE** — editorial product layout, asymmetric grids, monospace labels.
3. **imnotamorningperson / Represent / Nude Project** — luxurious, clean, minimal layouts with a premium 'Pinterest it-girl' aesthetic. Effortless streetwear basics framed in high-end editorial grids.
4. **Brandy Melville** — effortless minimalism, basics-first photography.

The ABG site should feel like these references had a child who grew up in Samyan and never stopped being online.

**Hard rules for Claude Code:**
- No rounded corners anywhere.
- No drop shadows or gradients.
- No colors outside the defined palette.
- No hardcoded copy — all strings via `t('key')`.
- No cart, bag, or checkout UI (v1 has no payment).
- No password gate on drops.
- NEVER run database seed scripts (e.g., `pnpm --filter server seed` or `tsx src/seed.ts`) or run any commands that delete, truncate, or overwrite database tables. The database products and drops are manually managed by the user on the Neon console, so database records must remain completely intact.
