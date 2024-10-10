import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

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
		customerId: v.optional(v.string()),
		carId: v.optional(v.string()),
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
	args: { customerId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('bookings')
			.withIndex('by_customerId', (q) => q.eq('customerId', args.customerId))
			.collect();
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
