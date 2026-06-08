# ABG Implementation Plan

## Phase 1: Foundation + Public Frontend ✅ COMPLETE

### Monorepo Scaffold ✅
- [x] Root `package.json` with pnpm workspaces config
- [x] `pnpm-workspace.yaml` pointing to `packages/*`
- [x] `.gitignore` for Node, builds, env files
- [x] `.env` with Neon database credentials
- [x] `.env.example` for reference

### Backend: `packages/server` ✅

#### Config Files
- [x] `package.json` with Express, Drizzle, Resend, Better Auth
- [x] `tsconfig.json` (Node.js, ES2022)
- [x] `drizzle.config.ts` pointing to root `.env`

#### Database & ORM
- [x] `src/lib/schema.ts` — 6 tables:
  - `drops` — collection release events (id, slug, name, name_th, description, description_th, drop_at, is_active, google_form_url, created_at)
  - `products` — individual items (id, slug, name, name_th, description, description_th, price, drop_id, is_active, google_form_url, created_at)
  - `product_variants` — sizes/colors with stock (id, product_id, size, color, sku, stock, created_at)
  - `product_images` — gallery (id, product_id, url, position, alt_text)
  - `waitlist` — email signups (id, email, drop_id, phone, campus, created_at) with unique(email, drop_id)
  - `admin_users` — admin accounts (id, email, name, created_at)
- [x] `src/lib/db.ts` — Neon serverless client via `@neondatabase/serverless`
- [x] `src/lib/email.ts` — Resend client stub (email templates in phase 2)
- [x] Schema migrated to Neon PostgreSQL

#### Middleware
- [x] `src/middleware/errorHandler.ts` — global error handler with AppError class
- [x] `src/middleware/auth.ts` — `requireAdmin` stub (Better Auth in phase 2)

#### Routes
- [x] `src/routes/drops.ts`
  - `GET /api/drops` — list active/upcoming drops, ordered by drop_at
  - `GET /api/drops/:slug` — drop + joined products/variants/images
- [x] `src/routes/products.ts`
  - `GET /api/products/:slug` — product + variants + images
- [x] `src/routes/waitlist.ts`
  - `POST /api/waitlist` — insert email, handle unique constraint silently (200 both ways)
- [x] `src/routes/admin/index.ts` — stubs for phase 2, all return 401
- [x] `src/index.ts` — Express app with CORS, json middleware, routes

### Frontend: `packages/web` ✅

#### Config Files
- [x] `package.json` with React, Vite, Tailwind, i18next, Zustand, Motion
- [x] `vite.config.ts` with Tailwind plugin, `/api` proxy to `:4000`
- [x] `tailwind.config.ts` with brand colors + font families
- [x] `index.html` minimal shell

#### Styles & i18n
- [x] `src/styles/globals.css` — CSS vars, global resets (border-radius: 0, box-shadow: none), @font-face for HK Grotesk Wide
- [x] `src/i18n.ts` — react-i18next init, default `th`, localStorage key `abg_lang`
- [x] `src/locales/th.json` — 30+ Thai translation keys
- [x] `src/locales/en.json` — 30+ English translation keys

#### State Management
- [x] `src/store/ui.ts` — Zustand: `language`, `setLanguage`, `mobileMenuOpen`, `setMobileMenuOpen`

#### API & Routing
- [x] `src/lib/api.ts` — typed fetch helpers:
  - `getDrops()`, `getDrop(slug)`, `getProduct(slug)`, `joinWaitlist(data)`
  - TypeScript interfaces for Drop, Product, ProductVariant, ProductImage
- [x] `src/main.tsx` — React root, i18n provider, Router
- [x] `src/App.tsx` — React Router v7:
  - `/` → Home
  - `/drop/:slug` → DropPage
  - `/products/:slug` → ProductDetail
  - `/waitlist` → Waitlist

#### UI Components (19 total) ✅

**Primitives** (`src/components/ui/`)
- [x] `Button.tsx` — variants: primary (black bg, cream text), ghost (border), disabled
- [x] `Badge.tsx` — variants: soldout, lowstock, live, upcoming
- [x] `SizePill.tsx` — size selector (available/selected/soldout states)
- [x] `CountdownTimer.tsx` — ticking DD:HH:MM:SS, monospace, updates every 1s
- [x] `Modal.tsx` — full-screen overlay, close on ESC or backdrop click
- [x] `Accordion.tsx` — expandable items, single or multi mode
- [x] `LanguageToggle.tsx` — TH/EN toggle, syncs with i18n + localStorage

**Layout** (`src/components/layout/`)
- [x] `Navbar.tsx` — fixed top, 1px border, logo left, nav center (desktop), toggle + hamburger right, mobile overlay
- [x] `Footer.tsx` — two-column: brand statement left, Instagram + email capture right, copyright bottom

**Product Components** (`src/components/product/`)
- [x] `ProductCard.tsx` — image (crosshair cursor), name, price (฿), stock badge
- [x] `ProductGrid.tsx` — grid-cols-2 (md), gap-6, maps ProductCards
- [x] `ImageGallery.tsx` — primary 3:4 image, thumbnail row, selectable
- [x] `SizeSelector.tsx` — size pills with OOS + stock info
- [x] `OrderButton.tsx` — Google Form link or "coming soon" or SOLD OUT badge

**Drop Components** (`src/components/drop/`)
- [x] `DropBanner.tsx` — sticky strip with countdown + drop name (fetches latest drop)
- [x] `DropHeader.tsx` — drop name, date, description (bilingual)
- [x] `DropCountdown.tsx` — large monospace countdown (reuses CountdownTimer)
- [x] `DropNotes.tsx` — bilingual founder notes, large typography

**Forms** (`src/components/forms/`)
- [x] `WaitlistForm.tsx` — email (required), phone (optional), campus (optional), submit/loading/confirm states

#### Pages ✅

- [x] `src/pages/Home.tsx`
  - Hero: "ACOUSTIC BUT GOATED." at 8vw, tagline, scroll indicator
  - DropBanner (sticky)
  - Editorial Grid: latest drop products (up to 4)
  - Brand Statement: pull-quote + image placeholder
  - Footer

- [x] `src/pages/DropPage.tsx`
  - DropHeader (name, date, description)
  - **Pre-drop**: DropCountdown + WaitlistForm
  - **Live**: ProductGrid + DropNotes
  - **Ended**: greyed-out grid with SOLD OUT badges
  - Error state if drop not found

- [x] `src/pages/ProductDetail.tsx`
  - Desktop two-col (image left sticky, details right), mobile single-col
  - ImageGallery + price (฿ formatted) + drop label
  - SizeSelector (shows stock)
  - OrderButton (form link / coming soon / sold out)
  - Modal: Size Guide (stub content)
  - Accordion: Material Info

- [x] `src/pages/Waitlist.tsx`
  - Shows upcoming drop (name + countdown) or "something is coming"
  - WaitlistForm

#### Static Assets
- [x] `public/fonts/.gitkeep` — ready for HK Grotesk Wide `.woff2` files

#### Drizzle Migrations
- [x] `drizzle/0000_loose_retro_girl.sql` — creates all 6 tables + constraints
- [x] `drizzle/meta/` — migration metadata

### Design System Compliance ✅
- [x] No rounded corners (global `border-radius: 0 !important`)
- [x] No shadows or gradients (global `box-shadow: none !important`)
- [x] Color palette: cream (#F5F1E8), charcoal (#3F3F44), red (#C0392B), black (#0A0A0A), white
- [x] Typography: HK Grotesk Wide (display), Helvetica Neue (body), Courier New (mono)
- [x] Product images: cursor crosshair
- [x] All copy via `t('key')` — zero hardcoded strings
- [x] No cart/bag/checkout UI
- [x] No password gates on drops

### Verification ✅
- [x] `pnpm install` → 274 packages, no errors
- [x] `pnpm db:push` → schema migrated to Neon
- [x] `pnpm dev` → Vite on `:5173`, Express on `:4000`
- [x] Frontend HTML loading correctly
- [x] API endpoints responding:
  - `GET /api/drops` → `[]` (empty, database ready)
  - `GET /api/products/:slug` → 404 with proper error
- [x] Error handling working

---

## Phase 2: Admin Panel (Post-Launch)

### Admin Auth & Setup
- [ ] Better Auth integration
  - [ ] Session-based auth
  - [ ] Login page
  - [ ] `requireAdmin` middleware enforcement
- [ ] `/admin` — Dashboard with:
  - [ ] Active drop status
  - [ ] Waitlist counts
  - [ ] Low stock alerts

### Admin: Drop Management (`/admin/drops`)
- [ ] List all drops (table view)
- [ ] Create drop (form: name EN/TH, slug, drop_at, description EN/TH, google_form_url, is_active toggle)
- [ ] Edit drop (PATCH)
- [ ] Delete/soft-delete drop (set is_active = false)

### Admin: Product Management (`/admin/products`)
- [ ] List products (table view)
- [ ] Create product (form: name EN/TH, slug, description EN/TH, price ฿ display / satang storage, drop assignment, google_form_url override)
- [ ] Edit product (PATCH)
- [ ] Delete/soft-delete product
- [ ] Image upload (drag-drop multi, multer middleware)
- [ ] Variant stock editor (inline table: size, color, SKU, stock)

### Admin: Waitlist (`/admin/waitlist`)
- [ ] Table view with filter by drop
- [ ] Export CSV (email, phone, campus, created_at)
- [ ] Email blast via Resend (pre-written template)

---

## Phase 3: Public Pages (Post-Launch)

### `/archive` — Past Drops
- [ ] Grid of ended drops (name, date, image, SOLD OUT badge)
- [ ] Click to expand and show products (greyed-out, non-interactive)
- [ ] Exists to build FOMO and cultural cachet

### `/about` — Manifesto
- [ ] Document structure (no boxes, no team headshots)
- [ ] Sections: The Name → The Problem → The Product → The Community
- [ ] Bilingual (TH + EN side-by-side or stacked)
- [ ] One raw campus photo full-bleed between sections 2 and 3

---

## Phase 4: Payment & Order Management (Post-Launch)

### Stripe + PromptPay Integration
- [ ] Checkout page
- [ ] Payment processing (Stripe API)
- [ ] PromptPay QR code fallback
- [ ] Order confirmation email

### Order Management
- [ ] Order table in database
- [ ] Admin order tracking
- [ ] Customer order history (email-based lookup or login)

---

## Phase 5: Advanced Features (Post-Launch)

- [ ] LINE Notify / SMS drop alerts
- [ ] Referral waitlist ("skip the line")
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Customer relationship management

---

## File Structure

```
abg/
├── .env                           (populated with Neon creds)
├── .env.example                   (template)
├── .gitignore
├── package.json                   (root, pnpm workspaces)
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── project.md                     (spec document)
├── PLAN.md                        (this file)
├── packages/
│   ├── server/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts
│   │   ├── drizzle/
│   │   │   ├── 0000_loose_retro_girl.sql
│   │   │   └── meta/
│   │   └── src/
│   │       ├── index.ts
│   │       ├── lib/
│   │       │   ├── db.ts
│   │       │   ├── schema.ts
│   │       │   └── email.ts
│   │       ├── middleware/
│   │       │   ├── auth.ts
│   │       │   └── errorHandler.ts
│   │       └── routes/
│   │           ├── drops.ts
│   │           ├── products.ts
│   │           ├── waitlist.ts
│   │           └── admin/
│   │               └── index.ts
│   └── web/
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── index.html
│       ├── public/
│       │   └── fonts/
│       │       ├── HKGroteskWide-Bold.woff2          (add me)
│       │       └── HKGroteskWide-ExtraBold.woff2     (add me)
│       └── src/
│           ├── main.tsx
│           ├── App.tsx
│           ├── i18n.ts
│           ├── locales/
│           │   ├── th.json
│           │   └── en.json
│           ├── styles/
│           │   └── globals.css
│           ├── store/
│           │   └── ui.ts
│           ├── lib/
│           │   └── api.ts
│           ├── components/
│           │   ├── ui/              (7 components)
│           │   ├── layout/          (2 components)
│           │   ├── product/         (5 components)
│           │   ├── drop/            (4 components)
│           │   ├── forms/           (1 component)
│           │   └── admin/           (stub, phase 2)
│           └── pages/
│               ├── Home.tsx
│               ├── DropPage.tsx
│               ├── ProductDetail.tsx
│               └── Waitlist.tsx
```

---

## Commands

```bash
# Install dependencies
pnpm install

# Development (both frontend + backend)
pnpm dev

# Build for production
pnpm build

# Database management
pnpm db:generate    # Generate migrations from schema
pnpm db:push        # Push schema to Neon
pnpm db:migrate     # Run migrations (if using migration files)

# Filter by package
pnpm --filter web dev      # Just frontend
pnpm --filter server dev   # Just backend
```

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Repo | pnpm workspaces monorepo |
| Frontend | React 18 + Vite 5 + TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS Variables |
| Routing | React Router v7 |
| State | Zustand 4 |
| i18n | react-i18next 14 + i18next 23 |
| Animations | Motion 11 (Framer Motion) |
| Backend | Express 4 + TypeScript 5 |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Auth | Better Auth (phase 2) |
| Email | Resend |
| File Upload | Multer (phase 2) |
| Validation | Zod |
| CORS | cors middleware |

---

## Next Steps

1. **Add font files**: Download HK Grotesk Wide `.woff2` files and place in `packages/web/public/fonts/`
2. **Populate database**: Create sample drops and products via admin panel (phase 2)
3. **Customize content**: Update About and Brand Statement copy
4. **Deploy**: Vercel (web) + Railway/Render (server)
5. **Phase 2**: Admin panel with auth, drop/product/waitlist management
