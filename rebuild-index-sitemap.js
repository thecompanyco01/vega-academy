const fs = require('fs');
const path = require('path');

// Scan all blog directories
const blogDir = path.join(__dirname, 'blog');
const articles = [];

fs.readdirSync(blogDir).forEach(item => {
  const itemPath = path.join(blogDir, item);
  if (fs.statSync(itemPath).isDirectory()) {
    const indexFile = path.join(itemPath, 'index.html');
    if (fs.existsSync(indexFile)) {
      const html = fs.readFileSync(indexFile, 'utf-8');
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const descMatch = html.match(/<meta name="description" content="(.*?)">/);
      const searchVol = html.match(/📊\s*([\d,]+\/mo)/);
      const readTime = html.match(/⏱️\s*(\d+ min)/);
      articles.push({
        slug: item,
        title: titleMatch ? titleMatch[1] : item,
        description: descMatch ? descMatch[1] : '',
        searchVolume: searchVol ? searchVol[1] : '',
        readTime: readTime ? readTime[1] : '5 min'
      });
    }
  }
});

// Sort by title
articles.sort((a, b) => a.title.localeCompare(b.title));

console.log(`Found ${articles.length} blog articles`);

// Generate blog index
const blogIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog — Vega Academy | Fractional CFO & Advisory Resources</title>
    <meta name="description" content="Expert articles on fractional CFO services, advisory pricing, cash flow forecasting, and transitioning from bookkeeping to advisory. ${articles.length}+ in-depth guides.">
    <link rel="canonical" href="https://fractionalcfoschool.com/blog/">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0a0a0f; --surface: #12121a; --surface-2: #1a1a26; --border: #2a2a3a; --text: #e8e8f0; --text-muted: #8888a0; --accent: #6c5ce7; --accent-light: #a29bfe; --gold: #f0c040; --success: #00d2a0; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        nav { position: fixed; top: 0; left: 0; right: 0; background: rgba(10,10,15,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); z-index: 100; padding: 16px 0; }
        nav .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, var(--accent-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-decoration: none; }
        .nav-links { display: flex; gap: 16px; align-items: center; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; }
        .nav-cta { background: var(--accent); color: white !important; padding: 10px 24px; border-radius: 8px; font-weight: 600; }
        .hero { padding: 140px 0 60px; text-align: center; }
        .hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; }
        .hero p { color: var(--text-muted); font-size: 18px; max-width: 600px; margin: 0 auto; }
        .hero .count { display: inline-block; background: var(--surface-2); border: 1px solid var(--border); padding: 6px 16px; border-radius: 20px; font-size: 14px; color: var(--gold); margin-top: 16px; }
        .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
        .articles { display: grid; gap: 20px; padding-bottom: 80px; }
        .article-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; transition: border-color 0.2s, transform 0.2s; }
        .article-card:hover { border-color: var(--accent); transform: translateY(-2px); }
        .article-card a { text-decoration: none; color: inherit; }
        .article-card h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: var(--text); }
        .article-card p { font-size: 14px; color: var(--text-muted); margin-bottom: 12px; line-height: 1.6; }
        .article-meta { display: flex; gap: 12px; font-size: 12px; color: var(--text-muted); }
        .article-meta span { display: flex; align-items: center; gap: 4px; }
        footer { border-top: 1px solid var(--border); padding: 40px 0; text-align: center; color: var(--text-muted); font-size: 13px; }
        footer a { color: var(--accent-light); text-decoration: none; }
        @media (max-width: 768px) { .hero h1 { font-size: 1.8rem; } }
    </style>
</head>
<body>
    <nav>
        <div class="nav-inner">
            <a href="/" class="logo">⭐ Vega Academy</a>
            <div class="nav-links">
                <a href="/blog/">Blog</a>
                <a href="/starter-kit/">Free Starter Kit</a>
                <a href="/tools/advisory-revenue-calculator/">Calculator</a>
                <a href="/course/module-1/" class="nav-cta">Start Free Module →</a>
            </div>
        </div>
    </nav>

    <div class="hero">
        <div class="container">
            <h1>Vega Academy Blog</h1>
            <p>In-depth guides on fractional CFO services, advisory pricing, cash flow management, and building a profitable advisory practice.</p>
            <div class="count">📚 ${articles.length} articles — all backed by real search data</div>
        </div>
    </div>

    <div class="container">
        <div class="articles">
            ${articles.map(a => `
            <div class="article-card">
                <a href="/blog/${a.slug}/">
                    <h2>${a.title}</h2>
                    <p>${a.description.substring(0, 200)}${a.description.length > 200 ? '...' : ''}</p>
                    <div class="article-meta">
                        <span>⏱️ ${a.readTime} read</span>
                        ${a.searchVolume ? `<span>📊 ${a.searchVolume} searches</span>` : ''}
                    </div>
                </a>
            </div>`).join('\n')}
        </div>
    </div>

    <footer>
        <div class="container">
            <p>© 2026 Vega Academy. Helping bookkeepers build advisory practices.</p>
            <p style="margin-top: 8px;">
                <a href="/">Home</a> · <a href="/blog/">Blog</a> · <a href="/starter-kit/">Free Starter Kit</a> · <a href="/course/module-1/">Free Module</a>
            </p>
        </div>
    </footer>
    <script defer src="https://cdn.vercel-insights.com/v1/script.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexHTML);
console.log('✅ Blog index updated');

// Generate sitemap
const baseUrl = 'https://fractionalcfoschool.com';
const today = new Date().toISOString().split('T')[0];

let sitemapUrls = [
  { loc: '/', priority: '1.0', freq: 'daily' },
  { loc: '/blog/', priority: '0.9', freq: 'daily' },
  { loc: '/starter-kit/', priority: '0.8', freq: 'weekly' },
  { loc: '/course/module-1/', priority: '0.8', freq: 'weekly' },
  { loc: '/tools/advisory-revenue-calculator/', priority: '0.8', freq: 'weekly' },
];

// Blog articles
articles.forEach(a => {
  sitemapUrls.push({ loc: `/blog/${a.slug}/`, priority: '0.7', freq: 'monthly' });
});

// Industry pages
const industries = fs.readdirSync(path.join(__dirname, 'fractional-cfo')).filter(f => {
  return fs.statSync(path.join(__dirname, 'fractional-cfo', f)).isDirectory();
});
sitemapUrls.push({ loc: '/fractional-cfo/', priority: '0.8', freq: 'weekly' });
industries.forEach(ind => {
  sitemapUrls.push({ loc: `/fractional-cfo/${ind}/`, priority: '0.6', freq: 'monthly' });
});

// City pages (fractional-cfo-near-me)
const cityDir = path.join(__dirname, 'fractional-cfo-near-me');
if (fs.existsSync(cityDir)) {
  sitemapUrls.push({ loc: '/fractional-cfo-near-me/', priority: '0.7', freq: 'weekly' });
  const cities = fs.readdirSync(cityDir).filter(f => fs.statSync(path.join(cityDir, f)).isDirectory());
  cities.forEach(city => {
    sitemapUrls.push({ loc: `/fractional-cfo-near-me/${city}/`, priority: '0.6', freq: 'monthly' });
  });
}

// Topic x industry pages
const topicDirs = ['bookkeeping-to-advisory', 'budgeting', 'cash-flow-forecasting', 'financial-reporting', 'kpi-dashboard', 'pricing-strategy', 'profitability-analysis'];
topicDirs.forEach(topic => {
  const topicPath = path.join(__dirname, topic);
  if (fs.existsSync(topicPath)) {
    const subDirs = fs.readdirSync(topicPath).filter(f => fs.statSync(path.join(topicPath, f)).isDirectory());
    subDirs.forEach(sub => {
      sitemapUrls.push({ loc: `/${topic}/${sub}/`, priority: '0.5', freq: 'monthly' });
    });
  }
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml);
console.log(`✅ Sitemap updated with ${sitemapUrls.length} URLs`);
