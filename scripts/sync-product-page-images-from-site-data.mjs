import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('public/assets/js/site-data.js', 'utf8');
const sandbox = {};
vm.runInNewContext(`${source};this.SITE=SITE;`, sandbox);
const site = sandbox.SITE;

const images = new Map();
for (const category of Object.values(site.products)) {
  for (const product of category.items) {
    images.set(product.id, product.image);
  }
}

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const path = `${dir}/${name}`;
    const stat = fs.statSync(path);
    if (stat.isDirectory()) files.push(...walk(path));
    else if (path.endsWith('.astro')) files.push(path);
  }
  return files;
}

let changed = 0;
for (const file of walk('src/pages/products')) {
  const id = file.split('/').at(-2);
  const image = images.get(id);
  if (!image) continue;
  let source = fs.readFileSync(file, 'utf8');
  const next = source.replace(/<img src="[^"]+" alt="([^"]+)" loading="lazy" class="h-full w-full object-contain p-6" \/>/, `<img src="${image}" alt="$1" loading="lazy" class="h-full w-full object-contain p-6" />`);
  if (next !== source) {
    fs.writeFileSync(file, next);
    changed += 1;
  }
}

console.log(`Synced ${changed} product page images.`);
