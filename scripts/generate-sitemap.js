// Simple sitemap generator: skanuje src/pages i src/content/posts
// Uruchamiany po `astro build` (wyjściowy folder: ./dist)
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const pagesDir = path.join(projectRoot, 'src', 'pages');
const postsDir = path.join(projectRoot, 'src', 'content', 'posts');

async function getSiteUrl() {
  // import astro.config.mjs to read site
  try {
    const cfg = await import(path.join(projectRoot, 'astro.config.mjs'));
    return cfg.default?.site || process.env.SITE_URL || 'https://example.com';
  } catch (e) {
    return process.env.SITE_URL || 'https://example.com';
  }
}

function normalizeRouteFromPath(filePath) {
  // filePath relative to src/pages
  let p = filePath.replace(/\\/g, '/');
  if (p.endsWith('/index.astro') || p.endsWith('/index.md')) {
    p = p.replace(/\/index\.(astro|md)$/, '/');
  } else {
    p = p.replace(/\.(astro|md)$/, '');
  }
  // ignore dynamic routes (contain [ or _)
  if (p.includes('[') || p.includes('_')) return null;
  return p;
}

async function walk(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const d of list) {
    const res = path.resolve(dir, d.name);
    if (d.isDirectory()) {
      results = results.concat(await walk(res));
    } else {
      results.push(res);
    }
  }
  return results;
}

(async () => {
  const site = (await getSiteUrl()).replace(/\/$/, '');
  const urls = new Map();

  // scan src/pages
  try {
    const files = await walk(pagesDir);
    for (const f of files) {
      if (!f.match(/\.(astro|md)$/)) continue;
      const rel = path.relative(pagesDir, f);
      const route = normalizeRouteFromPath(rel);
      if (!route) continue;
      const url = site + (route.startsWith('/') ? route : '/' + route);
      const stat = await fs.stat(f);
      urls.set(url, stat.mtime.toISOString());
    }
  } catch (e) {
    // ignore if pagesDir doesn't exist
  }

  // scan posts in src/content/posts
  try {
    const postFiles = await walk(postsDir);
    for (const pf of postFiles) {
      if (!pf.endsWith('.md')) continue;
      const slug = path.basename(pf, '.md');
      const url = `${site}/posts/${slug}`;
      const stat = await fs.stat(pf);
      urls.set(url, stat.mtime.toISOString());
    }
  } catch (e) {
    // ignore
  }

  // homepage fallback
  urls.set(site + '/', new Date().toISOString());

  // build sitemap xml
  const xmlItems = Array.from(urls.entries()).map(([loc, lastmod]) => {
    return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlItems}\n</urlset>`;

  // ensure dist exists
  try {
    await fs.mkdir(distDir, { recursive: true });
    await fs.writeFile(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
    console.log('sitemap.xml wygenerowany w dist/sitemap.xml');
  } catch (err) {
    console.error('Błąd podczas zapisywania sitemap:', err);
    process.exit(1);
  }
})();