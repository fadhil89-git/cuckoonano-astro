# CUCKOONANO Astro Handoff Notes

This project is an Astro migration for `cuckoonano.com`.

The owner is actively reorganising an old WordPress site into a cleaner Astro structure. Treat the current working tree as intentional, even if there are many modified/deleted/untracked files. Do not revert unrelated changes.

## Project Context

- Framework: Astro static site.
- Main source folder: `src/pages/`.
- Product pages live under: `src/pages/products/`.
- Location pages are dynamic under:
  - `src/pages/locations/[state]/index.astro`
  - `src/pages/locations/[state]/[location]/index.astro`
- Blog migration is already done.
- Do not touch `src/pages/blog/` unless explicitly asked.
- Do not move blog articles.
- Do not create blog redirects unless the URL is clearly product/business related.

## Important SEO Decisions Already Made

- Full SEO implementation guideline lives in `SEO_GUIDELINE.md`. Refer to it before creating or updating product, blog, location, service, redirect, sitemap, or schema-related pages.
- Old WordPress URLs with SEO value should 301 redirect to the closest clean final URL.
- Do not blindly keep long WordPress slugs as final URLs.
- Product final URLs should generally follow:
  - `/products/[category]/[product-name]/`
- Do not redirect product URLs to `/blog/`, homepage, or generic `/products/`.
- Canonicals should point to the clean final URL, not old redirected URLs.
- Sitemap should include final clean URLs only.
- Internal links should point directly to final URLs, not old redirected URLs.
- `/cuckoo-vs-coway/` must stay at root level.

## Current Product Structure Direction

Preferred product/category structure:

- `/products/water-purifier/`
- `/products/water-purifier/xcel-2/`
- `/products/water-purifier/prime-x3/`
- `/products/air-purifier/`
- `/products/air-purifier/k-model/`
- `/products/air-purifier/i-model/`
- `/products/pressure-cooker/m10/`
- `/products/treadmill/b-fit/`
- `/products/samsung/`
- `/products/massage-chair/`
- `/products/mattress/`
- `/products/induction/`

Root-level legacy folders such as `/k-model/`, `/i-model/`, `/r-model/`, `/u-model/`, `/m10-multi-cooker-rice-cooker/`, and `/cuckoo-b-fit/` are being cleaned up and should redirect to clean product URLs.

## Location Page Decision

For state/district/location pages, keep the current approach for now:

- Location page = local intent, coverage, installation/service confidence, and category discovery.
- Product page = product details, price, promo, comparison, and CTA.

Do not list every product and price on every location page for now. It creates maintenance risk and visual overload.

KIV idea for later:

- More informative category cards on location pages.
- Category cards could show category name, short use case, model count, and starting price.
- If implemented later, data must come from a single shared source, not manually repeated on every location page.

## Product Section Decision

The page `/products/water-purifier/` uses the existing product selector style from `public/assets/js/main.js`.

When adding product/category sections to Astro product pages:

- Match the existing style from `/products/water-purifier/`.
- Do not invent a new visual system unless explicitly requested.
- Do not duplicate separate versions of product cards if avoidable.
- Prefer a shared data/component approach so future price/model updates are not missed.

Relevant files:

- `public/assets/js/main.js`
- `public/assets/js/site-data.js`
- `src/components/ProductCategorySection.astro`
- `src/components/ProductCard.astro`
- `src/pages/products/water-purifier/index.astro`

## Prime X3 Page

Page created:

- `src/pages/products/water-purifier/prime-x3/index.astro`

Positioning:

- Do not sell it merely as an outdoor filter.
- Main angle: "Air bersih untuk seluruh rumah, bukan dapur sahaja."
- Product: CUCKOO Prime X3 Outdoor Water Filter.
- Pricing:
  - Rental plan: 60 bulan
  - RM12/bulan untuk 6 bulan pertama
  - Bulan 7-60: RM88/bulan
  - Outright promo: RM2100
  - Normal outright: RM2600
  - Service setiap 6 bulan
- Promo must be described as subject to current terms/campaign period.

Assets:

- `public/assets/images/products/water-purifier/prime-x3/`

## B-Fit Treadmill Task

The user provided a draft standalone HTML file:

- `/Users/wanahmadfadhil/Documents/website cuckoo/Web belum/b-fit-treadmill-premium-tailwind-v2.html`

Use it as content/reference only. Do not copy it directly.

Why not copy directly:

- It is standalone HTML with its own `<html>`, `<head>`, header, footer, Tailwind CDN, and custom CSS.
- The Astro site already has `BaseLayout`, nav, global styles, CTA patterns, and product structure.
- It uses CSS-drawn treadmill visuals. Prefer real product images from local assets.
- Some copy is draft/placeholder, e.g. "Section ini..." and "Ganti dengan gambar sebenar nanti".

Existing Astro page:

- `src/pages/products/treadmill/b-fit/index.astro`

Current page is still basic and should be upgraded into a proper product landing page.

Recommended B-Fit page flow:

1. Hero
   - H1: `CUCKOO B-Fit Treadmill`
   - Headline angle: `Jalan, joging dan lari dari rumah`
   - CTA WhatsApp
   - Price pill: `RM12/bulan 6 bulan pertama`
   - Product image: `/assets/images/Gambar%20Produk%20png/b-fit.webp`

2. Problem section
   - Tak sempat ke gym
   - Cuaca tak menentu
   - Ruang rumah terhad
   - Nak konsisten bergerak di rumah

3. Feature showcase
   - 2-in-1 walking + running
   - Foldable 20cm
   - Walking 1-6 km/h, running 1-14 km/h
   - 15 preset programs + U1-U3 custom
   - 8-point shock absorption
   - LED display + Bluetooth speaker

4. Pricing
   - Rental: RM12/bulan 6 bulan pertama
   - After promo: RM102/bulan
   - Outright: RM3,399
   - Promo subject to current campaign/terms

5. Service / CUCKOO+ Care
   - Service setiap 6 bulan
   - 3 tahun service & warranty for rental
   - Free belt change bulan ke-24
   - Pemasangan diuruskan CUCKOO

6. Specification table
   - Model: CUCKOO B-FIT Treadmill (CTM-YT102)
   - Display: speed, step number, time, distance, calories
   - Built-in program: 15 preset + 3 custom U1-U3
   - Speed: walking 1-6 km/h, running 1-14 km/h
   - Motor: DC motor peak power 2.0 HP
   - Running belt: 1050mm x 420mm
   - Folded size: 1327mm x 758mm x 200mm
   - Unfolded size: 1255mm x 758mm x 1087mm
   - Weight supported: 100kg

7. FAQ
   - Sesuai untuk apartment?
   - Boleh guna untuk walking sahaja?
   - Promo RM12 berapa lama?
   - Rental vs outright beza apa?
   - Service termasuk apa?
   - Had berat maksimum?

SEO recommendation for B-Fit:

- Meta title: `CUCKOO B-Fit Treadmill | Harga Rental & Promo RM12`
- Meta description: `Semak CUCKOO B-Fit Treadmill untuk rumah: walking, running, foldable 20cm, 15 preset program, service berkala dan promo rental RM12/bulan.`
- Canonical: `https://www.cuckoonano.com/products/treadmill/b-fit/`
- Add JSON-LD:
  - Product
  - FAQPage
  - BreadcrumbList if consistent with site pattern

## Samsung Side-by-Side Refrigerator 583L Page

Page: `src/pages/products/samsung/side-by-side-refrigerator-583l/index.astro`

Final URL: `/products/samsung/side-by-side-refrigerator-583l/`

Assets folder: `public/assets/images/products/samsung/refrigerator/`

Product facts (single source of truth for this page):

- Model: 583L Refrigerator Side-by-Side, SmartThings AI Energy.
- Model code / SKU / MPN: `F-SBSREFSLV/2W` (RS4000DC series).
- Capacity: 583L total (375L fridge + 208L freezer).
- Type: Side-by-Side, Mono Cooling, No Frost.
- Design / colour: Gentle Silver Matt, flat door, recess handle.
- Unit size (W x H x D): 912mm x 1780mm x 654mm. Weight: 91kg.
- Cooling: All-Around Cooling, Power Cool, Power Freeze.
- Compressor: Digital Inverter (10-year warranty). Refrigerant R-600A.
- Energy: 385 kWh/year. AI Energy Mode helps save up to ~10%.
- Smart: WiFi Embedded + SmartThings (Control, Energy, Home Care, Food).
- Pricing: rental from RM85/bulan (60 bulan / 5 tahun); outright RM4,099.
- Warranty: rental = 5-year exclusive; outright = 2-year standard + 1-year CUCKOO extended; compressor 10 years.
- Free gift: set pisau CUCKOO (tertakluk terma/stok/kelayakan).
- WhatsApp CTAs use the global `rotatingWhatsapp()` helper (do not hardcode wa.me here).

Interactive sections (vanilla JS in the page's single `is:inline` script, no new deps):

- Hero product image: 5-sisi slider (arrows + dots + swipe + click-to-zoom). NO auto-rotate (user preference). Images: `Refrigerator-cuckoo-samsung.webp`, then `Refrigerator-3/4/5/6-Photoroom.webp`. `heroPrimary` is slide 1 and is the preload/LCP image.
- "Masalah Harian" section: problem -> solution slider. Left column = problem statement + maroon Solusi box + the 4 tab buttons (Masalah 1/2/3 + Penyelesaian, bottom). Right column = image (fills column height via `flex-1` + `lg:h-full`) + readable caption card below. AUTO-rotate every 5s, resets on click/swipe. Solution tab/card uses emerald accent. Images: `peti-sejuk-penuh.webp`, `peti-sejuk-bil-letrik-mahal.webp`, `peti-sejuk-frost-beku.webp`, `peti-sejuk-cuckoo-baru.webp`. Image here is NOT clickable (no zoom).
- "Gambar Produk Sebenar" gallery: borderless big image slider (`Refrigerator-2..8.webp`) with click-to-zoom lightbox.
- "How to measure" (Kitchen Fit): responsive `<picture>` — desktop `my-feature-how-to-measure-542859111.avif`, mobile `...112.avif` — click-to-zoom.
- Testimoni: swipe slider (drag + arrows), same pattern as the TV page.
- Shared zoom lightbox (`#zoomLightbox`) used by gallery + measure; hero handles its own zoom call. Elements opt in with `data-zoom` (generic) or `data-hero-zoom` (hero).
- Free Delivery + Warranty strip uses `free-shipping-icon.png` + `warranty-icon.png`.
- SmartThings sub-feature strip uses `RS4000DC_PC_Main08-2/3/4.webp`.

SEO (already done — keep in sync if content changes):

- Meta title/description, canonical, OG image, `preloadImages` all set in `BaseLayout` props.
- All `<img>` have descriptive Malay alt text (keep this rule for any new image).
- JSON-LD: `Product` (image array, brand+manufacturer Samsung, model RS4000DC, sku/mpn, color, `additionalProperty` specs, dual `offers` rental RM85/month + outright RM4099, each with `itemCondition` NewCondition + `priceValidUntil`), `FAQPage` (8 Q&A), `BreadcrumbList`.
- `priceValidUntil` is a constant in frontmatter — bump it when promo period changes.
- Sitemap: URL present in `public/sitemap.xml` (removed an old duplicate laundry-combo entry while here).

## CUCKOO INDUCTWO Hybrid Induction Hob Page

Page: `src/pages/products/induction/inductwo/index.astro`
Final URL: `/products/induction/inductwo/` (already in `public/sitemap.xml`).
Assets: `public/assets/images/products/induction/inductwo/` (renamed to SEO slugs `dapur-induksi-cuckoo-inductwo-...-malaysia.webp`), plus shared `public/assets/images/products/induction/` (cooking-mode icons `pan-fry/grill/hot-pot/boil/keep-warm.webp`, `cooker-landing-02/04.webp`, 6 `kenapa-induction-...card-*.webp`), hero shot `Gambar Produk png/cuckoo inductwo.webp`, service assets `products/induction/servis/` + technician `service/Cuckoo-Servis copy.webp`.

Product facts (single source of truth for this page):

- Hybrid hob: 1 Induction zone + 1 Highlight zone. Dual Highlight Zone (expansion function). France Eurokera Ceramic Glass. Plug 13A. Quick Heating + Turbo Mode. Auto-cook: Pan Fry, Grill, Hot Pot, Boil, Keep Warm. ECO-Hybrid Power (has its own full section w/ `cooker-landing-04.webp`, `*INDUCTWO Only`).
- Dimensions 588 × 508 × 67 mm, 9 kg (from the spec diagram image).
- Pricing: Outright RM2,600. Rental RM91/bulan (tanpa casing = built-in) or RM101/bulan (dengan casing = free-standing), 5-year (60-month) contract. Promo hook RM12/bulan (tempoh kempen semasa — not tied to a fixed month count). CCSP (CUCKOO+ Care Service Package) RM493.50/year for INDUCTWO (NOT RM470; Inductrio is RM556.50 — do not mix).
- WhatsApp CTAs: hardcoded `whatsappUrl` (api.whatsapp.com, so gtag click tracking fires). `priceValidUntil` constant in frontmatter.

Deliberate exclusions / wording rules:

- INDUCTRIO-only features NOT used here: Direct Touch Sensor (`cooker-landing-03.webp` avoided). Use "Turbo Mode" wording, not "IH-Booster".
- "IH-Ultra" term appears on poster image `...poster-4.webp` (kept in gallery) but is NOT used in body copy; keep alt text neutral.
- Removed poster `...poster-3.webp` (showed RM98/month, conflicts with RM91/RM101) — file deleted from folder.
- Induction safety wording stays soft: no "100% selamat" / "tidak akan kebakaran" / "permukaan tidak panas". Note surface can still get hot from cookware.

Section order: Hero (image before pricing on mobile via order-3) → "Kenapa Beralih Ke Induction" (6-card auto marquee) → gas problem → `cooker-landing-02` tech poster → 6 reasons → heat tech → ECO-Hybrid → benefits → cooking modes (big round icons) → poster gallery (7 square posters, custom lightbox) → real-photo gallery (`ProductGallerySlider`) → CUCKOO+ Care Service (intro + 4 cards + CCS 8-Point Check + 6-step process; grid on ≥sm, auto marquee on mobile; step file order is REVERSED vs process order) → spec → built-in vs free-standing → pricing → FAQ (14, incl. 4 service Q&A) → summary → shared `data-promo`/`data-product-selector`/`data-agent-block`.

Reusable JS in the page's `is:inline` script: generic marquee runs on every `[data-marquee]` (kenapa cards + service steps), only animates when track is visible + overflowing (`offsetParent` + `scrollWidth > clientWidth`); duplicate the items so half the scrollWidth = one set. Poster lightbox keyed to `[data-poster-open]` / `[data-poster-lightbox]`.

JSON-LD: `Product` (image array, brand+manufacturer CUCKOO, model INDUCTWO, dual `offers` rental RM12 + outright RM2600 with `itemCondition`+`priceValidUntil`), `FAQPage` (14 Q&A), `BreadcrumbList`.

Service section is INDUCTWO-only — do NOT copy it onto other product pages.

## Design Guidance

- Follow the existing site style, especially product pages like:
  - `src/pages/products/water-purifier/xcel-2/index.astro`
  - `src/pages/products/water-purifier/prime-x3/index.astro`
- Do not add a separate standalone navbar/footer inside product pages.
- Use `BaseLayout`.
- Use existing brand colours/classes where possible:
  - brand red/maroon
  - cream/white backgrounds
  - rounded sections/cards consistent with current site
- Avoid making page too different from the rest of the site.
- Use real product imagery where available.
- Mobile layout must be clean and not overflow.

## Current Redirect/Deployment Notes

Relevant files:

- `public/_redirects`
- `vercel.json`
- `astro.config.mjs`
- `public/sitemap.xml`

When editing redirects:

- Use direct 301 redirects.
- Avoid redirect chains.
- Keep product redirects close to matching final product URL.
- Do not redirect product URLs to `/blog/`.

## Commands

Build check:

```bash
npm run build
```

Dev server:

```bash
npm run dev
```

## Analytics

- Cloudflare Web Analytics is injected once in `src/layouts/BaseLayout.astro`.
- It reads `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` from `import.meta.env`.
- Do not add duplicate Cloudflare beacon scripts in pages, product pages, blog pages, or location pages.
- Do not remove the conditional Cloudflare script unless analytics is intentionally being retired.

## Working Style

- Do not touch `/blog` unless asked.
- Do not revert unrelated work.
- Keep edits scoped.
- Prefer shared components/data over repeated hardcoded sections.
- If unsure about SEO-sensitive redirects, flag for manual decision before editing.
