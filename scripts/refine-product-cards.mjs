import fs from 'node:fs';
import vm from 'node:vm';

const siteDataPath = 'public/assets/js/site-data.js';
const mainPath = 'public/assets/js/main.js';

const siteSource = fs.readFileSync(siteDataPath, 'utf8');
const sandbox = {};
vm.runInNewContext(`${siteSource};this.SITE=SITE;`, sandbox);
const site = sandbox.SITE;

const P = '/assets/images/Gambar%20Produk%20png/';
const legacy = {
  washer: '/assets/images/products/washer-dryer/washer-dryer-cuckoo-knight-mesin-basuh-pengering-23.jpg',
  inductwo: '/assets/images/promo/promosi-cuckoo-2025-inductwo-rm88-induction-cooker-dapur-elektrik-induksi-promotion-offer-agent.jpeg',
  inductrio: '/assets/images/promo/promosi-cuckoo-2025-inductrio-rm100-induction-cooker-dapur-elektrik-induksi-promotion-offer-agent.jpeg',
};

const copy = {
  'xcel-2': {
    desc: 'Model countertop moden untuk keluarga yang mahukan air panas, sejuk dan room temperature.',
    price: 'Semak bulanan',
    bullets: ['Hot / Cold / Room', 'Nano Positive Filtration', 'Sesuai dapur moden'],
  },
  'king-top-2': {
    desc: 'Pilihan popular untuk rumah kerana rekaan atas meja, mudah dicapai dan air bermineral.',
    price: 'Semak bulanan',
    bullets: ['Hot / Cold / Room', 'Air bermineral', 'Model keluarga'],
  },
  warrior: {
    desc: 'Penapis air berkapasiti besar untuk keluarga yang kerap guna air panas dan sejuk.',
    price: 'Semak bulanan',
    bullets: ['Kapasiti besar', 'Hot / Cold / Room', 'Stainless steel tank*'],
  },
  glamour: {
    desc: 'Model premium dengan rekaan elegan untuk ruang dapur atau pantry yang kemas.',
    price: 'Semak bulanan',
    bullets: ['Rekaan premium', 'Air bermineral', 'Sesuai rumah moden'],
  },
  grande: {
    desc: 'Pilihan penapis air floor-standing untuk penggunaan lebih tinggi di rumah atau pejabat.',
    price: 'Semak bulanan',
    bullets: ['Floor-standing', 'Kapasiti tinggi', 'Sesuai pejabat kecil'],
  },
  titan: {
    desc: 'Model penapis air berprestasi tinggi untuk rumah yang perlukan penggunaan harian konsisten.',
    price: 'Semak bulanan',
    bullets: ['Kapasiti tinggi', 'Air bermineral', 'Penggunaan harian'],
  },
  'flo-stand': {
    desc: 'Penapis air stand yang praktikal untuk rumah, ruang makan atau pejabat kecil.',
    price: 'Semak bulanan',
    bullets: ['Model berdiri', 'Mudah ditempatkan', 'Sesuai ruang keluarga'],
  },
  ace: {
    desc: 'Model undersink yang kemas untuk dapur minimal dan ruang counter yang lebih lapang.',
    price: 'Semak bulanan',
    bullets: ['Undersink', 'Ruang counter kemas', 'Sesuai dapur moden'],
  },
  kiut: {
    desc: 'Model kompak untuk rumah kecil, bilik sewa atau ruang dapur yang terhad.',
    price: 'Semak bulanan',
    bullets: ['Kompak', 'Mudah letak', 'Sesuai ruang kecil'],
  },
  'l-model': {
    desc: 'Penapis udara untuk ruang lebih besar dengan sensor dan indikator kualiti udara.',
    price: 'Semak bulanan',
    bullets: ['PM2.5 Sensor', 'HEPA H13 Filter', 'Coverage luas*'],
  },
  'u-model': {
    desc: 'Penapis udara bergaya moden untuk ruang tamu, bilik tidur dan rumah keluarga.',
    price: 'Semak bulanan',
    bullets: ['HEPA H13 Filter', 'Cuckoo Plasma Ioniser', 'LED indicator'],
  },
  'r-model': {
    desc: 'Model penapis udara ringkas untuk bantu kurangkan habuk halus dalam ruang harian.',
    price: 'Semak bulanan',
    bullets: ['Tapisan habuk', 'Sesuai bilik', 'Mudah digunakan'],
  },
  'k-model': {
    desc: 'Penapis udara kompak untuk bilik tidur, bilik anak atau ruang kerja kecil.',
    price: 'Semak bulanan',
    bullets: ['Kompak', 'HEPA filter*', 'Sesuai bilik'],
  },
  'c-plus-humidifier': {
    desc: 'Humidifier untuk bantu ruang terasa lebih selesa, terutama bilik berhawa dingin.',
    price: 'Semak bulanan',
    bullets: ['Humidifier', 'Sesuai bilik aircond', 'Rekaan kompak'],
  },
  'd-model': {
    desc: 'Penapis udara ringkas untuk rumah yang mahukan asas penjagaan udara harian.',
    price: 'Semak bulanan',
    bullets: ['Air purifier', 'Sesuai bilik', 'Mudah dijaga'],
  },
  'vita-5tar': {
    desc: 'Aircond inverter 5-star untuk bilik tidur, bilik anak atau ruang kerja rumah.',
    price: 'Dari RM103/bln*',
    bullets: ['Inverter 5-star', 'Vitamin C Filter', 'UVC LED sterilisation*'],
  },
  'samsung-bespoke-ai-laundry-combo-12-7kg': {
    desc: 'Washer dryer combo untuk basuh dan kering dalam satu mesin, sesuai rumah moden.',
    price: '±RM130/bln*',
    bullets: ['12kg washer / 7kg dryer', 'AI wash', '2-in-1 space saver'],
    image: legacy.washer,
  },
  '65-mini-led-m1eh-4k-samsung-vision-smart-tv': {
    desc: 'Smart TV Samsung 65 inci untuk hiburan rumah dengan skrin besar dan paparan 4K.',
    price: 'Semak bulanan',
    bullets: ['65 inci', '4K Smart TV', 'Samsung Vision'],
  },
  'galaxy-tab-s10-fe-plus': {
    desc: 'Tablet Samsung untuk kerja ringan, belajar, hiburan dan penggunaan harian keluarga.',
    price: 'Semak bulanan',
    bullets: ['Galaxy Tab', 'S Pen support*', 'Sesuai kerja & belajar'],
  },
  'bespoke-2': {
    desc: 'Kerusi urut premium bersama OGAWA untuk rutin relaksasi di rumah.',
    price: '±RM139/bln*',
    bullets: ['Smart SL Track', 'Air massage', 'Thermotherapy*'],
  },
  'bespoke-massage-lounger': {
    desc: 'Massage lounger untuk rehat harian dengan saiz lebih lounge dan selesa.',
    price: 'Semak bulanan',
    bullets: ['Lounger style', 'Auto massage', 'Sesuai ruang keluarga'],
  },
  'a-lite': {
    desc: 'Tilam CUCKOO x Napure untuk tidur selesa dengan rasa sokongan harian yang seimbang.',
    price: 'Semak bulanan',
    bullets: ['Natural latex*', 'Hotel mattress feel', 'Queen / King*'],
    image: `${P}a-luxe-mattress.png`,
  },
  'a-luxe': {
    desc: 'Tilam premium CUCKOO x Napure untuk rasa tidur lebih mewah dan sokongan badan.',
    price: 'Semak bulanan',
    bullets: ['Premium mattress', 'Natural latex*', 'Queen / King*'],
  },
  inductwo: {
    desc: 'Hybrid induction hob dua zon untuk dapur moden yang mahukan masakan lebih pantas.',
    price: '±RM88/bln*',
    bullets: ['2-hob hybrid cooktop', 'Turbo mode', 'Direct highlight zone'],
    image: legacy.inductwo,
  },
  inductrio: {
    desc: 'Hybrid induction hob tiga zon untuk keluarga yang kerap memasak beberapa hidangan.',
    price: '±RM100/bln*',
    bullets: ['2 induction + 1 highlight', 'SCHOTT CERAN glass*', 'Touch sensor'],
    image: legacy.inductrio,
  },
  p10: {
    desc: 'Pressure cooker P10 untuk nasi, lauk dan masakan harian dengan lebih mudah.',
    price: 'Semak promo',
    bullets: ['Multi cooker', 'Masakan harian', 'Pressure cooking'],
  },
  treadmill: {
    desc: 'Treadmill untuk rutin berjalan dan light jogging dari rumah.',
    price: 'Semak bulanan',
    bullets: ['Walking & light jog', 'Sesuai rumah', 'Mudah digunakan'],
  },
};

for (const category of Object.values(site.products)) {
  category.items = category.items
    .filter((item) => item.id !== 'ch10')
    .map((item) => ({ ...item, ...(copy[item.id] || {}) }));
}

site.products['pressure-cooker'].desc = 'CUCKOO P10 untuk masakan harian, lauk, nasi dan menu keluarga.';
site.products['pressure-cooker'].title = 'Pressure Cooker CUCKOO P10';

fs.writeFileSync(siteDataPath, `const SITE = ${JSON.stringify(site, null, 2)};\n`);

let main = fs.readFileSync(mainPath, 'utf8');

const newCard = `function card(p){let bullets=(p.bullets||[]).slice(0,3).map(b=>\`<li class="flex gap-2 text-xs leading-5 text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"></span><span>\${b}</span></li>\`).join('');let price=p.price?\`<span class="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-black text-brand">\${p.price}</span>\`:'';return \`<article class="w-[300px] shrink-0 snap-start rounded-[1.75rem] border border-brand/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-soft sm:w-[320px]"><div class="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-brand/10"><img src="\${p.image}" alt="\${p.name}" loading="lazy" class="h-full w-full object-contain" /></div><div class="mt-5 flex items-start justify-between gap-3"><h3 class="text-lg font-black leading-tight">\${p.name}</h3>\${price}</div><p class="mt-3 min-h-[3rem] text-sm leading-6 text-muted">\${p.desc}</p>\${bullets?\`<ul class="mt-4 grid gap-2">\${bullets}</ul>\`:''}<a href="\${p.url}" class="mt-5 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl">Lihat Produk</a></article>\`}`;
main = main.replace(/function card\(p\)\{.*?\}function renderProductSelector/s, `${newCard}function renderProductSelector`);

main = main.replace(
  /<div class="rounded-\[2rem\] bg-cream p-5 shadow-sm"><div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h3 class="text-2xl font-black">\$\{c\.title\}<\/h3><p class="mt-2 max-w-2xl text-sm leading-6 text-muted">\$\{c\.desc\}<\/p><\/div><a href="\/products\/\$\{k\}\/" class="rounded-full bg-white px-5 py-3 text-sm font-bold text-brand shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">Lihat kategori<\/a><\/div><div class="mt-6 flex snap-x gap-4 overflow-x-auto pb-2 no-scrollbar">\$\{c\.items\.map\(card\)\.join\(''\)\}<\/div><\/div>/,
  `<div class="rounded-[2rem] bg-cream p-5 shadow-sm sm:p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p class="text-xs font-black uppercase tracking-[.18em] text-brand/70">Kategori produk</p><h3 class="mt-2 text-2xl font-black sm:text-3xl">\${c.title}</h3><p class="mt-3 max-w-2xl text-sm leading-6 text-muted">\${c.desc}</p></div><a href="/products/\${k}/" class="inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-brand shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">Lihat kategori</a></div><div class="mt-7 flex snap-x gap-4 overflow-x-auto pb-3 no-scrollbar">\${c.items.map(card).join('')}</div><p class="mt-3 text-xs leading-5 text-muted">*Harga, promo dan ciri tertentu bergantung kepada model, stok dan kempen semasa. WhatsApp ejen untuk semak pakej terkini.</p></div>`
);

fs.writeFileSync(mainPath, main);

console.log('Refined product cards and product data.');
