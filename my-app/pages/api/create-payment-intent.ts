// pages/api/create-payment-intent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Make sure STRIPE_SECRET_KEY is defined
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-10-28.acacia',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, sessionId, type, planId } = req.body;

    // First, get or create a Stripe customer
    let customer;
    try {
      // Try to fetch existing customer
      customer = await stripe.customers.list({
        email: sessionId,
        limit: 1,
      });

      if (customer.data.length === 0) {
        // Create new customer if none exists
        customer = await stripe.customers.create({
          email: sessionId,
          metadata: {
            clerkUserId: sessionId,
          },
        });
      } else {
        customer = customer.data[0];
      }
    } catch (error) {
      console.error('Error managing customer:', error);
      return res.status(500).json({ error: 'Failed to manage customer' });
    }

    if (type === 'subscription') {
      // Handle subscription payment
      const priceIds: { [key: string]: string } = {
        silver_elite: process.env.STRIPE_PRICE_SILVER!,
        gold_elite: process.env.STRIPE_PRICE_GOLD!,
        platinum_elite: process.env.STRIPE_PRICE_PLATINUM!,
      };

      if (!priceIds[planId]) {
        return res.status(400).json({ error: `Invalid plan ID: ${planId}` });
      }

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceIds[planId] }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return res.status(200).json({
        clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
      });
    } else {
      // Handle regular one-time payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: { sessionId },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    }
  } catch (error) {
    console.error('Payment intent creation error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      body: req.body,
    });

    return res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
