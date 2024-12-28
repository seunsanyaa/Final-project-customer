import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNotification = mutation({
  args: {
    userId: v.string(),
    bookingId: v.optional(v.string()),
    message: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    // Check user's notification preferences
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_userId", q => q.eq("userId", args.userId))
      .first();

    // Get notification preferences, default to enabled if not set
    const notificationPreferences = settings?.notificationPreferences ?? {
      booking: true,
      promotion: true,
      payment: true,
      rewards: true,
      reminder: true,
    };

    // Check if this notification type is enabled
    if (notificationPreferences[args.type as keyof typeof notificationPreferences]) {
      await ctx.db.insert("notifications", {
        userId: args.userId,
        bookingId: args.bookingId,
        message: args.message,
        isRead: false,
        createdAt: Date.now(),
        type: args.type,
      });
      return { created: true };
    }

    return { created: false };
  },
});

export const getUnreadNotifications = query({
  args: {
    userId: v.string(),
  },
  
  handler: async (ctx, args) => {
    // First get user's notification preferences
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_userId", q => q.eq("userId", args.userId))
      .first();

    // Get enabled notification types
    const enabledTypes = settings?.notificationPreferences 
      ? Object.entries(settings.notificationPreferences)
          .filter(([_, enabled]) => enabled)
          .map(([type]) => type)
      : ['booking', 'promotion', 'payment', 'rewards', 'reminder']; // Default all enabled

    // Get notifications filtered by enabled types
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => 
        q.eq("userId", args.userId)
      )
      .filter((q) => 
        q.and(
          q.eq(q.field("isRead"), false),
          q.or(...enabledTypes.map(type => q.eq(q.field("type"), type)))
        )
      )
      .order("desc")
      .collect();

    return notifications;
  },
});

export const markNotificationsAsRead = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => 
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      notifications.map((notification) =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );
  },
});

