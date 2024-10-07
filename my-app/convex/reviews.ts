import { v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getUserId } from './util';

// Get a single review by reviewId
export const getReview = query({
  args: { reviewId: v.string() },
  handler: async (ctx, args) => {
    const review = await ctx.db
      .query('reviews')
      .withIndex('by_reviewId', (q) => q.eq('reviewId', args.reviewId))
      .first();

    if (!review) {
      throw new Error('Review not found');
    }

    return review;
  },
});

// Get all reviews
export const getAllReviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('reviews').collect();
  },
});

// Create a new review
export const createReview = mutation({
  args: {
    reviewId: v.string(),
    bookingId: v.string(),
    rating: v.number(),
    comment: v.string(),
    reviewDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const reviewId = await ctx.db.insert('reviews', {
      ...args,
    });

    return reviewId;
  },
});

// Update an existing review
export const updateReview = mutation({
  args: {
    reviewId: v.string(),
    bookingId: v.optional(v.string()),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
    reviewDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const { reviewId, ...updateFields } = args;
    const existingReview = await ctx.db
      .query('reviews')
      .withIndex('by_reviewId', (q) => q.eq('reviewId', reviewId))
      .first();

    if (!existingReview) {
      throw new Error('Review not found');
    }

    await ctx.db.patch(existingReview._id, updateFields);
    return existingReview._id;
  },
});

// Delete a review
export const deleteReview = mutation({
  args: { reviewId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const reviewToDelete = await ctx.db
      .query('reviews')
      .withIndex('by_reviewId', (q) => q.eq('reviewId', args.reviewId))
      .first();

    if (!reviewToDelete) {
      throw new Error('Review not found');
    }

    await ctx.db.delete(reviewToDelete._id);
  },
});

// Get reviews by bookingId
export const getReviewsByBooking = query({
  args: { bookingId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('reviews')
      .withIndex('by_bookingId', (q) => q.eq('bookingId', args.bookingId))
      .collect();
  },
});

// Get average rating
export const getAverageRating = query({
  args: {},
  handler: async (ctx) => {
    const allReviews = await ctx.db.query('reviews').collect();
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    return allReviews.length > 0 ? totalRating / allReviews.length : 0;
  },
});