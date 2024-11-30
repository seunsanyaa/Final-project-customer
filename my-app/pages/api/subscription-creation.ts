import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();
    // Map plan IDs to Stripe price IDs
    const priceIds: { [key: string]: string } = {
      silver_elite: 'price_1Pq55dH8Z0Y55dH8Z0Y55dH8', // Replace with actual Stripe price IDs
      gold_elite: 'price_1Pq55dH8Z0Y55dH8Z0Y55dH8',
      platinum_elite: 'price_1Pq55dH8Z0Y55dH8Z0Y55dH8',
    };

    const subscription = await stripe.subscriptions.create({
      customer: userId, // Assuming you've already created a Stripe customer
      items: [{ price: priceIds[planId] }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    return NextResponse.json({
      clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
