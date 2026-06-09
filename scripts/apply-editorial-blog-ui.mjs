import fs from 'node:fs';
import path from 'node:path';

const REPORT_PATH = 'reports/wordpress-import-posts.json';
const PAGES_DIR = 'src/pages';
const SITE = 'https://www.cuckoonano.com';
const FALLBACK_IMAGE = '/assets/images/brand/cuckoo-ebrandstore3.png';

const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
const posts = report.posts || [];

function unescapeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
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

function localizeImage(value) {
  if (!value) return FALLBACK_IMAGE;
  return value.replace(SITE, '') || FALLBACK_IMAGE;
}

function extract(regex, value) {
  return value.match(regex)?.[1] || '';
}

function buildFrontmatterAdditions(title, description, image) {
  return `
const articleTitle = ${escapeJs(unescapeHtml(title))};
const articleDescription = ${escapeJs(unescapeHtml(description))};
const featuredImage = ${escapeJs(localizeImage(image))};
`;
}

function buildHero() {
  return `<BaseLayout {...meta}>
  <div class="reading-progress" data-reading-progress></div>
  <article class="article-shell" data-article-page data-article-title={articleTitle} data-current-path={Astro.url.pathname}>
    <header class="article-hero">
      <div class="article-hero-inner">
        <div class="article-kicker-row">
          <span class="article-badge">Panduan CUCKOO</span>
        </div>
        <h1>{articleTitle}</h1>
        <p class="article-excerpt">{articleDescription}</p>
        <div class="article-meta">
          <span>Ditulis oleh Fadhil</span>
          <span aria-hidden="true">/</span>
          <span>Diterbitkan <time datetime={publishedDate}>{publishedDate}</time></span>
          {modifiedDate ? <><span aria-hidden="true">/</span><span>Dikemaskini {modifiedDate}</span></> : null}
        </div>
        <figure class="article-featured">
          <img src={featuredImage} alt={articleTitle} loading="eager" decoding="async" />
        </figure>
      </div>
    </header>
    <div class="article-layout">
      <aside class="article-toc" aria-label="Isi artikel">
        <p>Dalam Artikel</p>
        <nav data-toc-list></nav>
      </aside>
      <div class="article-main">
        <details class="article-toc-mobile">
          <summary>Isi Artikel</summary>
          <nav data-toc-list></nav>
        </details>
        <article class="content article-content">`;
}

function buildAfterArticle() {
  return `        </article>
        <section class="article-author" aria-label="Penulis artikel">
          <div class="article-author-avatar">FA</div>
          <div>
            <p class="article-author-label">Ditulis oleh</p>
            <h2>Wan Ahmad Fadhil</h2>
            <p>Ejen CUCKOO sepenuh masa sejak 2017. Saya bantu pembaca faham pilihan produk, harga dan proses order dengan bahasa yang mudah.</p>
          </div>
        </section>
        <section class="article-related" aria-label="Artikel berkaitan">
          <div class="article-section-heading">
            <p>Bacaan Seterusnya</p>
            <h2>Artikel berkaitan</h2>
          </div>
          <div class="article-related-grid" data-related-posts></div>
        </section>
      </div>
    </div>
  </article>
  <div data-promo></div>`;
}

let updated = 0;
const blogItems = [];

for (const post of posts) {
  const file = path.join(PAGES_DIR, post.slug, 'index.astro');
  if (!fs.existsSync(file)) continue;

  let source = fs.readFileSync(file, 'utf8');
  const existingTitle = extract(/<h1[^>]*>([\s\S]*?)<\/h1>/, source).trim() || post.title;
  const existingDescription =
    extract(/<p class="mt-5 max-w-3xl text-lg leading-8 text-muted">([\s\S]*?)<\/p>/, source).trim() ||
    post.seoDescription;
  const existingImage = extract(/ogImage:\s*["']([^"']*)["']/, source);

  if (!source.includes('const articleTitle =')) {
    source = source.replace(
      /(const modifiedDate = [^;]+;\n)---/,
      `$1${buildFrontmatterAdditions(existingTitle, existingDescription, existingImage)}---`,
    );
  }

  source = source.replace(
    /<BaseLayout \{\.\.\.meta\}>\n\s*<section class="hero-pattern px-4 py-14 sm:px-6 lg:px-8">[\s\S]*?<\/section>\n\s*<section class="bg-white px-4 py-14 sm:px-6 lg:px-8">\n\s*<article class="content mx-auto max-w-4xl">/,
    buildHero(),
  );

  source = source.replace(
    /\s*<\/article>\n\s*<\/section>\n\s*<div data-promo><\/div>/,
    `\n${buildAfterArticle()}`,
  );

  fs.writeFileSync(file, source);
  updated += 1;

  blogItems.push({
    title: unescapeHtml(existingTitle),
    url: `/${post.slug}/`,
    category: 'Panduan CUCKOO',
    date: post.date,
    description: unescapeHtml(existingDescription),
    image: localizeImage(existingImage),
  });
}

blogItems.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
fs.writeFileSync('public/assets/js/blog-items.js', `SITE.blogItems = ${JSON.stringify(blogItems, null, 2)};\n`);

console.log(`Updated ${updated} blog article pages`);
