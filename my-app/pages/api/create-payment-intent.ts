// pages/api/create-payment-intent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Make sure STRIPE_SECRET_KEY is defined
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, sessionId, email, userId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // First, get or create a Stripe customer
    let customer;
    try {
      // Try to fetch existing customer
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        // Create new customer if none exists
        customer = await stripe.customers.create({
          email: email,
          metadata: { clerkUserId: userId }
        });
      } else {
        customer = customers.data[0];
      }
    } catch (error) {
      console.error('Error managing customer:', error);
      return res.status(500).json({ error: 'Failed to manage customer' });
    }

    // Create payment intent with the customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      customer: customer.id,
      metadata: { sessionId },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
