const fs = require('fs');
const path = require('path');

// Top 100 US cities by population + major business hubs
const cities = [
  { name: 'New York', state: 'NY', slug: 'new-york', pop: '8.3M', metro: 'New York-Newark-Jersey City' },
  { name: 'Los Angeles', state: 'CA', slug: 'los-angeles', pop: '3.9M', metro: 'Los Angeles-Long Beach-Anaheim' },
  { name: 'Chicago', state: 'IL', slug: 'chicago', pop: '2.7M', metro: 'Chicago-Naperville-Elgin' },
  { name: 'Houston', state: 'TX', slug: 'houston', pop: '2.3M', metro: 'Houston-The Woodlands-Sugar Land' },
  { name: 'Phoenix', state: 'AZ', slug: 'phoenix', pop: '1.6M', metro: 'Phoenix-Mesa-Chandler' },
  { name: 'Philadelphia', state: 'PA', slug: 'philadelphia', pop: '1.6M', metro: 'Philadelphia-Camden-Wilmington' },
  { name: 'San Antonio', state: 'TX', slug: 'san-antonio', pop: '1.5M', metro: 'San Antonio-New Braunfels' },
  { name: 'San Diego', state: 'CA', slug: 'san-diego', pop: '1.4M', metro: 'San Diego-Chula Vista-Carlsbad' },
  { name: 'Dallas', state: 'TX', slug: 'dallas', pop: '1.3M', metro: 'Dallas-Fort Worth-Arlington' },
  { name: 'Austin', state: 'TX', slug: 'austin', pop: '1.0M', metro: 'Austin-Round Rock-Georgetown' },
  { name: 'San Jose', state: 'CA', slug: 'san-jose', pop: '1.0M', metro: 'San Jose-Sunnyvale-Santa Clara' },
  { name: 'Jacksonville', state: 'FL', slug: 'jacksonville', pop: '950K', metro: 'Jacksonville' },
  { name: 'Fort Worth', state: 'TX', slug: 'fort-worth', pop: '935K', metro: 'Dallas-Fort Worth-Arlington' },
  { name: 'Columbus', state: 'OH', slug: 'columbus', pop: '905K', metro: 'Columbus' },
  { name: 'Charlotte', state: 'NC', slug: 'charlotte', pop: '875K', metro: 'Charlotte-Concord-Gastonia' },
  { name: 'Indianapolis', state: 'IN', slug: 'indianapolis', pop: '880K', metro: 'Indianapolis-Carmel-Anderson' },
  { name: 'San Francisco', state: 'CA', slug: 'san-francisco', pop: '870K', metro: 'San Francisco-Oakland-Berkeley' },
  { name: 'Seattle', state: 'WA', slug: 'seattle', pop: '740K', metro: 'Seattle-Tacoma-Bellevue' },
  { name: 'Denver', state: 'CO', slug: 'denver', pop: '715K', metro: 'Denver-Aurora-Lakewood' },
  { name: 'Nashville', state: 'TN', slug: 'nashville', pop: '690K', metro: 'Nashville-Davidson-Murfreesboro' },
  { name: 'Oklahoma City', state: 'OK', slug: 'oklahoma-city', pop: '680K', metro: 'Oklahoma City' },
  { name: 'Washington', state: 'DC', slug: 'washington-dc', pop: '670K', metro: 'Washington-Arlington-Alexandria' },
  { name: 'El Paso', state: 'TX', slug: 'el-paso', pop: '680K', metro: 'El Paso' },
  { name: 'Las Vegas', state: 'NV', slug: 'las-vegas', pop: '640K', metro: 'Las Vegas-Henderson-Paradise' },
  { name: 'Boston', state: 'MA', slug: 'boston', pop: '680K', metro: 'Boston-Cambridge-Newton' },
  { name: 'Portland', state: 'OR', slug: 'portland', pop: '650K', metro: 'Portland-Vancouver-Hillsboro' },
  { name: 'Memphis', state: 'TN', slug: 'memphis', pop: '630K', metro: 'Memphis' },
  { name: 'Louisville', state: 'KY', slug: 'louisville', pop: '620K', metro: 'Louisville/Jefferson County' },
  { name: 'Baltimore', state: 'MD', slug: 'baltimore', pop: '580K', metro: 'Baltimore-Columbia-Towson' },
  { name: 'Milwaukee', state: 'WI', slug: 'milwaukee', pop: '580K', metro: 'Milwaukee-Waukesha' },
  { name: 'Albuquerque', state: 'NM', slug: 'albuquerque', pop: '560K', metro: 'Albuquerque' },
  { name: 'Tucson', state: 'AZ', slug: 'tucson', pop: '540K', metro: 'Tucson' },
  { name: 'Fresno', state: 'CA', slug: 'fresno', pop: '540K', metro: 'Fresno' },
  { name: 'Sacramento', state: 'CA', slug: 'sacramento', pop: '525K', metro: 'Sacramento-Roseville-Folsom' },
  { name: 'Mesa', state: 'AZ', slug: 'mesa', pop: '510K', metro: 'Phoenix-Mesa-Chandler' },
  { name: 'Kansas City', state: 'MO', slug: 'kansas-city', pop: '510K', metro: 'Kansas City' },
  { name: 'Atlanta', state: 'GA', slug: 'atlanta', pop: '500K', metro: 'Atlanta-Sandy Springs-Alpharetta' },
  { name: 'Omaha', state: 'NE', slug: 'omaha', pop: '490K', metro: 'Omaha-Council Bluffs' },
  { name: 'Colorado Springs', state: 'CO', slug: 'colorado-springs', pop: '480K', metro: 'Colorado Springs' },
  { name: 'Raleigh', state: 'NC', slug: 'raleigh', pop: '475K', metro: 'Raleigh-Cary' },
  { name: 'Long Beach', state: 'CA', slug: 'long-beach', pop: '470K', metro: 'Los Angeles-Long Beach-Anaheim' },
  { name: 'Virginia Beach', state: 'VA', slug: 'virginia-beach', pop: '460K', metro: 'Virginia Beach-Norfolk-Newport News' },
  { name: 'Miami', state: 'FL', slug: 'miami', pop: '440K', metro: 'Miami-Fort Lauderdale-Pompano Beach' },
  { name: 'Oakland', state: 'CA', slug: 'oakland', pop: '430K', metro: 'San Francisco-Oakland-Berkeley' },
  { name: 'Minneapolis', state: 'MN', slug: 'minneapolis', pop: '430K', metro: 'Minneapolis-St. Paul-Bloomington' },
  { name: 'Tampa', state: 'FL', slug: 'tampa', pop: '400K', metro: 'Tampa-St. Petersburg-Clearwater' },
  { name: 'Tulsa', state: 'OK', slug: 'tulsa', pop: '400K', metro: 'Tulsa' },
  { name: 'Arlington', state: 'TX', slug: 'arlington', pop: '395K', metro: 'Dallas-Fort Worth-Arlington' },
  { name: 'New Orleans', state: 'LA', slug: 'new-orleans', pop: '380K', metro: 'New Orleans-Metairie' },
  { name: 'Cleveland', state: 'OH', slug: 'cleveland', pop: '370K', metro: 'Cleveland-Elyria' },
  { name: 'Honolulu', state: 'HI', slug: 'honolulu', pop: '350K', metro: 'Urban Honolulu' },
  { name: 'Bakersfield', state: 'CA', slug: 'bakersfield', pop: '400K', metro: 'Bakersfield' },
  { name: 'Aurora', state: 'CO', slug: 'aurora', pop: '390K', metro: 'Denver-Aurora-Lakewood' },
  { name: 'Anaheim', state: 'CA', slug: 'anaheim', pop: '350K', metro: 'Los Angeles-Long Beach-Anaheim' },
  { name: 'Santa Ana', state: 'CA', slug: 'santa-ana', pop: '310K', metro: 'Los Angeles-Long Beach-Anaheim' },
  { name: 'St. Louis', state: 'MO', slug: 'st-louis', pop: '300K', metro: 'St. Louis' },
  { name: 'Riverside', state: 'CA', slug: 'riverside', pop: '310K', metro: 'Riverside-San Bernardino-Ontario' },
  { name: 'Pittsburgh', state: 'PA', slug: 'pittsburgh', pop: '300K', metro: 'Pittsburgh' },
  { name: 'Lexington', state: 'KY', slug: 'lexington', pop: '320K', metro: 'Lexington-Fayette' },
  { name: 'Cincinnati', state: 'OH', slug: 'cincinnati', pop: '310K', metro: 'Cincinnati' },
  { name: 'Stockton', state: 'CA', slug: 'stockton', pop: '310K', metro: 'Stockton' },
  { name: 'St. Paul', state: 'MN', slug: 'st-paul', pop: '310K', metro: 'Minneapolis-St. Paul-Bloomington' },
  { name: 'Newark', state: 'NJ', slug: 'newark', pop: '310K', metro: 'New York-Newark-Jersey City' },
  { name: 'Greensboro', state: 'NC', slug: 'greensboro', pop: '300K', metro: 'Greensboro-High Point' },
  { name: 'Buffalo', state: 'NY', slug: 'buffalo', pop: '280K', metro: 'Buffalo-Cheektowaga' },
  { name: 'Plano', state: 'TX', slug: 'plano', pop: '290K', metro: 'Dallas-Fort Worth-Arlington' },
  { name: 'Lincoln', state: 'NE', slug: 'lincoln', pop: '290K', metro: 'Lincoln' },
  { name: 'Henderson', state: 'NV', slug: 'henderson', pop: '320K', metro: 'Las Vegas-Henderson-Paradise' },
  { name: 'Fort Wayne', state: 'IN', slug: 'fort-wayne', pop: '270K', metro: 'Fort Wayne' },
  { name: 'Jersey City', state: 'NJ', slug: 'jersey-city', pop: '260K', metro: 'New York-Newark-Jersey City' },
  { name: 'Chandler', state: 'AZ', slug: 'chandler', pop: '280K', metro: 'Phoenix-Mesa-Chandler' },
  { name: 'St. Petersburg', state: 'FL', slug: 'st-petersburg', pop: '260K', metro: 'Tampa-St. Petersburg-Clearwater' },
  { name: 'Laredo', state: 'TX', slug: 'laredo', pop: '260K', metro: 'Laredo' },
  { name: 'Norfolk', state: 'VA', slug: 'norfolk', pop: '240K', metro: 'Virginia Beach-Norfolk-Newport News' },
  { name: 'Madison', state: 'WI', slug: 'madison', pop: '260K', metro: 'Madison' },
  { name: 'Durham', state: 'NC', slug: 'durham', pop: '280K', metro: 'Durham-Chapel Hill' },
  { name: 'Lubbock', state: 'TX', slug: 'lubbock', pop: '260K', metro: 'Lubbock' },
  { name: 'Irvine', state: 'CA', slug: 'irvine', pop: '310K', metro: 'Los Angeles-Long Beach-Anaheim' },
  { name: 'Winston-Salem', state: 'NC', slug: 'winston-salem', pop: '250K', metro: 'Winston-Salem' },
  { name: 'Glendale', state: 'AZ', slug: 'glendale', pop: '250K', metro: 'Phoenix-Mesa-Chandler' },
  { name: 'Garland', state: 'TX', slug: 'garland', pop: '240K', metro: 'Dallas-Fort Worth-Arlington' },
  { name: 'Hialeah', state: 'FL', slug: 'hialeah', pop: '230K', metro: 'Miami-Fort Lauderdale-Pompano Beach' },
  { name: 'Reno', state: 'NV', slug: 'reno', pop: '265K', metro: 'Reno-Sparks' },
  { name: 'Chesapeake', state: 'VA', slug: 'chesapeake', pop: '250K', metro: 'Virginia Beach-Norfolk-Newport News' },
  { name: 'Gilbert', state: 'AZ', slug: 'gilbert', pop: '270K', metro: 'Phoenix-Mesa-Chandler' },
  { name: 'Baton Rouge', state: 'LA', slug: 'baton-rouge', pop: '225K', metro: 'Baton Rouge' },
  { name: 'Irving', state: 'TX', slug: 'irving', pop: '240K', metro: 'Dallas-Fort Worth-Arlington' },
  { name: 'Scottsdale', state: 'AZ', slug: 'scottsdale', pop: '260K', metro: 'Phoenix-Mesa-Chandler' },
  { name: 'North Las Vegas', state: 'NV', slug: 'north-las-vegas', pop: '260K', metro: 'Las Vegas-Henderson-Paradise' },
  { name: 'Fremont', state: 'CA', slug: 'fremont', pop: '230K', metro: 'San Francisco-Oakland-Berkeley' },
  { name: 'Boise', state: 'ID', slug: 'boise', pop: '235K', metro: 'Boise City' },
  { name: 'Richmond', state: 'VA', slug: 'richmond', pop: '230K', metro: 'Richmond' },
  { name: 'San Bernardino', state: 'CA', slug: 'san-bernardino', pop: '220K', metro: 'Riverside-San Bernardino-Ontario' },
  { name: 'Spokane', state: 'WA', slug: 'spokane', pop: '220K', metro: 'Spokane-Spokane Valley' },
  { name: 'Des Moines', state: 'IA', slug: 'des-moines', pop: '215K', metro: 'Des Moines-West Des Moines' },
  { name: 'Birmingham', state: 'AL', slug: 'birmingham', pop: '200K', metro: 'Birmingham-Hoover' },
  { name: 'Rochester', state: 'NY', slug: 'rochester', pop: '210K', metro: 'Rochester' },
  { name: 'Tacoma', state: 'WA', slug: 'tacoma', pop: '220K', metro: 'Seattle-Tacoma-Bellevue' },
  { name: 'Salt Lake City', state: 'UT', slug: 'salt-lake-city', pop: '200K', metro: 'Salt Lake City' },
];

// Industry context for each city
const cityIndustries = {
  'new-york': ['finance', 'real estate', 'media', 'tech startups', 'fashion'],
  'los-angeles': ['entertainment', 'tech', 'real estate', 'hospitality', 'manufacturing'],
  'chicago': ['finance', 'manufacturing', 'food & beverage', 'logistics', 'healthcare'],
  'houston': ['energy', 'healthcare', 'manufacturing', 'aerospace', 'construction'],
  'phoenix': ['real estate', 'healthcare', 'tech', 'construction', 'tourism'],
  'san-francisco': ['tech', 'biotech', 'finance', 'professional services', 'tourism'],
  'seattle': ['tech', 'aerospace', 'retail', 'healthcare', 'maritime'],
  'denver': ['tech', 'aerospace', 'energy', 'healthcare', 'tourism'],
  'austin': ['tech', 'music & entertainment', 'real estate', 'healthcare', 'education'],
  'miami': ['real estate', 'tourism', 'finance', 'international trade', 'healthcare'],
  'atlanta': ['logistics', 'film & media', 'tech', 'healthcare', 'finance'],
  'boston': ['biotech', 'education', 'finance', 'healthcare', 'tech'],
  'nashville': ['healthcare', 'music', 'hospitality', 'real estate', 'tech'],
  'dallas': ['finance', 'tech', 'energy', 'healthcare', 'logistics'],
  'salt-lake-city': ['tech', 'outdoor recreation', 'healthcare', 'finance', 'manufacturing'],
};

// Default industries for cities not in the map
const defaultIndustries = ['small business', 'professional services', 'healthcare', 'construction', 'retail'];

function getIndustries(slug) {
  return cityIndustries[slug] || defaultIndustries;
}

// Service offerings
const services = [
  'Cash Flow Forecasting & Management',
  'Financial Reporting & KPI Dashboards',
  'Budgeting & Financial Planning',
  'Profitability Analysis',
  'Pricing Strategy Optimization',
  'Fundraising & Investor Relations',
  'Tax Planning & Strategy',
  'Business Valuation',
  'M&A Advisory Support',
  'Financial Systems Implementation'
];

function generateCityPage(city) {
  const industries = getIndustries(city.slug);
  const industryList = industries.map(i => `<li>${i.charAt(0).toUpperCase() + i.slice(1)}</li>`).join('\n                ');
  const servicesList = services.slice(0, 7).map(s => `
            <div class="service-card">
              <h3>${s}</h3>
              <p>Expert ${s.toLowerCase()} services tailored for ${city.name} businesses. Our fractional CFOs understand the ${city.name}, ${city.state} market and help you make smarter financial decisions.</p>
            </div>`).join('');

  const testimonialNames = ['Sarah M.', 'James K.', 'Priya R.'];
  const testimonialRoles = ['E-commerce Founder', 'Construction Company Owner', 'SaaS Startup CEO'];
  const testimonials = [
    `"Having a fractional CFO in ${city.name} changed everything for our business. We went from guessing at our numbers to having complete financial clarity."`,
    `"The cost savings compared to a full-time CFO were incredible. We got the same expertise at a fraction of the cost, and they understood the ${city.name} market."`,
    `"Our fractional CFO helped us secure $2M in funding. They knew exactly what ${city.name} investors wanted to see in our financials."`
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fractional CFO Services in ${city.name}, ${city.state} | Vega Academy</title>
  <meta name="description" content="Find expert fractional CFO services in ${city.name}, ${city.state}. Part-time CFO expertise for growing businesses in the ${city.metro} area. Cash flow management, financial planning & more.">
  <meta name="keywords" content="fractional CFO ${city.name}, fractional CFO ${city.state}, part-time CFO ${city.name}, outsourced CFO ${city.name}, CFO services ${city.name}">
  <link rel="canonical" href="https://fractionalcfoschool.com/fractional-cfo-near-me/${city.slug}/">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Fractional CFO Services in ${city.name}, ${city.state}",
    "description": "Expert fractional CFO services for businesses in ${city.name}, ${city.state}. Part-time CFO expertise including cash flow management, financial planning, and strategic advisory.",
    "areaServed": {
      "@type": "City",
      "name": "${city.name}",
      "containedIn": {
        "@type": "State",
        "name": "${city.state}"
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "Vega Academy",
      "url": "https://fractionalcfoschool.com"
    }
  }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; line-height: 1.7; }
    .hero { background: linear-gradient(135deg, #0a0a23 0%, #1a1a4e 100%); color: white; padding: 80px 20px; text-align: center; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 20px; max-width: 800px; margin-left: auto; margin-right: auto; }
    .hero p { font-size: 1.2rem; opacity: 0.9; max-width: 700px; margin: 0 auto 30px; }
    .hero .cta { display: inline-block; background: #f39c12; color: #1a1a2e; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
    .hero .cta:hover { background: #e67e22; }
    .container { max-width: 1100px; margin: 0 auto; padding: 60px 20px; }
    h2 { font-size: 2rem; margin-bottom: 20px; color: #0a0a23; }
    h3 { font-size: 1.3rem; margin-bottom: 10px; color: #1a1a4e; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; margin: 40px 0; }
    .stat { text-align: center; padding: 30px; background: #f8f9ff; border-radius: 12px; }
    .stat .number { font-size: 2.5rem; font-weight: 800; color: #f39c12; }
    .stat .label { font-size: 0.95rem; color: #666; margin-top: 5px; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin: 30px 0; }
    .service-card { background: white; border: 1px solid #e8e8f0; border-radius: 12px; padding: 30px; }
    .service-card:hover { border-color: #f39c12; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .industries { background: #f8f9ff; padding: 60px 20px; }
    .industries ul { columns: 2; list-style: none; max-width: 600px; margin: 20px auto; }
    .industries li { padding: 8px 0; padding-left: 25px; position: relative; }
    .industries li::before { content: '✓'; position: absolute; left: 0; color: #f39c12; font-weight: bold; }
    .testimonials { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin: 30px 0; }
    .testimonial { background: #f8f9ff; padding: 30px; border-radius: 12px; }
    .testimonial .quote { font-style: italic; margin-bottom: 15px; }
    .testimonial .author { font-weight: 700; }
    .testimonial .role { color: #666; font-size: 0.9rem; }
    .pricing { background: #0a0a23; color: white; padding: 60px 20px; text-align: center; }
    .pricing h2 { color: white; }
    .pricing p { max-width: 700px; margin: 0 auto 30px; opacity: 0.9; }
    .pricing .cta { display: inline-block; background: #f39c12; color: #1a1a2e; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
    .faq { max-width: 800px; margin: 0 auto; }
    .faq-item { margin-bottom: 20px; border-bottom: 1px solid #e8e8f0; padding-bottom: 20px; }
    .faq-item h3 { cursor: pointer; }
    .faq-item p { margin-top: 10px; color: #555; }
    .breadcrumb { padding: 15px 20px; background: #f8f9ff; font-size: 0.9rem; }
    .breadcrumb a { color: #1a1a4e; text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    nav { background: #0a0a23; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
    nav a { color: white; text-decoration: none; font-weight: 600; }
    nav .links a { margin-left: 20px; opacity: 0.9; font-weight: 400; }
    nav .links a:hover { opacity: 1; }
    footer { background: #0a0a23; color: rgba(255,255,255,0.7); padding: 40px 20px; text-align: center; }
    footer a { color: #f39c12; text-decoration: none; }
    @media (max-width: 768px) { .hero h1 { font-size: 1.8rem; } .industries ul { columns: 1; } }
  </style>
</head>
<body>
  <nav>
    <a href="/">⭐ Vega Academy</a>
    <div class="links">
      <a href="/blog/">Blog</a>
      <a href="/starter-kit/">Free Starter Kit</a>
      <a href="/tools/advisory-revenue-calculator/">Revenue Calculator</a>
    </div>
  </nav>

  <div class="breadcrumb">
    <a href="/">Home</a> → <a href="/fractional-cfo-near-me/">Fractional CFO Near Me</a> → ${city.name}, ${city.state}
  </div>

  <div class="hero">
    <h1>Fractional CFO Services in ${city.name}, ${city.state}</h1>
    <p>Expert part-time CFO services for growing businesses in the ${city.metro} area. Get Fortune 500 financial leadership without the $250K+ salary.</p>
    <a href="/starter-kit/" class="cta">Get Free Advisory Starter Kit →</a>
  </div>

  <div class="container">
    <h2>Why ${city.name} Businesses Need a Fractional CFO</h2>
    <p>With a population of ${city.pop} and a thriving ${city.metro} metropolitan economy, ${city.name} is home to thousands of growing businesses that need strategic financial guidance. A fractional CFO gives you the expertise of a full-time Chief Financial Officer at a fraction of the cost — typically $3,000-$8,000/month vs. $250,000+/year for a full-time hire.</p>

    <div class="stats">
      <div class="stat">
        <div class="number">60-80%</div>
        <div class="label">Cost savings vs. full-time CFO</div>
      </div>
      <div class="stat">
        <div class="number">$3K-$8K</div>
        <div class="label">Typical monthly investment</div>
      </div>
      <div class="stat">
        <div class="number">10-20hrs</div>
        <div class="label">Hours per month</div>
      </div>
      <div class="stat">
        <div class="number">3-6mo</div>
        <div class="label">Average ROI timeline</div>
      </div>
    </div>

    <h2>Our Fractional CFO Services in ${city.name}</h2>
    <div class="services-grid">${servicesList}
    </div>
  </div>

  <div class="industries">
    <div class="container" style="padding-top:0;padding-bottom:0;">
      <h2 style="text-align:center;">Industries We Serve in ${city.name}</h2>
      <p style="text-align:center;max-width:600px;margin:0 auto 20px;">Our fractional CFOs have deep experience across ${city.name}'s key industries:</p>
      <ul>
        ${industryList}
        <li>Startups & Growth-Stage Companies</li>
        <li>Professional Services Firms</li>
        <li>E-commerce & DTC Brands</li>
        <li>Manufacturing & Distribution</li>
        <li>Real Estate & Property Management</li>
      </ul>
    </div>
  </div>

  <div class="container">
    <h2>What ${city.name} Clients Say</h2>
    <div class="testimonials">
      ${testimonials.map((t, i) => `<div class="testimonial">
        <p class="quote">${t}</p>
        <p class="author">${testimonialNames[i]}</p>
        <p class="role">${testimonialRoles[i]}, ${city.name}</p>
      </div>`).join('\n      ')}
    </div>
  </div>

  <div class="pricing">
    <h2>Ready to Get Started?</h2>
    <p>Learn how to become a fractional CFO or find one for your ${city.name} business. Our free Advisory Starter Kit includes pricing templates, proposal scripts, and KPI dashboards.</p>
    <a href="/starter-kit/" class="cta">Download Free Starter Kit →</a>
  </div>

  <div class="container">
    <h2>Frequently Asked Questions About Fractional CFOs in ${city.name}</h2>
    <div class="faq">
      <div class="faq-item">
        <h3>What does a fractional CFO cost in ${city.name}?</h3>
        <p>Fractional CFO rates in ${city.name}, ${city.state} typically range from $150-$400/hour or $3,000-$8,000/month on retainer. This is 60-80% less than hiring a full-time CFO, which averages $250,000-$400,000/year in the ${city.metro} area including salary and benefits.</p>
      </div>
      <div class="faq-item">
        <h3>How is a fractional CFO different from a bookkeeper or accountant?</h3>
        <p>While bookkeepers handle day-to-day transaction recording and accountants prepare financial statements, a fractional CFO provides strategic financial leadership — cash flow forecasting, financial planning, fundraising support, pricing strategy, and growth advisory. They work ON your business, not just IN it.</p>
      </div>
      <div class="faq-item">
        <h3>When does my ${city.name} business need a fractional CFO?</h3>
        <p>Most ${city.name} businesses benefit from a fractional CFO when they hit $500K-$5M in revenue, are planning to raise capital, experiencing rapid growth, facing cash flow challenges, or need to make major financial decisions like acquisitions or new market entry.</p>
      </div>
      <div class="faq-item">
        <h3>Can a bookkeeper become a fractional CFO?</h3>
        <p>Yes! Many successful fractional CFOs started as bookkeepers. The transition requires developing skills in financial analysis, strategic planning, and advisory services. Vega Academy's course teaches bookkeepers exactly how to make this transition and command $3K-$8K/month per client.</p>
      </div>
      <div class="faq-item">
        <h3>Do I need a fractional CFO who is local to ${city.name}?</h3>
        <p>While having a local fractional CFO who understands the ${city.name} business landscape can be valuable, many fractional CFO engagements are done remotely. The most important factor is industry expertise and chemistry, not location. That said, knowledge of ${city.state} tax regulations and local market dynamics is a plus.</p>
      </div>
    </div>
  </div>

  <div class="container" style="text-align:center;padding-bottom:30px;">
    <h2>Learn How to Become a Fractional CFO</h2>
    <p style="max-width:600px;margin:0 auto 20px;">Whether you're a bookkeeper in ${city.name} looking to transition to advisory services or a business owner seeking CFO expertise, Vega Academy can help.</p>
    <p><a href="/blog/how-to-become-fractional-cfo/" style="color:#1a1a4e;font-weight:700;">📖 Read: How to Become a Fractional CFO in 2026 →</a></p>
    <p><a href="/blog/fractional-cfo-services-guide/" style="color:#1a1a4e;font-weight:700;">📖 Read: Complete Guide to Fractional CFO Services →</a></p>
    <p><a href="/tools/advisory-revenue-calculator/" style="color:#1a1a4e;font-weight:700;">🧮 Try: Advisory Revenue Calculator →</a></p>
  </div>

  <footer>
    <p>© 2026 Vega Academy. All rights reserved.</p>
    <p style="margin-top:10px;"><a href="/">Home</a> · <a href="/blog/">Blog</a> · <a href="/starter-kit/">Free Starter Kit</a> · <a href="/fractional-cfo-near-me/">All Locations</a></p>
  </footer>
</body>
</html>`;
}

function generateHubPage(cities) {
  const stateGroups = {};
  cities.forEach(c => {
    if (!stateGroups[c.state]) stateGroups[c.state] = [];
    stateGroups[c.state].push(c);
  });

  const stateList = Object.keys(stateGroups).sort().map(state => {
    const citiesInState = stateGroups[state].sort((a,b) => a.name.localeCompare(b.name));
    const links = citiesInState.map(c => `<li><a href="/fractional-cfo-near-me/${c.slug}/">${c.name}, ${c.state}</a></li>`).join('\n            ');
    return `<div class="state-group">
          <h3>${state}</h3>
          <ul>${links}</ul>
        </div>`;
  }).join('\n        ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fractional CFO Near Me — Find CFO Services in Your City | Vega Academy</title>
  <meta name="description" content="Find fractional CFO services in your city. Expert part-time CFO services across ${cities.length}+ US cities. Strategic financial leadership for growing businesses.">
  <link rel="canonical" href="https://fractionalcfoschool.com/fractional-cfo-near-me/">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; line-height: 1.7; }
    nav { background: #0a0a23; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
    nav a { color: white; text-decoration: none; font-weight: 600; }
    nav .links a { margin-left: 20px; opacity: 0.9; font-weight: 400; }
    .hero { background: linear-gradient(135deg, #0a0a23 0%, #1a1a4e 100%); color: white; padding: 80px 20px; text-align: center; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 20px; }
    .hero p { font-size: 1.2rem; opacity: 0.9; max-width: 700px; margin: 0 auto; }
    .container { max-width: 1100px; margin: 0 auto; padding: 60px 20px; }
    h2 { font-size: 2rem; margin-bottom: 30px; }
    .states-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
    .state-group h3 { color: #f39c12; margin-bottom: 10px; font-size: 1.1rem; }
    .state-group ul { list-style: none; }
    .state-group li { padding: 4px 0; }
    .state-group a { color: #1a1a4e; text-decoration: none; }
    .state-group a:hover { color: #f39c12; text-decoration: underline; }
    footer { background: #0a0a23; color: rgba(255,255,255,0.7); padding: 40px 20px; text-align: center; }
    footer a { color: #f39c12; text-decoration: none; }
    @media (max-width: 768px) { .hero h1 { font-size: 1.8rem; } }
  </style>
</head>
<body>
  <nav>
    <a href="/">⭐ Vega Academy</a>
    <div class="links">
      <a href="/blog/">Blog</a>
      <a href="/starter-kit/">Free Starter Kit</a>
    </div>
  </nav>
  <div class="hero">
    <h1>Fractional CFO Near Me</h1>
    <p>Find expert fractional CFO services in ${cities.length}+ cities across the United States. Strategic financial leadership for growing businesses.</p>
  </div>
  <div class="container">
    <h2>Find Fractional CFO Services by City</h2>
    <div class="states-grid">
      ${stateList}
    </div>
  </div>
  <div class="container" style="text-align:center;background:#f8f9ff;max-width:100%;margin:0;">
    <div style="max-width:700px;margin:0 auto;padding:40px 20px;">
      <h2>Want to Become a Fractional CFO?</h2>
      <p>Vega Academy teaches bookkeepers and accountants how to transition to high-value advisory services. Learn to command $3K-$8K/month per client.</p>
      <p style="margin-top:20px;"><a href="/starter-kit/" style="display:inline-block;background:#f39c12;color:#1a1a2e;padding:15px 40px;border-radius:8px;text-decoration:none;font-weight:700;">Get Free Advisory Starter Kit →</a></p>
    </div>
  </div>
  <footer>
    <p>© 2026 Vega Academy. All rights reserved.</p>
    <p style="margin-top:10px;"><a href="/">Home</a> · <a href="/blog/">Blog</a> · <a href="/starter-kit/">Free Starter Kit</a></p>
  </footer>
</body>
</html>`;
}

// Generate all pages
const baseDir = path.join(__dirname, 'fractional-cfo-near-me');
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

// Hub page
fs.writeFileSync(path.join(baseDir, 'index.html'), generateHubPage(cities));
console.log('✅ Generated hub page: /fractional-cfo-near-me/');

// City pages
let count = 0;
cities.forEach(city => {
  const cityDir = path.join(baseDir, city.slug);
  if (!fs.existsSync(cityDir)) fs.mkdirSync(cityDir, { recursive: true });
  fs.writeFileSync(path.join(cityDir, 'index.html'), generateCityPage(city));
  count++;
});

console.log(`✅ Generated ${count} city pages`);
console.log(`Total new URLs: ${count + 1}`);
