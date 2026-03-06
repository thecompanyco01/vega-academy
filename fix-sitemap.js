const fs = require('fs');

// Collect all unique URLs
const urls = new Set();
const baseUrl = 'https://vega-academy.vercel.app';

// Core pages
const corePriority = [
  ['/', 1.0], ['/blog/', 0.9], ['/starter-kit/', 0.9],
  ['/course/module-1-preview/', 0.8], ['/fractional-cfo/', 0.8]
];
corePriority.forEach(([path, pri]) => urls.add(`${path}|${pri}`));

// All blog posts
const blogDirs = fs.readdirSync('./blog').filter(f => 
  fs.statSync(`./blog/${f}`).isDirectory()
);
blogDirs.forEach(d => urls.add(`/blog/${d}/|0.8`));

// All industry pages
const industries = fs.readdirSync('./fractional-cfo').filter(f => 
  fs.statSync(`./fractional-cfo/${f}`).isDirectory()
);
industries.forEach(d => urls.add(`/fractional-cfo/${d}/|0.7`));

// All topic x industry pages
const topics = ['cash-flow-forecasting', 'kpi-dashboard', 'financial-reporting', 
  'pricing-strategy', 'budgeting', 'profitability-analysis', 'bookkeeping-to-advisory'];
topics.forEach(topic => {
  if (fs.existsSync(`./${topic}`)) {
    const dirs = fs.readdirSync(`./${topic}`).filter(f => 
      fs.statSync(`./${topic}/${f}`).isDirectory()
    );
    dirs.forEach(d => urls.add(`/${topic}/${d}/|0.7`));
  }
});

// Generate sitemap
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
urls.forEach(entry => {
  const [path, priority] = entry.split('|');
  xml += `  <url><loc>${baseUrl}${path}</loc><lastmod>2026-03-06</lastmod><priority>${priority}</priority></url>\n`;
});
xml += '</urlset>';
fs.writeFileSync('./sitemap.xml', xml);
console.log(`Sitemap: ${urls.size} unique URLs`);
