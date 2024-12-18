import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    // Find customer by metadata
    const customers = await stripe.customers.list({
      limit: 100,
      expand: ['data.default_source'],
    });
    
    const customer = customers.data.find(cust => cust.metadata.clerkUserId === userId);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    if (req.method === 'GET') {
      // Get all payment methods for the customer
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card'
      });

      return res.status(200).json({
        paymentMethods: paymentMethods.data,
        defaultPaymentMethod: customer.default_source
      });
    }

    if (req.method === 'DELETE') {
      const { paymentMethodId } = req.body;
      
      // Detach the payment method from the customer
      await stripe.paymentMethods.detach(paymentMethodId);
      
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Error handling payment methods:', error);
    res.status(500).json({ error: 'Failed to handle payment methods' });
  }
} 