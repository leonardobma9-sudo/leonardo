import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';
import { dbServer, SubscriptionRow } from './src/utils/db-server.ts';

// Load environment variables in local dev
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Stripe client lazily
let stripeClient: Stripe | null = null;
const getStripe = (): Stripe | null => {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      stripeClient = new Stripe(key, {
        apiVersion: '2023-10-16' as any,
      });
    }
  }
  return stripeClient;
};

// Webhook endpoint needs the raw body to verify signature
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req: express.Request, res: express.Response): Promise<any> => {
    const stripe = getStripe();
    if (!stripe) {
      console.warn('Stripe webhook received but STRIPE_SECRET_KEY is not configured.');
      return res.status(500).json({ error: 'Stripe is not configured' });
    }

    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured.');
      return res.status(500).json({ error: 'Webhook secret is not configured' });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      console.log(`Processing Stripe Webhook event: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const email = session.customer_email || session.customer_details?.email;
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;

          if (email) {
            dbServer.upsertSubscription({
              user_id: email.toLowerCase().trim(),
              stripe_customer_id: customerId || '',
              stripe_subscription_id: subscriptionId || '',
              status: 'ativo',
              plano: 'Projeto Alpha Premium Mensal',
              valor: 17.90,
              moeda: 'BRL',
              data_inicio: new Date().toISOString(),
              proxima_cobranca: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });
            console.log(`Checkout success. Active subscription created for user: ${email}`);
          }
          break;
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as any;
          const customerId = subscription.customer as string;
          const status = subscription.status === 'active' ? 'ativo' : subscription.status;

          // Find subscription row by customer ID
          const existing = dbServer.getSubscriptionByCustomerId(customerId);
          if (existing) {
            dbServer.upsertSubscription({
              user_id: existing.user_id,
              stripe_subscription_id: subscription.id,
              status: status,
              valor: (subscription.items.data[0]?.price?.unit_amount || 1790) / 100,
              moeda: subscription.currency?.toUpperCase() || 'BRL',
              proxima_cobranca: new Date(subscription.current_period_end * 1000).toISOString(),
            });
            console.log(`Subscription updated for customer ${customerId}: status=${status}`);
          } else {
            // Retrieve customer details to get the email if not found
            try {
              const customer = await stripe.customers.retrieve(customerId);
              if (!customer.deleted && 'email' in customer && customer.email) {
                dbServer.upsertSubscription({
                  user_id: customer.email,
                  stripe_customer_id: customerId,
                  stripe_subscription_id: subscription.id,
                  status: status,
                  valor: (subscription.items.data[0]?.price?.unit_amount || 1790) / 100,
                  moeda: subscription.currency?.toUpperCase() || 'BRL',
                  proxima_cobranca: new Date(subscription.current_period_end * 1000).toISOString(),
                });
                console.log(`Subscription created for new customer ${customerId} (${customer.email}): status=${status}`);
              }
            } catch (err) {
              console.error('Error retrieving customer during subscription update:', err);
            }
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as any;
          const existing = dbServer.getSubscriptionBySubscriptionId(subscription.id);
          if (existing) {
            dbServer.upsertSubscription({
              user_id: existing.user_id,
              status: 'cancelado',
            });
            console.log(`Subscription deleted: ${subscription.id} for user ${existing.user_id}`);
          }
          break;
        }

        case 'invoice.paid': {
          const invoice = event.data.object as any;
          const subscriptionId = invoice.subscription as string;
          if (subscriptionId) {
            const existing = dbServer.getSubscriptionBySubscriptionId(subscriptionId);
            if (existing) {
              dbServer.upsertSubscription({
                user_id: existing.user_id,
                status: 'ativo',
                proxima_cobranca: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              });
              console.log(`Invoice paid. Subscription marked active for sub_id: ${subscriptionId}`);
            }
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as any;
          const subscriptionId = invoice.subscription as string;
          if (subscriptionId) {
            const existing = dbServer.getSubscriptionBySubscriptionId(subscriptionId);
            if (existing) {
              dbServer.upsertSubscription({
                user_id: existing.user_id,
                status: 'inadimplente',
              });
              console.log(`Invoice payment failed. Subscription marked delinquent for sub_id: ${subscriptionId}`);
            }
          }
          break;
        }

        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error(`Error processing webhook event: ${error.message}`);
      res.status(500).json({ error: 'Failed to process webhook event' });
    }
  }
);

// Standard JSON middleware for subsequent API routes
app.use(express.json());

// Subscription Status route
app.get('/api/subscription/status/:email', (req, res) => {
  const email = req.params.email;
  if (!email) {
    res.status(400).json({ error: 'Email parameter is required' });
    return;
  }

  const sub = dbServer.getSubscriptionByUserId(email);
  if (!sub) {
    res.json({ email, status: 'inativo', subscription: null });
  } else {
    res.json({ email, status: sub.status, subscription: sub });
  }
});

// Get Stripe configuration status
app.get('/api/stripe/config', (req, res) => {
  const hasKeys = !!process.env.STRIPE_SECRET_KEY;
  res.json({
    hasRealKeys: hasKeys,
    priceAmount: 17.90,
    priceCurrency: 'BRL',
  });
});

// Create Stripe Checkout Session
app.post('/api/stripe/create-checkout-session', async (req, res): Promise<any> => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const stripe = getStripe();
  if (!stripe) {
    // Return a simulated URL if real keys are not available
    console.log(`Stripe is not configured. Falling back to sandbox checkout simulation for ${email}`);
    return res.json({
      simulated: true,
      url: `/stripe-checkout-simulation?email=${encodeURIComponent(email)}`,
    });
  }

  try {
    const origin = req.headers.origin || `http://localhost:${PORT}`;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Projeto Alpha Premium',
              description: 'Plataforma premium para ganho de massa muscular e hipertrofia',
            },
            unit_amount: 1790, // R$ 17,90
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/?stripe_checkout=success&session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}`,
      cancel_url: `${origin}/?stripe_checkout=cancelled&email=${encodeURIComponent(email)}`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create Stripe Customer Portal Session
app.post('/api/stripe/create-portal-session', async (req, res): Promise<any> => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const sub = dbServer.getSubscriptionByUserId(email);
  const stripe = getStripe();

  // If Stripe or Customer ID is missing, run simulated portal
  if (!stripe || !sub || !sub.stripe_customer_id || sub.stripe_customer_id.startsWith('cus_sim_')) {
    console.log(`Stripe is not configured or user has a simulated subscription. Falling back to sandbox portal simulation for ${email}`);
    return res.json({
      simulated: true,
      url: `/stripe-portal-simulation?email=${encodeURIComponent(email)}`,
    });
  }

  try {
    const origin = req.headers.origin || `http://localhost:${PORT}`;
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${origin}/`,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('Error creating portal session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Sandbox Simulators for flawless out-of-the-box preview testing
app.post('/api/stripe/simulate-webhook', (req, res) => {
  const { email, eventType } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required for simulation' });
    return;
  }

  const cleanEmail = email.toLowerCase().trim();
  const now = new Date();

  console.log(`[SIMULATOR] Triggering simulated webhook event: ${eventType} for ${cleanEmail}`);

  if (eventType === 'checkout.session.completed' || eventType === 'invoice.paid') {
    const customerId = `cus_sim_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const subscriptionId = `sub_sim_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const subRow = dbServer.upsertSubscription({
      user_id: cleanEmail,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: 'ativo',
      plano: 'Projeto Alpha Premium Mensal',
      valor: 17.90,
      moeda: 'BRL',
      data_inicio: now.toISOString(),
      proxima_cobranca: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    res.json({ success: true, message: 'Simulated checkout/paid complete', subscription: subRow });
  } else if (eventType === 'customer.subscription.deleted') {
    const subRow = dbServer.upsertSubscription({
      user_id: cleanEmail,
      status: 'cancelado',
    });
    res.json({ success: true, message: 'Simulated cancel complete', subscription: subRow });
  } else if (eventType === 'invoice.payment_failed') {
    const subRow = dbServer.upsertSubscription({
      user_id: cleanEmail,
      status: 'inadimplente',
    });
    res.json({ success: true, message: 'Simulated payment failed complete', subscription: subRow });
  } else {
    res.status(400).json({ error: `Unsupported simulation eventType: ${eventType}` });
  }
});

// Vite or static file serving
const startServer = async () => {
  // Ensure Leonardo's active subscription is seeded in the database on startup
  try {
    dbServer.upsertSubscription({
      user_id: 'leonardo.bma@hotmail.com',
      status: 'ativo',
      plano: 'Projeto Alpha Premium Mensal',
      valor: 17.90,
      moeda: 'BRL',
      data_inicio: new Date().toISOString(),
      proxima_cobranca: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    console.log('[SEED] Seeded active premium subscription for leonardo.bma@hotmail.com');
  } catch (err) {
    console.error('Failed to seed subscription:', err);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PROJECT ALPHA SERVER] Listening on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
