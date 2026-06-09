import fs from 'node:fs';
import path from 'node:path';

const XML_PATH =
  '/Users/wanahmadfadhil/Downloads/cuckoomalaysiaordersenangpasangcepatservispercuma.WordPress.2026-05-25.xml';
const SITE = 'https://www.cuckoonano.com';
const OUT_DIR = 'src/pages';
const IMAGE_PUBLIC_DIR = 'public/assets/images/blog/wp-uploads';
const IMAGE_PUBLIC_PATH = '/assets/images/blog/wp-uploads';
const REPORT_DIR = 'reports';

const xml = fs.readFileSync(XML_PATH, 'utf8');

function getTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}(?: [^>]*)?>[\\s\\S]*?<\\/${tag}>`));
  if (!match) return '';
  return unwrapCdata(
    match[0]
      .replace(new RegExp(`^<${tag}(?: [^>]*)?>`), '')
      .replace(new RegExp(`<\\/${tag}>$`), '')
      .trim(),
  );
}

function unwrapCdata(value) {
  return value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
}

function decodeEntities(value) {
  return value
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&#038;/g, '&')
    .replace(/&#124;/g, '|')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function stripTags(value) {
  return decodeEntities(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function escapeJs(value) {
  return JSON.stringify(value ?? '');
}

function escapeAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function slugifyFileName(value) {
  return decodeURIComponent(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeWpImageUrl(url) {
  const clean = url.replace(/^http:\/\//, 'https://').split('?')[0];
  return clean.replace(/-\d+x\d+(?=\.(?:jpg|jpeg|png|webp|gif)$)/i, '');
}

function localImagePath(url) {
  const normalized = normalizeWpImageUrl(url);
  const parsed = new URL(normalized);
  const parts = parsed.pathname.split('/').filter(Boolean);
  const uploadsIndex = parts.indexOf('uploads');
  const relParts = uploadsIndex >= 0 ? parts.slice(uploadsIndex + 1) : parts.slice(-1);
  const file = slugifyFileName(relParts.pop() || 'image');
  return {
    remote: normalized,
    localPublic: `${IMAGE_PUBLIC_PATH}/${[...relParts, file].join('/')}`,
    localFile: path.join(IMAGE_PUBLIC_DIR, ...relParts, file),
  };
}

function decodeDiviJsonString(value) {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value
      .replace(/\\u003c/g, '<')
      .replace(/\\u003e/g, '>')
      .replace(/\\u0022/g, '"')
      .replace(/\\u0026/g, '&')
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"');
  }
}

function extractDiviBlockContent(content) {
  const chunks = [];
  for (const match of content.matchAll(/"value":"((?:\\.|[^"\\])*)"/g)) {
    const decoded = decodeDiviJsonString(match[1]);
    if (/<(?:p|h[1-6]|ul|ol|figure|img|blockquote|table)\b/i.test(decoded)) {
      chunks.push(decoded);
    }
  }
  return chunks.join('\n');
}

function cleanContent(raw, imageMap) {
  let html = raw || '';
  const diviExtracted = extractDiviBlockContent(html);
  if (diviExtracted && diviExtracted.length > stripTags(html).length) {
    html = diviExtracted;
  }

  html = html
    .replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '')
    .replace(/<!doctype[\s\S]*?<body[^>]*>/gi, '')
    .replace(/<\/body>[\s\S]*?<\/html>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?(?:html|body|head|meta|title)[^>]*>/gi, '')
    .replace(/<figure>\s*<video[\s\S]*?<\/video>\s*<\/figure>/gi, '')
    .replace(/<video[\s\S]*?<\/video>/gi, '')
    .replace(/<img([^>]+src="https?:\/\/[^"]+\.mp4"[^>]*)>/gi, '')
    .replace(/\[contact-form-7[^\]]*\]/gi, '')
    .replace(/\[metaslider[^\]]*\]/gi, '')
    .replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi, '$1')
    .replace(/\[embed[^\]]*\]([\s\S]*?)\[\/embed\]/gi, '<p><a href="$1">$1</a></p>')
    .replace(/\[\/?et_pb_[^\]]+\]/gi, '')
    .replace(/\[(?:\/)?(?:scope|Strictly|atau)[^\]]*\]/gi, '')
    .replace(/\s(?:class|style|width|height|sizes|srcset)="[^"]*"/gi, '')
    .replace(/\s(?:aria-level)="[^"]*"/gi, '')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '')
    .replace(/\n{3,}/g, '\n\n');

  html = html.replace(/https?:\/\/[^"' <>)]+\.(?:jpg|jpeg|png|webp|gif)/gi, (url) => {
    const img = localImagePath(url);
    imageMap.set(img.remote, img);
    return img.localPublic;
  });

  html = html.replace(/<img([^>]*)>/gi, (_match, attrs) => {
    const src = attrs.match(/\ssrc="([^"]+)"/i)?.[1] || '';
    const alt = attrs.match(/\salt="([^"]*)"/i)?.[1] || '';
    if (!src) return '';
    const caption = alt ? `<figcaption>${escapeAttr(alt)}</figcaption>` : '';
    return `<figure><img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" />${caption}</figure>`;
  });

  html = html
    .replace(/<a\s+href="https?:\/\/www\.cuckoonano\.com\/([^"#?]+)\/?"/gi, '<a href="/$1/"')
    .replace(/<a\s+href="http:\/\/www\.wasap\.my/gi, '<a href="https://www.wasap.my')
    .replace(/href="(\/[^"]*?)\/\/+"/g, 'href="$1/"')
    .replace(/<h1\b/gi, '<h2')
    .replace(/<\/h1>/gi, '</h2>');

  html = wrapLooseText(html);

  const text = stripTags(html);
  if (!text && !/<img\b/i.test(html)) {
    html = '<p>Kandungan asal artikel ini perlu disemak semula sebelum diterbitkan penuh.</p>';
  }
  return html.trim();
}

function wrapLooseText(html) {
  const blocks = html.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return blocks
    .map((block) => {
      if (/^<(?:p|h[1-6]|ul|ol|li|figure|blockquote|table|hr|pre)\b/i.test(block)) return block;
      if (/<(?:h[1-6]|ul|ol|figure|blockquote|table)\b/i.test(block)) return block;
      return `<p>${block.replace(/\n+/g, '<br />')}</p>`;
    })
    .join('\n\n');
}

function extractMeta(block) {
  const meta = {};
  for (const match of block.matchAll(
    /<wp:postmeta>[\s\S]*?<wp:meta_key><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_key>[\s\S]*?<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>[\s\S]*?<\/wp:postmeta>/g,
  )) {
    meta[match[1]] = match[2];
  }
  return meta;
}

function makeDescription(title, yoastDescription, html) {
  const cleanedYoast = stripTags(yoastDescription || '');
  if (cleanedYoast.length >= 90 && cleanedYoast.length <= 165) return cleanedYoast;
  const body = stripTags(html).replace(/\s+/g, ' ');
  const base = body.length > 80 ? body : `${decodeEntities(title)}. Panduan CUCKOO oleh ejen berpengalaman sejak 2017.`;
  return base.slice(0, 157).replace(/\s+\S*$/, '') + (base.length > 157 ? '...' : '');
}

function makeTitle(title, yoastTitle) {
  const cleaned = decodeEntities(stripTags(yoastTitle || '').replace(/%%sitename%%/g, 'CUCKOONANO'));
  if (cleaned.length >= 25 && cleaned.length <= 70) return cleaned;
  const base = decodeEntities(title);
  return base.includes('CUCKOO') || base.includes('Cuckoo') ? `${base} | CUCKOONANO` : `${base} | CUCKOO Malaysia`;
}

function firstImage(html) {
  return html.match(/<img\s+src="([^"]+)"/i)?.[1] || '';
}

function pageTemplate(post) {
  const relToLayout = '../'.repeat(post.slug.split('/').length + 1) + 'layouts/BaseLayout.astro';
  const ogImage = post.ogImage.startsWith('/assets/')
    ? `${SITE}${post.ogImage}`
    : post.ogImage || `${SITE}/assets/images/uploads/cuckoonano-og.webp`;

  return `---
import BaseLayout from '${relToLayout}';

const meta = {
  title: ${escapeJs(post.seoTitle)},
  description: ${escapeJs(post.seoDescription)},
  canonical: ${escapeJs(`${SITE}/${post.slug}/`)},
  ogImage: ${escapeJs(ogImage)},
  ogType: 'article'
};

const publishedDate = ${escapeJs(post.date)};
const modifiedDate = ${escapeJs(post.modified)};
---
<BaseLayout {...meta}>
  <section class="hero-pattern px-4 py-14 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <p class="font-bold text-brand">Panduan CUCKOO</p>
      <h1 class="mt-3 text-4xl font-black tracking-tight sm:text-5xl">${escapeAttr(decodeEntities(post.title))}</h1>
      <p class="mt-5 max-w-3xl text-lg leading-8 text-muted">${escapeAttr(post.seoDescription)}</p>
      <p class="mt-6 text-sm font-semibold text-muted">Diterbitkan: <time datetime={publishedDate}>{publishedDate}</time>{modifiedDate ? ' - Dikemaskini: ' + modifiedDate : ''}</p>
    </div>
  </section>
  <section class="bg-white px-4 py-14 sm:px-6 lg:px-8">
    <article class="content mx-auto max-w-4xl">
${post.html
  .split('\n')
  .map((line) => `      ${line}`)
  .join('\n')}
    </article>
  </section>
  <div data-promo></div>
</BaseLayout>
`;
}

const items = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)].map((match) => match[0]);
const imageMap = new Map();
const posts = [];

for (const item of items) {
  if (getTag(item, 'wp:post_type') !== 'post' || getTag(item, 'wp:status') !== 'publish') continue;
  const slug = getTag(item, 'wp:post_name');
  const meta = extractMeta(item);
  const title = getTag(item, 'title');
  const rawContent = getTag(item, 'content:encoded');
  const html = cleanContent(rawContent, imageMap);
  const image = firstImage(html);
  const seoTitle = makeTitle(title, meta._yoast_wpseo_title);
  const seoDescription = makeDescription(title, meta._yoast_wpseo_metadesc, html);
  posts.push({
    slug,
    title,
    date: getTag(item, 'wp:post_date').slice(0, 10),
    modified: getTag(item, 'wp:post_modified').slice(0, 10),
    link: getTag(item, 'link'),
    seoTitle,
    seoDescription,
    html,
    ogImage: image,
    imageCount: [...html.matchAll(/<img\b/g)].length,
  });
}

posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.mkdirSync(IMAGE_PUBLIC_DIR, { recursive: true });

for (const post of posts) {
  const dir = path.join(OUT_DIR, post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.astro'), pageTemplate(post));
}

const images = [...imageMap.values()].sort((a, b) => a.remote.localeCompare(b.remote));
fs.writeFileSync(
  path.join(REPORT_DIR, 'wordpress-import-posts.json'),
  JSON.stringify(
    {
      importedAt: new Date().toISOString(),
      source: XML_PATH,
      posts: posts.map(({ html, ...post }) => ({ ...post, contentChars: stripTags(html).length })),
      images,
    },
    null,
    2,
  ),
);
fs.writeFileSync(
  path.join(REPORT_DIR, 'wordpress-image-downloads.tsv'),
  images.map((img) => `${img.remote}\t${img.localFile}`).join('\n') + '\n',
);

const blogItems = posts.map((post) => ({
  title: decodeEntities(post.title),
  url: `/${post.slug}/`,
  category: 'Panduan CUCKOO',
  date: post.date,
  description: post.seoDescription,
}));

fs.writeFileSync(
  'public/assets/js/blog-items.js',
  `SITE.blogItems = ${JSON.stringify(blogItems, null, 2)};\n`,
);

console.log(`Imported ${posts.length} posts`);
console.log(`Unique normalized images ${images.length}`);
console.log(`Report: ${path.join(REPORT_DIR, 'wordpress-import-posts.json')}`);
