import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const productDir = '/assets/images/Gambar%20Produk%20png';

const productImages = {
  'xcel-2': `${productDir}/xcel-2.png`,
  'king-top-2': `${productDir}/king-top-2.png`,
  warrior: `${productDir}/warrior.png`,
  glamour: `${productDir}/glamour-front.png`,
  grande: `${productDir}/grande.png`,
  titan: `${productDir}/titan.png`,
  'flo-stand': `${productDir}/flo.png`,
  ace: `${productDir}/ace-undersink.png`,
  kiut: `${productDir}/kiut.png`,
  'l-model': `${productDir}/l-model-main.png`,
  'u-model': `${productDir}/u-model.png`,
  'r-model': `${productDir}/cuckoo-c-model.jpg`,
  'k-model': `${productDir}/k-model.png`,
  'c-plus-humidifier': `${productDir}/cuckoo-c-plus.png`,
  'd-model': `${productDir}/d-model-1.png`,
  'vita-5tar': `${productDir}/vita-5tar.png`,
  'samsung-bespoke-ai-laundry-combo-12-7kg':
    '/assets/images/products/washer-dryer/washer-dryer-cuckoo-knight-mesin-basuh-pengering-1.jpg',
  '65-mini-led-m1eh-4k-samsung-vision-smart-tv': `${productDir}/m1eh-4k-tv-1.png`,
  'galaxy-tab-s10-fe-plus': `${productDir}/samsung-s10fe-1.png`,
  'bespoke-2': `${productDir}/cuckoo-bespoke-2-1.png`,
  'bespoke-massage-lounger': `${productDir}/bespoke-massage-lounger.png`,
  'a-lite': `${productDir}/aluxe.png`,
  'a-luxe': `${productDir}/a-luxe-mattress.png`,
  inductwo: '/assets/images/products/induction/kelebihan-multicooker-cuckoo-induction-heating.png',
  inductrio: '/assets/images/products/induction/kelebihan-multicooker-cuckoo-induction-heating.png',
  p10: `${productDir}/p10-1.png`,
  ch10: `${productDir}/p10-4.png`,
  treadmill: `${productDir}/b-fit.png`,
};

function publicFileExists(publicPath) {
  const decoded = decodeURIComponent(publicPath);
  return fs.existsSync(path.join('public', decoded));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const siteDataPath = 'public/assets/js/site-data.js';
const sandbox = {};
vm.runInNewContext(`${fs.readFileSync(siteDataPath, 'utf8')};this.SITE=SITE`, sandbox);
const site = sandbox.SITE;

const changedItems = [];
for (const category of Object.values(site.products)) {
  for (const item of category.items) {
    const image = productImages[item.id];
    if (!image) continue;
    item.image = image;
    changedItems.push({ id: item.id, image });
  }
}

fs.writeFileSync(siteDataPath, `const SITE = ${JSON.stringify(site, null, 2)};\n`);

let mainJs = fs.readFileSync('public/assets/js/main.js', 'utf8');
mainJs = mainJs.replace(
  /function card\(p\)\{return `[\s\S]*?<\/article>`\}/,
  'function card(p){return `<article class="min-w-[260px] snap-start rounded-[1.75rem] border border-brand/10 bg-cream p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-soft"><div class="mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-white"><img src="${p.image}" alt="${p.name}" loading="lazy" class="h-full w-full object-contain p-4" /></div><h3 class="font-black">${p.name}</h3><p class="mt-1 text-sm leading-6 text-muted">${p.desc}</p><a href="${p.url}" class="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark">Lihat Produk</a></article>`}',
);
fs.writeFileSync('public/assets/js/main.js', mainJs);

const updatedPages = [];
for (const category of Object.values(site.products)) {
  for (const item of category.items) {
    const image = item.image;
    const file = path.join('src/pages', item.url.replace(/^\/|\/$/g, ''), 'index.astro');
    if (!fs.existsSync(file)) continue;

    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes('Product Image Placeholder')) continue;

    const replacement = `<div class="rounded-[2rem] bg-white p-5 shadow-soft"><div class="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.5rem] bg-brand-soft"><img src="${image}" alt="${escapeHtml(item.name)}" loading="lazy" class="h-full w-full object-contain p-6" /></div></div>`;
    const next = source.replace(
      /<div class="rounded-\[2rem\] bg-white p-5 shadow-soft"><div class="flex aspect-\[4\/3\][\s\S]*?Product Image Placeholder<br>[\s\S]*?<\/div><\/div>/,
      replacement,
    );

    if (next !== source) {
      fs.writeFileSync(file, next);
      updatedPages.push(item.url);
    }
  }
}

const missing = changedItems.filter((item) => !publicFileExists(item.image));
fs.writeFileSync(
  'reports/product-image-application.json',
  JSON.stringify({ changedItems, updatedPages, missing }, null, 2),
);

console.log(`Updated product data: ${changedItems.length}`);
console.log(`Updated product pages: ${updatedPages.length}`);
console.log(`Missing mapped images: ${missing.length}`);
