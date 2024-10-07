import { Description } from '@radix-ui/react-toast';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		userId: v.string(),
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),//customers use emails to login but not staff
		password: v.string(), // Added password field
		role: v.string(), // Added role field
		phoneNumber: v.string(), // Added phoneNumber field
	})
		.index('by_userId', ['userId'])
		.index('by_email', ['email']),
		staff: defineTable({
			userId: v.string(),
			username: v.string(),//username is used in login
			password: v.string(),
			salary:v.number(),//used in case we need to calculate salary for profit statistics
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
		year: v.number(), // Added year created field
		color: v.string(), // Added color field
		registrationNumber: v.string(), // Added registrationNumber field
		availability: v.boolean(), // Added availability field(booked or not)
		disabled: v.boolean(), // Added disabled field(disability vehicle or not)
		lastMaintenanceDate: v.string(), // Added lastMaintenanceDate field
		companyInsurance: v.string(), // Added companyInsurance field
		fleetId: v.string(), // Reference to the fleet this car belongs to

	})
		.index('by_carId', ['carId'])
		.index('by_model', ['model'])
		.index('by_maker', ['make'])
		.index('by_fleetId', ['fleetId']),
		 // Index for querying by fleetId
		disabledCars: defineTable({
			type: v.string(),// designates if car is drivable by disabled people or just is disability friendly (allows for wheelchair passengers etc) 
			carId: v.string(),
			fleetid: v.string(),	
			description: v.string(),
	
		})
			.index('by_type', ['type'])
			.index('by_carId', ['carId']),
	// New tables based on the diagram
	fleets: defineTable({
		fleetId: v.string(),
		model: v.string(),
		maker: v.string(),
		plateNumbers: v.array(v.string()), // Array to hold different plate numbers for the same model
	})
		.index('by_fleetId', ['fleetId'])
		.index('by_model', ['model'])
		.index('by_maker', ['maker']),

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
