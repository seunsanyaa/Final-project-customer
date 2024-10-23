import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Helper function to update the average rating of a car.
 * @param ctx - The Convex context.
 * @param carId - The registration number of the car.
 */
async function updateCarAverageRating(ctx: any, carId: string): Promise<void> {
  // Fetch all bookings for the given carId
  const bookings = await ctx.db
    .query("bookings")
    .withIndex("by_carId", (q) => q.eq("carId", carId))
    .collect();

  // Extract all reviewIds from these bookings
  const reviewIds = bookings
    .map((booking) => booking.reviewId)
    .filter((reviewId) => reviewId !== undefined && reviewId !== null) as string[];

  if (reviewIds.length === 0) {
    // If there are no reviews, set averageRating to undefined
    await ctx.db
      .query("cars")
      .withIndex("by_registrationNumber", (q) => q.eq("registrationNumber", carId))
      .first()
      .then(async (car) => {
        if (car) {
          await ctx.db.patch(car._id, { averageRating: undefined });
        }
      });
    return;
  }

  // Fetch all reviews using the collected reviewIds
  const reviews = await ctx.db
    .query("reviews")
    .anyOf(reviewIds.map((id) => ({ _id: id })))
    .collect();

  if (reviews.length === 0) {
    // No reviews found, set averageRating to undefined
    await ctx.db
      .query("cars")
      .withIndex("by_registrationNumber", (q) => q.eq("registrationNumber", carId))
      .first()
      .then(async (car) => {
        if (car) {
          await ctx.db.patch(car._id, { averageRating: undefined });
        }
      });
    return;
  }

  // Calculate the average numberOfStars
  const totalStars = reviews.reduce((sum, review) => sum + review.numberOfStars, 0);
  const averageRating = totalStars / reviews.length;

  // Update the car's averageRating
  await ctx.db
    .query("cars")
    .withIndex("by_registrationNumber", (q) => q.eq("registrationNumber", carId))
    .first()
    .then(async (car) => {
      if (car) {
        await ctx.db.patch(car._id, { averageRating });
      }
    });
}

export const createReview = mutation({
  args: {
    bookingId: v.id("bookings"),
    rating: v.number(),
    userId: v.string(),
    comment: v.string(),
    numberOfStars: v.number(),
  },
  handler: async (ctx, args) => {
    const { bookingId, rating, userId, comment, numberOfStars } = args;

    // Check if the booking exists
    const booking = await ctx.db.get(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Check if a review already exists for this booking
    if (booking.reviewId) {
      throw new Error("A review already exists for this booking");
    }

    // Create the review
    const reviewId = await ctx.db.insert("reviews", {
      bookingId,
      rating,
      userId,
      comment,
      numberOfStars,
      reviewDate: new Date().toISOString(),
    });

    // Update the booking with the reviewId
    await ctx.db.patch(bookingId, { reviewId: reviewId });

    // Fetch the carId associated with this booking
    const carId = booking.carId;

    // Update the car's averageRating
    await updateCarAverageRating(ctx, carId);

    return reviewId;
  },
});

export const getReviewsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return reviews;
  },
});
