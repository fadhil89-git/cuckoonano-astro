import fs from 'node:fs';

const file = 'public/assets/js/main.js';
let source = fs.readFileSync(file, 'utf8');

const oldRender = source.match(/function renderBlogList\(\)\{[\s\S]*?\}\)}/)?.[0];

const newRender = `function renderBlogList(){document.querySelectorAll("[data-blog-list]").forEach(el=>{el.innerHTML=\`<div class="blog-card-grid">\${SITE.blogItems.map(i=>\`<a href="\${i.url}" class="blog-card"><div class="blog-card-media"><img src="\${i.image||'/assets/images/brand/cuckoo-ebrandstore3.png'}" alt="\${i.title}" loading="lazy" /></div><div class="blog-card-body"><p class="blog-card-kicker">\${i.category||"Panduan CUCKOO"}</p><h2>\${i.title}</h2><p class="blog-card-desc">\${i.description||""}</p><p class="blog-card-date">\${i.date||""}</p></div></a>\`).join("")}</div>\`})}`;

if (!oldRender) {
  throw new Error('renderBlogList function not found');
}

source = source.replace(oldRender, newRender);
fs.writeFileSync(file, source);
