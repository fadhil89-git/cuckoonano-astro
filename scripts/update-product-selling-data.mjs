import fs from 'node:fs';
import vm from 'node:vm';

const siteDataPath = 'public/assets/js/site-data.js';
const mainPath = 'public/assets/js/main.js';
const P = '/assets/images/Gambar%20Produk%20png/';
const imageUrl = (file) => P + encodeURIComponent(file);

const source = fs.readFileSync(siteDataPath, 'utf8');
const sandbox = {};
vm.runInNewContext(`${source};this.SITE=SITE;`, sandbox);
const site = sandbox.SITE;

const updates = {
  'xcel-2': {
    price: 'RM66/bln x72',
    image: imageUrl('xcel-2.webp'),
    hoverImage: imageUrl('cuckoo xcel 2 white.webp'),
    desc: 'Countertop digital dengan 2 pilihan warna, Jet Black atau White, untuk dapur moden.',
    bullets: ['Tangki 2.3L: sejuk 1.0L, panas 1.0L, room 0.3L', 'Nano Positive Filtration', 'Touch panel & suhu boleh laras', 'Pilihan warna hitam atau putih'],
  },
  'king-top-2': {
    price: 'RM61/bln x84',
    desc: 'Model mekanikal popular untuk keluarga yang mahukan air panas, sejuk dan room temperature.',
    bullets: ['Tangki 2.3L: sejuk 1.0L, panas 1.0L, room 0.3L', 'Nano Positive Filtration', 'Tangki stainless steel antibakteria', 'Servis & tukar filter berkala'],
  },
  warrior: {
    price: 'RM100→RM95/bln',
    desc: 'Model mekanikal bertangki besar untuk keluarga besar, pejabat kecil atau penggunaan air tinggi.',
    bullets: ['Tangki 5.2L: sejuk 2.8L, panas 1.4L, room 1.0L', 'Nano Positive Filtration', 'Faucet sterilization', 'Stainless steel tank'],
  },
  glamour: {
    price: 'RM105/bln',
    desc: 'Model digital premium dengan tangki besar dan fungsi air panas, sejuk serta room temperature.',
    bullets: ['Tangki 7.6L: sejuk 2.5L, panas 2.4L, room 2.7L', 'Nano Positive Filtration', 'Digital touch control', 'Tangki stainless steel'],
  },
  grande: {
    price: 'RM113→RM108/bln',
    desc: 'Floor-standing digital dengan 2 faucet, extra hot sehingga 100°C dan kapasiti besar.',
    bullets: ['Tangki 7.6L: sejuk 2.5L, panas 2.4L, room 2.7L', 'Nano Positive Filtration', 'Extra hot 100°C', 'In & Out sterilization'],
  },
  titan: {
    price: 'RM113→RM108/bln',
    desc: 'Model digital tankless untuk air panas, sejuk dan room tanpa simpanan tangki.',
    bullets: ['Tankless: panas, sejuk dan room', 'Nano Positive Filtration', 'Digital touch panel', 'Pilihan jumlah air'],
  },
  'flo-stand': {
    price: 'RM115/bln',
    desc: 'Floor-standing mekanikal untuk pejabat, surau, sekolah atau keluarga yang ramai.',
    bullets: ['Tangki 16L: sejuk 5L, panas 4L, room 7L', 'Nano Positive Filtration', 'Kapasiti paling besar', 'Sesuai tempat ramai pengguna'],
  },
  ace: {
    price: 'Semak plan',
    desc: 'Undersink untuk dapur minimal, ruang counter lebih kemas dan air minuman terus dari faucet.',
    bullets: ['Undersink / tanpa tangki atas meja', 'Sistem penapisan CUCKOO', 'Ruang counter lebih lapang', 'Sesuai dapur moden'],
  },
  kiut: {
    price: 'Semak plan',
    desc: 'Model kompak untuk rumah kecil, bilik sewa atau ruang dapur yang terhad.',
    bullets: ['Kompak / tangki kecil', 'Sistem penapisan CUCKOO', 'Mudah letak di ruang kecil', 'Sesuai penggunaan ringan'],
  },
  'l-model': {
    price: 'Semak plan',
    desc: 'Penapis udara untuk ruang lebih besar dengan sensor kualiti udara dan indikator automatik.',
    bullets: ['HEPA H13 filter', 'PM2.5 sensor', 'Cuckoo Plasma Ioniser', 'Coverage luas*'],
  },
  'u-model': {
    price: 'RM130/bln*',
    desc: 'Penapis udara coverage luas untuk ruang tamu, bilik besar dan rumah keluarga.',
    bullets: ['Coverage ±1161 sqft*', 'HEPA H13 filter', 'PM2.5 sensor', 'Cuckoo Plasma Ioniser'],
  },
  'r-model': {
    price: 'Semak plan',
    desc: 'Penapis udara ringkas untuk bantu kurangkan habuk halus dalam ruang harian.',
    bullets: ['Filter habuk halus', 'Sensor kualiti udara*', 'LED indicator', 'Sesuai bilik'],
  },
  'k-model': {
    price: 'RM85/bln*',
    desc: 'Penapis udara kompak untuk bilik tidur, bilik anak atau ruang kerja kecil.',
    bullets: ['HEPA filter*', 'Sensor kualiti udara*', 'Rekaan kompak', 'Sesuai bilik'],
  },
  'c-plus-humidifier': {
    price: 'RM110/bln*',
    desc: 'Air purifier dengan humidifier untuk ruang yang kering, terutama bilik berhawa dingin.',
    bullets: ['Humidifier tank 2.5L*', 'Air purifier + humidifier', 'Cuckoo Plasma Ioniser*', 'Sesuai bilik aircond'],
  },
  'd-model': {
    price: 'RM115/bln*',
    desc: 'Penapis udara untuk ruang rumah dengan sistem tapisan dan sensor mengikut model.',
    bullets: ['HEPA filter*', 'Sensor udara*', 'LED indicator', 'Servis filter berkala'],
  },
  'vita-5tar': {
    price: 'Dari RM103/bln',
    desc: 'Aircond inverter 5-star untuk bilik tidur, bilik anak atau ruang kerja rumah.',
    bullets: ['Inverter 5-star', 'Vitamin C Filter', 'Silver Ion Filter', 'UVC LED sterilisation*'],
  },
  'samsung-bespoke-ai-laundry-combo-12-7kg': {
    price: 'RM115/bln x60',
    desc: 'Washer dryer combo untuk basuh dan kering dalam satu mesin, sesuai rumah moden.',
    bullets: ['12kg washer / 7kg dryer', 'AI Wash & AI Ecobubble', 'Auto Dispense', '2-in-1 space saver'],
  },
  '65-mini-led-m1eh-4k-samsung-vision-smart-tv': {
    price: 'Semak plan',
    desc: 'Smart TV Samsung 65 inci untuk hiburan rumah dengan skrin besar dan paparan 4K.',
    bullets: ['65 inci', '4K Smart TV', 'Mini LED display*', 'Samsung Vision'],
  },
  'galaxy-tab-s10-fe-plus': {
    price: 'Semak plan',
    desc: 'Tablet Samsung untuk kerja ringan, belajar, hiburan dan penggunaan harian keluarga.',
    bullets: ['Galaxy Tab S10 FE+', 'S Pen support*', 'Sesuai kerja & belajar', 'Samsung ecosystem'],
  },
  'bespoke-2': {
    price: 'RM148/bln',
    desc: 'Kerusi urut premium bersama OGAWA untuk rutin relaksasi harian di rumah.',
    bullets: ['Smart SL Track massage', '34 air massage bags', 'Thermotherapy ±45°C*', 'Auto massage programmes'],
  },
  'bespoke-massage-lounger': {
    price: 'Semak plan',
    image: imageUrl('bespoke-massage-lounger.webp'),
    desc: 'Massage lounger yang lebih santai untuk rehat harian dan ruang keluarga.',
    bullets: ['Lounger design', 'Auto massage programmes', 'Rekaan lebih kompak', 'Sesuai ruang keluarga'],
  },
  'a-lite': {
    price: 'Semak plan',
    desc: 'Tilam CUCKOO x Napure 300mm untuk tidur selesa dengan sokongan harian yang seimbang.',
    bullets: ['Ketebalan 300mm', 'Natural latex*', 'Pocket spring support', 'Queen / King*'],
  },
  'a-luxe': {
    price: 'Dari RM105/bln',
    desc: 'Tilam premium CUCKOO x Napure 350mm dengan rasa tidur lebih mewah dan sokongan badan.',
    bullets: ['Ketebalan 350mm', '100% natural latex*', 'Graphene & VitaShield Tech', '7 Zone Spine Support'],
  },
  inductwo: {
    price: 'RM88/bln*',
    image: imageUrl('cuckoo inductwo.webp'),
    desc: 'Hybrid induction hob dua zon untuk dapur moden yang mahukan masakan lebih pantas.',
    bullets: ['2-hob hybrid cooktop', 'Induction + highlight zone', 'Turbo mode', 'Direct touch control'],
  },
  inductrio: {
    price: 'RM100/bln*',
    image: imageUrl('cuckoo inductrio.webp'),
    desc: 'Hybrid induction hob tiga zon untuk keluarga yang kerap memasak beberapa hidangan.',
    bullets: ['2 induction + 1 highlight', 'SCHOTT CERAN glass*', 'Direct touch sensor', 'Voice navigation*'],
  },
  p10: {
    price: 'Semak promo',
    desc: 'Pressure cooker P10 untuk nasi, lauk dan masakan harian dengan lebih mudah.',
    bullets: ['Pressure multi cooker', 'X-Wall coating*', 'Auto steam cleaning*', 'Menu masakan harian'],
  },
  treadmill: {
    price: 'Semak plan',
    desc: 'Treadmill untuk rutin berjalan dan light jogging dari rumah.',
    bullets: ['Walking & light jog', 'Rekaan sesuai rumah', 'Mudah digunakan', 'Sesuai rutin harian'],
  },
};

for (const category of Object.values(site.products)) {
  category.items = category.items.map((product) => ({
    ...product,
    ...(updates[product.id] || {}),
  }));
}

fs.writeFileSync(siteDataPath, `const SITE = ${JSON.stringify(site, null, 2)};\n`);

let main = fs.readFileSync(mainPath, 'utf8');
const newCard = `function card(p){let bullets=(p.bullets||[]).slice(0,4).map(b=>\`<li class="flex gap-2 text-xs leading-5 text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"></span><span>\${b}</span></li>\`).join('');let price=p.price?\`<span class="rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-black leading-none text-brand sm:text-xs">\${p.price}</span>\`:'';let hover=p.hoverImage?\`<img src="\${p.hoverImage}" alt="\${p.name} warna alternatif" loading="lazy" class="absolute inset-0 h-full w-full object-contain p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />\`:'';let baseOpacity=p.hoverImage?'group-hover:opacity-0':'';return \`<article class="group flex w-[300px] shrink-0 snap-start flex-col rounded-[1.75rem] border border-brand/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-soft sm:w-[320px]"><div class="relative flex h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10"><img src="\${p.image}" alt="\${p.name}" loading="lazy" class="h-full w-full object-contain p-5 transition-opacity duration-300 \${baseOpacity}" />\${hover}</div><div class="mt-5 grid min-h-[4.25rem] grid-cols-[1fr_auto] items-start gap-3"><h3 class="text-lg font-black leading-tight">\${p.name}</h3>\${price}</div><p class="mt-2 min-h-[4.5rem] text-sm leading-6 text-muted">\${p.desc}</p>\${bullets?\`<ul class="mt-4 grid gap-2">\${bullets}</ul>\`:''}<a href="\${p.url}" class="mt-auto inline-flex w-fit rounded-full bg-brand px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl">Lihat Produk</a></article>\`}`;
main = main.replace(/function card\(p\)\{.*?\}function renderProductSelector/s, `${newCard}function renderProductSelector`);
fs.writeFileSync(mainPath, main);

const missing = [];
for (const category of Object.values(site.products)) {
  for (const product of category.items) {
    for (const image of [product.image, product.hoverImage].filter(Boolean)) {
      const path = 'public' + decodeURIComponent(image);
      if (!fs.existsSync(path)) missing.push(`${product.id}: ${image}`);
    }
  }
}

if (missing.length) {
  console.error('Missing images:\n' + missing.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Updated selling data, price pills and card UI.');
}
