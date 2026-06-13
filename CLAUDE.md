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

## Working Style

- Do not touch `/blog` unless asked.
- Do not revert unrelated work.
- Keep edits scoped.
- Prefer shared components/data over repeated hardcoded sections.
- If unsure about SEO-sensitive redirects, flag for manual decision before editing.

