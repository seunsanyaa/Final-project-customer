import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Car } from "../types/car";
import { Booking } from "../types/booking";
import { Review } from "../types/review";
/**
 * Helper function to update the average rating of a car.
 * @param ctx - The Convex context.
 * @param carId - The registration number of the car.
 */
async function updateCarAverageRating(ctx: any, carId: string): Promise<void> {
  // Fetch all bookings for the given carId
  const bookings = await ctx.db
    .query("bookings")
    .withIndex("by_carId", (q: any) => q.eq("carId", carId))
    .collect();

  // Extract all reviewIds from these bookings
  const reviewIds = bookings
    .map((booking: Booking) => booking.reviewId)
    .filter((reviewId: string) => reviewId !== undefined && reviewId !== null) as string[];

  if (reviewIds.length === 0) {
    // If there are no reviews, set averageRating to undefined
    const car = await ctx.db
      .query("cars")
      .withIndex("by_registrationNumber", (q: any) => q.eq("registrationNumber", carId))
      .first();

    if (car) {
      await ctx.db.patch(car._id, { averageRating: undefined });
    }
    return;
  }

  // Fetch all reviews using the collected reviewIds
  const reviews = await ctx.db
    .query("reviews")
    .anyOf(reviewIds.map((id) => ({ _id: id })))
    .collect();

  if (reviews.length === 0) {
    // No reviews found, set averageRating to undefined
    const car = await ctx.db
      .query("cars")
      .withIndex("by_registrationNumber", (q: any) => q.eq("registrationNumber", carId))
      .first();

    if (car) {
      await ctx.db.patch(car._id, { averageRating: undefined });
    }
    return;
  }

  // Calculate the averageNumberOfStars
  const totalStars = reviews.reduce((sum: number, review: Review) => sum + review.numberOfStars, 0);
  const averageRating = totalStars / reviews.length;

  // Update the car's averageRating
  const car = await ctx.db
    .query("cars")
    .withIndex("by_registrationNumber", (q: any) => q.eq("registrationNumber", carId))
    .first();

  if (car) {
    await ctx.db.patch(car._id, { averageRating });
  }
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

    // Fetch reviews associated with the userId
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Enrich each review with car details
    const enrichedReviews = await Promise.all(
      reviews.map(async (review: Review) => {
        const booking = await ctx.db.get(review.bookingId);
        if (booking) {
          const car = await ctx.db
            .query("cars")
            .withIndex("by_registrationNumber", (q) => q.eq("registrationNumber", booking.carId))
            .first();

          return {
            ...review,
            carDetails: car
              ? {
                  maker: car.maker,
                  model: car.model,
                  year: car.year,
                  color: car.color,
                  trim: car.trim,
                }
              : null,
          };
        }
        return { ...review, carDetails: null };
      })
    );

    return enrichedReviews;
  },
});
