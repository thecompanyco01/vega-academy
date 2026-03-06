// Vercel Serverless Function: List subscribers (admin endpoint)
// GET /api/subscribers?key=ADMIN_KEY

const fs = require('fs');
const SUBSCRIBERS_FILE = '/tmp/vega-subscribers.json';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple API key auth
  const adminKey = process.env.ADMIN_API_KEY || 'vega-admin-2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    const subs = JSON.parse(data);
    return res.status(200).json({ 
      count: subs.length, 
      subscribers: subs 
    });
  } catch {
    return res.status(200).json({ count: 0, subscribers: [] });
  }
};
