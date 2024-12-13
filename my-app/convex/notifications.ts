import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNotification = mutation({
  args: {
    userId: v.string(),
    bookingId: v.string(),
    message: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      bookingId: args.bookingId,
      message: args.message,
      isRead: false,
      createdAt: Date.now(),
      type: args.type,
    });
  },
});

export const getUnreadNotifications = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_and_isRead", (q) => 
        q.eq("userId", args.userId).eq("isRead", false)
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
