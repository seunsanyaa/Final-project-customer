import { v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getUserId } from './util';

// Get a single maintenance record by maintenanceId
export const getMaintenance = query({
  args: { maintenanceId: v.string() },
  handler: async (ctx, args) => {
    const maintenance = await ctx.db
      .query('maintenance')
      .withIndex('by_maintenanceId', (q) => q.eq('maintenanceId', args.maintenanceId))
      .first();

    if (!maintenance) {
      throw new Error('Maintenance record not found');
    }

    return maintenance;
  },
});

// Get all maintenance records
export const getAllMaintenance = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('maintenance').collect();
  },
});

// Create a new maintenance record
export const createMaintenance = mutation({
  args: {
    maintenanceId: v.string(),
    carId: v.string(),
    maintenanceDate: v.string(),
    description: v.string(),
    cost: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const maintenanceId = await ctx.db.insert('maintenance', {
      ...args,
    });

    return maintenanceId;
  },
});

// Update an existing maintenance record
export const updateMaintenance = mutation({
  args: {
    maintenanceId: v.string(),
    carId: v.optional(v.string()),
    maintenanceDate: v.optional(v.string()),
    description: v.optional(v.string()),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const { maintenanceId, ...updateFields } = args;
    const existingMaintenance = await ctx.db
      .query('maintenance')
      .withIndex('by_maintenanceId', (q) => q.eq('maintenanceId', maintenanceId))
      .first();

    if (!existingMaintenance) {
      throw new Error('Maintenance record not found');
    }

    await ctx.db.patch(existingMaintenance._id, updateFields);
    return existingMaintenance._id;
  },
});

// Delete a maintenance record
export const deleteMaintenance = mutation({
  args: { maintenanceId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const maintenanceToDelete = await ctx.db
      .query('maintenance')
      .withIndex('by_maintenanceId', (q) => q.eq('maintenanceId', args.maintenanceId))
      .first();

    if (!maintenanceToDelete) {
      throw new Error('Maintenance record not found');
    }

    await ctx.db.delete(maintenanceToDelete._id);
  },
});

// Get maintenance records for a specific car
export const getMaintenanceByCarId = query({
  args: { carId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('maintenance')
      .withIndex('by_carId', (q) => q.eq('carId', args.carId))
      .collect();
  },
});