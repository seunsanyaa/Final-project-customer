import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Create a new booking
export const createBooking = mutation({
	args: {
		customerId: v.string(),
		carId: v.string( ),
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
  
  
