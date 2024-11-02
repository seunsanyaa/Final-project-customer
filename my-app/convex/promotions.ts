import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Promotion } from '../types/Promotion';

// Create a new promotion
export const createPromotion = mutation({
  args: {
    promotionTitle: v.string(),
    promotionDescription: v.string(),
    promotionImage: v.string(),
    promotionType: v.union(v.literal('discount'), v.literal('offer'), v.literal('upgrade')),
    promotionValue: v.number(),
    promotionStartDate: v.string(),
    promotionEndDate: v.string(),
    status: v.union(v.literal('active'), v.literal('inactive'), v.literal('expired'), v.literal('scheduled')),
    goldenMembersOnly: v.boolean(),
    target: v.union(v.literal('all'), v.literal('specific'), v.literal('none')),
    specificTarget: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const promotionId = await ctx.db.insert('promotions', args);
    return promotionId;
  },
});

// Update a promotion
export const updatePromotion = mutation({
  args: {
    id: v.id('promotions'),
    promotionTitle: v.optional(v.string()),
    promotionDescription: v.optional(v.string()),
    promotionImage: v.optional(v.string()),
    promotionType: v.optional(v.union(v.literal('discount'), v.literal('offer'), v.literal('upgrade'))),
    promotionValue: v.optional(v.number()),
    promotionStartDate: v.optional(v.string()),
    promotionEndDate: v.optional(v.string()),
    status: v.optional(v.union(v.literal('active'), v.literal('inactive'), v.literal('expired'), v.literal('scheduled'))),
    goldenMembersOnly: v.optional(v.boolean()),
    target: v.optional(v.union(v.literal('all'), v.literal('specific'), v.literal('none'))),
    specificTarget: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a promotion
export const deletePromotion = mutation({
  args: { id: v.id('promotions') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get all active promotions
export const getAllPromotions = query({
  handler: async (ctx) => {
    const currentDate = new Date().toISOString();
    return await ctx.db
      .query('promotions')
      .filter((q) => 
        q.and(
          q.eq(q.field('status'), 'active'),
          q.gte(q.field('promotionEndDate'), currentDate)
        )
      )
      .collect();
  },
});

// Get regular member promotions
export const getRegularMemberPromotions = query({
  handler: async (ctx) => {
    const currentDate = new Date().toISOString();
    return await ctx.db
      .query('promotions')
      .filter((q) => 
        q.and(
          q.eq(q.field('status'), 'active'),
          q.eq(q.field('goldenMembersOnly'), false),
          q.gte(q.field('promotionEndDate'), currentDate)
        )
      )
      .collect();
  },
});

// Get golden member promotions
export const getGoldenMemberPromotions = query({
  handler: async (ctx) => {
    const currentDate = new Date().toISOString();
    return await ctx.db
      .query('promotions')
      .filter((q) => 
        q.and(
          q.eq(q.field('status'), 'active'),
          q.eq(q.field('goldenMembersOnly'), true),
          q.gte(q.field('promotionEndDate'), currentDate)
        )
      )
      .collect();
  },
});

// Add this new mutation
export const redeemPromo = mutation({
  args: {
    userId: v.string(),
    promotionId: v.id('promotions'),
  },
  handler: async (ctx, args) => {
    // Get the customer
    const customer = await ctx.db
      .query('customers')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get existing promotions array or initialize empty array
    const existingPromos = customer.promotions || [];

    // Check if promotion is already redeemed
    if (existingPromos.includes(args.promotionId)) {
      return { status: 'already_redeemed' };
    }

    // Add the new promotion ID to the array
    await ctx.db.patch(customer._id, {
      promotions: [...existingPromos, args.promotionId],
    });

    return { status: 'success' };
  },
});