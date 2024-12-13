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
    const { amount, sessionId, email, installmentPlan } = req.body;

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
        });
      } else {
        customer = customers.data[0];
      }
    } catch (error) {
      console.error('Error managing customer:', error);
      return res.status(500).json({ error: 'Failed to manage customer' });
    }

    if (installmentPlan) {
      // Create a subscription for installment payments
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(installmentPlan.amountPerInstallment * 100),
            recurring: {
              interval: installmentPlan.frequency,
              interval_count: 1
            },
            product: `Car Rental Installment Payment - ${sessionId}`,
          },
        }],
        metadata: { sessionId, isInstallment: 'true' },
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;

      return res.status(200).json({
        clientSecret: payment_intent.client_secret,
        subscriptionId: subscription.id
      });
    } else {
      // Regular one-time payment
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
    }

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
