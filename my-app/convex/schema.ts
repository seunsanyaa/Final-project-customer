import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		userId: v.string(),
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
		password: v.string(), // Added password field
		role: v.string(), // Added role field
		phoneNumber: v.string(), // Added phoneNumber field
	})
		.index('by_userId', ['userId'])
		.index('by_email', ['email']),
		staff: defineTable({
			userId: v.string(),
			username: v.string(),
			password: v.string(),
		})
			.index('by_userId', ['userId'])
			.index('by_username', ['username']),
	
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
		carId: v.string(),
		model: v.string(),
		make: v.string(),
		year: v.number(), // Added year field
		color: v.string(), // Added color field
		registrationNumber: v.string(), // Added registrationNumber field
		availability: v.boolean(), // Added availability field
		disabled: v.boolean(), // Added disabled field
		lastMaintenanceDate: v.string(), // Added lastMaintenanceDate field
		companyInsurance: v.string(), // Added companyInsurance field
		seatNumber: v.number(), // Added seatNumber field
	})
		.index('by_carId', ['carId'])
		.index('by_model', ['model'])
		.index('by_maker', ['make']),

	// New tables based on the diagram

	bookings: defineTable({
		bookingId: v.string(),
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
		.index('by_bookingId', ['bookingId'])
		.index('by_customerId', ['customerId'])
		.index('by_carId', ['carId']),

	payments: defineTable({
		recieptNumber: v.string(),
		bookingId: v.string(),
		amount: v.number(),
		paymentDate: v.string(),
		paymenttype: v.string(),
	})
		.index('by_recieptNumber', ['recieptNumber'])
		.index('by_bookingId', ['bookingId']),

	reviews: defineTable({
		reviewId: v.string(),
		bookingId: v.string(),
		rating: v.number(),
		comment: v.string(),
		reviewDate: v.string(),
	})
		.index('by_reviewId', ['reviewId'])
		.index('by_bookingId', ['bookingId']),

	maintenance: defineTable({
		maintenanceId: v.string(),
		carId: v.string(),
		maintenanceDate: v.string(),
		description: v.string(),
		cost: v.number(),
	})
		.index('by_maintenanceId', ['maintenanceId'])
		.index('by_carId', ['carId']),

	insurance: defineTable({
		insuranceId: v.string(),
		carId: v.string(),
		provider: v.string(),
		policyNumber: v.string(),
		startDate: v.string(),
		endDate: v.string(),
		coverage: v.string(),
	})
		.index('by_insuranceId', ['insuranceId'])
		.index('by_carId', ['carId']),
	promotion: defineTable({
	promotionId: v.string(),
	discount: v.number(),
	demographic: v.string(),
	})
		.index('by_promotionId', ['promotionId']),
		analyticalreport: defineTable({
			reportId: v.string(),
			reportDate: v.string(),
			reportTitle: v.string(),
			reportContent: v.string(),
			})
				.index('by_reportId', ['reportId']),
});
