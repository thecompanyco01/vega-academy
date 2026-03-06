#!/usr/bin/env node
// Programmatic SEO page generator for Vega Academy
// Generates hundreds of industry-specific and topic-specific pages

const fs = require('fs');
const path = require('path');

const INDUSTRIES = [
  'restaurants', 'construction', 'ecommerce', 'saas', 'real-estate', 'dental-practices',
  'medical-practices', 'law-firms', 'marketing-agencies', 'manufacturing', 'retail',
  'professional-services', 'nonprofits', 'fitness-gyms', 'salons-spas', 'landscaping',
  'plumbing', 'electrical-contractors', 'hvac', 'auto-repair', 'trucking-logistics',
  'cleaning-services', 'photography', 'wedding-planning', 'pet-services', 'daycare',
  'insurance-agencies', 'staffing-agencies', 'it-services', 'architecture-firms',
  'engineering-firms', 'accounting-firms', 'veterinary-clinics', 'pharmacies',
  'home-services', 'roofing', 'painting-contractors', 'pest-control', 'moving-companies',
  'food-trucks', 'catering', 'bakeries', 'breweries', 'coffee-shops', 'franchises',
  'consulting-firms', 'property-management', 'interior-design', 'event-planning',
  'print-shops'
];

const INDUSTRY_NAMES = {
  'restaurants': 'Restaurants', 'construction': 'Construction Companies', 'ecommerce': 'E-Commerce Businesses',
  'saas': 'SaaS Companies', 'real-estate': 'Real Estate Agencies', 'dental-practices': 'Dental Practices',
  'medical-practices': 'Medical Practices', 'law-firms': 'Law Firms', 'marketing-agencies': 'Marketing Agencies',
  'manufacturing': 'Manufacturing Companies', 'retail': 'Retail Businesses', 'professional-services': 'Professional Services Firms',
  'nonprofits': 'Nonprofits', 'fitness-gyms': 'Fitness & Gym Businesses', 'salons-spas': 'Salons & Spas',
  'landscaping': 'Landscaping Companies', 'plumbing': 'Plumbing Companies', 'electrical-contractors': 'Electrical Contractors',
  'hvac': 'HVAC Companies', 'auto-repair': 'Auto Repair Shops', 'trucking-logistics': 'Trucking & Logistics Companies',
  'cleaning-services': 'Cleaning Service Companies', 'photography': 'Photography Businesses',
  'wedding-planning': 'Wedding Planning Businesses', 'pet-services': 'Pet Service Businesses',
  'daycare': 'Daycare & Childcare Centers', 'insurance-agencies': 'Insurance Agencies',
  'staffing-agencies': 'Staffing Agencies', 'it-services': 'IT Service Companies',
  'architecture-firms': 'Architecture Firms', 'engineering-firms': 'Engineering Firms',
  'accounting-firms': 'Accounting Firms', 'veterinary-clinics': 'Veterinary Clinics',
  'pharmacies': 'Pharmacies', 'home-services': 'Home Service Companies', 'roofing': 'Roofing Companies',
  'painting-contractors': 'Painting Contractors', 'pest-control': 'Pest Control Companies',
  'moving-companies': 'Moving Companies', 'food-trucks': 'Food Trucks', 'catering': 'Catering Companies',
  'bakeries': 'Bakeries', 'breweries': 'Breweries & Distilleries', 'coffee-shops': 'Coffee Shops',
  'franchises': 'Franchise Businesses', 'consulting-firms': 'Consulting Firms',
  'property-management': 'Property Management Companies', 'interior-design': 'Interior Design Firms',
  'event-planning': 'Event Planning Companies', 'print-shops': 'Print Shops'
};

const INDUSTRY_KPIS = {
  'restaurants': ['Food Cost %', 'Labor Cost %', 'Table Turnover Rate', 'Average Check Size', 'RevPASH', 'Prime Cost %'],
  'construction': ['Backlog-to-Revenue Ratio', 'Job Cost Variance', 'WIP Schedule', 'Gross Margin by Job', 'Equipment Utilization', 'Change Order Rate'],
  'ecommerce': ['Customer Acquisition Cost', 'Lifetime Value', 'Cart Abandonment Rate', 'Average Order Value', 'Return Rate', 'Gross Margin per SKU'],
  'saas': ['MRR/ARR', 'Churn Rate', 'LTV:CAC Ratio', 'Net Revenue Retention', 'Rule of 40', 'Burn Multiple'],
  'real-estate': ['Cap Rate', 'Cash-on-Cash Return', 'GRM', 'NOI', 'Vacancy Rate', 'Debt Service Coverage'],
  'dental-practices': ['Production per Provider', 'Collection Rate', 'Overhead %', 'New Patient Flow', 'Case Acceptance Rate', 'Revenue per Operatory'],
  'medical-practices': ['Revenue per Patient Visit', 'Days in AR', 'Denial Rate', 'Overhead Ratio', 'Provider Productivity', 'Payer Mix'],
  'law-firms': ['Revenue per Lawyer', 'Realization Rate', 'Collection Rate', 'Leverage Ratio', 'Profit per Partner', 'Billable Hours'],
  'marketing-agencies': ['Revenue per Employee', 'Client Retention Rate', 'Gross Margin by Client', 'Utilization Rate', 'Average Retainer Value', 'Pipeline Coverage'],
};

const TOPICS = [
  { slug: 'fractional-cfo', title: 'Fractional CFO', desc: 'part-time strategic financial leadership' },
  { slug: 'cash-flow-forecasting', title: 'Cash Flow Forecasting', desc: 'weekly and monthly cash flow projections' },
  { slug: 'kpi-dashboard', title: 'KPI Dashboard', desc: 'key performance indicator tracking and reporting' },
  { slug: 'financial-reporting', title: 'Financial Reporting', desc: 'monthly financial statements and analysis' },
  { slug: 'pricing-strategy', title: 'Pricing Strategy', desc: 'margin analysis and pricing optimization' },
  { slug: 'budgeting', title: 'Budgeting & Forecasting', desc: 'annual budgets and variance analysis' },
  { slug: 'profitability-analysis', title: 'Profitability Analysis', desc: 'revenue and margin analysis by service line' },
  { slug: 'bookkeeping-to-advisory', title: 'Bookkeeping to Advisory Transition', desc: 'upgrading from compliance to strategic advisory' },
];

function getKPIs(industry) {
  return INDUSTRY_KPIS[industry] || ['Revenue Growth Rate', 'Gross Margin %', 'Operating Expense Ratio', 'Days Sales Outstanding', 'Cash Conversion Cycle', 'Net Profit Margin'];
}

function generateIndustryPage(industry, industryName) {
  const kpis = getKPIs(industry);
  const kpiList = kpis.map(k => `<li><strong>${k}:</strong> Track this monthly to identify trends and opportunities for improvement.</li>`).join('\n                    ');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fractional CFO for ${industryName}: Financial Leadership Guide</title>
    <meta name="description" content="How fractional CFO services help ${industryName.toLowerCase()}. Industry-specific KPIs, pricing, cash flow strategies, and advisory frameworks for ${industryName.toLowerCase()}.">
    <meta name="keywords" content="fractional CFO ${industryName.toLowerCase()}, CFO services ${industryName.toLowerCase()}, financial management ${industryName.toLowerCase()}">
    <link rel="canonical" href="https://vega-academy.vercel.app/fractional-cfo/${industry}/">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0a0a0f; --surface: #12121a; --surface-2: #1a1a26; --border: #2a2a3a; --text: #e8e8f0; --text-muted: #8888a0; --accent: #6c5ce7; --accent-light: #a29bfe; --gold: #f0c040; --success: #00d2a0; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.8; }
        .container { max-width: 760px; margin: 0 auto; padding: 0 24px; }
        nav { position: fixed; top: 0; left: 0; right: 0; background: rgba(10,10,15,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); z-index: 100; padding: 16px 0; }
        nav .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, var(--accent-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-decoration: none; }
        .logo span { font-weight: 400; opacity: 0.7; }
        .nav-links { display: flex; gap: 16px; align-items: center; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; }
        .nav-cta { background: var(--accent); color: white !important; padding: 10px 24px; border-radius: 8px; font-weight: 600; }
        article { padding: 120px 0 80px; }
        .breadcrumb { font-size: 13px; color: var(--text-muted); margin-bottom: 32px; }
        .breadcrumb a { color: var(--accent-light); text-decoration: none; }
        .meta { display: flex; gap: 16px; margin-bottom: 40px; flex-wrap: wrap; }
        .meta-item { font-size: 13px; color: var(--text-muted); }
        h1 { font-size: clamp(30px, 5vw, 44px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.15; margin-bottom: 20px; }
        .subtitle { font-size: 18px; color: var(--text-muted); margin-bottom: 16px; line-height: 1.7; }
        h2 { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin: 48px 0 20px; padding-top: 24px; border-top: 1px solid var(--border); }
        h3 { font-size: 20px; font-weight: 700; margin: 32px 0 16px; }
        p { margin-bottom: 20px; font-size: 16px; }
        ul, ol { margin-bottom: 20px; padding-left: 24px; }
        li { margin-bottom: 10px; font-size: 16px; }
        strong { color: var(--accent-light); }
        blockquote { border-left: 3px solid var(--accent); padding: 16px 24px; margin: 28px 0; background: var(--surface); border-radius: 0 12px 12px 0; }
        blockquote p { color: var(--text-muted); margin-bottom: 0; font-style: italic; }
        .highlight-box { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin: 28px 0; }
        .highlight-box h4 { font-size: 17px; font-weight: 700; color: var(--gold); margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-size: 14px; }
        th { color: var(--accent-light); font-weight: 600; background: var(--surface); }
        td { color: var(--text-muted); }
        .cta-box { background: linear-gradient(135deg, rgba(108,92,231,0.15), rgba(240,192,64,0.1)); border: 1px solid var(--accent); border-radius: 16px; padding: 40px; margin: 48px 0; text-align: center; }
        .cta-box h3 { margin-top: 0; color: var(--accent-light); }
        .cta-btn { display: inline-block; background: linear-gradient(135deg, var(--accent), #7c6cf7); color: white; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; }
        footer { padding: 32px 0; border-top: 1px solid var(--border); text-align: center; color: var(--text-muted); font-size: 13px; }
        footer a { color: var(--accent-light); text-decoration: none; }
    </style>
    <script type="application/ld+json">
    { "@context": "https://schema.org", "@type": "Article", "headline": "Fractional CFO for ${industryName}", "author": { "@type": "Organization", "name": "Vega Academy" }, "datePublished": "2026-03-06" }
    </script>
</head>
<body>
<nav><div class="nav-inner"><a href="/" class="logo">⭐ vega <span>academy</span></a><div class="nav-links"><a href="/blog/">Blog</a><a href="/starter-kit/">Free Starter Kit</a><a href="/" class="nav-cta">Join Waitlist</a></div></div></nav>

<article>
<div class="container">
    <div class="breadcrumb"><a href="/">Home</a> → <a href="/fractional-cfo/">Fractional CFO by Industry</a> → ${industryName}</div>

    <h1>Fractional CFO for ${industryName}: What You Need to Know</h1>
    <p class="subtitle">${industryName} face unique financial challenges that generic bookkeeping can't solve. Here's how fractional CFO services are specifically tailored for the ${industry.replace(/-/g, ' ')} industry — including the KPIs that matter, pricing benchmarks, and common pitfalls.</p>

    <div class="meta">
        <span class="meta-item">📅 March 2026</span>
        <span class="meta-item">⏱️ 8 min read</span>
        <span class="meta-item">📂 Industry Guide</span>
    </div>

    <h2>Why ${industryName} Need Specialized Financial Leadership</h2>
    <p>${industryName} operate in a unique financial environment. Generic bookkeeping captures the numbers, but it doesn't address the industry-specific challenges that determine whether the business thrives or merely survives.</p>
    <p>A fractional CFO who understands ${industryName.toLowerCase()} brings immediate value because they know:</p>
    <ul>
        <li>Which KPIs actually predict success in this industry</li>
        <li>Industry-specific benchmarks to measure performance against</li>
        <li>Common cash flow traps unique to ${industryName.toLowerCase()}</li>
        <li>Pricing models and margin structures that work in this vertical</li>
        <li>Seasonal patterns and how to plan around them</li>
    </ul>

    <h2>Key KPIs for ${industryName}</h2>
    <p>A fractional CFO working with ${industryName.toLowerCase()} should track these metrics monthly at minimum:</p>
    <div class="highlight-box">
        <h4>📊 Essential KPIs</h4>
        <ul>
                    ${kpiList}
        </ul>
    </div>
    <p>These aren't generic financial metrics — they're the specific indicators that the most successful ${industryName.toLowerCase()} use to make better decisions, faster.</p>

    <h2>What Fractional CFO Services Look Like for ${industryName}</h2>
    <h3>Monthly Deliverables</h3>
    <ul>
        <li><strong>Industry-specific financial dashboard</strong> — Not a generic P&L review, but a dashboard built around the KPIs listed above</li>
        <li><strong>Cash flow forecast</strong> — Rolling 13-week projection accounting for the seasonal and cyclical patterns of ${industryName.toLowerCase()}</li>
        <li><strong>Margin analysis</strong> — Understanding profitability at the service/product/project level, not just the business level</li>
        <li><strong>Advisory meeting</strong> — 30-60 minute monthly call focused on decisions: what to invest in, what to cut, what to change</li>
    </ul>

    <h3>Strategic Services</h3>
    <ul>
        <li>Annual budget development with industry-specific assumptions</li>
        <li>Pricing strategy optimization based on margin analysis</li>
        <li>Growth planning and scenario modeling</li>
        <li>Team compensation benchmarking and planning</li>
        <li>Capital planning for equipment, expansion, or acquisition</li>
    </ul>

    <h2>Pricing for Fractional CFO Services</h2>
    <table>
        <tr><th>Business Revenue</th><th>Monthly Fee</th><th>Hours/Month</th></tr>
        <tr><td>$500K - $2M</td><td>$1,500 - $2,500</td><td>5-8</td></tr>
        <tr><td>$2M - $5M</td><td>$2,500 - $5,000</td><td>8-15</td></tr>
        <tr><td>$5M - $15M</td><td>$5,000 - $8,000</td><td>15-25</td></tr>
    </table>
    <p>Most ${industryName.toLowerCase()} fall in the $1M-$10M revenue range, making the $2,000-$5,000/month tier the sweet spot. That's a fraction of a full-time CFO ($200K+ salary) for the same strategic impact.</p>

    <h2>Common Financial Mistakes in ${industryName}</h2>
    <ol>
        <li><strong>Not tracking industry-specific KPIs:</strong> Generic financial statements don't tell you what's really happening in your business</li>
        <li><strong>Underpricing services:</strong> Without margin analysis, most businesses leave 10-20% on the table</li>
        <li><strong>Ignoring cash flow timing:</strong> Revenue is vanity, profit is sanity, cash is reality</li>
        <li><strong>Making growth decisions without financial models:</strong> Hiring, expanding, or investing without scenario analysis is gambling</li>
        <li><strong>Outgrowing your bookkeeper without upgrading:</strong> There's a point where you need strategic financial leadership, not just accurate books</li>
    </ol>

    <h2>For Bookkeepers: Specializing in ${industryName}</h2>
    <p>If you're a bookkeeper looking to add advisory services, specializing in ${industryName.toLowerCase()} is a powerful strategy. Industry specialization lets you:</p>
    <ul>
        <li>Command higher fees (specialists always earn more than generalists)</li>
        <li>Build templates and frameworks once, reuse across all clients</li>
        <li>Develop deep industry benchmarking data</li>
        <li>Get referrals from within the industry (${industryName.toLowerCase()} talk to each other)</li>
        <li>Create content that ranks for industry-specific keywords</li>
    </ul>

    <div class="cta-box">
        <h3>Want to Offer Fractional CFO Services to ${industryName}?</h3>
        <p>Get the free Advisory Starter Kit: pricing calculator, proposal template, KPI dashboard, conversation scripts, and monthly report template.</p>
        <a href="/starter-kit/" class="cta-btn">Get the Free Starter Kit →</a>
    </div>

    <p><em>Related: <a href="/blog/how-to-become-fractional-cfo/" style="color:var(--accent-light)">How to Become a Fractional CFO in 2026</a></em></p>
    <p><em>Related: <a href="/blog/fractional-cfo-services-guide/" style="color:var(--accent-light)">Fractional CFO Services: Complete Guide</a></em></p>
    <p><em>Related: <a href="/blog/client-advisory-services-cas-guide/" style="color:var(--accent-light)">Client Advisory Services (CAS) Guide</a></em></p>
</div>
</article>

<footer><div class="container"><p>© 2026 <a href="/">Vega Academy</a>. Built with ⭐</p></div></footer>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;
}

function generateTopicIndustryPage(topic, industry, industryName) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topic.title} for ${industryName}: Complete Guide</title>
    <meta name="description" content="${topic.title} guide specifically for ${industryName.toLowerCase()}. Learn how to implement ${topic.desc} tailored to the ${industry.replace(/-/g, ' ')} industry.">
    <meta name="keywords" content="${topic.slug.replace(/-/g, ' ')} ${industryName.toLowerCase()}, ${topic.title.toLowerCase()} ${industryName.toLowerCase()}">
    <link rel="canonical" href="https://vega-academy.vercel.app/${topic.slug}/${industry}/">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0a0a0f; --surface: #12121a; --surface-2: #1a1a26; --border: #2a2a3a; --text: #e8e8f0; --text-muted: #8888a0; --accent: #6c5ce7; --accent-light: #a29bfe; --gold: #f0c040; --success: #00d2a0; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.8; }
        .container { max-width: 760px; margin: 0 auto; padding: 0 24px; }
        nav { position: fixed; top: 0; left: 0; right: 0; background: rgba(10,10,15,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); z-index: 100; padding: 16px 0; }
        nav .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, var(--accent-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-decoration: none; }
        .logo span { font-weight: 400; opacity: 0.7; }
        .nav-links { display: flex; gap: 16px; align-items: center; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; }
        .nav-cta { background: var(--accent); color: white !important; padding: 10px 24px; border-radius: 8px; font-weight: 600; }
        article { padding: 120px 0 80px; }
        .breadcrumb { font-size: 13px; color: var(--text-muted); margin-bottom: 32px; }
        .breadcrumb a { color: var(--accent-light); text-decoration: none; }
        h1 { font-size: clamp(28px, 5vw, 40px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.15; margin-bottom: 20px; }
        .subtitle { font-size: 18px; color: var(--text-muted); margin-bottom: 40px; line-height: 1.7; }
        h2 { font-size: 24px; font-weight: 700; margin: 48px 0 16px; padding-top: 24px; border-top: 1px solid var(--border); }
        h3 { font-size: 20px; font-weight: 700; margin: 32px 0 12px; }
        p { margin-bottom: 20px; font-size: 16px; }
        ul, ol { margin-bottom: 20px; padding-left: 24px; }
        li { margin-bottom: 8px; font-size: 16px; }
        strong { color: var(--accent-light); }
        .highlight-box { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin: 28px 0; }
        .highlight-box h4 { font-size: 17px; font-weight: 700; color: var(--gold); margin-bottom: 12px; }
        .cta-box { background: linear-gradient(135deg, rgba(108,92,231,0.15), rgba(240,192,64,0.1)); border: 1px solid var(--accent); border-radius: 16px; padding: 40px; margin: 48px 0; text-align: center; }
        .cta-box h3 { margin-top: 0; color: var(--accent-light); }
        .cta-btn { display: inline-block; background: linear-gradient(135deg, var(--accent), #7c6cf7); color: white; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; }
        footer { padding: 32px 0; border-top: 1px solid var(--border); text-align: center; color: var(--text-muted); font-size: 13px; }
        footer a { color: var(--accent-light); text-decoration: none; }
    </style>
    <script type="application/ld+json">
    { "@context": "https://schema.org", "@type": "Article", "headline": "${topic.title} for ${industryName}", "author": { "@type": "Organization", "name": "Vega Academy" }, "datePublished": "2026-03-06" }
    </script>
</head>
<body>
<nav><div class="nav-inner"><a href="/" class="logo">⭐ vega <span>academy</span></a><div class="nav-links"><a href="/blog/">Blog</a><a href="/starter-kit/">Free Starter Kit</a><a href="/" class="nav-cta">Join Waitlist</a></div></div></nav>

<article>
<div class="container">
    <div class="breadcrumb"><a href="/">Home</a> → <a href="/fractional-cfo/${industry}/">CFO for ${industryName}</a> → ${topic.title}</div>

    <h1>${topic.title} for ${industryName}</h1>
    <p class="subtitle">A practical guide to implementing ${topic.desc} specifically for ${industryName.toLowerCase()}. Built for fractional CFOs, advisory professionals, and bookkeepers serving the ${industry.replace(/-/g, ' ')} industry.</p>

    <h2>Why ${topic.title} Matters for ${industryName}</h2>
    <p>${industryName} face distinct financial dynamics that make ${topic.desc} critical. Without proper ${topic.title.toLowerCase()}, these businesses often struggle with:</p>
    <ul>
        <li>Lack of visibility into true financial performance</li>
        <li>Inability to predict and prevent cash shortfalls</li>
        <li>Poor pricing decisions based on gut feel instead of data</li>
        <li>Missed growth opportunities due to incomplete financial intelligence</li>
    </ul>

    <h2>How to Implement ${topic.title} for ${industryName}</h2>
    <h3>Step 1: Assess Current State</h3>
    <p>Before implementing any ${topic.title.toLowerCase()} framework, audit what financial data and processes already exist. Most ${industryName.toLowerCase()} have the raw data in their accounting system — it's just not being used strategically.</p>

    <h3>Step 2: Define Industry-Specific Metrics</h3>
    <p>Generic financial metrics aren't enough for ${industryName.toLowerCase()}. You need industry-specific KPIs that reflect how these businesses actually create and capture value. See our <a href="/fractional-cfo/${industry}/" style="color:var(--accent-light)">complete ${industryName} CFO guide</a> for the specific KPIs to track.</p>

    <h3>Step 3: Build the Framework</h3>
    <p>Create a repeatable ${topic.title.toLowerCase()} system that your client (or you) can maintain with minimal effort. The best systems run on data that's already in the accounting platform — no manual data entry required.</p>

    <h3>Step 4: Review and Iterate Monthly</h3>
    <p>Schedule a monthly review meeting to walk through the ${topic.title.toLowerCase()} results. This is where the real advisory value happens: translating numbers into decisions.</p>

    <div class="highlight-box">
        <h4>💡 Pro Tip</h4>
        <p>The #1 mistake when implementing ${topic.title.toLowerCase()} for ${industryName.toLowerCase()} is making it too complex. Start with 3-5 core metrics, deliver consistently for 3 months, then expand. A simple system that runs reliably beats a comprehensive system that doesn't get maintained.</p>
    </div>

    <h2>Tools and Templates</h2>
    <p>Our free Advisory Starter Kit includes templates that can be customized for ${industryName.toLowerCase()}, including:</p>
    <ul>
        <li>KPI dashboard template (customizable for any industry)</li>
        <li>Monthly financial reporting template</li>
        <li>Cash flow forecasting spreadsheet</li>
        <li>Advisory proposal template</li>
        <li>Client conversation scripts</li>
    </ul>

    <div class="cta-box">
        <h3>Get the Templates</h3>
        <p>Download the free Advisory Starter Kit — customizable templates for ${topic.title.toLowerCase()} and more.</p>
        <a href="/starter-kit/" class="cta-btn">Download Free Starter Kit →</a>
    </div>

    <p><em>Related: <a href="/fractional-cfo/${industry}/" style="color:var(--accent-light)">Fractional CFO for ${industryName}: Complete Guide</a></em></p>
    <p><em>Related: <a href="/blog/how-to-become-fractional-cfo/" style="color:var(--accent-light)">How to Become a Fractional CFO in 2026</a></em></p>
</div>
</article>

<footer><div class="container"><p>© 2026 <a href="/">Vega Academy</a>. Built with ⭐</p></div></footer>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;
}

// Generate hub page for industry directory
function generateIndustryHub() {
  const links = INDUSTRIES.map(ind => {
    const name = INDUSTRY_NAMES[ind];
    return `        <a href="/fractional-cfo/${ind}/" class="industry-card">${name}</a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fractional CFO Services by Industry — Vega Academy</title>
    <meta name="description" content="Industry-specific fractional CFO guides for 50+ industries. KPIs, pricing, cash flow strategies, and advisory frameworks tailored to your vertical.">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0a0a0f; --surface: #12121a; --border: #2a2a3a; --text: #e8e8f0; --text-muted: #8888a0; --accent: #6c5ce7; --accent-light: #a29bfe; --gold: #f0c040; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        nav { position: fixed; top: 0; left: 0; right: 0; background: rgba(10,10,15,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); z-index: 100; padding: 16px 0; }
        nav .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, var(--accent-light), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-decoration: none; }
        .logo span { font-weight: 400; opacity: 0.7; }
        .nav-links { display: flex; gap: 16px; align-items: center; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; }
        .nav-cta { background: var(--accent); color: white !important; padding: 10px 24px; border-radius: 8px; font-weight: 600; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .page-header { padding: 140px 0 48px; text-align: center; }
        .page-header h1 { font-size: clamp(32px, 5vw, 48px); font-weight: 800; letter-spacing: -2px; margin-bottom: 12px; }
        .page-header p { color: var(--text-muted); font-size: 18px; max-width: 600px; margin: 0 auto; }
        .industry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; padding: 32px 0 80px; }
        .industry-card { display: block; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; text-decoration: none; color: var(--text); font-weight: 600; font-size: 15px; transition: all 0.2s; }
        .industry-card:hover { border-color: var(--accent); transform: translateY(-2px); color: var(--accent-light); }
        footer { padding: 32px 0; border-top: 1px solid var(--border); text-align: center; color: var(--text-muted); font-size: 13px; }
        footer a { color: var(--accent-light); text-decoration: none; }
    </style>
</head>
<body>
<nav><div class="nav-inner"><a href="/" class="logo">⭐ vega <span>academy</span></a><div class="nav-links"><a href="/blog/">Blog</a><a href="/starter-kit/">Free Starter Kit</a><a href="/" class="nav-cta">Join Waitlist</a></div></div></nav>

<section class="page-header">
    <div class="container">
        <h1>Fractional CFO Services by Industry</h1>
        <p>Industry-specific guides with KPIs, pricing benchmarks, and advisory frameworks for 50+ verticals.</p>
    </div>
</section>

<section>
    <div class="container">
        <div class="industry-grid">
${links}
        </div>
    </div>
</section>

<footer><div class="container"><p>© 2026 <a href="/">Vega Academy</a>. Built with ⭐</p></div></footer>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;
}

// === GENERATE ALL PAGES ===

let pageCount = 0;
let sitemapUrls = [];

// 1. Industry hub page
const hubDir = path.join(__dirname, 'fractional-cfo');
fs.mkdirSync(hubDir, { recursive: true });
fs.writeFileSync(path.join(hubDir, 'index.html'), generateIndustryHub());
sitemapUrls.push('https://vega-academy.vercel.app/fractional-cfo/');
pageCount++;
console.log(`✅ Industry hub page`);

// 2. Industry-specific pages (50 pages)
for (const industry of INDUSTRIES) {
  const dir = path.join(__dirname, 'fractional-cfo', industry);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), generateIndustryPage(industry, INDUSTRY_NAMES[industry]));
  sitemapUrls.push(`https://vega-academy.vercel.app/fractional-cfo/${industry}/`);
  pageCount++;
}
console.log(`✅ ${INDUSTRIES.length} industry pages`);

// 3. Topic × Industry pages (50 industries × 8 topics = 400 pages)
for (const topic of TOPICS) {
  const topicDir = path.join(__dirname, topic.slug);
  fs.mkdirSync(topicDir, { recursive: true });
  
  // Topic hub page (simple redirect to first industry or list)
  for (const industry of INDUSTRIES) {
    const dir = path.join(__dirname, topic.slug, industry);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), generateTopicIndustryPage(topic, industry, INDUSTRY_NAMES[industry]));
    sitemapUrls.push(`https://vega-academy.vercel.app/${topic.slug}/${industry}/`);
    pageCount++;
  }
}
console.log(`✅ ${TOPICS.length * INDUSTRIES.length} topic × industry pages`);

// 4. Update sitemap
const existingSitemap = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
const newUrls = sitemapUrls.map(url => `  <url><loc>${url}</loc><lastmod>2026-03-06</lastmod><priority>0.7</priority></url>`).join('\n');
const updatedSitemap = existingSitemap.replace('</urlset>', newUrls + '\n</urlset>');
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), updatedSitemap);

console.log(`\n🚀 Total pages generated: ${pageCount}`);
console.log(`📄 Sitemap updated with ${sitemapUrls.length} new URLs`);
console.log(`📊 Total URLs in sitemap: ${updatedSitemap.split('<url>').length - 1}`);
