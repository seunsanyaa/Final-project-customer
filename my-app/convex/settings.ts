import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { query } from './_generated/server';

export const saveSettings = mutation({
  args: {
    userId: v.string(),
    darkMode: v.optional(v.boolean()),
    language: v.optional(v.string()),
    notificationPreferences: v.optional(v.object({
      booking: v.boolean(),
      promotion: v.boolean(),
      payment: v.boolean(),
      rewards: v.boolean(),
      reminder: v.boolean(),
    })),
  },
  
  async handler(ctx, args) {
    const darkMode = args.darkMode ?? false;
    const language = args.language ?? 'english';
    const notificationPreferences = args.notificationPreferences ?? {
      booking: true,
      promotion: true,
      payment: true,
      rewards: true,
      reminder: true,
    };

    const existingSettings = await ctx.db
      .query('settings')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .first();

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        darkMode,
        language,
        notificationPreferences,
      });
      return existingSettings._id;
    } else {
      return await ctx.db.insert('settings', {
        userId: args.userId,
        darkMode,
        language,
        notificationPreferences,
      });
    }
  },
});

export const fetchSettings = query({
  args: {
    userId: v.string(),
  },
  
  async handler(ctx, args) {
    const settings = await ctx.db
      .query('settings')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .first();
    
    // If no settings found, return default values
    if (!settings) {
      return {
        darkMode: false,
        language: 'english',
        notificationPreferences: {
          booking: true,
          promotion: true,
          payment: true,
          rewards: true,
          reminder: true,
        }
      };
    }
    
    return settings;
  },
});
