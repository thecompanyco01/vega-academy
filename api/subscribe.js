// Vercel Serverless Function: Email capture endpoint
// Stores subscribers in Vercel KV (or falls back to in-memory for demo)
// POST /api/subscribe { email, name?, source? }

const fs = require('fs');
const path = require('path');

// Simple file-based storage for MVP (works on Vercel with /tmp)
const SUBSCRIBERS_FILE = '/tmp/vega-subscribers.json';

function getSubscribers() {
  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveSubscribers(subs) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2));
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
    };

    // Check for duplicate
    const subs = getSubscribers();
    const exists = subs.find(s => s.email === subscriber.email);
    
    if (exists) {
      return res.status(200).json({ 
        success: true, 
        message: 'You\'re already on the list! We\'ll be in touch soon.',
        duplicate: true 
      });
    }

    subs.push(subscriber);
    saveSubscribers(subs);

    // Log to console for Vercel logs
    console.log(`New subscriber: ${subscriber.email} from ${subscriber.source}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Welcome! Check your inbox for the Advisory Starter Kit.',
      subscriber_count: subs.length
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
