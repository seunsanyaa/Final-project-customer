import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

export const createPayment = mutation({
	args: {
		bookingId: v.id('bookings'),
		amount: v.number(),
		paymentDate: v.string(),
		paymentType: v.string(),
		paymentIntentId: v.string(),
	},
	handler: async (ctx, args) => {
		const existingPayment = await ctx.db
			.query('payments')
			.withIndex('by_paymentIntentId', (q) => q.eq('paymentIntentId', args.paymentIntentId))
			.first();

		if (existingPayment) {
			return { paymentId: existingPayment._id, receiptNumber: existingPayment.receiptNumber };
		}

		const timestamp = Date.now();
		const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
		let receiptNumber = `REC-${timestamp}-${randomPart}`;

		let existingReceiptPayment;
		do {
			existingReceiptPayment = await ctx.db
				.query('payments')
				.withIndex('by_receiptNumber', (q) => q.eq('receiptNumber', receiptNumber))
				.first();

			if (existingReceiptPayment) {
				receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
			}
		} while (existingReceiptPayment);

		const paymentId = await ctx.db.insert('payments', {
			receiptNumber: receiptNumber,
			bookingId: args.bookingId,
			amount: args.amount,
			paymentDate: args.paymentDate,
			paymentType: args.paymentType,
			paymentIntentId: args.paymentIntentId,
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
			.withIndex('by_receiptNumber', (q) =>
				q.eq('receiptNumber', args.receiptNumber)
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
			.withIndex('by_receiptNumber', (q) =>
				q.eq('receiptNumber', args.receiptNumber)
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
