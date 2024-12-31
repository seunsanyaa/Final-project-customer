


import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Promotion } from '../types/Promotion';
import { Id } from '../convex/_generated/dataModel';

export const adminSearchPromotion = query({
	args: {
		promotionTitle: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		return await ctx.db.query('promotions').filter(q => q.eq(q.field('promotionTitle'), args.promotionTitle)).collect();
	}
});

// Create a new promotion
export const createPromotion = mutation({
  args: {
    promotionTitle: v.string(),
    promotionDescription: v.string(),
    promotionImage: v.string(),
    promotionType: v.union(v.literal('discount'), v.literal('offer'), v.literal('upgrade'), v.literal('permenant')),
    promotionValue: v.number(),
    promotionStartDate: v.optional(v.string()),
    promotionEndDate: v.optional(v.string()),
    status: v.union(v.literal('active'), v.literal('inactive'), v.literal('expired'), v.literal('scheduled')),
    goldenMembersOnly: v.boolean(),
    target: v.union(v.literal('all'), v.literal('specific'), v.literal('none')),
    specificTarget: v.array(v.string()),
    minimumRentals: v.optional(v.number()),
    minimumMoneySpent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Validate that permanent promotions don't have start/end dates
    if (args.promotionType === 'permenant') {
      if (args.promotionStartDate || args.promotionEndDate || (!args.minimumRentals && !args.minimumMoneySpent)) {
        throw new Error('Permanent promotions cannot have start/end dates and must have minimum rentals and minimum money spent');
      }
    } else {
      // Non-permanent promotions must have start/end dates
      if (!args.promotionStartDate || !args.promotionEndDate || args.minimumRentals || args.minimumMoneySpent) {
        throw new Error('Non-permanent promotions must have start and end dates and cannot have minimum rentals or minimum money spent');
      }
    }
    
    const promotionId = await ctx.db.insert('promotions', args);

    // Get all customers
    const customers = await ctx.db.query('customers').collect();

    // Create notifications for all customers
    await Promise.all(
      customers.map(async (customer) => {
        await ctx.db.insert('notifications', {
          userId: customer.userId,
          message: `New promotion available: ${args.promotionTitle}`,
          type: 'promotion',
          isRead: false,
          createdAt: Date.now(),
          promotionId: promotionId, // Store the promotion ID in the notification
        });
      })
    );

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
    promotionType: v.optional(v.union(v.literal('discount'), v.literal('offer'), v.literal('upgrade'), v.literal('permenant'))),
    promotionValue: v.optional(v.number()),
    promotionStartDate: v.optional(v.string()),
    promotionEndDate: v.optional(v.string()),
    status: v.optional(v.union(v.literal('active'), v.literal('inactive'), v.literal('expired'), v.literal('scheduled'))),
    goldenMembersOnly: v.optional(v.boolean()),
    target: v.optional(v.union(v.literal('all'), v.literal('specific'), v.literal('none'))),
    specificTarget: v.optional(v.array(v.string())),
    minimumRentals: v.optional(v.number()),
    minimumMoneySpent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Get existing promotion
    const existingPromotion = await ctx.db.get(id);
    if (!existingPromotion) {
      throw new Error('Promotion not found');
    }

    // Validate permanent promotion rules
    const newType = updates.promotionType || existingPromotion.promotionType;
    if (newType === 'permenant') {
      if (updates.promotionStartDate || updates.promotionEndDate) {
        throw new Error('Permanent promotions cannot have start/end dates');
      }
    }

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
        q.or(
          // Handle regular promotions with end dates
          q.and(
            q.eq(q.field('status'), 'active'),
            q.neq(q.field('promotionType'), 'permenant'),
            q.gte(q.field('promotionEndDate'), currentDate)
          ),
          // Handle permanent promotions (no end date check needed)
          q.and(
            q.eq(q.field('status'), 'active'),
            q.eq(q.field('promotionType'), 'permenant')
          )
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

// Add this new query to get redeemed promotions for a user
export const getUserRedeemedPromotions = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Get the customer first
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!customer || !customer.promotions) {
      return [];
    }

    // Fetch all promotions that the customer has redeemed
    const redeemedPromotions = await Promise.all(
      customer.promotions.map(async (promoId) => {
        const promotion = await ctx.db.get(promoId);
        if (!promotion) return null;
        
        return {
          ...promotion,
          isUsed: customer.usedPromotions?.includes(promoId) ?? false
        };
      })
    );

    // Filter out any null values and return valid promotions
    return redeemedPromotions.filter(Boolean);
  },
});

// Add this mutation to mark a promotion as used
export const markPromotionAsUsed = mutation({
  args: {
    userId: v.string(),
    promotionId: v.id("promotions"),
  },
  handler: async (ctx, { userId, promotionId }) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!customer) {
      throw new Error("Customer not found");
    }

    const usedPromotions = customer.usedPromotions || [];
    
    // Add the promotion to usedPromotions if not already there
    if (!usedPromotions.includes(promotionId)) {
      await ctx.db.patch(customer._id, {
        usedPromotions: [...usedPromotions, promotionId],
      });
    }

    return { status: "success" };
  },
});

export const getPermanentPromotions = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('promotions')
      .filter((q) => 
        q.and(
          q.eq(q.field('status'), 'active'),
          q.eq(q.field('promotionType'), 'permenant')
        )
      )
      .collect();
  },
});

// Add this new query to get all applicable promotions for a car
export const getApplicablePromotions = query({
  args: { 
    carId: v.string(),
    userId: v.string() 
  },
  handler: async (ctx, { carId, userId }) => {
    const car = await ctx.db.get(carId as Id<"cars">);
    if (!car) return [];

    const customer = await ctx.db
      .query("customers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    // Get all active promotions
    const allPromotions = await ctx.db
      .query("promotions")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Get all customer bookings once
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("customerId"), userId))
      .collect();

    const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalCost, 0);
    const totalRentals = bookings.length;

    // Now filter promotions without async operations
    return allPromotions.filter(promo => {
      // Check if promotion is already redeemed
      const isRedeemed = customer?.promotions?.includes(promo._id);
      if (isRedeemed) return false;

      // Check if promotion targets this car or its categories
      const isTargeted = promo.specificTarget.some(target => 
        target === car._id || 
        (car.categories && car.categories.includes(target))
      );

      if (promo.promotionType === 'permenant') {
        // Check requirements based on what's defined
        if (promo.minimumMoneySpent && promo.minimumMoneySpent > 0) {
          if (totalSpent < promo.minimumMoneySpent) return false;
        }
        
        if (promo.minimumRentals && promo.minimumRentals > 0) {
          if (totalRentals < promo.minimumRentals) return false;
        }

        // Skip if both minimums are 0 or undefined
        if ((!promo.minimumRentals || promo.minimumRentals === 0) && 
            (!promo.minimumMoneySpent || promo.minimumMoneySpent === 0)) {
          return false;
        }

        return isTargeted;
      }

      return isTargeted;
    });
  },
});

export const deactivatePromo = mutation({
  args: { 
    userId: v.string(),
    promotionId: v.id("promotions")
  },
  handler: async (ctx, { userId, promotionId }) => {
    // Get the customer
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!customer) {
      throw new Error("Customer not found");
    }

    // Remove the promotion from the customer's active promotions
    const updatedPromotions = customer.promotions?.filter(id => id !== promotionId) || [];

    // Update the customer record
    await ctx.db.patch(customer._id, {
      promotions: updatedPromotions
    });

    return true;
  },
});

