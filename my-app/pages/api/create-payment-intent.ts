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
    const { amount, sessionId } = req.body;

    // Add better error handling
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Convert amount to cents (Stripe expects amounts in smallest currency unit)
    

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      metadata: {
        sessionId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Log success for debugging
    console.log('Payment intent created successfully:', paymentIntent.id);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Improved error logging
    console.error('Error creating payment intent:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      body: req.body,
    });

    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
