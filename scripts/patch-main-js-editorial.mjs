import fs from 'node:fs';

const file = 'public/assets/js/main.js';
let source = fs.readFileSync(file, 'utf8');

const enhancement = `function renderArticleEnhancements(){
  document.querySelectorAll("[data-article-page]").forEach((page)=>{
    const content = page.querySelector(".article-content");
    if (!content) return;

    const headings = [...content.querySelectorAll("h2,h3")].filter((heading)=>heading.textContent.trim());
    const tocLinks = headings.slice(0, 12).map((heading, index)=>{
      if (!heading.id) heading.id = "section-" + (index + 1);
      return '<a href="#' + heading.id + '">' + heading.textContent.trim() + '</a>';
    }).join("");

    page.querySelectorAll("[data-toc-list]").forEach((toc)=>{
      toc.innerHTML = tocLinks || '<span class="block rounded-2xl bg-cream px-3 py-3 text-sm font-bold text-muted">Artikel ringkas</span>';
    });

    const progress = document.querySelector("[data-reading-progress]");
    if (progress) {
      const updateProgress = ()=>{
        const rect = content.getBoundingClientRect();
        const total = content.offsetHeight - window.innerHeight;
        const start = window.scrollY + rect.top;
        const read = window.scrollY - start;
        progress.style.width = Math.max(0, Math.min(100, total > 0 ? (read / total) * 100 : 0)) + "%";
      };
      updateProgress();
      document.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
    }

    const current = page.dataset.currentPath || location.pathname;
    const items = (SITE.blogItems || []).filter((item)=>item.url !== current).slice(0, 3);
    page.querySelectorAll("[data-related-posts]").forEach((related)=>{
      related.innerHTML = items.map((item)=>{
        const image = item.image || "/assets/images/brand/cuckoo-ebrandstore3.png";
        const category = item.category || "Panduan CUCKOO";
        const description = item.description || "";
        return '<a class="related-card" href="' + item.url + '"><div class="related-card-media"><img src="' + image + '" alt="' + item.title + '" loading="lazy" /></div><div class="related-card-body"><p>' + category + '</p><h3>' + item.title + '</h3><span>' + description + '</span></div></a>';
      }).join("");
    });
  });
}`;

if (!source.includes('function renderArticleEnhancements()')) {
  source = source.replace('function renderFooter(){', enhancement + 'function renderFooter(){');
}

source = source.replace(
  'renderBlogList();renderFooter()',
  'renderBlogList();renderArticleEnhancements();renderFooter()',
);

fs.writeFileSync(file, source);
