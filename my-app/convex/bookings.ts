import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';

// Create a new booking
export const createBooking = mutation({
	args: {
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
	},
	handler: async (ctx, args) => {
		const bookingId = await ctx.db.insert('bookings', args);
		return bookingId;
	},
});

// Read a booking by ID
export const getBooking = query({
	args: { id: v.id('bookings') },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

// Read all bookings
export const getAllBookings = query({
	handler: async (ctx) => {
		return await ctx.db.query('bookings').collect();
	},
});

// Update a booking
export const updateBooking = mutation({
	args: {
		id: v.id('bookings'),
		customerId: v.optional(v.id('customers')),
		carId: v.optional(v.id('cars')),
		startDate: v.optional(v.string()),
		endDate: v.optional(v.string()),
		totalCost: v.optional(v.number()),
		paidAmount: v.optional(v.number()),
		status: v.optional(v.string()),
		pickupLocation: v.optional(v.string()),
		dropoffLocation: v.optional(v.string()),
		customerInsurancetype: v.optional(v.string()),
		customerInsuranceNumber: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;
		await ctx.db.patch(id, updates);
		return id;
	},
});

// Delete a booking
export const deleteBooking = mutation({
	args: { id: v.id('bookings') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
		return args.id;
	},
});

// Get bookings by customer ID
export const getBookingsByCustomer = query({
	// Validate the customerId argument against the 'bookings' table
	args: { customerId: v.string() },  // Use string validation for customerId
	handler: async (ctx, args) => {
		// Fetch all bookings for the given customerId
		const bookings = await ctx.db
			.query('bookings')
			.withIndex('by_customerId', (q) => q.eq('customerId', args.customerId))
			.collect();

		// Fetch car details for each booking where carId matches registrationNumber
		const bookingsWithCarDetails = await Promise.all(
			bookings.map(async (booking) => {
				const car = await ctx.db
					.query('cars')
					.withIndex('by_registrationNumber', (q) =>
						q.eq('registrationNumber', booking.carId)
					)
					.first();

				return {
					...booking,
					carDetails: car
						? `${car.maker} ${car.model} (${car.year})`
						: 'Not available',
					make: car?.maker || 'Not available',
					model: car?.model || 'Not available',
					color: car?.color || 'Not available',
					trim: car?.trim || 'Not available',
					customerName: 'Not available', // You can fetch and include customer details similarly
					rewardsPointsUsed: 0, // Update as per your business logic
					rewardsPointsCredited: 'Not available', // Update as needed
					cancellationPolicy: 'Standard 24-hour cancellation policy applies', // Update if different
				};
			})
		);

		return bookingsWithCarDetails;
	},
});
  
  

// Get bookings by car ID
export const getBookingsByCar = query({
	args: { carId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('bookings')
			.withIndex('by_carId', (q) => q.eq('carId', args.carId))
			.collect();
	},
});



// Add this new query
export const getBookingDetails = query({
	args: { bookingId: v.id('bookings') },
	handler: async (ctx, args) => {
		const booking = await ctx.db.get(args.bookingId);
		if (!booking) {
			throw new Error(`Booking with ID ${args.bookingId} not found.`);
		}

		const car = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', (q) => q.eq('registrationNumber', booking.carId))
			.first();

		const payments = await ctx.db
			.query('payments')
			.withIndex('by_bookingId', (q) => q.eq('bookingId', args.bookingId))
			.collect();

		const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

		return {
			...booking,
			carDetails: car ? `${car.maker} ${car.model} (${car.year})` : 'Not available',
			make: car?.maker,
			model: car?.model,
			color: car?.color,
			trim: car?.trim,
			customerName: 'Not available',
			totalPaid,
			rewardsPointsEarned: Math.floor(booking.totalCost * 0.1),
			rewardsPointsUsed: 0,
			rewardsPointsCredited: 'Not available',
			cancellationPolicy: 'Standard 24-hour cancellation policy applies',
		};
	},
});

// Update booking with total paid amount
export const updateBookingWithTotalPaid = mutation({
	args: {
		id: v.id('bookings'), // Booking ID
	},
	handler: async (ctx, args) => {
		// Manually call the query to fetch payments by booking ID
		const payments = await ctx.db
			.query('payments')
			.withIndex('by_bookingId', (q) => q.eq('bookingId', args.id))
			.collect();
  
		// Handle case where no payments exist
		if (!payments || payments.length === 0) {
			return `No payments found for booking ID ${args.id}.`;
		}
  
		// Sum the paid amounts
		const totalPaidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
		// Update the booking with the new total paid amount
		await ctx.db.patch(args.id, { paidAmount: totalPaidAmount });
  
		return `Booking with ID ${args.id} has been updated with total paid amount: ${totalPaidAmount}.`;
	},
});

// Get car by car ID
export const getCarByCarId = query({
	args: { carId: v.string() },
	handler: async (ctx, args) => {
		
		const car = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', (q) => q.eq('registrationNumber', args.carId))
			.first();

		if (!car) {
			throw new Error(`Car with registration number ${args.carId} not found.`);
		}

		return car;
	},
});
