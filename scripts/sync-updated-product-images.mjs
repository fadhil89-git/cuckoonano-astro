import fs from 'node:fs';
import vm from 'node:vm';

const siteDataPath = 'public/assets/js/site-data.js';
const imageDir = 'public/assets/images/Gambar Produk png';
const imageBase = '/assets/images/Gambar%20Produk%20png/';

const imageUrl = (file) => imageBase + encodeURIComponent(file).replace(/%2F/g, '/');

const productImageById = {
  'xcel-2': imageUrl('cuckoo xcel 2 white.webp'),
  'king-top-2': imageUrl('king-top-2.webp'),
  warrior: imageUrl('warrior.webp'),
  glamour: imageUrl('glamour-front.webp'),
  grande: imageUrl('grande.webp'),
  titan: imageUrl('titan.webp'),
  'flo-stand': imageUrl('flo.webp'),
  ace: imageUrl('ace-undersink.webp'),
  kiut: imageUrl('kiut.webp'),
  'l-model': imageUrl('l-model-main.webp'),
  'u-model': imageUrl('u-model.webp'),
  'r-model': imageUrl('d-model-1.webp'),
  'k-model': imageUrl('k-model.webp'),
  'c-plus-humidifier': imageUrl('cuckoo-c-plus.webp'),
  'd-model': imageUrl('d-model-1.webp'),
  'vita-5tar': imageUrl('aircond cuckoo vita 5tar 1 png (1)-Photoroom.webp'),
  'samsung-bespoke-ai-laundry-combo-12-7kg': imageUrl('Samsung-bespoke-ai-img-03.webp'),
  '65-mini-led-m1eh-4k-samsung-vision-smart-tv': imageUrl('m1eh-4k-tv-1.webp'),
  'galaxy-tab-s10-fe-plus': imageUrl('samsung-s10fe-1.webp'),
  'bespoke-2': imageUrl('cuckoo bespoke 2 massage chair kerusi urut 1.webp'),
  'bespoke-massage-lounger': imageUrl('bespoke-massage-lounger.webp'),
  'a-lite': imageUrl('A-lite-series-With-BedFrame_Font.webp'),
  'a-luxe': imageUrl('tilam cuckoo a luxe mattress napure 1.webp'),
  inductwo: '/assets/images/promo/promosi-cuckoo-2025-inductwo-rm88-induction-cooker-dapur-elektrik-induksi-promotion-offer-agent.jpeg',
  inductrio: '/assets/images/promo/promosi-cuckoo-2025-inductrio-rm100-induction-cooker-dapur-elektrik-induksi-promotion-offer-agent.jpeg',
  p10: imageUrl('p10-1.webp'),
  treadmill: imageUrl('b-fit.webp'),
};

const source = fs.readFileSync(siteDataPath, 'utf8');
const sandbox = {};
vm.runInNewContext(`${source};this.SITE=SITE;`, sandbox);
const site = sandbox.SITE;

for (const category of Object.values(site.products)) {
  category.items = category.items.map((product) => ({
    ...product,
    image: productImageById[product.id] || product.image,
  }));
}

fs.writeFileSync(siteDataPath, `const SITE = ${JSON.stringify(site, null, 2)};\n`);

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const path = `${dir}/${name}`;
    const stat = fs.statSync(path);
    if (stat.isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const productPages = walk('src/pages/products').filter((file) => file.endsWith('.astro'));
for (const file of productPages) {
  const id = file.split('/').at(-2);
  const nextImage = productImageById[id];
  if (!nextImage) continue;

  let page = fs.readFileSync(file, 'utf8');
  page = page.replace(/<img src="[^"]+" alt="([^"]+)" loading="lazy" class="h-full w-full object-contain p-6" \/>/, `<img src="${nextImage}" alt="$1" loading="lazy" class="h-full w-full object-contain p-6" />`);
  fs.writeFileSync(file, page);
}

let locationLanding = fs.readFileSync('src/components/location/LocationLanding.astro', 'utf8');
const locationReplacements = {
  "image: '/assets/images/Gambar%20Produk%20png/king-top-2.webp'": `image: '${productImageById['king-top-2']}'`,
  "image: '/assets/images/Gambar%20Produk%20png/l-model-main.webp'": `image: '${productImageById['l-model']}'`,
  "image: '/assets/images/Gambar%20Produk%20png/vita-5tar.webp'": `image: '${productImageById['vita-5tar']}'`,
  "image: '/assets/images/products/washer-dryer/washer-dryer-cuckoo-knight-mesin-basuh-pengering-23.jpg'": `image: '${productImageById['samsung-bespoke-ai-laundry-combo-12-7kg']}'`,
  "image: '/assets/images/Gambar%20Produk%20png/cuckoo-bespoke-2-1.webp'": `image: '${productImageById['bespoke-2']}'`,
  "image: '/assets/images/Gambar%20Produk%20png/a-luxe-mattress.webp'": `image: '${productImageById['a-luxe']}'`,
  "image: '/assets/images/Gambar%20Produk%20png/b-fit.webp'": `image: '${productImageById.treadmill}'`,
};

for (const [from, to] of Object.entries(locationReplacements)) {
  locationLanding = locationLanding.replace(from, to);
}
fs.writeFileSync('src/components/location/LocationLanding.astro', locationLanding);

const missing = [];
for (const category of Object.values(site.products)) {
  for (const product of category.items) {
    const localPath = 'public' + decodeURIComponent(product.image);
    if (!fs.existsSync(localPath)) missing.push(`${product.id}: ${product.image}`);
  }
}

if (missing.length) {
  console.error('Missing product images:\n' + missing.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Synced product images from ${imageDir}.`);
}
