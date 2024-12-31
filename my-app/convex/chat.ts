import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const sendMessage = mutation({
  args: {
    userId: v.string(),
    message: v.string(),
    isAdmin: v.boolean(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('messages', {
      userId: args.userId,
      message: args.message,
      isAdmin: args.isAdmin,
      timestamp: args.timestamp,
    });
  },
});

export const getMessagesByCustomerId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});