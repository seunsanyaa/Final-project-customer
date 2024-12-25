import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
export const adminSearchPayment = query({
	args: {
		bookingId: v.optional(v.id('bookings')),
	},
	handler: async (ctx, args) => {
		return await ctx.db.query('payments').filter(q => q.eq(q.field('bookingId'), args.bookingId)).collect();
	}
});
export const createPayment = mutation({
	args: {
		bookingId: v.optional(v.id('bookings')),
		amount: v.number(),
		paymentDate: v.string(),
		paymentType: v.string(),
		paymentIntentId: v.optional(v.string()),
		isSubscription: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		if (args.paymentIntentId) {
			const existingPayment = await ctx.db
				.query('payments')
				.withIndex('by_paymentIntentId', (q) =>
					q.eq('paymentIntentId', args.paymentIntentId as string)
				)
				.first();

			if (existingPayment) {
				return {
					paymentId: existingPayment._id,
					receiptNumber: existingPayment.receiptNumber,
				};
			}
		}
		const timestamp = Date.now();
		const randomPart = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, '0');
		const receiptNumber = `REC-${timestamp}-${randomPart}`;

		const paymentId = await ctx.db.insert('payments', {
			receiptNumber,
			bookingId: args.bookingId,
			amount: args.amount,
			paymentDate: args.paymentDate,
			paymentType: args.paymentType,
			paymentIntentId: args.paymentIntentId,
			isSubscription: args.isSubscription || false,
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
			throw new Error(
				`Payment with receipt number ${args.receiptNumber} does not exist.`
			);
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
		if (args.paymentDate !== undefined)
			updateFields.paymentDate = args.paymentDate;
		if (args.paymentType !== undefined)
			updateFields.paymentType = args.paymentType;
		if (args.paymentIntentId !== undefined)
			updateFields.paymentIntentId = args.paymentIntentId;
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
		userId: v.string(),
		status: v.string(),
		subscriptionPlan: v.optional(v.string()),
		isSubscription: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const sessionData = {
			bookingId: args.bookingId,
			paidAmount: args.paidAmount,
			userId: args.userId,
			status: 'pending',
			createdAt: new Date().toISOString(),
			expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
			isSubscription: args.isSubscription || false,
			subscriptionPlan: args.subscriptionPlan,
		};

		const id = await ctx.db.insert('paymentSessions', sessionData);
		return { sessionId: id };
	},
});

// Get payment session details
export const getPaymentSession = query({
	args: { sessionId: v.id('paymentSessions') },
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.sessionId);

		if (!session) {
			throw new Error('Payment session not found');
		}

		// Check if session has expired
		if (new Date(session.expiresAt) < new Date()) {
			throw new Error('Payment session has expired');
		}

		// Only fetch booking details if it's not a subscription
		if (!session.isSubscription && session.bookingId) {
			const booking = await ctx.db.get(session.bookingId);
			if (!booking) {
				throw new Error('Associated booking not found');
			}
			return {
				...session,
				booking,
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
			throw new Error('Payment session not found');
		}

		await ctx.db.patch(args.sessionId, {
			status: args.status,
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

		// First, verify the payment session exists and is completed
		const paymentSession = await ctx.db.get(args.paymentSessionId);
		if (!paymentSession || paymentSession.status !== 'completed') {
			throw new Error('Invalid or incomplete payment session');
		}

		// Create the subscription
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

		// Update the customer's subscription plan
		const customer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (customer) {
			await ctx.db.patch(customer._id, {
				subscriptionPlan: args.plan,
			});
		}

		return { subscriptionId };
	},
});

export const completeSubscriptionPayment = mutation({
	args: {
		sessionId: v.id('paymentSessions'),
		userId: v.string(),
		plan: v.string(),
		amount: v.number(),
	},
	handler: async (ctx, args) => {
		// Update payment session status
		await ctx.db.patch(args.sessionId, {
			status: 'completed',
		});

		// Create subscription
		const subscriptionId = await ctx.db.insert('subscriptions', {
			userId: args.userId,
			plan: args.plan,
			status: 'active',
			startDate: new Date().toISOString(),
			endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
			lastPaymentDate: new Date().toISOString(),
			nextPaymentDate: new Date(
				Date.now() + 30 * 24 * 60 * 60 * 1000
			).toISOString(),
			paymentSessionId: args.sessionId,
			amount: args.amount,
		});

		return { subscriptionId };
	},
});

export const deletePaymentSession = mutation({
	args: {
		sessionId: v.id('paymentSessions'),
	},
	handler: async (ctx, args) => {
		// Check if the session exists
		const session = await ctx.db.get(args.sessionId);
		if (!session) {
			throw new Error('Payment session not found');
		}

		// Delete the session
		await ctx.db.delete(args.sessionId);

		return { status: 'success' };
	},
});

export const getWeeklyPayments = query({
	args: {
		startDate: v.string(), // ISO date string
		endDate: v.string(), // ISO date string
	},
	handler: async (ctx, args) => {
		const payments = await ctx.db
			.query('payments')
			.filter((q) =>
				q.and(
					q.gte(
						q.field('paymentDate'),
						new Date(args.startDate).getTime().toString()
					),
					q.lte(
						q.field('paymentDate'),
						new Date(args.endDate).getTime().toString()
					)
				)
			)
			.collect();

		// Group payments by week
		const weeklyPayments = payments.reduce(
			(acc, payment) => {
				const weekStart = new Date(payment.paymentDate);
				weekStart.setHours(0, 0, 0, 0);
				weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to start of week (Sunday)

				const weekKey = weekStart.toISOString().split('T')[0];

				if (!acc[weekKey]) {
					acc[weekKey] = 0;
				}
				acc[weekKey] += payment.amount;

				return acc;
			},
			{} as Record<string, number>
		);

		// Convert to array format for easier charting
		return Object.entries(weeklyPayments).map(([week, total]) => ({
			week,
			total,
		}));
	},
});

export const getWeeklyPaymentStats = query({
	handler: async (ctx) => {
		const payments = await ctx.db.query('payments').collect();

		// Create a map to store counts by week
		const weeklyStats = new Map<string, number>();

		payments.forEach((payment) => {
			const date = new Date(payment.paymentDate);
			// Get the week number (1-52)
			const weekNumber = getWeekNumber(date);
			// Create a key in format "YYYY-WW"
			const weekKey = `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
			weeklyStats.set(weekKey, (weeklyStats.get(weekKey) || 0) + 1);
		});

		// Convert to format needed for ResponsiveLine
		const data = [
			{
				id: 'weekly-payment-counts',
				data: Array.from(weeklyStats.entries())
					.sort(([weekA], [weekB]) => weekA.localeCompare(weekB))
					.map(([x, y]) => ({
						x,
						y,
					})),
			},
		];

		return data;
	},
});

// Helper function to get week number
function getWeekNumber(date: Date): number {
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export const getDailyPaymentStats = query({
	handler: async (ctx) => {
		const payments = await ctx.db.query('payments').collect();

		// Create a map to store total amounts by day
		const dailyStats = new Map<string, number>();

		payments.forEach((payment) => {
			const date = new Date(payment.paymentDate);
			const dayKey = date.toISOString().split('T')[0];
			// Sum up the amounts instead of counting
			dailyStats.set(dayKey, (dailyStats.get(dayKey) || 0) + payment.amount);
		});

		// Convert to format needed for ResponsiveLine
		const data = Array.from(dailyStats.entries())
			.sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
			.map(([x, y]) => ({
				x,
				y,
			}));

		return data;
	},
});
