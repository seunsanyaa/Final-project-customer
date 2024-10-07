import { v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getUserId } from './util';

// Get a single payment by receiptNumber
export const getPayment = query({
  args: { receiptNumber: v.string() },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query('payments')
      .withIndex('by_recieptNumber', (q) => q.eq('recieptNumber', args.receiptNumber))
      .first();

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  },
});

// Get all payments
export const getAllPayments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('payments').collect();
  },
});

// Create a new payment
export const createPayment = mutation({
  args: {
    recieptNumber: v.string(),
    bookingId: v.string(),
    amount: v.number(),
    paymentDate: v.string(),
    paymenttype: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const paymentId = await ctx.db.insert('payments', {
      ...args,
    });

    return paymentId;
  },
});

// Update an existing payment
export const updatePayment = mutation({
  args: {
    recieptNumber: v.string(),
    bookingId: v.optional(v.string()),
    amount: v.optional(v.number()),
    paymentDate: v.optional(v.string()),
    paymenttype: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const { recieptNumber, ...updateFields } = args;
    const existingPayment = await ctx.db
      .query('payments')
      .withIndex('by_recieptNumber', (q) => q.eq('recieptNumber', recieptNumber))
      .first();

    if (!existingPayment) {
      throw new Error('Payment not found');
    }

    await ctx.db.patch(existingPayment._id, updateFields);
    return existingPayment._id;
  },
});

// Delete a payment
export const deletePayment = mutation({
  args: { recieptNumber: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const paymentToDelete = await ctx.db
      .query('payments')
      .withIndex('by_recieptNumber', (q) => q.eq('recieptNumber', args.recieptNumber))
      .first();

    if (!paymentToDelete) {
      throw new Error('Payment not found');
    }

    await ctx.db.delete(paymentToDelete._id);
  },
});

// Get payments by bookingId
export const getPaymentsByBooking = query({
  args: { bookingId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('payments')
      .withIndex('by_bookingId', (q) => q.eq('bookingId', args.bookingId))
      .collect();
  },
});