import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

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
    const { planId, email, sessionId } = req.body;

    // Debug logging
    console.log('Starting subscription creation:', { planId, email, sessionId });
    console.log('Environment variables:', {
      silverPrice: process.env.STRIPE_SILVER_ELITE_PRICE_ID,
      goldPrice: process.env.STRIPE_GOLD_ELITE_PRICE_ID,
      platinumPrice: process.env.STRIPE_PLATINUM_ELITE_PRICE_ID,
    });

    const priceIds: { [key: string]: string } = {
      silver_elite: process.env.STRIPE_SILVER_ELITE_PRICE_ID!,
      gold_elite: process.env.STRIPE_GOLD_ELITE_PRICE_ID!,
      platinum_elite: process.env.STRIPE_PLATINUM_ELITE_PRICE_ID!,
    };

    if (!priceIds[planId]) {
      console.error('Invalid plan ID:', planId);
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Create or get customer
    let customer;
    try {
      const existingCustomers = await stripe.customers.list({ email });
      customer = existingCustomers.data.length > 0 
        ? existingCustomers.data[0] 
        : await stripe.customers.create({ email });
      
      console.log('Customer:', { id: customer.id, email: customer.email });
    } catch (error) {
      console.error('Error handling customer:', error);
      return res.status(500).json({ error: 'Failed to process customer' });
    }

    // Create a subscription
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceIds[planId] }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        metadata: {
          sessionId: sessionId,
        },
        expand: ['latest_invoice.payment_intent'],
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      console.log('Subscription created:', { 
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret?.slice(0, 10) + '...'
      });

      return res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });

    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ error: 'Failed to create subscription' });
    }

  } catch (error) {
    console.error('Subscription creation error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}