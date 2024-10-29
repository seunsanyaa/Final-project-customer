import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		userId: v.string(),
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
		staff:v.optional(v.boolean()),
	})
		.index('by_userId', ['userId'])
		.index('by_email', ['email']),

	staff: defineTable({
		email: v.string(), //username is used in login
	 	role: v.string(),
	})
		.index('by_email', ['email']),

	customers: defineTable({
		userId: v.string(),
		nationality: v.string(),
		age: v.number(),
		phoneNumber: v.string(),
		licenseNumber: v.string(),
		address: v.string(),
		dateOfBirth: v.string(),
		licensePicture: v.optional(v.string()),
	})
		.index('by_userId', ['userId'])
		.index('by_licenseNumber', ['licenseNumber']),

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
		WAFdescription: v.optional(v.string()),
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
	})
		.index('by_registrationNumber', ['registrationNumber']),

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
		customerInsurancetype: v.string(),
		customerInsuranceNumber: v.string(),
		reviewId: v.optional(v.string()),
		
	})
		.index('by_customerId', ['customerId'])
		.index('by_carId', ['carId']),

	payments: defineTable({
		receiptNumber: v.string(),
		bookingId: v.id('bookings'),
		amount: v.number(),
		paymentDate: v.string(),
		paymentType: v.string(),
		paymentIntentId: v.string(),
	})
		.index('by_receiptNumber', ['receiptNumber'])
		.index('by_bookingId', ['bookingId'])
		.index('by_paymentIntentId', ['paymentIntentId']),

	fleets: defineTable({
		model: v.string(),
		maker: v.string(),
		registrationNumber: v.array(v.string()), // Array to hold different plate numbers for the same model
	})
		.index('by_model', ['model'])
		.index('by_maker', ['maker']),

	reviews:defineTable({
		bookingId: v.id('bookings'),
		rating: v.number(),
		userId: v.string(),
		comment: v.string(),
		numberOfStars: v.number(),
		reviewDate: v.string(),
	})
		.index('by_bookingId', ['bookingId'])
		.index('by_userId', ['userId']),
});

