import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const outputDir = 'public/assets/images/gambar-produk';
const outputPublic = '/assets/images/gambar-produk';
const reportPath = 'reports/blog-featured-image-collection.json';

function slugFileName(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const base = path
    .basename(fileName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'image'}${ext || '.jpg'}`;
}

function uniqueDestination(fileName, used) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  let candidate = fileName;
  let index = 2;
  while (used.has(candidate) || fs.existsSync(path.join(outputDir, candidate))) {
    candidate = `${base}-${index}${ext}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}

fs.mkdirSync(outputDir, { recursive: true });

const sandbox = { SITE: {} };
vm.runInNewContext(fs.readFileSync('public/assets/js/blog-items.js', 'utf8'), sandbox);

const images = [...new Set((sandbox.SITE.blogItems || []).map((item) => item.image).filter(Boolean))];
const used = new Set();
const mapping = new Map();
const missing = [];

for (const image of images) {
  if (!image.startsWith('/assets/')) continue;
  const sourceFile = path.join('public', image);
  if (!fs.existsSync(sourceFile)) {
    missing.push(image);
    continue;
  }

  const destinationName = uniqueDestination(slugFileName(path.basename(image)), used);
  const destinationFile = path.join(outputDir, destinationName);
  fs.copyFileSync(sourceFile, destinationFile);
  mapping.set(image, `${outputPublic}/${destinationName}`);
}

let blogItemsSource = fs.readFileSync('public/assets/js/blog-items.js', 'utf8');
for (const [from, to] of mapping) {
  blogItemsSource = blogItemsSource.replaceAll(`"image": "${from}"`, `"image": "${to}"`);
}
fs.writeFileSync('public/assets/js/blog-items.js', blogItemsSource);

const wp = JSON.parse(fs.readFileSync('reports/wordpress-import-posts.json', 'utf8'));
const updatedPages = [];
for (const post of wp.posts || []) {
  const file = path.join('src/pages', post.slug, 'index.astro');
  if (!fs.existsSync(file)) continue;

  const source = fs.readFileSync(file, 'utf8');
  const current = source.match(/const featuredImage = "([^"]*)";/)?.[1];
  const next = mapping.get(current);
  if (!next) continue;

  fs.writeFileSync(file, source.replace(`const featuredImage = "${current}";`, `const featuredImage = "${next}";`));
  updatedPages.push({ slug: post.slug, from: current, to: next });
}

const report = {
  output: outputPublic,
  copied: mapping.size,
  updatedPages: updatedPages.length,
  missing,
  images: [...mapping].map(([from, to]) => ({ from, to })),
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`Copied: ${mapping.size}`);
console.log(`Updated pages: ${updatedPages.length}`);
console.log(`Missing: ${missing.length}`);
console.log(`Report: ${reportPath}`);
