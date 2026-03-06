const fs = require('fs');
const path = require('path');

// Read all blog directories
const blogDir = path.join(__dirname, 'blog');
const posts = fs.readdirSync(blogDir)
  .filter(f => fs.statSync(path.join(blogDir, f)).isDirectory())
  .map(slug => {
    const html = fs.readFileSync(path.join(blogDir, slug, 'index.html'), 'utf8');
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const descMatch = html.match(/<meta name="description" content="(.*?)"/);
    const readTimeMatch = html.match(/⏱️\s*(.*?)</);
    return {
      slug,
      title: titleMatch ? titleMatch[1].replace(' — Vega Academy', '').replace(' | Vega Academy', '') : slug,
      description: descMatch ? descMatch[1].substring(0, 150) + '...' : '',
      readTime: readTimeMatch ? readTimeMatch[1] : '8 min read'
    };
  });

const postCards = posts.map(p => `
        <a href="/blog/${p.slug}/" class="post-card">
            <div class="post-meta">
                <span>📅 March 2026</span>
                <span>⏱️ ${p.readTime}</span>
            </div>
            <h2 class="post-title">${p.title}</h2>
            <p class="post-excerpt">${p.description}</p>
        </a>`).join('\n');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog — Vega Academy | Advisory & Fractional CFO Guides</title>
    <meta name="description" content="Practical guides for bookkeepers and accountants transitioning to advisory and fractional CFO services. ${posts.length}+ in-depth articles with real data.">
    <link rel="canonical" href="https://vega-academy.vercel.app/blog/">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0a0a0f; --surface: #12121a; --surface-2: #1a1a26; --border: #2a2a3a; --text: #e8e8f0; --text-muted: #8888a0; --accent: #6c5ce7; --accent-light: #a29bfe; --gold: #f0c040; --success: #00d2a0; }
        body { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 0 24px; }
        nav { position: fixed; top: 0; left: 0; right: 0; background: rgba(10,10,15,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); z-index: 100; padding: 16px 0; }
        nav .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, var(--accent-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-decoration: none; }
        .logo span { font-weight: 400; opacity: 0.7; }
        .nav-links { display: flex; gap: 16px; align-items: center; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; }
        .nav-cta { background: var(--accent); color: white !important; padding: 10px 24px; border-radius: 8px; font-weight: 600; }
        .page-header { padding: 140px 0 60px; text-align: center; border-bottom: 1px solid var(--border); }
        .page-header h1 { font-size: clamp(32px, 5vw, 48px); font-weight: 800; letter-spacing: -2px; margin-bottom: 12px; }
        .page-header p { color: var(--text-muted); font-size: 18px; }
        .page-header .count { color: var(--gold); font-weight: 700; }
        .posts { padding: 48px 0; }
        .post-card { display: block; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 20px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .post-card:hover { border-color: var(--accent); transform: translateY(-2px); }
        .post-meta { font-size: 13px; color: var(--text-muted); margin-bottom: 12px; display: flex; gap: 16px; }
        .post-title { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 8px; color: var(--text); }
        .post-excerpt { font-size: 15px; color: var(--text-muted); line-height: 1.6; }
        footer { padding: 40px 0; border-top: 1px solid var(--border); text-align: center; }
        footer p { color: var(--text-muted); font-size: 13px; }
        footer a { color: var(--accent-light); text-decoration: none; }
    </style>
</head>
<body>
<nav>
    <div class="nav-inner">
        <a href="/" class="logo">⭐ vega <span>academy</span></a>
        <div class="nav-links">
            <a href="/blog/">Blog</a>
            <a href="/starter-kit/">Free Starter Kit</a>
            <a href="/fractional-cfo/">By Industry</a>
            <a href="/" class="nav-cta">Join Waitlist</a>
        </div>
    </div>
</nav>

<section class="page-header">
    <div class="container">
        <h1>The Vega Academy Blog</h1>
        <p><span class="count">${posts.length} articles</span> — Practical guides for bookkeepers building advisory practices and fractional CFO businesses. All backed by real data.</p>
    </div>
</section>

<section class="posts">
    <div class="container">
${postCards}
    </div>
</section>

<footer>
    <div class="container">
        <p>© 2026 <a href="/">Vega Academy</a>. Built with ⭐ for ambitious bookkeepers and advisory professionals.</p>
    </div>
</footer>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(blogDir, 'index.html'), indexHtml);
console.log(`✅ Blog index updated with ${posts.length} posts`);
