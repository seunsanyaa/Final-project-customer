import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { query } from './_generated/server';

export const saveSettings = mutation({
  args: {
    userId: v.string(),
    darkMode: v.optional(v.boolean()),
    language: v.optional(v.string()),
  },
  
  async handler(ctx, args) {
    // Set default values
    const darkMode = args.darkMode ?? false;
    const language = args.language ?? 'english';

    // Check if user already has settings
    const existingSettings = await ctx.db
      .query('settings')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .first();

    if (existingSettings) {
      // Update existing settings
      await ctx.db.patch(existingSettings._id, {
        darkMode,
        language,
      });
      return existingSettings._id;
    } else {
      // Create new settings
      const newSettingsId = await ctx.db.insert('settings', {
        userId: args.userId,
        darkMode,
        language,
      });
      return newSettingsId;
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
      };
    }
    
    return settings;
  },
});
