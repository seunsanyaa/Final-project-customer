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
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    console.log('Attempting to cancel subscription:', subscriptionId);
    
    // First verify the subscription exists and is active
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (!subscription || subscription.status !== 'active') {
      return res.status(400).json({ 
        error: 'Invalid subscription or subscription not active',
        status: subscription?.status 
      });
    }

    // Cancel immediately instead of at period end
    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

    console.log('Subscription cancelled:', canceledSubscription.id, 'Status:', canceledSubscription.status);

    if (canceledSubscription.status === 'canceled') {
      res.status(200).json({ 
        message: 'Subscription cancelled successfully',
        subscriptionId: canceledSubscription.id 
      });
    } else {
      throw new Error(`Failed to cancel subscription. Status: ${canceledSubscription.status}`);
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 