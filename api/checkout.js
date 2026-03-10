// Vercel Serverless Function: Create Stripe Checkout Session
// POST /api/checkout { priceId, productType }
// SECURITY: Stripe SECRET key is server-side only. NEVER exposed to client.

const https = require('https');

const STRIPE_SECRET_KEY = process.env.AGENT3_STRIPE_KEY;
const DOMAIN = 'https://fractionalcfoschool.com';

// Allowed price IDs (whitelist to prevent abuse)
const ALLOWED_PRICES = {
  'foundations': 'price_1T94UHLNZZpWBOkPKcr8USxn',
  'pro-membership': 'price_1T94UPLNZZpWBOkPgoBDapa5',
  'certification': 'price_1T94UXLNZZpWBOkPUsYJ9Aei',
  'cfo-dashboard': 'price_1T9KPJLNZZpWBOkP94d1MiXv',
  'cash-flow-forecast': 'price_1T9KPKLNZZpWBOkPQDGsKdeX',
  'client-proposals': 'price_1T9KPKLNZZpWBOkPEk6wR3q9',
  'financial-reporting': 'price_1T9KPLLNZZpWBOkPk3LxJbVd',
};

function stripeRequest(path, params) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams(params).toString();
    const options = {
      hostname: 'api.stripe.com',
      path: path,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ error: data }); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', DOMAIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!STRIPE_SECRET_KEY) {
    console.error('AGENT3_STRIPE_KEY not configured');
    return res.status(500).json({ error: 'Payment system not configured' });
  }

  try {
    const { product } = req.body || {};

    if (!product || !ALLOWED_PRICES[product]) {
      return res.status(400).json({ 
        error: 'Invalid product. Valid: foundations, pro-membership, certification, cfo-dashboard, cash-flow-forecast, client-proposals, financial-reporting' 
      });
    }

    const priceId = ALLOWED_PRICES[product];
    const isSubscription = product === 'pro-membership';

    const params = {
      'mode': isSubscription ? 'subscription' : 'payment',
      'success_url': `${DOMAIN}/thank-you/?product=${product}&session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${DOMAIN}/${
        product === 'foundations' ? 'foundations' :
        product === 'pro-membership' ? 'pro' :
        product === 'certification' ? 'certification' :
        product === 'cfo-dashboard' ? 'templates/cfo-dashboard' :
        product === 'cash-flow-forecast' ? 'templates/cash-flow-forecast' :
        product === 'client-proposals' ? 'templates/client-proposals' :
        product === 'financial-reporting' ? 'templates/financial-reporting' :
        'pricing'
      }/`,
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'payment_method_types[0]': 'card',
      'allow_promotion_codes': 'true',
      'customer_creation': isSubscription ? undefined : 'always',
      'metadata[product]': product,
    };

    if (!isSubscription) {
      params['payment_intent_data[metadata][product]'] = product;
    } else {
      params['subscription_data[metadata][product]'] = product;
    }

    const session = await stripeRequest('/v1/checkout/sessions', params);

    if (session.error) {
      console.error('Stripe error:', JSON.stringify(session.error));
      return res.status(500).json({ error: 'Failed to create checkout session' });
    }

    return res.status(200).json({ url: session.url, sessionId: session.id });

  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
