import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
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
    console.log('Request body:', { planId, email, sessionId });

    // Validate inputs
    if (!planId || !email || !sessionId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { planId, email, sessionId }
      });
    }

    // Validate price ID exists
    const priceId = process.env[`STRIPE_${planId.toUpperCase()}_PRICE_ID`];
    if (!priceId) {
      return res.status(400).json({ 
        error: 'Invalid plan ID',
        message: `No price ID found for plan: ${planId}`,
        availableEnvVars: Object.keys(process.env).filter(key => key.includes('STRIPE_') && key.includes('PRICE_ID'))
      });
    }

    console.log('Using price ID:', priceId);

    // Get or create customer
    let customer;
    try {
      const customers = await stripe.customers.list({ email, limit: 1 });
      customer = customers.data.length > 0 
        ? customers.data[0] 
        : await stripe.customers.create({ email });
      console.log('Customer:', customer.id);
    } catch (error) {
      console.error('Customer creation/retrieval error:', error);
      throw error;
    }

    // Create the subscription
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { 
          save_default_payment_method: 'on_subscription',
          payment_method_types: ['card']
        },
        metadata: { sessionId },
        expand: ['latest_invoice.payment_intent']
      });

      console.log('Subscription created:', subscription.id);

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      return res.status(200).json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Stripe subscription creation error:', error);
      throw error;
    }

  } catch (error) {
    console.error('Detailed subscription creation error:', error);
    return res.status(500).json({ 
      error: 'Failed to create subscription',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
    });
  }
}
