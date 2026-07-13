# ABG Design System

**Attitude Before Garment** — cut-first, dry, quiet. The site should feel like one continuous visual system: cream space, Helvetica type, photography that breathes. Not print-era tech UI, not hype merch energy.

Brand narrative and audience live in [`ABG (_Attitude Before Garment_) Brand Identity & Vibe Document.md`](./ABG%20(_Attitude%20Before%20Garment_)%20Brand%20Identity%20%26%20Vibe%20Document.md). This file is the **product UI** source of truth.

---

## Principles

1. **Quiet over loud** — One true specific line beats five enthusiastic ones. No marquees, no mono ticker tape, no screaming hashtags.
2. **Cut over chrome** — Let product imagery and type do the work. Borders, slabs, and “system” UI are the exception, not the default.
3. **One composition** — Landing and promotional surfaces read as a single field (hero → section → grid → closer), not a dashboard of widgets.
4. **Flat and sharp** — No rounded corners, no drop shadows, no decorative gradients.
5. **Restraint is the flex** — If a control looks like it belongs on a terminal or a streetwear drop tracker, rewrite it in Helvetica on cream.

---

## Color

Use only these tokens (Tailwind: `cream`, `charcoal`, `red`; CSS vars in `globals.css`).

| Token | Hex | Role |
|-------|-----|------|
| Cream | `#F5F1E8` | Page ground, section fields, quiet chrome |
| Charcoal | `#3F3F44` | Body text, icons, hairlines, primary UI |
| White | `#FFFFFF` | Product image grounds, high-contrast surfaces |
| Black | `#0A0A0A` | Rare — near-black only when true black is required |
| Red | `#C0392B` | Sold-out / critical status only |

### Opacity scale (charcoal on cream)

| Use | Class / value |
|-----|----------------|
| Primary text | `text-charcoal` |
| Supporting / meta | `text-charcoal/70` |
| Labels / muted | `text-charcoal/50`–`/55` |
| Hairline rules | `border-charcoal/15` |
| Disabled | `opacity-30` |

### On photography

- Hero / overlay type: **white** (`text-white`), not cream.
- Nav over image: cream/white links at ~85% opacity, full on hover.

Selection: charcoal background, cream text.

---

## Typography

| Role | Family | Tailwind | Use |
|------|--------|----------|-----|
| Display / UI | Helvetica Neue → Helvetica → Arial | `font-display`, `font-body` | Headlines, nav, product meta, body, CTAs |
| Brand accent | Jeffrson | `font-brand` | Logo feel / rare lockup accents — not body copy |
| Mono | Courier New | `font-mono` | **Deprecated for marketing UI.** Do not introduce on home, product grids, or brand pages. |

HK Grotesk is retired. Do not reintroduce it.

### Tracking & case

- Default tracking for display/nav: `-0.07em` (`tracking-[-0.07em]`).
- Supporting / meta: `-0.04em`.
- Prefer **lowercase** for nav, labels, product names, section titles.
- Sentence case for longer body lines. Avoid ALL-CAPS marketing blocks.

### Scale (reference)

| Element | Approx size | Weight |
|---------|-------------|--------|
| Hero title | `clamp(1.75rem, 4vw, 2.45rem)` | Bold |
| Section title | 24–32px | Bold |
| Nav / primary links | 14px | Regular |
| Body / hero support | 15–18px | Regular |
| Product name | 13–14px | Medium |
| Price / meta | 12–13px | Regular |
| Status / micro | 11–12px | Regular |

Line height: tight on headlines (`leading-none` / `leading-snug`); snug on body.

---

## Layout & spacing

- **Page ground:** `bg-cream` full bleed.
- **Horizontal padding** (match home hero): `px-6` → `md:px-8` → `lg:px-[27px]` (or `lg:px-6.75` if configured).
- **Content max width:** `max-w-7xl` for grids and section content when needed.
- **Section rhythm:** generous vertical padding (`py-16`–`py-24`); air between blocks over dense packing.
- **Hairlines:** `border-charcoal/15` — not heavy black bars.
- **Grids:** soft gaps (`gap-4` → `md:gap-6` → `lg:gap-8`). Never 1px charcoal “tech” gutters.

### Heroes

- Full-bleed photo as the edge-to-edge plane.
- Overlay copy bottom-left (or similarly grounded), not floating badges or promo chips on the image.
- First viewport: brand/signal + one headline + short support (+ CTA if needed) — no stats, schedules, or chrome clutter.

---

## Components

### Navigation

- Overlay on heroes (no spacer when `overlay`).
- Centered lowercase Helvetica links, tight tracking.
- Mobile: charcoal panel, large bold lowercase links, simple icon + label for account/cart.
- Hover: opacity / color shift only — no fill snaps.

### Drop notice (`DropBanner`)

- Thin cream strip, Helvetica, lowercase.
- Quiet facts: upcoming · name · countdown.
- Not a charcoal banner or mono alert bar.

### Product grid

- Cream field, open columns (2 / 3 / 4 by breakpoint).
- Soft gaps; no bordered charcoal lattice.

### Product card

- Image on white/cream ground; `object-contain` with padding (air around the garment).
- Meta **under** the image on cream — name + price in Helvetica; no charcoal footer slab.
- Status: tiny lowercase Helvetica (or red for sold out) — no mono `■ 1 LEFT` blocks.
- Favorite / add: light line icons; no bordered mono buttons.
- Hover: subtle scale (`~1.02`) or opacity — never black-fill snap.

### Pagination & links

- Helvetica text links in charcoal / charcoal-70.
- No boxed mono prev/next buttons.

### Section closer

- One short dry line, Helvetica, charcoal/70.
- Optional hairline above. No uppercase manifesto billboard.

### Forms & interactive surfaces

- Square corners (`border-radius: 0`).
- Flat fills; charcoal/cream contrast for primary actions when needed.
- Prefer quiet text buttons on cream for secondary actions.

---

## Motion

- Prefer opacity and soft transform only.
- Keep durations short (~200–500ms), ease-out.
- Motion creates presence and hierarchy — not noise (no endless marquees on brand surfaces).

---

## Voice (UI copy)

Tone: dry, understated, specific, quietly self-aware.

| Do | Don’t |
|----|--------|
| “limited run. cut first. no restocks.” | “Shop our high-quality collection today!” |
| “something is coming.” | “ACOUSTIC BUT GOATED” / NPC / fit-pic energy |
| Specific craft facts | Hype scarcity language |
| Lowercase, short lines | Explaining the fit or announcing the joke |

All user-facing strings go through i18n (`locales/en.json`, `locales/th.json`) via `t('key')` — no hardcoded marketing copy in components.

---

## Imagery

- Candid over posed; motion and drape over studio stiffness.
- Let silhouette and cut read clearly.
- Product cards: garment readable with air — not crushed in a harsh frame.
- Favicons: cream / grey SVG set under `public/favicon/`.

---

## Anti-patterns (retired)

Do not bring these back on brand-facing surfaces (home, about, product browse, heroes):

- Charcoal mono marquees / ticker tape
- `bg-charcoal gap-[1px] border border-charcoal` product grids
- Charcoal meta slabs under product images
- Mono uppercase status blocks (`■ 1 LEFT`, `BATCH_01`, etc.)
- Heavy black section rules and “tech grid” backgrounds as decoration
- Rounded corners, shadows, purple gradients, pill clusters, floating promo badges on heroes
- HK Grotesk, print-era “Acoustic But Goated” marketing chrome

Legacy mono/tech patterns may still exist on older drop-archive tooling pages — new work should follow this document and migrate when those surfaces are touched.

---

## Implementation map

| Concern | Location |
|---------|----------|
| CSS tokens & base | `packages/web/src/styles/globals.css` |
| Tailwind theme | `packages/web/tailwind.config.ts` |
| Copy | `packages/web/src/locales/en.json` |
| Agent hard rules | `.cursorrules` |

When in doubt: cream field, Helvetica, lowercase, hairline, air — then stop.
