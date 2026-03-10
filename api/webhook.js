// Vercel Serverless Function: Stripe Webhook Handler
// POST /api/webhook — receives Stripe checkout.session.completed events
// Sends delivery email via AgentMail with download links

const https = require('https');
const crypto = require('crypto');

const STRIPE_SECRET_KEY = process.env.AGENT3_STRIPE_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY;
const DOMAIN = 'https://fractionalcfoschool.com';

// Product → download file mapping
const PRODUCT_DOWNLOADS = {
  'cfo-dashboard': {
    name: 'CFO Dashboard Template Pack',
    file: '/downloads/d8f3a2c1e9b7/cfo-dashboard-template-pack.xlsx',
    price: '$47',
  },
  'cash-flow-forecast': {
    name: 'Cash Flow Forecasting Kit',
    file: '/downloads/a4e7b9d2f1c6/cash-flow-forecasting-kit.xlsx',
    price: '$47',
  },
  'client-proposals': {
    name: 'Client Proposal & Engagement Letter Pack',
    file: '/downloads/c2f8e3a7d5b1/client-proposal-engagement-pack.xlsx',
    price: '$27',
  },
  'financial-reporting': {
    name: 'Financial Reporting Template Pack',
    file: '/downloads/e6d1b4f9a3c8/financial-reporting-template-pack.xlsx',
    price: '$47',
  },
  'foundations': {
    name: 'Foundations Course',
    file: null, // Course delivery TBD
    price: '$297',
  },
  'pro-membership': {
    name: 'CFO Pro Membership',
    file: null, // Membership area TBD
    price: '$49/mo',
  },
  'certification': {
    name: 'Certified Fractional CFO Program',
    file: null, // Course delivery TBD
    price: '$1,497',
  },
};

function makeRequest(hostname, path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const options = { hostname, path, method, headers };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function sendDeliveryEmail(customerEmail, customerName, product) {
  const productInfo = PRODUCT_DOWNLOADS[product];
  if (!productInfo) return;

  const downloadUrl = productInfo.file ? `${DOMAIN}${productInfo.file}` : null;

  let emailBody;
  if (downloadUrl) {
    emailBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a2e;">
  <div style="background: #1a1a2e; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: #f9c846; margin: 0; font-size: 24px;">📊 Fractional CFO School</h1>
  </div>
  <div style="background: #ffffff; padding: 32px; border: 1px solid #e0e0e0; border-radius: 0 0 12px 12px;">
    <h2 style="color: #1a1a2e; margin-top: 0;">Your download is ready!</h2>
    <p>Hi${customerName ? ' ' + customerName : ''},</p>
    <p>Thank you for purchasing the <strong>${productInfo.name}</strong>. Your template pack is ready to download:</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${downloadUrl}" style="display: inline-block; background: #f9c846; color: #1a1a2e; padding: 14px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 16px;">Download Your Templates →</a>
    </div>
    <p style="color: #666; font-size: 14px;">This link will remain active. You can download the file as many times as you need.</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
    <p style="color: #666; font-size: 14px;">Need help getting started? Check out our <a href="${DOMAIN}/blog/" style="color: #2563eb;">blog</a> for guides on using these templates with your clients.</p>
    <p style="color: #666; font-size: 14px;">Ready to level up? The <a href="${DOMAIN}/foundations/" style="color: #2563eb;">Foundations Course ($297)</a> teaches you how to build a full fractional CFO practice.</p>
  </div>
  <div style="text-align: center; padding: 16px; color: #999; font-size: 12px;">
    <p>© 2026 Fractional CFO School · <a href="${DOMAIN}" style="color: #999;">fractionalcfoschool.com</a></p>
  </div>
</body>
</html>`;
  } else {
    emailBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a2e;">
  <div style="background: #1a1a2e; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: #f9c846; margin: 0; font-size: 24px;">📊 Fractional CFO School</h1>
  </div>
  <div style="background: #ffffff; padding: 32px; border: 1px solid #e0e0e0; border-radius: 0 0 12px 12px;">
    <h2 style="color: #1a1a2e; margin-top: 0;">Welcome to ${productInfo.name}!</h2>
    <p>Hi${customerName ? ' ' + customerName : ''},</p>
    <p>Thank you for enrolling in the <strong>${productInfo.name}</strong>. We're setting up your access and will email you with your course materials within 24 hours.</p>
    <p>In the meantime, check out these resources to get started:</p>
    <ul>
      <li><a href="${DOMAIN}/blog/what-is-fractional-cfo/" style="color: #2563eb;">What Is a Fractional CFO?</a></li>
      <li><a href="${DOMAIN}/blog/how-to-become-a-fractional-cfo/" style="color: #2563eb;">How to Become a Fractional CFO</a></li>
      <li><a href="${DOMAIN}/blog/advisory-pricing-bookkeepers/" style="color: #2563eb;">Advisory Pricing Guide</a></li>
    </ul>
    <p>If you have any questions, reply to this email and we'll get back to you.</p>
  </div>
  <div style="text-align: center; padding: 16px; color: #999; font-size: 12px;">
    <p>© 2026 Fractional CFO School · <a href="${DOMAIN}" style="color: #999;">fractionalcfoschool.com</a></p>
  </div>
</body>
</html>`;
  }

  // Send via AgentMail (if configured)
  if (AGENTMAIL_API_KEY) {
    try {
      const payload = JSON.stringify({
        to: customerEmail,
        from: 'hello@fractionalcfoschool.com',
        subject: downloadUrl 
          ? `Your ${productInfo.name} is ready to download`
          : `Welcome to ${productInfo.name}!`,
        html: emailBody,
      });

      await makeRequest('api.agentmail.to', '/v0/emails', 'POST', {
        'Authorization': `Bearer ${AGENTMAIL_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      }, payload);

      console.log(`Delivery email sent to ${customerEmail} for ${product}`);
    } catch (err) {
      console.error('Email send failed:', err);
    }
  } else {
    console.log(`AgentMail not configured. Would send to ${customerEmail} for ${product}`);
  }
}

// Verify Stripe webhook signature
function verifySignature(payload, signature, secret) {
  if (!secret) return true; // Skip verification if no secret configured (dev mode)
  const elements = signature.split(',');
  const timestamp = elements.find(e => e.startsWith('t='))?.slice(2);
  const v1Sig = elements.find(e => e.startsWith('v1='))?.slice(3);
  if (!timestamp || !v1Sig) return false;
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(v1Sig), Buffer.from(expectedSig));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Get raw body for signature verification
    const chunks = [];
    for await (const chunk of req) { chunks.push(chunk); }
    const rawBody = Buffer.concat(chunks).toString('utf8');
    
    // Verify signature if webhook secret is set
    const sig = req.headers['stripe-signature'];
    if (STRIPE_WEBHOOK_SECRET && sig) {
      if (!verifySignature(rawBody, sig, STRIPE_WEBHOOK_SECRET)) {
        console.error('Webhook signature verification failed');
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email || session.customer_email;
      const customerName = session.customer_details?.name;
      const product = session.metadata?.product || 
                      new URL(session.success_url).searchParams.get('product');

      if (customerEmail && product) {
        await sendDeliveryEmail(customerEmail, customerName, product);
      }

      console.log(`Checkout completed: ${product} by ${customerEmail}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
};
