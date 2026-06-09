async function loadIncludes() {
  for (const el of document.querySelectorAll('[data-include]')) {
    try {
      const response = await fetch(el.getAttribute('data-include'));
      el.innerHTML = await response.text();
    } catch (error) {
      console.warn(error);
    }
  }
}

function cleanPhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function wasap(phone) {
  const number = cleanPhone(phone);
  return 'https://wasap.my/' + (number.startsWith('6') ? number : '6' + number);
}

function rotatingWhatsapp() {
  const links = [
    'https://api.whatsapp.com/send?phone=60139916967&text=Salam%20Fadhil,%20saya%20nak%20semak%20promo%20CUCKOO%20terkini,%20harga%20bulanan%20dan%20produk%20yang%20sesuai.',
    'https://api.whatsapp.com/send?phone=60132775539&text=Salam%20Pn%20Izzah,%20saya%20nak%20semak%20promo%20CUCKOO%20terkini,%20harga%20bulanan%20dan%20produk%20yang%20sesuai.'
  ];
  const current = Number(localStorage.getItem('waRotate') || 0);
  const link = links[current % links.length];
  localStorage.setItem('waRotate', String(current + 1));
  return link;
}

function agentWhatsapp(agent = 'fadhil') {
  const links = {
    fadhil: 'https://api.whatsapp.com/send?phone=60139916967&text=Salam%20Fadhil,%20saya%20nak%20semak%20promo%20CUCKOO%20terkini,%20harga%20bulanan%20dan%20produk%20yang%20sesuai.',
    izzah: 'https://api.whatsapp.com/send?phone=60132775539&text=Salam%20Pn%20Izzah,%20saya%20nak%20semak%20promo%20CUCKOO%20terkini,%20harga%20bulanan%20dan%20produk%20yang%20sesuai.'
  };
  return links[agent] || links.fadhil;
}

function productWhatsapp(product) {
  const text = `Salam Fadhil, saya nak semak promo untuk ${product.name}. Boleh bantu semak harga bulanan, syarat dan produk yang layak?`;
  return 'https://api.whatsapp.com/send?phone=60139916967&text=' + encodeURIComponent(text);
}

function suitability(product) {
  const category = product.category || '';
  const name = product.name || '';

  if (category === 'water-purifier') {
    if (/warrior|grande|flo/i.test(name)) return 'keluarga besar, pejabat kecil atau penggunaan ramai';
    if (/kiut|ace/i.test(name)) return 'ruang dapur terhad dan rumah moden';
    return 'rumah keluarga dan kegunaan air minuman harian';
  }

  if (category === 'air-purifier') return 'bilik tidur, ruang tamu dan rumah kawasan berhabuk';
  if (category === 'air-conditioner') return 'bilik tidur, bilik anak dan ruang kerja';
  if (category === 'washer-dryer') return 'condo, apartment dan keluarga yang mahu jimat ruang';
  if (category === 'samsung') return 'rumah moden dan gaya hidup digital';
  if (category === 'massage-chair') return 'ruang rehat keluarga dan hadiah untuk ibu bapa';
  if (category === 'mattress') return 'upgrade tidur dan keselesaan harian';
  if (category === 'induction') return 'dapur moden dan rutin memasak harian';
  if (category === 'pressure-cooker') return 'masakan harian yang lebih mudah';
  if (category === 'treadmill') return 'rutin berjalan atau light jogging di rumah';

  return 'customer yang mahu semak produk ikut bajet dan keperluan';
}

function specLabel(spec) {
  return String(spec || '')
    .replace(/\bCold\b/gi, 'Sejuk')
    .replace(/\bHot\b/gi, 'Panas')
    .replace(/\bRoom\b/gi, 'Room')
    .replace(/\s+/g, ' ')
    .trim();
}

function productSpecs(product) {
  const bullets = product.bullets || [];

  if (Array.isArray(product.specs) && product.specs.length) {
    return product.specs.map(specLabel).slice(0, 3);
  }

  if (product.category === 'water-purifier' && bullets[0]) {
    return bullets[0].split(',').map(specLabel).slice(0, 3);
  }

  const byCategory = {
    'air-conditioner': ['Inverter', '5-Star', 'Bilik Tidur'],
    'washer-dryer': ['12kg Wash', '7kg Dry', 'AI Combo'],
    samsung: ['Smart Home', 'Samsung', 'Plan CUCKOO'],
    'air-purifier': ['Air Purifier', 'Filter', 'Ruang Bilik'],
    mattress: ['Tilam', 'Sokongan Badan', 'Tidur Harian'],
    'massage-chair': ['Full Body', 'Auto Mode', 'Relax'],
    induction: ['Induction', 'Dapur Moden', 'Mudah Masak'],
    'pressure-cooker': ['Multi Cooker', 'Masak Harian', 'Keluarga'],
    treadmill: ['Fitness', 'Rumah', 'Light Jogging']
  };

  return (byCategory[product.category] || bullets.map(specLabel)).slice(0, 3);
}

function productHighlights(product) {
  const highlights = Array.isArray(product.highlights) && product.highlights.length
    ? product.highlights
    : (product.bullets || []).slice(product.category === 'water-purifier' ? 1 : 0);

  return highlights.filter(Boolean).slice(0, 3);
}

function card(product) {
  const specs = productSpecs(product)
    .map((spec) => `
      <span class="rounded-full bg-cream px-3 py-1.5 text-[11px] font-black leading-none text-brand ring-1 ring-brand/10">
        ${spec}
      </span>
    `)
    .join('');

  const highlights = productHighlights(product)
    .map((item) => `
      <li class="flex gap-2 text-xs font-bold leading-5 text-muted">
        <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] text-white">✓</span>
        <span>${item}</span>
      </li>
    `)
    .join('');

  const pricePlans = (product.pricePlans || [])
    .map((plan) => `
      <div class="mt-4 rounded-2xl bg-brand-soft/70 p-4 ring-1 ring-brand/10">
        <p class="text-[11px] font-black uppercase tracking-[.14em] text-brand">${plan.type}</p>
        <div class="mt-2 flex items-end gap-1">
          <span class="text-3xl font-black leading-none text-brand">${plan.highlight}</span>
          <span class="pb-1 text-xs font-black text-brand">/bulan</span>
        </div>
        <div class="mt-3 grid gap-1 border-t border-brand/10 pt-3">
          ${plan.rows.map((row) => `
            <div class="flex items-center justify-between gap-3 text-xs">
              <span class="font-bold text-muted">${row[0]}</span>
              <span class="font-black text-brand">${row[1]}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `)
    .join('');

  const price = product.price
    ? `<div class="mt-4 rounded-2xl bg-brand-soft/70 p-4 ring-1 ring-brand/10">
        <p class="text-[11px] font-black uppercase tracking-[.14em] text-brand">${product.priceLabel || 'Plan / Harga'}</p>
        <p class="mt-2 text-2xl font-black leading-tight text-brand">${product.price}</p>
      </div>`
    : '';

  const hover = product.hoverImage
    ? `<img src="${product.hoverImage}" alt="${product.name} warna alternatif" loading="lazy" class="absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />`
    : '';

  const baseOpacity = product.hoverImage ? 'group-hover:opacity-0' : '';

  return `
    <article class="group flex w-[310px] shrink-0 snap-start flex-col rounded-[1.75rem] border border-brand/10 bg-white p-4 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:bg-white sm:w-[340px]">
      <div class="relative flex h-[310px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-white to-cream ring-1 ring-brand/10">
        <img src="${product.image}" alt="${product.name}" loading="lazy" class="h-full w-full object-contain p-4 transition-opacity duration-300 ${baseOpacity}" />
        ${hover}
      </div>

      <div class="mt-5">
        <h3 class="text-xl font-black leading-tight">${product.name}</h3>
      </div>

      ${specs ? `<div class="mt-3 flex flex-wrap gap-2">${specs}</div>` : ''}

      ${pricePlans || price}

      ${highlights ? `<ul class="mt-4 grid gap-2">${highlights}</ul>` : ''}

      <p class="mt-4 text-sm leading-6 text-muted">${product.desc}</p>

      <div class="mt-auto grid gap-3 pt-7">
        <a href="${productWhatsapp(product)}" class="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl">
          Semak Promo Produk Ini
        </a>
        <a href="${product.url}" class="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-brand ring-1 ring-brand/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-soft">
          Lihat Detail
        </a>
      </div>
    </article>
  `;
}

function categoryGuide(key) {
  const guides = {
    'water-purifier': [
      'Apa perlu semak',
      'Saiz keluarga, kapasiti tangki, fungsi panas/sejuk dan ruang dapur.',
      ['Tangki & suhu air', 'Digital atau mekanikal', 'Anggaran bayaran bulanan']
    ],
    'air-purifier': [
      'Apa perlu semak',
      'Saiz bilik, tahap habuk, alahan, anak kecil atau kegunaan ruang tamu.',
      ['Coverage ruang', 'Jenis filter', 'Bunyi & penggunaan harian']
    ],
    'outdoor-filter': [
      'Apa perlu semak',
      'Jenis rumah, tekanan air, ruang pemasangan dan keperluan filter luar rumah.',
      ['Point-of-entry', 'Non-electric', 'Servis berkala']
    ],
    'air-conditioner': [
      'Apa perlu semak',
      'HP aircond, saiz bilik, inverter, pemasangan dan penggunaan elektrik.',
      ['1.0HP atau 1.5HP', 'Saiz bilik', 'Plan dan pemasangan']
    ],
    'washer-dryer': [
      'Apa perlu semak',
      'Kapasiti basuhan, ruang rumah, rutin dobi dan keperluan dryer.',
      ['12kg / 7kg combo', 'Jimat ruang', 'Sesuai apartment']
    ],
    samsung: [
      'Apa perlu semak',
      'Produk Samsung melalui CUCKOO untuk gaya hidup rumah moden.',
      ['Peti sejuk / washer dryer', 'Smart TV / tablet', 'Semak plan aktif']
    ],
    'massage-chair': [
      'Apa perlu semak',
      'Ruang rumah, kegunaan harian, hadiah ibu bapa dan bajet bulanan.',
      ['Jenis urutan', 'Saiz ruang', 'Plan bulanan']
    ],
    mattress: [
      'Apa perlu semak',
      'Saiz tilam, tahap keselesaan, sokongan badan dan bajet bulanan.',
      ['Queen / King', 'Firmness', 'Plan mengikut model']
    ],
    induction: [
      'Apa perlu semak',
      'Saiz dapur, cara memasak harian dan pilihan induction hob.',
      ['2 atau 3 zon', 'Jenis cookware', 'Pemasangan dapur']
    ],
    'pressure-cooker': [
      'Apa perlu semak',
      'Kegunaan memasak harian, kapasiti keluarga dan menu yang biasa dimasak.',
      ['Nasi & lauk', 'Kapasiti periuk', 'Semak promo aktif']
    ],
    treadmill: [
      'Apa perlu semak',
      'Ruang rumah, rutin berjalan atau light jogging dan bajet bulanan.',
      ['Saiz treadmill', 'Rutin senaman', 'Semak plan aktif']
    ]
  };

  return guides[key] || [
    'Apa perlu semak',
    'Model, harga bulanan, stok, promo dan syarat semasa.',
    ['Model sesuai', 'Bayaran bulanan', 'Promo aktif']
  ];
}

function renderProductSelector() {
  document.querySelectorAll('[data-product-selector]').forEach((el) => {
    const preferred = [
      'water-purifier',
      'outdoor-filter',
      'air-purifier',
      'air-conditioner',
      'washer-dryer',
      'samsung',
      'mattress',
      'massage-chair',
      'induction',
      'pressure-cooker',
      'treadmill'
    ];
    const keys = preferred.filter((key) => SITE.products[key]);
    const sections = keys.map((key, index) => {
      const category = SITE.products[key];
      const guide = categoryGuide(key);
      const bg = index % 2 === 0 ? 'bg-cream' : 'bg-white';
      const panelBg = index % 2 === 0 ? 'bg-white' : 'bg-cream';
      const categoryUrl = category.url || `/products/${key}/`;

      return `
        <section id="produk-${key}" class="${bg} px-4 py-16 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-7xl">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p class="font-bold text-brand">${index === 0 ? 'Produk CUCKOO' : 'Kategori seterusnya'}</p>
                <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">${category.title}</h2>
                <p class="mt-3 max-w-3xl text-sm leading-7 text-muted">${category.desc}</p>
              </div>
              <a href="${categoryUrl}" class="inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl">
                Lihat Semua Model
              </a>
            </div>

            <div class="mt-8 grid gap-6 lg:grid-cols-[.58fr_1.42fr] lg:items-start">
              <aside class="rounded-[1.75rem] bg-brand p-6 text-white shadow-glow lg:sticky lg:top-24">
                <p class="text-xs font-black uppercase tracking-[.2em] text-brand-gold">${guide[0]}</p>
                <h3 class="mt-4 text-2xl font-black leading-tight">Sebelum pilih ${category.label}, semak perkara ini dulu.</h3>
                <p class="mt-4 text-sm font-semibold leading-7 text-white/75">${guide[1]}</p>
                <div class="mt-5 grid gap-2">
                  ${guide[2].map((item) => `<div class="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white ring-1 ring-white/15">${item}</div>`).join('')}
                </div>
                <a href="#" onclick="this.href=rotatingWhatsapp()" class="mt-6 inline-flex w-full justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-brand transition-all duration-300 hover:-translate-y-1 hover:bg-brand-gold">
                  Semak Promo Kategori Ini
                </a>
              </aside>

              <div class="min-w-0 rounded-[2rem] ${panelBg} p-4 shadow-none ring-1 ring-brand/10 sm:p-5">
                <div class="flex snap-x gap-4 overflow-x-auto overflow-y-visible pb-1 no-scrollbar">
                  ${category.items.slice(0, 8).map(card).join('')}
                </div>
                <p class="mt-5 px-1 text-xs leading-5 text-muted">
                  *Harga, promo dan ciri tertentu bergantung kepada model, stok dan kempen semasa. WhatsApp ejen untuk semak pakej terkini.
                </p>
              </div>
            </div>
          </div>
        </section>
      `;
    }).join('');

    el.innerHTML = `
      <div id="produk-popular">
        <section class="bg-cream px-4 pb-4 pt-16 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-7xl text-center">
            <p class="font-bold text-brand">Produk mengikut kategori</p>
            <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Produk CUCKOO Yang Ramai Customer Tanya</h2>
            <p class="mx-auto mt-4 max-w-3xl text-muted">
              Pilih kategori yang anda sudah minat, kemudian semak model popular, anggaran bayaran dan promo semasa dengan ejen.
            </p>
            <div class="sticky top-3 z-20 mx-auto mt-7 flex max-w-4xl flex-col items-center justify-between gap-3 rounded-[1.5rem] border border-brand/10 bg-white/95 p-3 text-left shadow-soft backdrop-blur sm:flex-row sm:rounded-full sm:px-5">
              <p class="text-sm font-bold leading-6 text-ink">
                <span class="text-brand">Promo terkini:</span> RM12/bulan 6 bulan pertama untuk produk terpilih.
              </p>
              <a href="#" onclick="this.href=rotatingWhatsapp()" class="inline-flex shrink-0 rounded-full bg-brand px-5 py-2.5 text-xs font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark">
                Semak kelayakan
              </a>
            </div>
          </div>
        </section>
        ${sections}
      </div>
    `;
  });
}

function renderPromo() {
  document.querySelectorAll('[data-promo]').forEach((el) => {
    if (!SITE.promo.active) {
      el.remove();
      return;
    }

    el.innerHTML = `
      <section class="bg-cream px-4 py-12 sm:px-6 lg:px-8">
        <div class="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          <article class="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_84%_8%,rgba(216,166,74,.22),transparent_30%),linear-gradient(135deg,#35040f_0%,#710b21_52%,#9d1731_100%)] p-6 text-white shadow-glow lg:p-8">
            <p class="inline-flex rounded-full bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-brand-gold ring-1 ring-white/15">Promo CUCKOO terkini</p>
            <div class="mt-6 rounded-[1.5rem] bg-white p-5 text-brand shadow-xl ring-1 ring-white/40">
              <p class="text-xs font-black uppercase tracking-[.18em] text-brand">Untuk produk terpilih</p>
              <div class="mt-3 flex items-end gap-2">
                <span class="text-[4.4rem] font-black leading-none tracking-tight sm:text-[5.5rem]">RM12</span>
                <span class="pb-3 text-xl font-black">/bulan</span>
              </div>
              <p class="mt-2 text-sm font-black text-ink">6 bulan pertama untuk produk yang layak.</p>
            </div>
            <p class="mt-5 text-sm font-semibold leading-7 text-white/80">
              Promo tertakluk kepada produk, stok, kawasan, kempen, kelulusan dan syarat semasa.
            </p>
            <a href="#" onclick="this.href=rotatingWhatsapp()" class="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-brand transition-all duration-300 hover:-translate-y-1 hover:bg-brand-gold hover:shadow-xl">
              Semak Produk Layak RM12
            </a>
          </article>

          <article class="overflow-hidden rounded-[2rem] border border-brand/10 bg-white p-6 shadow-soft lg:p-8">
            <p class="inline-flex rounded-full bg-brand-soft px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-brand">Trade-In / GOOOD Deal</p>
            <h2 class="mt-5 text-3xl font-black tracking-tight text-ink sm:text-4xl">Customer Lama CUCKOO? Semak Pilihan Trade-In.</h2>
            <p class="mt-4 text-sm font-semibold leading-7 text-muted">
              Untuk pelanggan CUCKOO sedia ada yang mahu upgrade model atau tukar kepada pakej semasa. Kami bantu semak kelayakan, produk yang boleh trade-in dan bayaran bulanan terkini.
            </p>
            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl bg-cream p-4">
                <p class="text-sm font-black text-brand">Upgrade model</p>
                <p class="mt-2 text-xs leading-5 text-muted">Semak pilihan produk yang boleh ditukar mengikut kempen.</p>
              </div>
              <div class="rounded-2xl bg-brand p-4 text-white">
                <p class="text-sm font-black">Jimat bayaran</p>
                <p class="mt-2 text-xs leading-5 text-white/75">Kelayakan dan rebat bergantung kepada syarat semasa.</p>
              </div>
            </div>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/goood-deal/" class="inline-flex justify-center rounded-full bg-brand px-6 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl">
                Lihat Promo Trade-In
              </a>
              <a href="#" onclick="this.href=rotatingWhatsapp()" class="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-brand ring-1 ring-brand/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-soft">
                Tanya Kelayakan
              </a>
            </div>
          </article>
        </div>
      </section>
    `;
  });
}

function renderWhy() {
  document.querySelectorAll('[data-why-cuckoo]').forEach((el) => {
    const points = [
      ['Bayaran bulanan mudah', 'Plan rental bulanan untuk produk terpilih.'],
      ['Tanpa slip gaji untuk plan tertentu', 'Untuk plan tertentu, tidak perlu slip gaji atau bank statement. Tertakluk kepada syarat semasa.'],
      ['Suri rumah boleh apply', 'Bergantung kepada produk, plan dan semakan kelayakan.'],
      ['Servis berkala', 'Servis mengikut kategori produk dan plan yang dipilih.'],
      ['Waranti mengikut produk', 'Perlindungan waranti bergantung kepada produk dan plan.'],
      ['Mudah mohon', 'Kami bantu semak dokumen dan proses asas sebelum daftar.']
    ];

    el.innerHTML = `
      <section class="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="mx-auto max-w-3xl text-center">
            <p class="font-bold text-brand">Kenapa ramai pilih CUCKOO?</p>
            <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Kenapa Ramai Pilih CUCKOO Untuk Rumah?</h2>
          </div>
          <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            ${points.map(([title, description]) => `
              <div class="rounded-2xl bg-cream p-5">
                <div class="flex gap-3">
                  <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs text-white">✓</span>
                  <div>
                    <h3 class="font-black">${title}</h3>
                    <p class="mt-2 text-sm text-muted">${description}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  });
}

function renderTestimonials() {
  document.querySelectorAll('[data-testimonials]').forEach((el) => {
    el.innerHTML = `
      <section class="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <p class="font-bold text-brand">Customer proof</p>
          <h2 class="mt-2 text-3xl font-black tracking-tight">Apa yang pelanggan biasanya hargai</h2>
          <div class="mt-8 grid gap-5 lg:grid-cols-3">
            ${SITE.testimonials.map(([name, quote]) => `
              <div class="rounded-[2rem] bg-cream p-6 shadow-none">
                <p class="text-4xl text-brand/30">"</p>
                <p class="mt-2 text-sm leading-6 text-muted">${quote}</p>
                <p class="mt-4 text-sm font-bold text-brand">${name}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  });
}

function renderGift() {
  document.querySelectorAll('[data-agent-gift]').forEach((el) => {
    el.innerHTML = `
      <section class="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="rounded-[2rem] border border-amber-400/30 bg-white p-6 shadow-soft lg:p-8">
            <div class="grid gap-6 sm:grid-cols-[120px_1fr_auto] sm:items-center">
              <div class="flex aspect-square items-center justify-center rounded-[1.5rem] bg-cream text-center text-sm font-bold text-brand">Gift Image</div>
              <div>
                <p class="text-sm font-bold text-brand">${SITE.gift.title}</p>
                <h2 class="mt-2 text-2xl font-black">${SITE.gift.headline}</h2>
                <p class="mt-2 text-sm leading-6 text-muted">${SITE.gift.description}</p>
              </div>
              <a href="#" onclick="this.href=rotatingWhatsapp()" class="rounded-full bg-brand px-6 py-3 text-center text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl">Tanya Gift</a>
            </div>
          </div>
        </div>
      </section>
    `;
  });
}

function renderAgents() {
  document.querySelectorAll('[data-agent-block]').forEach((el) => {
    el.innerHTML = `
      <section class="px-4 py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.12),transparent_34%),linear-gradient(135deg,#4B0715_0%,#7A0E23_55%,#8E1830_100%)] p-6 text-white shadow-glow lg:p-10">
            <div class="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-start">
              <div>
                <p class="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/90 ring-1 ring-white/15">Hubungi Ejen CUCKOO</p>
                <h2 class="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">Masih ada soalan?<br><span class="text-brand-gold">Tanya dulu</span> sebelum order.</h2>
                <p class="mt-5 max-w-2xl text-base leading-8 text-white/75">Kami bantu semak promo, harga bulanan, kelayakan dan cadangkan model CUCKOO yang sesuai dengan rumah anda.</p>
              </div>

              <div class="grid gap-3 rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/15 sm:grid-cols-3 lg:grid-cols-1">
                <div class="flex items-center gap-3"><span class="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-lg">✓</span><p class="font-black text-white">Ejen CUCKOO<br><span class="font-medium text-white/70">sejak 2017</span></p></div>
                <div class="flex items-center gap-3"><span class="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-lg">★</span><p class="font-black text-white">2000+<br><span class="font-medium text-white/70">pemasangan</span></p></div>
                <div class="flex items-center gap-3"><span class="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-lg">MY</span><p class="font-black text-white">Seluruh Malaysia<br><span class="font-medium text-white/70">servis & sokongan</span></p></div>
              </div>
            </div>

            <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div class="rounded-[1.35rem] bg-white/10 p-4 ring-1 ring-white/15"><p class="font-black text-white">Semak promo</p><p class="mt-1 text-sm text-white/65">Promo terkini & bayaran awal</p></div>
              <div class="rounded-[1.35rem] bg-white/10 p-4 ring-1 ring-white/15"><p class="font-black text-white">Harga bulanan</p><p class="mt-1 text-sm text-white/65">Plan ikut bajet anda</p></div>
              <div class="rounded-[1.35rem] bg-white/10 p-4 ring-1 ring-white/15"><p class="font-black text-white">Cadangan model</p><p class="mt-1 text-sm text-white/65">Ikut rumah & keperluan</p></div>
              <div class="rounded-[1.35rem] bg-white/10 p-4 ring-1 ring-white/15"><p class="font-black text-white">Kos pemasangan</p><p class="mt-1 text-sm text-white/65">Semak sebelum order</p></div>
              <div class="rounded-[1.35rem] bg-white/10 p-4 ring-1 ring-white/15"><p class="font-black text-white">Bantuan servis</p><p class="mt-1 text-sm text-white/65">Selepas jualan</p></div>
            </div>

            <div class="mt-8 grid gap-5 lg:grid-cols-2">
              ${SITE.agents.map((agent, index) => {
                const shortName = index === 0 ? 'Fadhil' : 'Izzah';
                const link = index === 0 ? agentWhatsapp('fadhil') : agentWhatsapp('izzah');
                const points = index === 0
                  ? ['Konsultasi produk & cadangan model', 'Semak harga bulanan & kelayakan', 'Promo terkini & pilihan terbaik']
                  : ['Follow-up order & semak status', 'Bantuan dokumen & maklumat produk', 'Bantuan selepas tanya & servis'];

                return `
                  <div class="rounded-[1.8rem] bg-white p-5 text-ink shadow-xl shadow-brand-dark/10 sm:p-6 lg:min-h-[350px]">
                    <div class="grid gap-6 sm:grid-cols-[210px_1fr] sm:items-center">
                      <div class="relative mx-auto flex h-[190px] w-[190px] items-end justify-center overflow-hidden rounded-full bg-brand-soft/80 ring-8 ring-brand-soft/60 sm:h-[210px] sm:w-[210px]">
                        <img src="${agent.image}" alt="Gambar ejen CUCKOO ${shortName}" loading="lazy" class="h-[190px] w-auto translate-y-2 object-contain object-bottom sm:h-[230px]" />
                      </div>
                      <div>
                        <h3 class="text-3xl font-black text-brand">${shortName}</h3>
                        <p class="mt-1 text-sm font-bold text-muted">${agent.since}</p>
                        <div class="mt-4 grid gap-2 text-sm leading-6 text-muted">
                          ${points.map((point) => `<p>✓ ${point}</p>`).join('')}
                        </div>
                        <a href="${link}" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl">WhatsApp ${shortName} <span>›</span></a>
                        <p class="mt-3 text-center text-sm font-black text-brand/70">${agent.phone}</p>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <p class="mx-auto mt-6 max-w-3xl rounded-full bg-white/10 px-5 py-3 text-center text-sm text-white/75 ring-1 ring-white/15">Maklumat anda selamat dan hanya digunakan untuk tujuan konsultasi.</p>
          </div>
        </div>
      </section>
    `;
  });
}

function renderBlogList() {
  document.querySelectorAll('[data-blog-list]').forEach((el) => {
    el.innerHTML = `
      <div class="blog-card-grid">
        ${SITE.blogItems.map((item) => `
          <a href="${item.url}" class="blog-card">
            <div class="blog-card-media"><img src="${item.image || '/assets/images/brand/cuckoo-ebrandstore3.png'}" alt="${item.title}" loading="lazy" /></div>
            <div class="blog-card-body">
              <p class="blog-card-kicker">${item.category || 'Panduan CUCKOO'}</p>
              <h2>${item.title}</h2>
              <p class="blog-card-desc">${item.description || ''}</p>
              <p class="blog-card-date">${item.date || ''}</p>
            </div>
          </a>
        `).join('')}
      </div>
    `;
  });
}

function renderArticleEnhancements() {
  document.querySelectorAll('[data-article-page]').forEach((page) => {
    const content = page.querySelector('.article-content');
    if (!content) return;

    const headings = [...content.querySelectorAll('h2,h3')].filter((heading) => heading.textContent.trim());
    const tocLinks = headings
      .slice(0, 12)
      .map((heading, index) => {
        if (!heading.id) heading.id = 'section-' + (index + 1);
        return '<a href="#' + heading.id + '">' + heading.textContent.trim() + '</a>';
      })
      .join('');

    page.querySelectorAll('[data-toc-list]').forEach((toc) => {
      toc.innerHTML = tocLinks || '<span class="block rounded-2xl bg-cream px-3 py-3 text-sm font-bold text-muted">Artikel ringkas</span>';
    });

    const progress = document.querySelector('[data-reading-progress]');
    if (progress) {
      const updateProgress = () => {
        const rect = content.getBoundingClientRect();
        const total = content.offsetHeight - window.innerHeight;
        const start = window.scrollY + rect.top;
        const read = window.scrollY - start;
        progress.style.width = Math.max(0, Math.min(100, total > 0 ? (read / total) * 100 : 0)) + '%';
      };
      updateProgress();
      document.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress);
    }

    const current = page.dataset.currentPath || location.pathname;
    const items = (SITE.blogItems || []).filter((item) => item.url !== current).slice(0, 3);
    page.querySelectorAll('[data-related-posts]').forEach((related) => {
      related.innerHTML = items
        .map((item) => {
          const image = item.image || '/assets/images/brand/cuckoo-ebrandstore3.png';
          const category = item.category || 'Panduan CUCKOO';
          const description = item.description || '';
          return '<a class="related-card" href="' + item.url + '"><div class="related-card-media"><img src="' + image + '" alt="' + item.title + '" loading="lazy" /></div><div class="related-card-body"><p>' + category + '</p><h3>' + item.title + '</h3><span>' + description + '</span></div></a>';
        })
        .join('');
    });
  });
}

function renderFooter() {
  document.querySelectorAll('[data-footer-products]').forEach((el) => {
    el.innerHTML = Object.entries(SITE.products)
      .map(([key, category]) => `
        <details class="rounded-2xl border border-white/10 bg-white/[.045] p-4 transition-colors open:bg-white/[.065]">
          <summary class="cursor-pointer list-none font-bold text-white/88 outline-none transition-colors hover:text-white focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink [&::-webkit-details-marker]:hidden">${category.label}</summary>
          <div class="mt-3 grid gap-1.5 border-t border-white/10 pt-3 text-sm">
            <a href="/products/${key}/" class="rounded-lg py-1.5 text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">Lihat semua ${category.label}</a>
            ${category.items.map((product) => `<a href="${product.url}" class="rounded-lg py-1.5 text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">${product.name}</a>`).join('')}
          </div>
        </details>
      `)
      .join('');
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadIncludes();
  renderProductSelector();
  renderPromo();
  renderWhy();
  renderTestimonials();
  renderGift();
  renderAgents();
  renderBlogList();
  renderArticleEnhancements();
  renderFooter();
});
