import fs from 'node:fs';
import path from 'node:path';

const fallback = '/assets/images/brand/cuckoo-ebrandstore3.png';
const reportPath = 'reports/blog-featured-photo-audit.json';

const featuredBySlug = {
  'cuckoo-relocation': '/assets/images/installation/cuckoo-plus-app-cara-guna-how-to-use-install-1.jpeg',
  'cara-trade-in-cuckoo': '/assets/images/promo/promosi-cuckoo-2025-water-purifier-penapis-air-promotion-offer-agent-.jpeg',
  'how-to-trade-in-cuckoo': '/assets/images/promo/promosi-cuckoo-2025-air-purifier-penapis-udara-promotion-offer-agent-trade-in.jpeg',
  'cara-guna-washer-dryer-cuckoo-knight': '/assets/images/products/washer-dryer/washer-dryer-cuckoo-knight-mesin-basuh-pengering-1.jpg',
  'kelebihan-tilam-cuckoo-a-luxe': '/assets/images/promo/promosi-cuckoo-2025-tilam-cuckoo-mattress-a-luxe-napure-promotion-offer-agent.jpeg',
  'kelebihan-tilam-cuckoo-s-lite': '/assets/images/promo/promosi-cuckoo-2025-tilam-cuckoo-mattress-s-lite-napure-promotion-offer-agent.jpeg',
  'cuckoo-vita-s-fujiaire-air-conditioner': '/assets/images/products/aircond/gambar-photo-image-aircond-cuckoo-vita-s-inveter-fujiaire-penghawa-dingin-1.jpg',
  'nombor-akaun-bank-cuckoo-jompay-cuckoo-bank-account-number': '/assets/images/misc/rsz_cuckoo_epp_easy_payment_credit_card.png',
  'cuckoo-sasar-jual-80000-tilam': '/assets/images/products/mattress/tilam-cuckoo-mattress-gambar-cantik.jpg',
  'cuckoo-samasama-promotion-2020': '/assets/images/promo/promosi-cuckoo-goood-combo.jpeg',
  'toksik-dalam-filter-cuckoo-benarkah-ini-kenyataan-rasmi-cuckoo-korea': '/assets/images/products/air-purifier/filter-penapis-udara-cuckoo-ultra-pm2.5.png',
  'aiming-to-shake-the-market-in-2019': '/assets/images/brand/cuckoo-korea-headquarters.jpg',
  'kenapa-cuckoo-logam-berat': '/assets/images/products/water-purifier/sijil-heavy-metal-kualiti-penapis-air-cuckoo-alkali-malaysia.jpg',
  'nak-pasang-penapis-air-cuckoo-di-dungun': '/assets/images/installation/cuckoo-pasang-laju.jpg',
  'kenapa-ramai-pasang-penapis-air-cuckoo-di-rumah': '/assets/images/products/water-purifier/7-kelebihan-penapis-air-cuckoo-water-purifier-benefits-1.jpg',
  'adakah-penapis-udara-cuckoo-mengeluarkan-udara-sejuk-macam-air-cond': '/assets/images/products/air-purifier/cuckoo-air-purifiers-bkg.jpg',
  'nak-pindah-rumah-tapi-baru-pasang-cuckoo-apa-perlu-saya-buat': '/assets/images/installation/cuckoo-plus-app-cara-guna-how-to-use-install-7.jpeg',
  'penapis-air-cuckoo-iris-top-di-tv3': '/assets/images/products/water-purifier/iris-top.jpg',
  'kesan-air-ro-reverse-osmosis-terhadap-kesihatan': '/assets/images/products/water-purifier/penapis-air-reverse-osmosis.jpg',
  'bagaimana-cuckoo-servis-penapis-air-di-rumah': '/assets/images/service/cuckoo-service-filter-nano-positive.jpg',
  'kenapa-doktor-tak-galakkan-air-ro-dr-suriyakhatun': '/assets/images/products/water-purifier/penapis-air-reverse-osmosis.jpg',
  'adakah-air-cuckoo-selamat-untuk-bayi': '/assets/images/misc/cuckoo-baby-mode.png',
  'latar-belakang-syarikat-cuckoo': '/assets/images/brand/cuckoo-korea-headquarters.jpg',
  'cara-sebenar-kira-kos-penapis-air-cuckoo': '/assets/images/products/water-purifier/kos-servis-penapis-air-cuckoo-water-purifier-service-price-1.png',
  'perbezaan-kaedah-bayaran-direct-debit-dan-kad-kredit': '/assets/images/misc/rsz_cuckoo_epp_easy_payment_credit_card.png',
  'kenapa-anda-perlu-ada-penapis-air-di-rumah': '/assets/images/products/water-purifier/kepentingan-memiliki-penapis-air.png',
  'perbezaan-penapis-air-murah-dan-mahal': '/assets/images/products/water-purifier/penapis-air.jpg',
  'tips-cara-memilih-agen-penapis-air': '/assets/images/people/bisnesonlinecuckoo1.jpg',
  'kenapa-perlu-tukar-filter': '/assets/images/misc/cuckoo-filters.png',
  'perbezaan-cuckoo-dengan-jenama-lain': '/assets/images/products/water-purifier/analysis-of-cuckoo-filtration-system-vs-other-filter.png',
  'jangan-beli-penapis-cuckoo-yang-ada-ciri-ciri-ini': '/assets/images/products/water-purifier/penapis-air-cuckoo.jpg',
};

function readPage(slug) {
  const file = path.join('src/pages', slug, 'index.astro');
  return fs.existsSync(file) ? { file, source: fs.readFileSync(file, 'utf8') } : null;
}

function getFeatured(source) {
  return source.match(/const featuredImage = "([^"]*)"/)?.[1] || '';
}

function isProblemImage(image) {
  return !image || image === fallback || (image.startsWith('/assets/') && !fs.existsSync('public' + image));
}

function replaceFeatured(source, image) {
  return source.replace(/const featuredImage = "([^"]*)";/, `const featuredImage = "${image}";`);
}

const wp = JSON.parse(fs.readFileSync('reports/wordpress-import-posts.json', 'utf8'));
const before = [];
const changed = [];

for (const post of wp.posts || []) {
  const page = readPage(post.slug);
  if (!page) continue;

  const current = getFeatured(page.source);
  if (isProblemImage(current)) {
    before.push({
      slug: post.slug,
      title: post.title,
      previousImage: current || 'NONE',
      reason: !current ? 'no featuredImage' : current === fallback ? 'fallback image' : 'missing file',
    });
  }

  const next = featuredBySlug[post.slug];
  if (next && fs.existsSync('public' + next)) {
    fs.writeFileSync(page.file, replaceFeatured(page.source, next));
    changed.push({ slug: post.slug, from: current, to: next });
  }
}

let blogItemsSource = fs.readFileSync('public/assets/js/blog-items.js', 'utf8');
for (const item of changed) {
  const url = `/${item.slug}/`;
  const blockPattern = new RegExp(`("url": "${url.replace(/\//g, '\\/')}",[\\s\\S]*?"image": )"[^"]*"`);
  blogItemsSource = blogItemsSource.replace(blockPattern, `$1"${item.to}"`);
}
fs.writeFileSync('public/assets/js/blog-items.js', blogItemsSource);

const after = [];
for (const post of wp.posts || []) {
  const page = readPage(post.slug);
  if (!page) continue;
  const image = getFeatured(page.source);
  if (isProblemImage(image)) {
    after.push({ slug: post.slug, title: post.title, image: image || 'NONE' });
  }
}

fs.writeFileSync(reportPath, JSON.stringify({ before, changed, after }, null, 2));
console.log(`Before problems: ${before.length}`);
console.log(`Updated: ${changed.length}`);
console.log(`Remaining problems: ${after.length}`);
console.log(`Report: ${reportPath}`);
