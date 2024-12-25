
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Car } from "../types/car";
import { Booking } from "../types/booking";
import { Review } from "../types/review";
import { Id } from "../convex/_generated/dataModel";
export const FilterCustomerReviews = mutation({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const { userId } = args;
		return await ctx.db.query('reviews').filter(q => q.eq(q.field('userId'), userId)).collect();
	}
});
export const SearchReviews = query({
	args: {
		userId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		return await ctx.db.query('reviews').filter(q => q.eq(q.field('userId'), args.userId)).collect();
	}
});
async function updateCarAverageRating(ctx: any, carId: string) {
  // Get all reviews for this car by:
  // 1. Get all bookings for this car
  const bookings = await ctx.db
    .query("bookings")
    .withIndex("by_carId", (q: any) => q.eq("carId", carId))
    .collect();

  // 2. Filter bookings that have reviews
  const bookingIds = bookings
    .filter((booking: Booking) => booking.reviewId)
    .map((booking: Booking) => booking._id);

  if (bookingIds.length === 0) {
    // No reviews exist, set averageRating to undefined
    await ctx.db
      .query("cars")
      .withIndex("by_registrationNumber", (q: any) => q.eq("registrationNumber", carId))
      .first()
      .then((car: Car) => {
        if (car) {
          ctx.db.patch(car._id, { averageRating: undefined });
        }
      });
    return;
  }

  // 3. Get all reviews for these bookings
  const reviews = await Promise.all(
    bookingIds.map((bookingId: string) => 
      ctx.db
        .query("reviews")
        .withIndex("by_bookingId", (q: any) => q.eq("bookingId", bookingId))
        .first()
    )
  );

  // 4. Calculate average rating
  const validReviews = reviews.filter(review => review !== null);
  const totalStars = validReviews.reduce((sum, review) => sum + review.numberOfStars, 0);
  const averageRating = totalStars / validReviews.length;

  // 5. Update the car's averageRating
  const car = await ctx.db
    .query("cars")
    .withIndex("by_registrationNumber", (q: any ) => q.eq("registrationNumber", carId))
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
        const booking = await ctx.db.get(review.bookingId as Id<"bookings">) as Booking;
        if (booking) {
          const car = await ctx.db
            .query("cars")
            .withIndex("by_registrationNumber", (q: any) => q.eq("registrationNumber", booking.carId))
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
                  pictures: car.pictures,
                  registrationNumber: booking.carId,
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

/**
 * Retrieves the top 6 reviews of all time based on the number of stars.
 * @returns An array of the top 6 reviews with enriched car details.
 */
export const getTopReviews = query({
  handler: async (ctx) => {
    // Get all reviews
    const reviews = await ctx.db
      .query("reviews")
      .collect();

    // Sort reviews by numberOfStars in descending order and take top 6
    const topReviews = reviews
      .sort((a, b) => b.numberOfStars - a.numberOfStars)
      .slice(0, 6);

    // Enrich each review with car details and user information
    const enrichedTopReviews = await Promise.all(
      topReviews.map(async (review) => {
        const booking = await ctx.db.get(review.bookingId);
        if (!booking) return null;

        // Get car details
        const car = await ctx.db
          .query("cars")
          .withIndex("by_registrationNumber", (q) =>
            q.eq("registrationNumber", booking.carId)
          )
          .first();

        // Get user details
        const user = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => 
            q.eq("userId", review.userId)
          )
          .first();

        return {
          ...review,
          userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
          carDetails: car
            ? {
                maker: car.maker,
                model: car.model,
                year: car.year,
                color: car.color,
                trim: car.trim,
                pictures: car.pictures,
                registrationNumber: booking.carId,
              }
            : null,
        };
      })
    );

    // Filter out any null results
    return enrichedTopReviews.filter((review): review is NonNullable<typeof review> => 
      review !== null
    );
  },
});
