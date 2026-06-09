import fs from 'node:fs';
import vm from 'node:vm';

const files = [
  'public/assets/js/site-data.js',
  'src/components/location/LocationLanding.astro',
  'src/pages/products/mattress/a-lite/index.astro',
];

for (const file of files) {
  let source = fs.readFileSync(file, 'utf8');
  source = source.replace(/\/assets\/images\/Gambar%20Produk%20png\/([^"' )]+)\.(png|jpg)/g, (_match, name) => {
    return `/assets/images/Gambar%20Produk%20png/${name}.webp`;
  });
  fs.writeFileSync(file, source);
}

const siteSource = fs.readFileSync('public/assets/js/site-data.js', 'utf8');
const sandbox = {};
vm.runInNewContext(`${siteSource};this.SITE=SITE;`, sandbox);
const site = sandbox.SITE;

if (site.products?.['air-conditioner']?.items?.[0]) {
  site.products['air-conditioner'].items[0].image = '/assets/images/Gambar%20Produk%20png/vita-5tar.webp';
}

for (const category of Object.values(site.products)) {
  for (const product of category.items) {
    if (product.image?.includes('/assets/images/Gambar%20Produk%20png/')) {
      const filePath = 'public' + decodeURIComponent(product.image);
      if (!fs.existsSync(filePath)) {
        const webpPath = filePath.replace(/\.(png|jpg)$/i, '.webp');
        if (fs.existsSync(webpPath)) {
          product.image = product.image.replace(/\.(png|jpg)$/i, '.webp');
        }
      }
    }
  }
}

fs.writeFileSync('public/assets/js/site-data.js', `const SITE = ${JSON.stringify(site, null, 2)};\n`);

console.log('Updated product image paths to existing webp files.');
