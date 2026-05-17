# MAQAṢṢ — barbershop prototype

A bilingual (EN / AR) barbershop booking site. Plain HTML + CSS + ES modules. No build step. Submissions land in `localStorage` with a single function marked for Firebase swap-in.

## Run it

ES modules don't load from `file://`, so use a local HTTP server:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

## What's where

```
├─ index.html      home — typographic hero + console menu widget + barber strip + lime CTA
├─ services.html   full services table (5 services, dense rows)
├─ book.html       4-step booking flow with sticky progress sidebar
├─ mine.html       reservations stored on this device
├─ css/
│   ├─ tokens.css       design tokens (bone/carbon/lime, type, spacing, motion)
│   ├─ base.css         reset, body, type, logical-property spacing
│   ├─ components.css   header, footer, system-bar, buttons, .box, .pick, forms
│   ├─ pages.css        hero, console widget, services table, booking grid, mine rows
│   └─ rtl.css          dir-only overrides (mostly numeric runs stay LTR)
├─ js/
│   ├─ data.js     brand + services + barbers (EN/AR)
│   ├─ i18n.js     dictionary + setLanguage() + paint()
│   ├─ app.js      header, active nav, lang toggle, scroll-reveal, magnetic CTAs
│   ├─ book.js     4-step state machine + submitBooking()
│   └─ mine.js     localStorage list + 3-state cancel pattern (5s auto-revert)
└─ assets/
```

## Design direction

**Neo-brutalist** — bone, carbon, acid lime. Single typeface (Space Grotesk), mono accents (JetBrains Mono), Noto Kufi Arabic for ع. Zero rounded corners. Hard 2px borders. No shadows. Asymmetric grids. Big typographic hero (clamp up to 280px). The site reads like a print zine crossed with a system console.

- **Palette.** Bone `#F2EFE6` (page bg), Carbon `#0E0E0C` (ink), Acid Lime `#D4FF3A` (single accent). Steel `#B6B2A6` for tertiary, Blood `#FF3D24` for destructive only.
- **Type.** Space Grotesk 300–700, used at extreme size deltas (11px mono labels next to 240px display). All caps on headings with tight tracking. Tabular numerals on prices/times.
- **Geometry.** `border-radius: 0` everywhere. 2px borders are the default; 4px on emphasis. Buttons translate `(2px, 2px)` on press — no spring, no fade.
- **Motion.** Snap easing (`cubic-bezier(0.8, 0, 0.2, 1)`). Hovers are color inversions, not opacity changes. The system bar dot blinks on a 1.4s step.
- **System bar.** A persistent black strip at the very top with open status, location coords, and a build tag — sets the "industrial" tone immediately.
- **Console widget on home.** Right-rail mini menu styled as a `.txt` file — JetBrains Mono, traffic-light dots in the header, lime footer with the CTA. Makes the booking feel less precious, more utility.

## Bilingual

- The language toggle in the header flips `<html lang>` and `<html dir>` and persists to `localStorage('lang')`.
- All static UI strings live in `js/i18n.js` and reference `data-i18n="key"` attributes.
- Dynamic content (services table, booking flow, my-bookings rows, console widget) repaints on a `languagechange` event.
- Layout flips for free in most places because everything uses logical properties (`margin-inline-start`, etc.). `css/rtl.css` only contains the small set of direction-only adjustments — numeric runs stay LTR; brand mark stays LTR.
- Arabic uses Noto Kufi Arabic — geometric, matches the brutalist grotesque feel of Space Grotesk.

## Booking flow (the core)

Four steps on `book.html`. Sticky sidebar on the left tracks state with `01/02/03/04` numerals and a carbon-on-lime "current" highlight. Total reads from a carbon footer.

1. **Service** — multi-select. Continue disabled until ≥1 picked. Sidebar shows the name when 1, or "`N` services" when 2+.
2. **Barber** — single-select. Auto-advances to step 3.
3. **Date & Time** — 60-day horizontally-scrollable date strip with prev/next arrows that page ~7 days. Month label updates to the months currently visible (e.g. "MAY" or "MAY / JUN"). Slots 10:00–21:00 every 30 min, grouped Morning / Afternoon / Evening, each in its own grid. Fridays before 14:00 are disabled with a "Friday morning · closed" note.
4. **Details** — name (required), phone (required, regex `^[+\d][\d\s-]{7,15}$`), notes (optional). Focus pulls the underline from carbon to lime, doubling the stroke weight.

**Confirmation** replaces the step content with a `BK-XXXXXXXX` reference (mono, 48px) and two CTAs that share a border.

## My Bookings (cancel-with-confirmation)

3-state pattern per row:
- idle → `Cancel`
- first click → row turns blood-red, label becomes `Confirm cancel`, `Keep it` appears
- second click → delete (with a smooth exit animation)
- `Keep it` → revert
- no click for 5 seconds → auto-revert

Tolerates both old (`serviceId: string`) and new (`serviceIds: string[]`) shapes per BRIEF.

## Firebase swap-in

`js/book.js` contains a single `async function submitBooking(booking)` with a clearly-marked comment block. Swap the body for `addDoc(collection(db, 'bookings'), { ...booking, createdAt })` and return `ref.id`. No other code needs to change.

## Accessibility

- `aria-pressed` on every selectable card / row / time cell.
- `aria-current="step"` on the active step.
- `aria-current="page"` on the active nav link.
- Visible `:focus-visible` outline (3px solid lime, no offset — it sits flush against the brutalist borders).
- All form fields have explicit `<label>` text and `autocomplete` attributes.
- Tap targets ≥ 44 × 44 px (input min-height 48; buttons 52–72).
- Reduced-motion respected.
- Skip link in lime to `#main`.

## Mobile

- All layouts work down to 375 px.
- Hero stacks vertically; console widget collapses below the type.
- Services table reflows to a name+price/desc/meta+cta grid.
- Booking grid stacks (sidebar above step content).
- Bottom tab bar (carbon background, lime active state).
- `min-h-[100dvh]` everywhere (no iOS Safari viewport jumping).

## Out of scope

No auth, OTP, payments, admin dashboard, real photos, SMS/email, or backend (yet). All explicitly per BRIEF.
