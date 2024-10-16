// pages/api/create-payment-intent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body; // Extract amount from request body

      // Create a PaymentIntent with the order amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // amount should be in the smallest currency unit (e.g., cents for USD)
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Send the clientSecret to the client
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
