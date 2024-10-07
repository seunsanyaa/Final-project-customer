import { v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getUserId } from './util';

// Get a single booking by bookingId
export const getBooking = query({
  args: { bookingId: v.string() },
  handler: async (ctx, args) => {
    const booking = await ctx.db
      .query('bookings')
      .withIndex('by_bookingId', (q) => q.eq('bookingId', args.bookingId))
      .first();

    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  },
});

// Get all bookings
export const getAllBookings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('bookings').collect();
  },
});

// Create a new booking
export const createBooking = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const bookingId = await ctx.db.insert('bookings', {
      ...args,
    });

    return bookingId;
  },
});

// Update an existing booking
export const updateBooking = mutation({
  args: {
    bookingId: v.string(),
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
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const { bookingId, ...updateFields } = args;
    const existingBooking = await ctx.db
      .query('bookings')
      .withIndex('by_bookingId', (q) => q.eq('bookingId', bookingId))
      .first();

    if (!existingBooking) {
      throw new Error('Booking not found');
    }

    await ctx.db.patch(existingBooking._id, updateFields);
    return existingBooking._id;
  },
});

// Delete a booking
export const deleteBooking = mutation({
  args: { bookingId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const bookingToDelete = await ctx.db
      .query('bookings')
      .withIndex('by_bookingId', (q) => q.eq('bookingId', args.bookingId))
      .first();

    if (!bookingToDelete) {
      throw new Error('Booking not found');
    }

    await ctx.db.delete(bookingToDelete._id);
  },
});

// Get bookings by customerId
export const getBookingsByCustomer = query({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bookings')
      .withIndex('by_customerId', (q) => q.eq('customerId', args.customerId))
      .collect();
  },
});

// Get bookings by carId
export const getBookingsByCar = query({
  args: { carId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bookings')
      .withIndex('by_carId', (q) => q.eq('carId', args.carId))
      .collect();
  },
});

// Get bookings by status
export const getBookingsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bookings')
      .filter((q) => q.eq(q.field('status'), args.status))
      .collect();
  },
});