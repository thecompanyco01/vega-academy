// Vercel Serverless Function: Email capture endpoint
// Stores subscribers via GitHub API (persistent, survives cold starts)
// POST /api/subscribe { email, name?, source? }

const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'thecompanyco01/vega-academy';
const FILE_PATH = 'data/subscribers.json';

function githubRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'vega-academy',
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function getSubscribers() {
  try {
    const res = await githubRequest('GET', `contents/${FILE_PATH}`);
    if (res.status === 200) {
      const content = Buffer.from(res.data.content, 'base64').toString('utf8');
      return { subscribers: JSON.parse(content), sha: res.data.sha };
    }
  } catch {}
  return { subscribers: [], sha: null };
}

async function saveSubscribers(subscribers, sha) {
  const content = Buffer.from(JSON.stringify(subscribers, null, 2)).toString('base64');
  const body = {
    message: `New subscriber (total: ${subscribers.length})`,
    content,
  };
  if (sha) body.sha = sha;
  return githubRequest('PUT', `contents/${FILE_PATH}`, body);
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, name, source } = req.body || {};

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const subscriber = {
      email: email.toLowerCase().trim(),
      name: name || '',
      source: source || 'website',
      timestamp: new Date().toISOString(),
    };

    const { subscribers, sha } = await getSubscribers();
    
    // Check for duplicate
    if (subscribers.find(s => s.email === subscriber.email)) {
      return res.status(200).json({ 
        success: true, 
        message: "You're already on the list! We'll be in touch soon.",
        duplicate: true 
      });
    }

    subscribers.push(subscriber);
    
    // Save to GitHub
    const saveResult = await saveSubscribers(subscribers, sha);
    
    if (saveResult.status !== 200 && saveResult.status !== 201) {
      // Fallback: log to console (visible in Vercel logs)
      console.log(`SUBSCRIBER_BACKUP: ${JSON.stringify(subscriber)}`);
      console.error('GitHub save failed:', saveResult.status, JSON.stringify(saveResult.data).slice(0, 200));
    }

    console.log(`New subscriber: ${subscriber.email} from ${subscriber.source} (total: ${subscribers.length})`);

    return res.status(200).json({ 
      success: true, 
      message: 'Welcome! Check your inbox for the Advisory Starter Kit.',
      subscriber_count: subscribers.length
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
