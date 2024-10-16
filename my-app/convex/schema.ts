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
	})
		.index('by_userId', ['userId'])
		.index('by_licenseNumber', ['licenseNumber']),

	cars: defineTable({
		model: v.string(),
		color: v.string(),
		maker: v.string(),
		lastMaintenanceDate: v.string(),
		available: v.boolean(),
		year: v.number(),
		disabled: v.boolean(),
		registrationNumber: v.string(), // Unique plate number for the individual car
		pictures: v.array(v.string()), // Array of picture URLs
		pricePerDay: v.number(),
	})
		.index('by_model', ['model'])
		.index('by_maker', ['maker'])
		.index('by_registrationNumber', ['registrationNumber']),
	// .index('by_fleetId', ['fleetId']), // Index for querying by fleetId

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
	})
		.index('by_customerId', ['customerId'])
		.index('by_carId', ['carId']),

	payments: defineTable({
		recieptNumber: v.string(),
		bookingId: v.string(),
		amount: v.number(),
		paymentDate: v.string(),
		paymentType: v.string(),
	})
		.index('by_recieptNumber', ['recieptNumber'])
		.index('by_bookingId', ['bookingId']),

	fleets: defineTable({
		model: v.string(),
		maker: v.string(),
		registrationNumber: v.array(v.string()), // Array to hold different plate numbers for the same model
	})
		.index('by_model', ['model'])
		.index('by_maker', ['maker']),
});

// 	bookings: defineTable({
// 		bookingId: v.string(),
// 		customerId: v.string(),
// 		carId: v.string(),
// 		startDate: v.string(),
// 		endDate: v.string(),
// 		totalCost: v.number(),
// 		paidAmount: v.number(),
// 		status: v.string(),
// 		pickupLocation: v.string(),
// 		dropoffLocation: v.string(),
// 		customerInsurancetype: v.string(),
// 		customerInsuranceNumber: v.string(),
// 	})
// 		.index('by_bookingId', ['bookingId'])
// 		.index('by_customerId', ['customerId'])
// 		.index('by_carId', ['carId']),

// 	payments: defineTable({
// 		recieptNumber: v.string(),
// 		bookingId: v.string(),
// 		amount: v.number(),
// 		paymentDate: v.string(),
// 		paymenttype: v.string(),
// 	})
// 		.index('by_recieptNumber', ['recieptNumber'])
// 		.index('by_bookingId', ['bookingId']),

// 	reviews: defineTable({
// 		reviewId: v.string(),
// 		bookingId: v.string(),
// 		rating: v.number(),
// 		comment: v.string(),
// 		reviewDate: v.string(),
// 	})
// 		.index('by_reviewId', ['reviewId'])
// 		.index('by_bookingId', ['bookingId']),

// 	maintenance: defineTable({
// 		maintenanceId: v.string(),
// 		carId: v.string(),
// 		maintenanceDate: v.string(),
// 		description: v.string(),
// 		cost: v.number(),
// 	})
// 		.index('by_maintenanceId', ['maintenanceId'])
// 		.index('by_carId', ['carId']),

// 	insurance: defineTable({
// 		insuranceId: v.string(),
// 		carId: v.string(),
// 		provider: v.string(),
// 		policyNumber: v.string(),
// 		startDate: v.string(),
// 		endDate: v.string(),
// 		coverage: v.string(),
// 	})
// 		.index('by_insuranceId', ['insuranceId'])
// 		.index('by_carId', ['carId']),
// 	promotion: defineTable({
// 		promotionId: v.string(),
// 		discount: v.number(),
// 		demographic: v.string(),
// 	}).index('by_promotionId', ['promotionId']),
// 	analyticalreport: defineTable({
// 		reportId: v.string(),
// 		reportDate: v.string(),
// 		reportTitle: v.string(),
// 		reportContent: v.string(),
// 	}).index('by_reportId', ['reportId']),
// });
