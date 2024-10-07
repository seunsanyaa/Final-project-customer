import { v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getUserId } from './util';

// Get a single insurance by insuranceId
export const getInsurance = query({
  args: { insuranceId: v.string() },
  handler: async (ctx, args) => {
    const insurance = await ctx.db
      .query('insurance')
      .withIndex('by_insuranceId', (q) => q.eq('insuranceId', args.insuranceId))
      .first();

    if (!insurance) {
      throw new Error('Insurance not found');
    }

    return insurance;
  },
});

// Get all insurance records
export const getAllInsurance = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('insurance').collect();
  },
});

// Create a new insurance record
export const createInsurance = mutation({
  args: {
    insuranceId: v.string(),
    carId: v.string(),
    provider: v.string(),
    policyNumber: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    coverage: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const insuranceId = await ctx.db.insert('insurance', {
      ...args,
    });

    return insuranceId;
  },
});

// Update an existing insurance record
export const updateInsurance = mutation({
  args: {
    insuranceId: v.string(),
    carId: v.optional(v.string()),
    provider: v.optional(v.string()),
    policyNumber: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    coverage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const { insuranceId, ...updateFields } = args;
    const existingInsurance = await ctx.db
      .query('insurance')
      .withIndex('by_insuranceId', (q) => q.eq('insuranceId', insuranceId))
      .first();

    if (!existingInsurance) {
      throw new Error('Insurance not found');
    }

    await ctx.db.patch(existingInsurance._id, updateFields);
    return existingInsurance._id;
  },
});

// Delete an insurance record
export const deleteInsurance = mutation({
  args: { insuranceId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const insuranceToDelete = await ctx.db
      .query('insurance')
      .withIndex('by_insuranceId', (q) => q.eq('insuranceId', args.insuranceId))
      .first();

    if (!insuranceToDelete) {
      throw new Error('Insurance not found');
    }

    await ctx.db.delete(insuranceToDelete._id);
  },
});

// Get insurance records by carId
export const getInsuranceByCarId = query({
  args: { carId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('insurance')
      .withIndex('by_carId', (q) => q.eq('carId', args.carId))
      .collect();
  },
});

// Get active insurance records (where current date is between startDate and endDate)
export const getActiveInsurance = query({
  args: {},
  handler: async (ctx) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    return await ctx.db
      .query('insurance')
      .filter((q) => 
        q.and(
          q.lte(q.field('startDate'), currentDate),
          q.gte(q.field('endDate'), currentDate)
        )
      )
      .collect();
  },
});