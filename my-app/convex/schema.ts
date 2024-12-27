import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		userId: v.string(),
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
		password: v.optional(v.string()),
		staff: v.optional(v.boolean()),
	})
		.index('by_userId', ['userId'])
		.index('by_email', ['email']),

	staff: defineTable({
		email: v.string(), //username is used in login
		role: v.string(),
		token: v.optional(v.string()),
		userId: v.optional(v.string()),
	}).index('by_email', ['email']),

	customers: defineTable({
		userId: v.string(),
		nationality: v.string(),
		age: v.number(),
		phoneNumber: v.string(),
		licenseNumber: v.string(),
		expirationDate: v.optional(v.string()),
		address: v.string(),
		dateOfBirth: v.string(),
		licensePicture: v.optional(v.string()),
		goldenMember: v.boolean(),
		promotions: v.optional(v.array(v.id('promotions'))),
		usedPromotions: v.optional(v.array(v.id('promotions'))),
		rewardPoints: v.number(),
		subscriptionPlan: v.optional(v.string()),
	})
		.index('by_userId', ['userId'])
		.index('by_licenseNumber', ['licenseNumber']),

	settings: defineTable({
		userId: v.string(),
		darkMode: v.boolean(),
		language: v.string(),
		notificationPreferences: v.optional(v.object({
			booking: v.boolean(),
			promotion: v.boolean(),
			payment: v.boolean(),
			rewards: v.boolean(),
			reminder: v.boolean(),
		})),
	}).index('by_userId', ['userId']),

	cars: defineTable({
		model: v.string(),
		color: v.string(),
		maker: v.string(),
		trim: v.string(),
		lastMaintenanceDate: v.string(),
		available: v.boolean(),
		year: v.number(),
		disabled: v.boolean(),
		registrationNumber: v.string(), // Unique plate number for the individual car
		pictures: v.array(v.string()), // Array of picture URLs
		pricePerDay: v.number(),
		averageRating: v.optional(v.number()),
		categories: v.optional(v.array(v.string())),
		golden: v.optional(v.boolean()),
	})
		.index('by_model', ['model'])
		.index('by_maker', ['maker'])
		.index('by_registrationNumber', ['registrationNumber']),
	// .index('by_fleetId', ['fleetId']), // Index for querying by fleetId
	specifications: defineTable({
		registrationNumber: v.string(),
		engineType: v.string(),
		engineCylinders: v.string(),
		engineHorsepower: v.string(),
		fuelType: v.string(),
		transmission: v.string(),
		drive: v.string(),
		doors: v.string(),
		bodyType: v.string(),
	})
		.index('by_registrationNumber', ['registrationNumber'])
		.index('by_bodyType', ['bodyType']),

	bookings: defineTable({
		customerId: v.string(),
		carId: v.string(),
		startDate: v.string(),
		endDate: v.string(),
		totalCost: v.number(),
		paidAmount: v.number(),
		status: v.string(),
		pickupLocation: v.string(),
		dropoffLocation: v.string(),
		reviewId: v.optional(v.string()),
		paymentType: v.optional(v.string()), // 'full' or 'installment'
		installmentPlan: v.optional(
			v.object({
				frequency: v.string(),
				totalInstallments: v.number(),
				amountPerInstallment: v.number(),
				remainingInstallments: v.number(),
				nextInstallmentDate: v.string(),
			})
		),
		extras: v.optional(
			v.object({
			insurance: v.boolean(),
			insuranceCost: v.number(),
			gps: v.boolean(),
			childSeat: v.boolean(),
			chauffer: v.boolean(),
			travelKit: v.boolean()
		}))
	})
		.index('by_customerId', ['customerId'])
		.index('by_carId', ['carId']),

	payments: defineTable({
		receiptNumber: v.string(),
		bookingId: v.optional(v.id('bookings')),
		amount: v.number(),
		paymentDate: v.string(),
		paymentType: v.string(),
		paymentIntentId: v.optional(v.string()),
		isSubscription: v.optional(v.boolean()),
	})
		.index('by_receiptNumber', ['receiptNumber'])
		.index('by_bookingId', ['bookingId'])
		.index('by_paymentIntentId', ['paymentIntentId']),

	fleets: defineTable({
		model: v.string(),
		maker: v.string(),
		year: v.number(),
		trim: v.string(),
		registrationNumber: v.array(v.string()), // Array to hold different plate numbers for the same model
		quantity: v.number(), 
	})
		.index('by_model', ['model'])
		.index('by_maker', ['maker']),

	reviews: defineTable({
		bookingId: v.id('bookings'),
		rating: v.number(),
		userId: v.string(),
		comment: v.string(),
		numberOfStars: v.number(),
		reviewDate: v.string(),
	})
		.index('by_bookingId', ['bookingId'])
		.index('by_userId', ['userId']),

	promotions: defineTable({
		promotionTitle: v.string(),
		promotionDescription: v.string(),
		promotionImage: v.string(),
		promotionType: v.union(
			v.literal('discount'),
			v.literal('offer'),
			v.literal('upgrade'),
			v.literal('permenant')
		),
		promotionValue: v.number(),
		promotionStartDate: v.optional(v.string()),
		promotionEndDate: v.optional(v.string()),
		status: v.union(
			v.literal('active'),
			v.literal('inactive'),
			v.literal('expired'),
			v.literal('scheduled')
		),
		goldenMembersOnly: v.boolean(),
		target: v.union(v.literal('all'), v.literal('specific'), v.literal('none')),
		specificTarget: v.array(v.string()),
		minimumRentals: v.optional(v.number()),
		minimumMoneySpent: v.optional(v.number()),
	}).index('by_promotionTitle', ['promotionTitle']),

	paymentSessions: defineTable({
		bookingId: v.optional(v.id('bookings')),
		subscriptionPlan: v.optional(v.string()),
		paidAmount: v.number(),
		userId: v.string(),
		status: v.string(),
		createdAt: v.string(),
		expiresAt: v.string(),
		isSubscription: v.optional(v.boolean()),
	})
		.index('by_userId', ['userId'])
		.index('by_bookingId', ['bookingId'])
		.index('by_status', ['status']),

	subscriptions: defineTable({
		userId: v.string(),
		plan: v.string(),
		amount: v.number(),
		paymentSessionId: v.id('paymentSessions'),
		stripeSubscriptionId: v.optional(v.string()),
		status: v.string(),
		startDate: v.string(),
		endDate: v.string(),
		lastPaymentDate: v.string(),
		nextPaymentDate: v.string(),
	})
		.index('by_userId', ['userId'])
		.index('by_status', ['status']),

	messages: defineTable({
		userId: v.optional(v.string()),
		message: v.string(),
		isAdmin: v.boolean(),
		timestamp: v.string(),
	}).index('by_userId', ['userId']),

	notifications: defineTable({
		userId: v.string(),
		bookingId: v.optional(v.string()),  // Made optional
		message: v.string(),
		type: v.string(), // e.g., "new_booking", "payment", etc.
		isRead: v.boolean(),
		createdAt: v.number(),
		promotionId: v.optional(v.id('promotions')), // Add this field
	})
		.index('by_userId', ['userId'])
		.index('by_userId_and_isRead', ['userId', 'isRead']),
});
