# CUCKOONANO SEO Guideline

Panduan ini ialah rujukan SEO untuk website `cuckoonano.com` versi Astro. Gunakan bila tambah halaman produk, kategori, blog, lokasi, servis atau landing page baru.

## Prinsip Utama

- SEO website ini berasaskan lead generation: traffic mesti dibawa ke WhatsApp, semakan promo, pertanyaan model, order atau pendaftaran ejen.
- Fokus utama: produk CUCKOO, harga/promo, servis, panduan pembelian, perbandingan model, dan local intent seluruh Malaysia.
- Tulis dalam Bahasa Melayu yang natural, ikut cara pelanggan sebenar cari di Google.
- Jangan kejar keyword stuffing. Jawab soalan pelanggan dengan jelas, lengkap dan boleh dipercayai.
- Setiap page perlu ada satu tujuan carian yang jelas.

## Struktur URL

Gunakan struktur URL bersih dan konsisten:

```text
/
/products/
/products/[category]/
/products/[category]/[product-name]/
/blog/[article-slug]/
/locations/
/locations/[state]/
/locations/[state]/[location]/
/service/
```

Contoh:

```text
/products/water-purifier/xcel-2/
/products/air-purifier/c-plus-humidifier/
/products/samsung/side-by-side-refrigerator-583l/
/locations/selangor/shah-alam/
/blog/cara-trade-in-cuckoo/
```

Elakkan URL final yang terlalu panjang seperti slug WordPress lama. Jika URL lama masih ada nilai SEO, redirect 301 ke URL final yang paling relevan.

## Meta SEO Wajib

Setiap page mesti pass props SEO ke `BaseLayout`:

```js
const meta = {
  title: 'Tajuk SEO Unik',
  description: 'Meta description ringkas yang jelaskan manfaat, produk, harga/promo atau intent halaman.',
  canonical: 'https://www.cuckoonano.com/path-final/',
  ogImage: 'https://www.cuckoonano.com/assets/images/path/image.webp',
  ogType: 'website'
};
```

Rules:

- `title` mesti unik untuk setiap halaman.
- `description` mesti unik dan tidak terlalu generic.
- `canonical` mesti URL final, bukan URL lama/redirect.
- `ogImage` guna gambar produk/ejen/visual sebenar yang relevan.
- Internal link mesti terus ke URL final.

## Page Title Formula

Gunakan formula ikut intent:

Product:

```text
[Nama Produk] | Harga, Promo & Info Produk
Penapis Udara CUCKOO C+ | Air Purifier + Humidifier H14
CUCKOO B-Fit Treadmill | Harga Rental & Promo RM12
```

Category:

```text
[Kategori] CUCKOO | Produk, Harga & Promo
Penapis Air CUCKOO | Produk, Harga & Promo Terkini
```

Location:

```text
Ejen CUCKOO [Lokasi] | Order & Pemasangan CUCKOO
Order CUCKOO Shah Alam | Ejen CUCKOO Selangor
```

Blog:

```text
[Topik Utama] | Panduan CUCKOO
Cara Trade In CUCKOO | Panduan Tukar Model Lama
```

## Product Page SEO

Setiap product page patut ada:

- H1 dengan nama produk dan kategori.
- Intro yang terus jawab: produk apa, sesuai untuk siapa, dan manfaat utama.
- Harga cash/rental/promo jika ada.
- Promo disclaimer: tertakluk kepada stok, kawasan, kelulusan dan terma semasa.
- Spesifikasi produk.
- Kelebihan/fungsi utama.
- Masalah pelanggan yang produk ini selesaikan.
- Kesesuaian pengguna: rumah, apartment, keluarga, pejabat, bayi, haiwan peliharaan dan sebagainya.
- Servis, warranty, care package atau installation info jika relevan.
- FAQ berdasarkan soalan pelanggan sebenar.
- CTA WhatsApp yang jelas.
- Gambar produk sebenar/studio/pemasangan jika ada.

Product page yang kuat biasanya ada schema:

- `Product`
- `Offer`
- `FAQPage`
- `BreadcrumbList`
- `WebPage`

Pastikan harga dalam content dan schema sama. Jika promo berubah, update juga `priceValidUntil`.

## Blog SEO

Blog digunakan untuk long-tail keyword dan topical authority.

Jenis artikel yang sesuai:

- Cara guna produk.
- Harga dan pakej.
- Perbandingan model.
- Masalah pelanggan.
- Tips memilih produk.
- Review produk.
- Servis, filter, warranty dan penjagaan.
- Artikel local/business intent seperti pejabat, syarikat, kerajaan atau trade-in.

Setiap blog patut:

- Jawab intent seawal mungkin.
- Ada H2 yang jelas.
- Link ke product page berkaitan.
- Link ke kategori produk berkaitan.
- Link ke WhatsApp/contact jika artikel ada buying intent.
- Guna gambar relevan dengan alt text.
- Elak buat blog baru jika intent lebih sesuai sebagai product page.

## Local SEO

Location page digunakan untuk local intent dan coverage, bukan untuk senaraikan semua harga produk.

Fokus location page:

- Order/pasang CUCKOO di lokasi tersebut.
- Kawasan sekitar/coverage.
- Kategori produk yang boleh ditanya.
- Trust ejen: sejak 2017, pengalaman, pemasangan diurus.
- CTA WhatsApp.

Format intent:

```text
Order CUCKOO di [Lokasi]
Ejen CUCKOO [Negeri]
Pasang penapis air CUCKOO di [Lokasi]
```

Jangan duplicate terlalu kuat antara lokasi. Kekalkan data kawasan, state, nearby areas dan copy local yang natural.

## Image SEO

Rules untuk gambar:

- Guna `.webp` jika boleh.
- Nama fail descriptive, bukan `IMG_1234.webp`.
- `alt` mesti terangkan objek dan konteks.
- Hero/LCP image guna `loading="eager"`, `fetchpriority="high"` dan preload melalui `BaseLayout` jika sesuai.
- Gambar bawah fold guna `loading="lazy"`.
- Jangan guna gambar generic jika gambar produk sebenar ada.

Contoh alt:

```html
alt="Penapis udara CUCKOO C+ Humidifier di bilik tidur"
alt="CUCKOO Samsung refrigerator 583L side by side warna silver"
```

## Schema Guideline

Product schema minimum:

- `@type: Product`
- `name`
- `brand`
- `manufacturer`
- `model` jika ada
- `description`
- `url`
- `image`
- `additionalProperty`
- `offers`

FAQ schema:

- Soalan mesti wujud dalam page.
- Jawapan schema mesti konsisten dengan jawapan yang user nampak.

Breadcrumb schema:

```text
Home > Produk > Kategori > Produk
Home > Locations > Negeri > Lokasi
Home > Blog > Artikel
```

## Internal Linking

Setiap page mesti bantu crawler dan user bergerak.

Product page link ke:

- kategori induk
- produk berkaitan
- blog panduan berkaitan
- WhatsApp/contact

Blog page link ke:

- product page berkaitan
- kategori produk
- artikel sokongan
- WhatsApp jika buying intent tinggi

Location page link ke:

- kategori produk
- produk popular jika relevan
- WhatsApp

Jangan link ke URL lama yang hanya redirect.

## Redirect Guideline

Bila migrate URL lama:

- Redirect 301 ke halaman paling relevan.
- Product lama redirect ke product page baru.
- Artikel lama redirect ke blog page baru jika intent artikel.
- Location lama redirect ke location page baru.
- Jangan redirect product intent ke homepage.
- Jangan redirect semua URL lama ke `/products/` secara generic.
- Sitemap hanya letak URL final.

Redirect utama dikawal dalam:

```text
astro.config.mjs
public/_redirects
vercel.json
```

Pastikan semua sumber redirect tidak bercanggah.

## Sitemap Dan Robots

Sitemap:

- Masukkan URL final sahaja.
- Tambah `lastmod` untuk page penting yang baru dikemaskini.
- Buang URL duplicate atau URL lama.

Robots:

```text
User-agent: *
Allow: /
Sitemap: https://www.cuckoonano.com/sitemap.xml
```

## Conversion SEO

SEO website ini mesti bawa kepada tindakan.

CTA yang sesuai:

- WhatsApp Ejen
- Semak Promo
- Tanya Harga Bulanan
- Semak Model Sesuai
- Tanya Coverage Kawasan
- Daftar Ejen

Untuk page produk, CTA patut muncul:

- dekat hero
- selepas pricing/promo
- selepas FAQ atau akhir page

## Trust Dan E-E-A-T

Masukkan trust signal bila relevan:

- Ejen sejak 2017.
- Pemasangan diurus 2000+.
- Pengalaman bantu pelanggan pilih model.
- Maklumat servis/warranty.
- Disclaimer bahawa website dikendalikan ejen, bukan laman rasmi korporat CUCKOO jika perlu.
- Bahasa selamat untuk health-related claim. Gunakan "membantu", bukan claim perubatan mutlak.

## Checklist Sebelum Publish Page Baru

- URL ikut struktur final.
- Title unik.
- Description unik.
- Canonical betul.
- OG image relevan.
- H1 jelas dan hanya satu.
- Ada internal links.
- Ada CTA WhatsApp/contact.
- Semua gambar ada alt text.
- Hero image optimized dan preload jika perlu.
- Schema valid dan konsisten dengan content.
- Harga/promo sama antara page dan schema.
- Sitemap dikemaskini.
- Redirect lama ditambah jika page menggantikan URL lama.
- `npm run build` lulus.

## Template Product Page Ringkas

```astro
---
import BaseLayout from '../../../../layouts/BaseLayout.astro';

const site = 'https://www.cuckoonano.com';
const pageUrl = `${site}/products/category/product-name/`;
const heroImg = '/assets/images/products/category/product-name/hero.webp';
const ogImg = `${site}${heroImg}`;
const priceValidUntil = '2026-12-31';

const meta = {
  title: 'Nama Produk CUCKOO | Harga & Promo',
  description: 'Semak nama produk CUCKOO, harga cash/rental, promo terkini, spesifikasi dan cara order melalui ejen CUCKOO.',
  canonical: pageUrl,
  ogImage: ogImg,
  ogType: 'website'
};
---

<BaseLayout {...meta} preloadImages={[heroImg]}>
  <!-- JSON-LD: Product, FAQPage, BreadcrumbList -->
  <section>
    <h1>Nama Produk CUCKOO</h1>
  </section>
</BaseLayout>
```

