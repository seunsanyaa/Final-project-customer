import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment Intent ID is required' });
    }

    // Get the payment intent first
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Get the latest invoice from the payment intent
    if (!paymentIntent.invoice) {
      return res.status(404).json({ error: 'No invoice found for this payment' });
    }

    // Get the invoice to find the subscription
    const invoice = await stripe.invoices.retrieve(paymentIntent.invoice as string);
    
    if (!invoice.subscription) {
      return res.status(404).json({ error: 'No subscription found for this invoice' });
    }

    // Get the subscription
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.status(200).json({ stripeSubscriptionId: subscription.id });
  } catch (error) {
    console.error('Error fetching Stripe subscription:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
} 