import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createPayment = mutation({
	args: {
		receiptNumber: v.string(),
		bookingId: v.string(),
		amount: v.number(),
		paymentDate: v.string(),
		paymentType: v.string(),
	},
	handler: async (ctx, args) => {
		
		const paymentId = await ctx.db.insert('payments', {
			...args,
			recieptNumber: args.receiptNumber,
            bookingId:args.bookingId, 
            amount:args.amount,
            paymentDate:args.paymentDate,
			paymenttype: args.paymentType,    
		});
		return `Payment with ID ${paymentId} has been created.`;
	},
});

export const RefundPayment = mutation({
	args: {
		receiptNumber: v.string(),
	},
	handler: async (ctx, args) => {
		const existingPayment = await ctx.db
			.query('payments')
			.withIndex('by_recieptNumber', (q) =>
				q.eq('recieptNumber', args.receiptNumber)
			)
			.first();

		if (!existingPayment) {
			throw new Error(`Payment with receipt number ${args.receiptNumber} does not exist.`);
		}
        //{actual refund function goes here}
		await ctx.db.delete(existingPayment._id);
		return `Payment with receipt number ${args.receiptNumber} has been refunded.`;
	},
});


export const getPayment = query({
	args: {
		receiptNumber: v.string(),
	},
	handler: async (ctx, args) => {
		const payment = await ctx.db
			.query('payments')
			.withIndex('by_recieptNumber', (q) =>
				q.eq('recieptNumber', args.receiptNumber)
			)
			.first();

		if (!payment) {
			return `Payment with receipt number ${args.receiptNumber} does not exist.`;
		}

		return payment;
	},
});

export const getAllPayments = query({
	handler: async (ctx) => {
		const payments = await ctx.db.query('payments').collect();
		return payments;
	},
});

export const getAllPaymentsByBookingId = query({
	args: { bookingId: v.id('bookings') },
	handler: async (ctx, args) => {
	  return await ctx.db
		.query('payments')
		.withIndex('by_bookingId', (q) => q.eq('bookingId', args.bookingId))
		.collect();
	},
  });