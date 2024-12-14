import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.body;
    
    // First try to find customer by metadata
    const customers = await stripe.customers.list({
      limit: 100 // Increase limit to ensure we find the customer
    });

    const customer = customers.data.find(cust => cust.metadata.userId === userId);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    });

    const subscription = subscriptions.data[0];
    
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    res.status(200).json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
} 