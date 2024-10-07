import { v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getUserId } from './util';

// Get a single promotion by promotionId
export const getPromotion = query({
  args: { promotionId: v.string() },
  handler: async (ctx, args) => {
    const promotion = await ctx.db
      .query('promotion')
      .withIndex('by_promotionId', (q) => q.eq('promotionId', args.promotionId))
      .first();

    if (!promotion) {
      throw new Error('Promotion not found');
    }

    return promotion;
  },
});

// Get all promotions
export const getAllPromotions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('promotion').collect();
  },
});

// Create a new promotion
export const createPromotion = mutation({
  args: {
    promotionId: v.string(),
    discount: v.number(),
    demographic: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const promotionId = await ctx.db.insert('promotion', {
      ...args,
    });

    return promotionId;
  },
});

// Update an existing promotion
export const updatePromotion = mutation({
  args: {
    promotionId: v.string(),
    discount: v.optional(v.number()),
    demographic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const { promotionId, ...updateFields } = args;
    const existingPromotion = await ctx.db
      .query('promotion')
      .withIndex('by_promotionId', (q) => q.eq('promotionId', promotionId))
      .first();

    if (!existingPromotion) {
      throw new Error('Promotion not found');
    }

    await ctx.db.patch(existingPromotion._id, updateFields);
    return existingPromotion._id;
  },
});

// Delete a promotion
export const deletePromotion = mutation({
  args: { promotionId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const promotionToDelete = await ctx.db
      .query('promotion')
      .withIndex('by_promotionId', (q) => q.eq('promotionId', args.promotionId))
      .first();

    if (!promotionToDelete) {
      throw new Error('Promotion not found');
    }

    await ctx.db.delete(promotionToDelete._id);
  },
});

// Search promotions by demographic
export const searchPromotionsByDemographic = query({
  args: { demographic: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('promotion')
      .filter((q) => q.eq(q.field('demographic'), args.demographic))
      .collect();
  },
});

// Get promotions with discount greater than or equal to a specified value
export const getPromotionsWithMinDiscount = query({
  args: { minDiscount: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('promotion')
      .filter((q) => q.gte(q.field('discount'), args.minDiscount))
      .collect();
  },
});