import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId, userId, planId } = req.body;

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      metadata: {
        userId,
        planId
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating subscription metadata:', error);
    res.status(500).json({ error: 'Failed to update subscription metadata' });
  }
} 