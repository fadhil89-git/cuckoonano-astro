import fs from 'node:fs';
import path from 'node:path';

const reportPath = 'reports/wordpress-import-posts.json';
const publicRoot = 'public';
const sourcePrefix = '/assets/images/blog/wp-uploads/';
const sourceDir = path.join(publicRoot, sourcePrefix);

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

function includesAny(value, words) {
  return words.some((word) => value.includes(word));
}

function classifyImage(image) {
  const text = `${image.remote || ''} ${image.localPublic || ''}`.toLowerCase();

  if (includesAny(text, ['promosi', 'promo', 'promotion', 'goood', 'offer', 'rm12', 'rm58', 'rm65', 'rm66', 'rm69', 'rm70', 'rm85', 'rm90', 'rm98', 'rm99', 'rm100', 'rm105', 'rm108', 'rm110', 'rm113', 'rm115', 'rm123', 'rm130', 'rm139'])) {
    return 'promo';
  }

  if (includesAny(text, ['aircond', 'air-conditioner', 'vita', 'fujiaire', 'inverter', '1.0hp', '1.5hp'])) {
    return 'products/aircond';
  }

  if (includesAny(text, ['washer', 'dryer', 'knight', 'mesin-basuh', 'laundry'])) {
    return 'products/washer-dryer';
  }

  if (includesAny(text, ['treadmill', 'b-fit'])) {
    return 'products/treadmill';
  }

  if (includesAny(text, ['kerusi-urut', 'massage', 'ogawa', 'lounger'])) {
    return 'products/massage-chair';
  }

  if (includesAny(text, ['tilam', 'mattress', 'napure', 'a-luxe', 's-lite'])) {
    return 'products/mattress';
  }

  if (includesAny(text, ['induction', 'induct', 'dapur-elektrik', 'induksi'])) {
    return 'products/induction';
  }

  if (includesAny(text, ['multicooker', 'multi-cooker', 'pressure-cooker', 'periuk', 'q10', 'p10', 'ch10'])) {
    return 'products/pressure-cooker';
  }

  if (includesAny(text, ['samsung', 'galaxy', 'smart-tv', 'vision-smart-tv'])) {
    return 'products/samsung';
  }

  if (includesAny(text, ['penapis-udara', 'air-purifier', 'c-model', 'b-model', 'd-model', 'i-model', 'k-model', 'r-model', 'u-model', 'humidifier', 'plasma-ion', 'hepa'])) {
    return 'products/air-purifier';
  }

  if (includesAny(text, ['penapis-air', 'water-purifier', 'water-filter', 'xcel', 'king-top', 'king-stand', 'warrior', 'titan', 'iris', 'icon', 'glamour', 'grande', 'flo-stand', 'fusion', 'deluxe', 'marvel', 'vivid', 'queen', 'prince', 'ace', 'prime-x', 'outdoor-water', 'filtration', 'filter-system', 'stainless-steel-tank'])) {
    return 'products/water-purifier';
  }

  if (includesAny(text, ['pasang', 'pemasangan', 'installation', 'install', 'paip', 'pipe', 'bracket', 'trunking', 'socket', 'hacking'])) {
    return 'installation';
  }

  if (includesAny(text, ['servis', 'service', 'ncs', 'relocation', 'tukar-filter', 'technician', 'technician'])) {
    return 'service';
  }

  if (includesAny(text, ['ejen', 'agent', 'fadhil', 'izzah', 'kerjaya', 'bisnes', 'komisyen', 'recruitment', 'team', 'telegram', 'whatsapp-group', 'dropship'])) {
    return 'people';
  }

  if (includesAny(text, ['logo', 'halal', 'sirim', 'certificate', 'sijil', 'korea', 'headquarters', 'kilang', 'company', 'latar-belakang', 'ebrandstore', 'bank', 'jompay'])) {
    return 'brand';
  }

  if (includesAny(text, ['coway', 'comparison', 'banding', 'perbezaan', 'vs-'])) {
    return 'blog-topics/comparison';
  }

  if (includesAny(text, ['habuk', 'dust', 'hama', 'asma', 'ekzema', 'resdung', 'bayi', 'mineral', 'alkali', 'reverse-osmosis', 'virus', 'bakteria', 'kucing', 'asap', 'rokok', 'bulu', 'bersin', 'health', 'doctor'])) {
    return 'blog-topics/health';
  }

  if (includesAny(text, ['cara-guna', 'tips', 'tip', 'guide', 'how-to', 'panduan'])) {
    return 'blog-topics/guides';
  }

  return 'misc';
}

function nextAvailablePath(targetFile) {
  if (!fs.existsSync(targetFile)) return targetFile;

  const parsed = path.parse(targetFile);
  let index = 2;
  while (true) {
    const candidate = path.join(parsed.dir, `${parsed.name}-${index}${parsed.ext}`);
    if (!fs.existsSync(candidate)) return candidate;
    index += 1;
  }
}

function replaceAllInFile(file, replacements) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }

  if (changed) fs.writeFileSync(file, content);
  return changed;
}

function listTextFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTextFiles(fullPath));
      continue;
    }
    if (/\.(astro|js|mjs|json|md|mdx|html|css)$/i.test(entry.name)) files.push(fullPath);
  }
  return files;
}

const replacements = new Map();
const moved = [];
const skipped = [];

for (const image of report.images) {
  if (!image.localPublic?.startsWith(sourcePrefix)) continue;
  if (!fs.existsSync(image.localFile)) {
    skipped.push(image.localFile);
    continue;
  }

  const category = classifyImage(image);
  const fileName = path.basename(image.localFile).toLowerCase();
  const targetDir = path.join(publicRoot, 'assets/images', category);
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = nextAvailablePath(path.join(targetDir, fileName));
  const targetPublic = `/${path.relative(publicRoot, targetFile).split(path.sep).join('/')}`;

  fs.renameSync(image.localFile, targetFile);

  const oldPublic = image.localPublic;
  const oldDomainPublic = `https://www.cuckoonano.com${oldPublic}`;
  replacements.set(oldPublic, targetPublic);
  replacements.set(oldDomainPublic, targetPublic);

  image.localFile = targetFile;
  image.localPublic = targetPublic;
  moved.push({ from: oldPublic, to: targetPublic, category });
}

for (const file of listTextFiles('src')) {
  replaceAllInFile(file, replacements);
}

replaceAllInFile(reportPath, replacements);
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (fs.existsSync('public/assets/images/blog/wp-uploads')) {
  for (const file of listTextFiles('reports')) {
    if (file !== reportPath) replaceAllInFile(file, replacements);
  }
}

const summary = moved.reduce((total, item) => {
  total[item.category] = (total[item.category] || 0) + 1;
  return total;
}, {});

fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/image-asset-organization.json', `${JSON.stringify({ moved: moved.length, skipped: skipped.length, summary, examples: moved.slice(0, 40) }, null, 2)}\n`);

console.log(JSON.stringify({ moved: moved.length, skipped: skipped.length, summary }, null, 2));
