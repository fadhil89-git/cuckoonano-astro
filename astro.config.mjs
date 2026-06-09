import { defineConfig } from 'astro/config';
import { readdirSync } from 'node:fs';

const blogSlugs = readdirSync(new URL('./src/pages/blog/', import.meta.url), {
  withFileTypes: true
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const rootRouteSlugs = new Set(['cuckoo-vs-coway']);

const blogRedirects = Object.fromEntries(
  blogSlugs
    .filter((slug) => !rootRouteSlugs.has(slug))
    .map((slug) => [`/${slug}/`, `/blog/${slug}/`])
);

const recruitmentBlogRedirects = {
  '/recruitment/cuckoo-agent-commission/': '/blog/cuckoo-agent-commission/',
  '/recruitment/kelebihan-jadi-ejen-cuckoo/': '/blog/kelebihan-jadi-ejen-cuckoo/',
  '/recruitment/komisyen-ejen-cuckoo-coway/': '/blog/komisyen-ejen-cuckoo-coway/'
};

const manualBlogRedirects = {
  '/dropship-cuckoo/': '/blog/5-kelebihan-buat-bisnes-dropship-penapis-air-cuckoo/'
};

const productRedirects = {
  '/king-top/': '/products/water-purifier/king-top-2/',
  '/king-top-2/': '/products/water-purifier/king-top-2/',
  '/prime-x1-outdoor-water-purifier/': '/products/water-purifier/prime-x3/',
  '/penapis-air-cuckoo/': '/products/water-purifier/',
  '/cuckoo-glamour/': '/products/water-purifier/glamour/',
  '/cuckoo-grande/': '/products/water-purifier/grande/',
  '/cuckoo-kiut/': '/products/water-purifier/kiut/',
  '/cuckoo-warrior/': '/products/water-purifier/warrior/',
  '/xcel/': '/products/water-purifier/xcel-2/',
  '/xcel-black/': '/products/water-purifier/xcel-2/',
  '/cuckoo-xcel-green/': '/products/water-purifier/xcel-2/',
  '/cuckoo-titan/': '/products/water-purifier/titan/',
  '/cuckoo-vivid/': '/products/water-purifier/vivid/',
  '/cuckoo-flo-stand/': '/products/water-purifier/flo-stand/',
  '/cuckoo-vita-s-x-fujiaire-air-conditioner-penghawa-dingin/': '/products/air-conditioner/vita-5tar/',
  '/kerusi-urut-cuckoo-ogawa-bespoke-massage-chair/': '/products/massage-chair/ogawa-bespoke/',
  '/cuckoo-knight-washer-dryer/': '/products/samsung/samsung-bespoke-ai-laundry-combo-12-7kg/',
  '/cuckoo-inductwo-3/': '/products/induction/inductwo/',
  '/cuckoo-inductrio/': '/products/induction/inductrio/',
  '/cuckoo-c-plus-humidifier/': '/products/air-purifier/c-plus-humidifier/',
  '/cuckoo-d-model/': '/products/air-purifier/d-model/',
  '/a-luxe/': '/products/mattress/a-luxe/'
};

const locationRedirects = {
  '/cuckoo-sungai-petani/': '/locations/kedah/sungai-petani/',
  '/cuckoo-besut/': '/locations/terengganu/besut/',
  '/cuckoo-kemaman/': '/locations/terengganu/kemaman/',
  '/cuckoo-kuala-terengganu/': '/locations/terengganu/kuala-terengganu/',
  '/cuckoo-dungun/': '/locations/terengganu/dungun/',
  '/cuckoo-kijal/': '/locations/terengganu/kemaman/',
  '/nak-pasang-cuckoo-di-kota-bharu/': '/locations/kelantan/kota-bharu/',
  '/nak-pasang-cuckoo-di-melaka/': '/locations/melaka/',
  '/mau-pasang-cuckoo-di-kota-kinabalu/': '/locations/sabah/kota-kinabalu/',
  '/mau-pasang-cuckoo-di-kuching/': '/locations/sarawak/kuching/',
  '/nak-pasang-cuckoo-di-kuantan/': '/locations/pahang/kuantan/',
  '/nak-pasang-cuckoo-di-penang/': '/locations/pulau-pinang/',
  '/nak-pasang-cuckoo-di-gombak/': '/locations/selangor/gombak/',
  '/nak-pasang-cuckoo-di-selayang/': '/locations/selangor/selayang/',
  '/ejen-cuckoo-batu-caves/': '/locations/selangor/batu-caves/',
  '/ejen-cuckoo-wangsa-maju/': '/locations/kuala-lumpur/wangsa-maju/',
  '/ejen-cuckoo-kepong/': '/locations/kuala-lumpur/kepong/',
  '/ejen-cuckoo-tangkak/': '/locations/johor/tangkak/',
  '/nak-pasang-cuckoo-di-sentul/': '/locations/kuala-lumpur/sentul/',
  '/ejen-cuckoo-taman-melati/': '/locations/kuala-lumpur/setapak/',
  '/ejen-cuckoo-taman-melawati/': '/locations/selangor/gombak/',
  '/nak-pasang-cuckoo-di-gemas/': '/locations/negeri-sembilan/tampin/',
  '/cuckoo-teluk-intan/': '/locations/perak/teluk-intan/',
  '/cuckoo-banting/': '/locations/selangor/banting/',
  '/cuckoo-gerik/': '/locations/perak/gerik/',
  '/cuckoo-setiawangsa/': '/locations/kuala-lumpur/setiawangsa/',
  '/cuckoo-bangi/': '/locations/selangor/bangi/',
  '/cuckoo-bandar-baru-bangi/': '/locations/selangor/bangi/',
  '/cuckoo-mont-kiara/': '/locations/kuala-lumpur/mont-kiara/',
  '/cuckoo-bukit-katil/': '/locations/melaka/melaka-tengah/',
  '/cuckoo-sungai-buloh/': '/locations/selangor/sungai-buloh/',
  '/cuckoo-bukit-rahman-putra/': '/locations/selangor/sungai-buloh/',
  '/cuckoo-kuang/': '/locations/selangor/rawang/',
  '/cuckoo-desa-coalfield/': '/locations/selangor/sungai-buloh/'
};

export default defineConfig({
  site: 'https://www.cuckoonano.com',
  trailingSlash: 'always',
  redirects: {
    ...blogRedirects,
    ...recruitmentBlogRedirects,
    ...manualBlogRedirects,
    ...productRedirects,
    ...locationRedirects
  }
});
