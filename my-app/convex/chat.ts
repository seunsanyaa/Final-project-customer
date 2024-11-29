import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const sendMessage = mutation({
  args: {
    customerId: v.string(),
    message: v.string(),
    isAdmin: v.boolean(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('messages', {
      customerId: args.customerId,
      message: args.message,
      isAdmin: args.isAdmin,
      timestamp: args.timestamp,
    });
  },
});

export const getMessagesByCustomerId = query({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_customerId', q => q.eq('customerId', args.customerId))
      .order('desc')
      .collect();
  },
});