# CUCKOONANO SEO Guideline (Bilingual MY / EN)

Panduan ini ialah rujukan SEO untuk website `cuckoonano.com` versi Astro **selepas dwibahasa** (Bahasa Melayu + English). Ia menggantikan andaian satu-bahasa dalam `SEO_GUIDELINE.md` dengan peraturan yang sah untuk kedua-dua locale.

> Ringkas: **satu projek, satu repo, satu deploy.** `ms` di root, `en` di `/en/`. Layout & komponen dikongsi. Ini bukan dua website.

---

## 0. Model Dwibahasa (baca dulu)

- **Default locale `ms`** kekal di root: `cuckoonano.com/...` — tiada perubahan pada URL Malay sedia ada.
- **English `en`** di bawah prefix: `cuckoonano.com/en/...` mencerminkan struktur yang sama.
- **Tidak semua halaman dwibahasa.** Lihat seksyen *Skop Bahasa*.
- **Fakta dikongsi, ayat diterjemah.** Lihat seksyen *Fact vs Prose*.
- Bahasa ialah **pilihan user**, bukan paksaan geo/IP. Jangan auto-redirect ikut lokasi.

---

## 1. Prinsip Utama

- SEO website ini berasaskan lead generation: traffic mesti dibawa ke WhatsApp, semakan promo, pertanyaan model, order atau pendaftaran ejen. (Sama untuk ms & en.)
- Tulis dalam **bahasa locale halaman**:
  - `ms` = Bahasa Melayu natural, ikut cara pelanggan Malaysia cari di Google.
  - `en` = English natural untuk pembeli Malaysia, **bukan terjemahan literal** ayat Malay.
- Setiap halaman = **satu locale, satu tujuan carian** yang jelas.
- Jangan kejar keyword stuffing dalam mana-mana bahasa.
- Versi English **bukan** salinan auto-translate. Jika sesuatu halaman tidak boleh ditulis natural dalam English, ia tidak patut wujud dalam English (biar `ms` sahaja).

---

## 2. Skop Bahasa (elak thin content)

Keputusan skop. Ini menentukan halaman mana dapat versi `en`.

| Jenis halaman | Versi `en`? | Sebab |
|---|---|---|
| Homepage | ✅ Ya | Pintu masuk utama pembeli English |
| Product pages `/products/[cat]/[name]/` | ✅ Ya | Bottom-funnel, convert pembeli English |
| Category `/products/[category]/` | ✅ Ya | Discovery English |
| `/cuckoo-vs-coway/` | ✅ Ya | Niat perbandingan tinggi, ada permintaan English |
| `/service/`, `/goood-deal/` | ⚠️ Ikut keperluan | Terjemah bila product EN dah stabil |
| Location `/locations/...` | ❌ Tidak | Niat 100% local Malay; English value SEO ~0 |
| Blog (umum) | ❌ Tidak (buat masa ni) | Kebanyakan Malay-intent |
| Blog (buying-guide terpilih) | ⚠️ Selective | Hanya artikel perbandingan/panduan beli yang ada permintaan English |
| Recruitment / `kerjaya-cuckoo` | ❌ Tidak | Audience Malay sepenuhnya |

Peraturan emas: **lebih baik 5 halaman English kuat daripada 30 halaman English nipis.** Thin/auto-translated content boleh seret turun kualiti seluruh domain.

---

## 3. Fact vs Prose (sumber kebenaran)

Ini melindungi daripada **harga basi** — risiko #1 dwibahasa.

| Language-neutral → **1 sumber dikongsi** | Per-locale → **diterjemah** |
|---|---|
| Harga, rental, outright, promo | Title, meta description |
| Spec (kapasiti, kuasa, dimensi) | H1, headline, ayat jualan |
| Model code, SKU, MPN | FAQ soalan & jawapan |
| Path gambar, URL | Alt text |
| Nombor dalam JSON-LD, `priceValidUntil` | Label spec ("Capacity" / "Kapasiti") |

Cadangan struktur fail:

```text
src/data/products/<name>.ts        // neutral: price, sku, specs, images
src/i18n/products/<name>.ms.ts      // prose Malay
src/i18n/products/<name>.en.ts      // prose English
```

Kedua-dua page `ms` & `en` import harga/spec dari fail **neutral yang sama**. Update harga sekali → kedua-dua bahasa + schema betul automatik.

---

## 4. Struktur URL

```text
ms (root)                         en (/en/)
/                                 /en/
/products/                        /en/products/
/products/[category]/             /en/products/[category]/
/products/[category]/[name]/      /en/products/[category]/[name]/
/service/                         /en/service/
/cuckoo-vs-coway/                 /en/cuckoo-vs-coway/

Malay-only (tiada cermin /en/):
/locations/[state]/[location]/
/blog/[slug]/   (kecuali buying-guide terpilih)
```

Rules:

- **Jangan taip `/en/` manual.** Guna helper: `localizedUrl(path, locale)`.
  - `localizedUrl('/products/water-purifier/', 'ms')` → `/products/water-purifier/`
  - `localizedUrl('/products/water-purifier/', 'en')` → `/en/products/water-purifier/`
- Struktur EN mesti **cermin** struktur MS (slug sama), supaya hreflang & maintenance mudah.
- `trailingSlash: 'always'` kekal untuk kedua-dua locale.
- Tambah bahasa ke-3 nanti (cth `zh`) = **tukar config + helper sahaja**, bukan rewrite.

---

## 5. Registry (pacu hreflang + sitemap)

Satu manifest menentukan locale mana wujud untuk setiap path. **Ini sumber kebenaran tunggal** untuk hreflang dan sitemap — supaya tak boleh jadi tak segerak.

```ts
// src/i18n/registry.ts
export const pageLocales = {
  '/': ['ms', 'en'],
  '/products/water-purifier/': ['ms', 'en'],
  '/products/water-purifier/xcel-2/': ['ms', 'en'],
  '/cuckoo-vs-coway/': ['ms', 'en'],
  '/locations/kedah/sungai-petani/': ['ms'],   // Malay sahaja
  '/blog/cuckoo-xcel-vs-king-top/': ['ms', 'en'], // buying-guide terpilih
  // ...
};
```

- hreflang di-emit **hanya** untuk locale yang betul-betul wujud (tiada link ke 404).
- Sitemap dijana dari registry yang sama.
- Halaman Malay-only auto dapat `x-default` → `ms`, tiada `alternate` palsu.

---

## 6. Meta SEO Wajib

Setiap page pass props SEO ke `BaseLayout`, **termasuk locale + alternates**:

```js
const meta = {
  title: 'Tajuk SEO Unik (dalam bahasa halaman)',
  description: 'Meta description unik dalam bahasa halaman.',
  canonical: localizedUrl('/products/category/name/', locale), // self-referential
  ogImage: 'https://www.cuckoonano.com/assets/images/path/image.webp',
  ogType: 'website',
  locale,                       // 'ms' | 'en'
  alternates: ['ms', 'en']      // dari registry; locale yang wujud sahaja
};
```

Rules:

- `title` & `description` mesti **unik per halaman DAN per locale**. EN bukan salinan MS.
- `canonical` mesti **self-referential per locale**: EN → URL EN, MS → URL MS. Jangan canonical EN ke MS (akan buat EN tak ter-index).
- `<html lang>` mesti padan locale halaman (BaseLayout set dinamik).
- `ogImage` guna gambar sebenar (neutral, boleh dikongsi).
- Internal link mesti terus ke URL final **dalam locale yang sama**.

---

## 7. Hreflang (wajib untuk halaman bilingual)

Setiap halaman yang ada lebih satu locale mesti emit (dalam `<head>`, dikendalikan `BaseLayout` dari registry):

```html
<link rel="alternate" hreflang="ms" href="https://www.cuckoonano.com/products/water-purifier/xcel-2/" />
<link rel="alternate" hreflang="en" href="https://www.cuckoonano.com/en/products/water-purifier/xcel-2/" />
<link rel="alternate" hreflang="x-default" href="https://www.cuckoonano.com/products/water-purifier/xcel-2/" />
```

- `x-default` sentiasa tunjuk ke versi `ms`.
- Halaman Malay-only: **tiada** `alternate hreflang` — kekal satu URL sahaja.
- Hreflang mesti **dua hala** (MS tunjuk EN, EN tunjuk MS). Registry pastikan ini konsisten.
- Jangan emit hreflang ke URL yang 404.

---

## 8. Page Title Formula

### Malay (`ms`)

```text
Product : [Nama Produk] | Harga, Promo & Info Produk
Category: [Kategori] CUCKOO | Produk, Harga & Promo
Location: Ejen CUCKOO [Lokasi] | Order & Pemasangan CUCKOO
Blog    : [Topik Utama] | Panduan CUCKOO
```

### English (`en`)

```text
Product : [Product Name] CUCKOO | Price, Promo & Specs
Category: CUCKOO [Category] | Models, Price & Promo
Blog    : [Main Topic] | CUCKOO Guide   (buying-guide terpilih sahaja)
```

> Location tiada formula EN (Malay-only). Tulis title English natural — jangan terjemah perkataan-demi-perkataan dari Malay.

---

## 9. Product Page SEO

Sama struktur untuk kedua-dua locale (H1, intro, harga, disclaimer, spec, kelebihan, FAQ, CTA WhatsApp, gambar sebenar). Yang berbeza ialah **bahasa prose sahaja**.

Tambahan dwibahasa:

- H1 dalam bahasa halaman; nama produk + kategori.
- Harga/spec dari sumber **neutral** (rujuk Fact vs Prose) — tak ditaip semula dalam EN.
- Promo disclaimer diterjemah natural:
  - `ms`: "Tertakluk kepada stok, kawasan, kelulusan dan terma semasa."
  - `en`: "Subject to stock, coverage area, approval and current terms."
- FAQ ditulis semula dalam English natural (bukan terjemahan literal soalan Malay).
- CTA WhatsApp guna helper global `rotatingWhatsapp()` (sama untuk semua locale).

Schema: `Product`, `Offer`, `FAQPage`, `BreadcrumbList`, `WebPage` (lihat seksyen Schema).

---

## 10. Schema Guideline (Bilingual)

Product schema minimum kekal sama. Tambahan i18n:

- `name`, `description` → **bahasa halaman**.
- `price`, `sku`, `mpn`, `model`, `additionalProperty` value → **neutral** (sama merentas locale).
- Tambah `"inLanguage": "ms"` atau `"en"` pada `WebPage` / `Product`.
- `offers` (rental + outright), `itemCondition`, `priceValidUntil` → neutral, dari sumber yang sama.

FAQ schema:

- Soalan & jawapan schema mesti **padan FAQ yang user nampak dalam bahasa itu**.
- FAQ EN page → FAQ schema EN. FAQ MS page → FAQ schema MS.

Breadcrumb schema (label ikut locale):

```text
ms:  Home > Produk > Kategori > Produk
en:  Home > Products > Category > Product
```

Pastikan harga dalam content = harga dalam schema = harga sumber neutral. Update `priceValidUntil` bila promo berubah (sekali, di sumber neutral).

---

## 11. Image SEO

- Path & nama fail gambar = **neutral, dikongsi** (`.webp`, descriptive, bukan `IMG_1234.webp`).
- `alt` text = **per locale**:
  - `ms`: `alt="Penapis udara CUCKOO C+ Humidifier di bilik tidur"`
  - `en`: `alt="CUCKOO C+ Humidifier air purifier in a bedroom"`
- Hero/LCP: `loading="eager"`, `fetchpriority="high"`, preload via `BaseLayout` (sama untuk kedua-dua locale).
- Bawah fold: `loading="lazy"`.

---

## 12. Internal Linking

- Setiap page link **dalam locale yang sama**: page EN → page EN, page MS → page MS.
- **Language switcher sahaja** yang link lintas-bahasa (MS ↔ EN bagi halaman semasa).
- Jika halaman semasa tiada versi locale lain, switcher tunjuk ke **homepage locale itu**, bukan link mati.
- Product/blog/location internal link rules (kategori induk, produk berkaitan, WhatsApp) kekal — cuma mesti dalam locale sama.
- Jangan link ke URL lama yang hanya redirect.

---

## 13. Fallback & UX Bahasa

- User pergi `/en/<page-yang-belum-wujud>` → **tunjuk versi MS** atau redirect ke `/en/` homepage. **Jangan 404.**
- Jangan auto-redirect ikut geo/IP/`Accept-Language`. Hormati pilihan user.
- Simpan pilihan bahasa user (cookie/localStorage) untuk kemudahan, tetapi URL kekal sumber kebenaran (boleh share & index).
- Ini membolehkan **launch separa**: homepage EN boleh live hari ini, page lain ditambah perlahan tanpa link pecah.

---

## 14. Redirect Guideline

- Rule redirect MS sedia ada (`astro.config.mjs`, `public/_redirects`, `vercel.json`) **kekal tak tersentuh**.
- URL EN baharu **tidak boleh bertembung** dengan rule redirect MS.
- Jangan redirect `/en/...` ke `/...` secara automatik (itu memaksa bahasa).
- Product/blog/location lama → kekal redirect ke URL **MS** final (default). EN ialah lapisan tambahan, bukan sasaran redirect lama.
- Sitemap hanya letak URL final (ms & en yang wujud).

---

## 15. Sitemap & Robots

Sitemap:

- Masukkan URL final sahaja (ms + en yang wujud, dari registry).
- Setiap entry bilingual sertakan `xhtml:link rel="alternate"` untuk ms, en, dan x-default:

```xml
<url>
  <loc>https://www.cuckoonano.com/products/water-purifier/xcel-2/</loc>
  <xhtml:link rel="alternate" hreflang="ms" href="https://www.cuckoonano.com/products/water-purifier/xcel-2/" />
  <xhtml:link rel="alternate" hreflang="en" href="https://www.cuckoonano.com/en/products/water-purifier/xcel-2/" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://www.cuckoonano.com/products/water-purifier/xcel-2/" />
</url>
```

- Halaman Malay-only: satu `<loc>` sahaja, tiada alternate.
- Buang URL duplicate / URL lama.

Robots:

```text
User-agent: *
Allow: /
Sitemap: https://www.cuckoonano.com/sitemap.xml
```

---

## 16. Conversion SEO

CTA sama merentas bahasa, label diterjemah:

| Intent | `ms` | `en` |
|---|---|---|
| WhatsApp | Semak Promo / WhatsApp Ejen | Check Promo / WhatsApp Us |
| Harga | Tanya Harga Bulanan | Ask Monthly Price |
| Model | Semak Model Sesuai | Find the Right Model |
| Coverage | Tanya Coverage Kawasan | Ask Area Coverage |
| Ejen | Daftar Ejen | Become an Agent |

Untuk product page, CTA muncul: dekat hero, selepas pricing/promo, selepas FAQ / akhir page. (Sama untuk kedua-dua locale.)

---

## 17. Trust & E-E-A-T

Trust signal kekal, diterjemah natural:

- `ms`: "Ejen CUCKOO sejak 2017", "Pemasangan diurus 2000+".
- `en`: "CUCKOO agent since 2017", "2000+ installations handled".
- Disclaimer ejen (bukan laman rasmi korporat) sertakan dalam kedua-dua bahasa bila perlu.
- Bahasa selamat untuk health claim: `ms` guna "membantu"; `en` guna "helps" — elak claim perubatan mutlak.

---

## 18. Checklist Sebelum Publish

### Umum (semua halaman)

- URL ikut struktur final.
- Title unik. Description unik.
- Canonical betul (self-referential).
- OG image relevan.
- H1 jelas dan hanya satu.
- Ada internal links + CTA WhatsApp/contact.
- Semua gambar ada alt text.
- Hero image optimized dan preload jika perlu.
- Schema valid dan konsisten dengan content.
- Harga/promo sama antara page dan schema.
- Sitemap dikemaskini.
- Redirect lama ditambah jika menggantikan URL lama.
- `npm run build` lulus.

### Tambahan dwibahasa (halaman EN atau pasangan ms/en)

- `locale` & `alternates` di-set dalam `meta`.
- `<html lang>` padan locale halaman.
- hreflang `ms` / `en` / `x-default` betul, **dua hala**, tiada link ke 404.
- Canonical self-referential (EN → EN, MS → MS).
- Semua internal link kekal dalam locale yang sama.
- Harga/spec sama antara **MS, EN, DAN schema** (dari sumber neutral).
- `inLanguage` di-set dalam JSON-LD.
- FAQ schema padan FAQ yang dipaparkan dalam bahasa itu.
- Copy English **natural**, bukan terjemahan mesin nipis.
- Path masuk dalam `registry.ts` dengan locale yang betul.

---

## 19. Template Product Page Ringkas (i18n-aware)

```astro
---
import BaseLayout from '../../../../layouts/BaseLayout.astro';
import { localizedUrl } from '../../../../i18n/url';
import product from '../../../../data/products/name';     // neutral: price, sku, specs
// import copy from '../../../../i18n/products/name.en';   // prose per locale

const locale = 'en'; // atau 'ms'
const site = 'https://www.cuckoonano.com';
const path = '/products/category/name/';
const heroImg = '/assets/images/products/category/name/hero.webp';

const meta = {
  title: 'Product Name CUCKOO | Price, Promo & Specs',
  description: 'Check CUCKOO Product Name: price, rental, promo, specs and how to order via a CUCKOO agent.',
  canonical: `${site}${localizedUrl(path, locale)}`,
  ogImage: `${site}${heroImg}`,
  ogType: 'website',
  locale,
  alternates: ['ms', 'en']
};
---

<BaseLayout {...meta} preloadImages={[heroImg]}>
  <!-- JSON-LD: Product (inLanguage), FAQPage, BreadcrumbList -->
  <!-- Harga & spec dari `product` (neutral); ayat dari copy locale -->
  <section>
    <h1>CUCKOO Product Name</h1>
  </section>
</BaseLayout>
```

---

## Rujukan Silang

- `SEO_GUIDELINE.md` — guideline asal (peraturan teras Malay; masih sah untuk `ms`).
- `CLAUDE.md` — konteks projek, struktur produk, keputusan SEO.
- `src/layouts/BaseLayout.astro` — emit hreflang, `<html lang>`, language switcher.
- `src/i18n/registry.ts` — sumber kebenaran locale per path (pacu hreflang + sitemap).
- `astro.config.mjs` — config `i18n` (defaultLocale `ms`, locales `['ms','en']`, `prefixDefaultLocale: false`).
