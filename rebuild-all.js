const fs = require('fs');
const path = require('path');

const baseUrl = 'https://fractionalcfoschool.com';
const rootDir = __dirname;

// Collect all index.html files
function findPages(dir, prefix = '') {
  const urls = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.vercel' || entry.name === 'api') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        const urlPath = prefix + '/' + entry.name + '/';
        urls.push(urlPath);
      }
      urls.push(...findPages(fullPath, prefix + '/' + entry.name));
    }
  }
  return urls;
}

const pages = ['/', ...findPages(rootDir)];
const uniquePages = [...new Set(pages)].sort();

// Generate sitemap
const today = new Date().toISOString().split('T')[0];
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
uniquePages.forEach(page => {
  const priority = page === '/' ? '1.0' : page.includes('/blog/') ? '0.8' : page.includes('/fractional-cfo-near-me/') ? '0.7' : '0.6';
  sitemap += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>\n`;
});
sitemap += `</urlset>`;
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap);
console.log(`✅ Sitemap generated: ${uniquePages.length} URLs`);

// Rebuild blog index
const blogDir = path.join(rootDir, 'blog');
const blogPosts = fs.readdirSync(blogDir, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => {
    const indexPath = path.join(blogDir, e.name, 'index.html');
    if (!fs.existsSync(indexPath)) return null;
    const html = fs.readFileSync(indexPath, 'utf-8');
    const titleMatch = html.match(/<title>(.*?)\|/);
    const descMatch = html.match(/<meta name="description" content="(.*?)"/);
    return {
      slug: e.name,
      title: titleMatch ? titleMatch[1].trim() : e.name,
      description: descMatch ? descMatch[1] : '',
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.title.localeCompare(b.title));

const blogIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — Fractional CFO School | Fractional CFO & Advisory Services</title>
  <meta name="description" content="Expert articles on fractional CFO services, advisory pricing, bookkeeper transitions, and financial leadership. ${blogPosts.length}+ in-depth guides.">
  <link rel="canonical" href="${baseUrl}/blog/">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; line-height: 1.7; }
    nav { background: #0a0a23; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
    nav a { color: white; text-decoration: none; font-weight: 600; }
    nav .links a { margin-left: 20px; opacity: 0.9; font-weight: 400; }
    .hero { background: linear-gradient(135deg, #0a0a23 0%, #1a1a4e 100%); color: white; padding: 60px 20px; text-align: center; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .hero p { font-size: 1.1rem; opacity: 0.9; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
    .post-card { border-bottom: 1px solid #e8e8f0; padding: 25px 0; }
    .post-card:last-child { border-bottom: none; }
    .post-card h2 { font-size: 1.3rem; margin-bottom: 8px; }
    .post-card h2 a { color: #1a1a4e; text-decoration: none; }
    .post-card h2 a:hover { color: #f39c12; }
    .post-card p { color: #555; font-size: 0.95rem; }
    footer { background: #0a0a23; color: rgba(255,255,255,0.7); padding: 40px 20px; text-align: center; }
    footer a { color: #f39c12; text-decoration: none; }
  </style>
</head>
<body>
  <nav>
    <a href="/">⭐ Fractional CFO School</a>
    <div class="links">
      <a href="/blog/">Blog</a>
      <a href="/starter-kit/">Free Starter Kit</a>
      <a href="/tools/advisory-revenue-calculator/">Revenue Calculator</a>
      <a href="/fractional-cfo-near-me/">Find a CFO</a>
    </div>
  </nav>
  <div class="hero">
    <h1>Fractional CFO School Blog</h1>
    <p>${blogPosts.length} expert articles on fractional CFO services, advisory, and financial leadership</p>
  </div>
  <div class="container">
    ${blogPosts.map(p => `<div class="post-card">
      <h2><a href="/blog/${p.slug}/">${p.title}</a></h2>
      <p>${p.description}</p>
    </div>`).join('\n    ')}
  </div>
  <footer>
    <p>© 2026 Fractional CFO School. All rights reserved.</p>
    <p style="margin-top:10px;"><a href="/">Home</a> · <a href="/blog/">Blog</a> · <a href="/starter-kit/">Free Starter Kit</a></p>
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexHtml);
console.log(`✅ Blog index rebuilt: ${blogPosts.length} posts`);
