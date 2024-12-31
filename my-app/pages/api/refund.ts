import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { ConvexHttpClient } from "convex/browser";
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bookingId, userId } = req.body;

    if (!bookingId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      // 1. Find all payments for this booking using Convex client
      const payments = await convex.query(api.payment.getAllPaymentsByBookingId, { bookingId: bookingId as Id<"bookings"> });
      console.log('Found payments:', payments);

      // If no payments found, return a specific status code
      if (!payments || payments.length === 0) {
        return res.status(202).json({ 
          message: 'no_payment_found',
          success: true 
        });
      }

      // 2. Process refunds for each payment that has a paymentIntentId
      const validPayments = payments.filter((payment: any) => payment.paymentIntentId);

      // If no valid payment intents found, return the same status
      if (validPayments.length === 0) {
        return res.status(202).json({ 
          message: 'no_payment_found',
          success: true 
        });
      }

      const refundPromises = validPayments.map(async (payment: any) => {
        try {
          const refund = await stripe.refunds.create({
            payment_intent: payment.paymentIntentId,
            reason: 'requested_by_customer',
          });
          console.log('Refund processed:', refund);
          
          // Call the RefundPayment mutation for each payment
          await convex.mutation(api.payment.RefundPayment, { 
            receiptNumber: payment.receiptNumber 
          });
          
          return refund;
        } catch (refundError) {
          console.error('Error processing individual refund:', refundError);
          throw refundError;
        }
      });

      const refunds = await Promise.all(refundPromises);

      // 3. Return the refund details
      return res.status(200).json({
        success: true,
        refunds: refunds,
        totalRefunded: refunds.reduce((sum, refund) => sum + refund.amount, 0) / 100
      });

    } catch (innerError) {
      console.error('Inner error:', innerError);
      throw innerError;
    }

  } catch (error) {
    console.error('Refund error:', error);
    return res.status(500).json({ 
      error: 'Error processing refund',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 