import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

export const createPayment = mutation({
	args: {
		bookingId: v.id('bookings'),
		amount: v.number(),
		paymentDate: v.string(),
		paymentType: v.string(),
		paymentIntentId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		if (args.paymentIntentId) {
		const existingPayment = await ctx.db
			.query('payments')
			.withIndex('by_paymentIntentId', (q) => q.eq('paymentIntentId', args.paymentIntentId as string))
			.first();

		if (existingPayment) {
			return { paymentId: existingPayment._id, receiptNumber: existingPayment.receiptNumber };
			}
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
			paymentIntentId: args.paymentIntentId || "paid cash",
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

export const editPayment = mutation({
	args: {
		paymentId: v.id('payments'),
		// Optional fields that can be updated
		amount: v.optional(v.number()),
		paymentDate: v.optional(v.string()),
		paymentType: v.optional(v.string()),
		paymentIntentId: v.optional(v.string()),
		bookingId: v.optional(v.id('bookings')),
	},
	handler: async (ctx, args) => {
		const existingPayment = await ctx.db.get(args.paymentId);
		
		if (!existingPayment) {
			throw new Error(`Payment with ID ${args.paymentId} does not exist.`);
		}

		// Create an update object with only the fields that were provided
		const updateFields: any = {};
		if (args.amount !== undefined) updateFields.amount = args.amount;
		if (args.paymentDate !== undefined) updateFields.paymentDate = args.paymentDate;
		if (args.paymentType !== undefined) updateFields.paymentType = args.paymentType;
		if (args.paymentIntentId !== undefined) updateFields.paymentIntentId = args.paymentIntentId;
		if (args.bookingId !== undefined) updateFields.bookingId = args.bookingId;

		// Update the payment
		await ctx.db.patch(args.paymentId, updateFields);

		// Return the updated payment
		return await ctx.db.get(args.paymentId);
	},
});

// Create a payment session
export const createPaymentSession = mutation({
	args: {
		bookingId: v.optional(v.id('bookings')),
		totalAmount: v.optional(v.number()),
		paidAmount: v.number(),
		paymentType: v.string(),
		userId: v.string(),
		subscriptionPlan: v.optional(v.string()),
		isSubscription: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		// Create a new payment session
		const sessionId = await ctx.db.insert('paymentSessions', {
			bookingId: args.bookingId,
			totalAmount: args.totalAmount,
			paidAmount: args.paidAmount,
			paymentType: args.paymentType,
			userId: args.userId,
			status: 'pending',
			createdAt: new Date().toISOString(),
			expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes expiry
			subscriptionPlan: args.subscriptionPlan,
			isSubscription: args.isSubscription || false,
		});

		return { _id: sessionId };
	},
});

// Get payment session details
export const getPaymentSession = query({
	args: { sessionId: v.id('paymentSessions') },
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.sessionId);
		
		if (!session) {
			throw new Error("Payment session not found");
		}

		// Check if session has expired
		if (new Date(session.expiresAt) < new Date()) {
			throw new Error("Payment session has expired");
		}

		// Only fetch booking details if it's not a subscription
		if (!session.isSubscription && session.bookingId) {
			const booking = await ctx.db.get(session.bookingId);
			if (!booking) {
				throw new Error("Associated booking not found");
			}
			return {
				...session,
				booking
			};
		}

		return session;
	},
});

// Update payment session status
export const updatePaymentSessionStatus = mutation({
	args: {
		sessionId: v.id('paymentSessions'),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.sessionId);
		if (!session) {
			throw new Error("Payment session not found");
		}

		await ctx.db.patch(args.sessionId, {
			status: args.status,
			updatedAt: new Date().toISOString(),
		});

		return await ctx.db.get(args.sessionId);
	},
});

// Add new mutation for creating subscriptions
export const createSubscription = mutation({
	args: {
		userId: v.string(),
		plan: v.string(),
		amount: v.number(),
		paymentSessionId: v.id('paymentSessions'),
	},
	handler: async (ctx, args) => {
		const now = new Date();
		const endDate = new Date();
		endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

		const subscriptionId = await ctx.db.insert('subscriptions', {
			userId: args.userId,
			plan: args.plan,
			status: 'active',
			startDate: now.toISOString(),
			endDate: endDate.toISOString(),
			lastPaymentDate: now.toISOString(),
			nextPaymentDate: endDate.toISOString(),
			paymentSessionId: args.paymentSessionId,
			amount: args.amount,
		});

		return { subscriptionId };
	},
});
