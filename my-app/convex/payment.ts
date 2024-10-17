import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createPayment = mutation({
	args: {
		bookingId: v.string(),
		amount: v.number(),
		paymentDate: v.string(),
		paymentType: v.string(),
	},
	handler: async (ctx, args) => {
		// Generate a unique receipt number
		const timestamp = Date.now();
		const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
		let receiptNumber = `REC-${timestamp}-${randomPart}`;

		// Check if the receipt number already exists
		let existingPayment;
		do {
			existingPayment = await ctx.db
				.query('payments')
				.withIndex('by_recieptNumber', (q) => q.eq('recieptNumber', receiptNumber))
				.first();

			if (existingPayment) {
				// If it exists, generate a new one
				receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
			}
		} while (existingPayment);

		const paymentId = await ctx.db.insert('payments', {
			recieptNumber: receiptNumber,
			bookingId: args.bookingId,
			amount: args.amount,
			paymentDate: args.paymentDate,
			paymentType: args.paymentType,
		});

		return { paymentId, receiptNumber };
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

export const getLatestPayment = query({
	handler: async (ctx) => {
		const latestPayment = await ctx.db
			.query('payments')
			.filter((q) => q.gt('_creationTime', '12:00')) // Filter payments after 12:00
			.order('desc')
			.first();
		if (!latestPayment) {
			return 0;
		}
		return latestPayment;
	},
});
