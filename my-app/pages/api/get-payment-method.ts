import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { payment_intent } = req.query;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent as string);
    const paymentMethodType = paymentIntent.payment_method_options?.card ? 'card' : 'Paypal';

    return res.status(200).json({ paymentMethodType });
  } catch (error) {
    console.error('Error retrieving payment method:', error);
    return res.status(500).json({ message: 'Error retrieving payment method' });
  }
} 