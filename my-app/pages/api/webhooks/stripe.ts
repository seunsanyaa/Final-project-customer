import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const sessionId = paymentIntent.metadata.sessionId;

      try {
        // Get payment session
        const session = await convex.query(api.payment.getPaymentSession, { 
          sessionId: sessionId as Id<"paymentSessions">
        });

        if (!session) {
          throw new Error('Payment session not found');
        }

        // Fetch the booking details using the bookingId
        const booking = await convex.query(api.bookings.getBooking, {
          id: session.bookingId as Id<"bookings">
        });

        // Create payment record
        await convex.mutation(api.payment.createPayment, {
          bookingId: session.bookingId,
          amount: session.paidAmount,
          paymentDate: new Date().toISOString(),
          paymentType: session.paymentType,
          paymentIntentId: paymentIntent.id,
        });

        // Update booking status
        const newPaidAmount = (booking?.paidAmount || 0) + session.paidAmount;
        let newStatus = booking?.status || 'pending';

        if (newStatus === 'pending') {
          newStatus = 'inprogress';
        } else if (newPaidAmount >= (booking?.totalCost || 0)) {
          newStatus = 'completed';
        }

        await convex.mutation(api.bookings.updateBooking, {
          id: session.bookingId as Id<"bookings">,
          status: newStatus,
          paidAmount: Math.ceil(newPaidAmount * 100) / 100,
        });

        // Mark session as completed and delete it
        await convex.mutation(api.payment.updatePaymentSessionStatus, {
          sessionId: sessionId as Id<"paymentSessions">,
          status: 'completed',
        });

        await convex.mutation(api.payment.deletePaymentSession, {
          sessionId: sessionId as Id<"paymentSessions">,
        });
      } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ error: 'Failed to process webhook' });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Failed to handle webhook' });
  }
} 