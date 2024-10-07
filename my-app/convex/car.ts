import { v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getUserId } from './util';

// Get a single car by carId
export const getCar = query({
  args: { carId: v.string() },
  handler: async (ctx, args) => {
    const car = await ctx.db
      .query('cars')
      .withIndex('by_carId', (q) => q.eq('carId', args.carId))
      .first();

    if (!car) {
      throw new Error('Car not found');
    }

    return car;
  },
});

// Get all cars
export const getAllCars = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('cars').collect();
  },
});

// Create a new car
export const createCar = mutation({
  args: {
    carId: v.string(),
    model: v.string(),
    make: v.string(),
    year: v.number(),
    color: v.string(),
    registrationNumber: v.string(),
    availability: v.boolean(),
    disabled: v.boolean(),
    lastMaintenanceDate: v.string(),
    companyInsurance: v.string(),
    seatNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const carId = await ctx.db.insert('cars', {
      ...args,
    });

    return carId;
  },
});

// Update an existing car
export const updateCar = mutation({
  args: {
    carId: v.string(),
    model: v.optional(v.string()),
    make: v.optional(v.string()),
    year: v.optional(v.number()),
    color: v.optional(v.string()),
    registrationNumber: v.optional(v.string()),
    availability: v.optional(v.boolean()),
    disabled: v.optional(v.boolean()),
    lastMaintenanceDate: v.optional(v.string()),
    companyInsurance: v.optional(v.string()),
    seatNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const { carId, ...updateFields } = args;
    const existingCar = await ctx.db
      .query('cars')
      .withIndex('by_carId', (q) => q.eq('carId', carId))
      .first();

    if (!existingCar) {
      throw new Error('Car not found');
    }

    await ctx.db.patch(existingCar._id, updateFields);
    return existingCar._id;
  },
});

// Delete a car
export const deleteCar = mutation({
  args: { carId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const carToDelete = await ctx.db
      .query('cars')
      .withIndex('by_carId', (q) => q.eq('carId', args.carId))
      .first();

    if (!carToDelete) {
      throw new Error('Car not found');
    }

    await ctx.db.delete(carToDelete._id);
  },
});

// Search cars by make or model
export const searchCars = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const carsByMake = await ctx.db
      .query('cars')
      .withIndex('by_maker', (q) => q.eq('make', args.searchTerm))
      .collect();

    const carsByModel = await ctx.db
      .query('cars')
      .withIndex('by_model', (q) => q.eq('model', args.searchTerm))
      .collect();

    return [...carsByMake, ...carsByModel];
  },
});

// Get available cars
export const getAvailableCars = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('cars')
      .filter((q) => q.eq(q.field('availability'), true))
      .collect();
  },
});