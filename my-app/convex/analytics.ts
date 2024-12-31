import { v } from 'convex/values';
import { query, mutation, internalMutation } from './_generated/server';
import { cronJobs } from 'convex/server';
import { api } from './_generated/api';

// Shared function for checking bookings and sending notifications
async function checkAndNotifyBookings(ctx: any) {
  try {
    console.log("Starting booking check process...");
    // Get all customers
    const customers = await ctx.db.query('customers').collect();
    console.log(`Found ${customers.length} customers to check`);
    
    // Check bookings for each customer
    for (const customer of customers) {
      try {
        console.log(`Checking bookings for customer ${customer.userId}`);
        const bookings = await ctx.db
          .query('bookings')
          .withIndex('by_customerId', (q: any) => q.eq('customerId', customer.userId))
          .filter((q: any) => q.neq(q.field('status'), 'cancelled'))
          .collect();

        console.log(`Found ${bookings.length} active bookings for customer ${customer.userId}`);
        const today = new Date();

        for (const booking of bookings) {
          try {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);

            // Check for upcoming start date
            const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            console.log(`Booking ${booking._id}: ${daysUntilStart} days until start`);
            
            if (daysUntilStart <= 3 && daysUntilStart > 0) {
              console.log(`Creating start notification for booking ${booking._id}`);
              await ctx.scheduler.runAfter(0, api.notifications.createNotification, {
                userId: customer.userId,
                bookingId: booking._id.toString(),
                message: `Your booking starts in ${daysUntilStart} day${daysUntilStart === 1 ? '' : 's'}!`,
                type: 'reminder',
              });
              console.log(`Start notification created successfully`);
            }

            // Check for upcoming end date
            const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            console.log(`Booking ${booking._id}: ${daysUntilEnd} days until end`);
            
            if (daysUntilEnd <= 3 && daysUntilEnd > 0) {
              console.log(`Creating end notification for booking ${booking._id}`);
              await ctx.scheduler.runAfter(0, api.notifications.createNotification, {
                userId: customer.userId,
                bookingId: booking._id.toString(),
                message: `Your booking ends in ${daysUntilEnd} day${daysUntilEnd === 1 ? '' : 's'}!`,
                type: 'reminder',
              });
              console.log(`End notification created successfully`);
            }
          } catch (bookingError) {
            console.error(`Error processing booking ${booking._id}:`, bookingError);
          }
        }
      } catch (customerError) {
        console.error(`Error processing customer ${customer.userId}:`, customerError);
      }
    }
    console.log("Booking check process completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Error in checkAndNotifyBookings:", error);
    throw error;
  }
}

export const getAnalyticsReport = query({
  args: {
    month: v.optional(v.number()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return { message: 'Analytics data' };
  }
});
// Get the most rented cars for a specific month
export const getMostRentedCars = query({
  args: {
    month: v.optional(v.number()), // Month number (1-12)
    year: v.optional(v.number()),
    limit: v.optional(v.number()), // Number of cars to return
  },
  handler: async (ctx, args) => {
    // Default to last month if no date provided
    const targetDate = new Date();
    if (!args.month || !args.year) {
      targetDate.setMonth(targetDate.getMonth() - 1);
    } else {
      targetDate.setFullYear(args.year, args.month - 1);
    }

    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1).toISOString();
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).toISOString();

    // Get all bookings for the specified month
    const bookings = await ctx.db
      .query('bookings')
      .filter((q) => 
        q.and(
          q.gte(q.field('startDate'), startOfMonth),
          q.lte(q.field('startDate'), endOfMonth)
        )
      )
      .collect();

    // Count bookings per car
    const carBookings = bookings.reduce((acc, booking) => {
      acc[booking.carId] = (acc[booking.carId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by booking count
    const sortedCars = await Promise.all(
      Object.entries(carBookings)
        .sort(([, a], [, b]) => b - a)
        .slice(0, args.limit || 10)
        .map(async ([carId, bookingCount]) => {
          const car = await ctx.db
            .query('cars')
            .withIndex('by_registrationNumber', (q) => q.eq('registrationNumber', carId))
            .first();

          return {
            car,
            bookingCount,
            revenue: bookings
              .filter(b => b.carId === carId)
              .reduce((sum, b) => sum + b.totalCost, 0),
          };
        })
    );

    return sortedCars;
  },
});

// Get the least rented cars for a specific month
export const getLeastRentedCars = query({
  args: {
    month: v.optional(v.number()),
    year: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Default to last month if no date provided
    const targetDate = new Date();
    if (!args.month || !args.year) {
      targetDate.setMonth(targetDate.getMonth() - 1);
    } else {
      targetDate.setFullYear(args.year, args.month - 1);
    }

    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1).toISOString();
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).toISOString();

    // Get all cars
    const allCars = await ctx.db.query('cars').collect();

    // Get all bookings for the specified month
    const bookings = await ctx.db
      .query('bookings')
      .filter((q) => 
        q.and(
          q.gte(q.field('startDate'), startOfMonth),
          q.lte(q.field('startDate'), endOfMonth)
        )
      )
      .collect();

    // Count bookings per car
    const carBookings = bookings.reduce((acc, booking) => {
      acc[booking.carId] = (acc[booking.carId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Include cars with zero bookings
    allCars.forEach(car => {
      if (!carBookings[car.registrationNumber]) {
        carBookings[car.registrationNumber] = 0;
      }
    });

    // Convert to array and sort by booking count (ascending)
    const sortedCars = await Promise.all(
      Object.entries(carBookings)
        .sort(([, a], [, b]) => a - b)
        .slice(0, args.limit || 10)
        .map(async ([carId, bookingCount]) => {
          const car = await ctx.db
            .query('cars')
            .withIndex('by_registrationNumber', (q) => q.eq('registrationNumber', carId))
            .first();

          return {
            car,
            bookingCount,
            revenue: bookings
              .filter(b => b.carId === carId)
              .reduce((sum, b) => sum + b.totalCost, 0),
            daysIdle: calculateIdleDays(bookings, carId, startOfMonth, endOfMonth),
          };
        })
    );

    return sortedCars;
  },
});

// Helper function to calculate idle days
function calculateIdleDays(
  bookings: any[],
  carId: string,
  startOfMonth: string,
  endOfMonth: string
): number {
  const start = new Date(startOfMonth);
  const end = new Date(endOfMonth);
  const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  
  const carBookings = bookings
    .filter(b => b.carId === carId)
    .map(b => ({
      start: new Date(b.startDate),
      end: new Date(b.endDate)
    }));

  let bookedDays = 0;
  carBookings.forEach(booking => {
    const bookingStart = booking.start > start ? booking.start : start;
    const bookingEnd = booking.end < end ? booking.end : end;
    bookedDays += (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24);
  });

  return Math.round(totalDays - bookedDays);
}

// Add this new function for installment calculations
export const calculateInstallmentDetails = query({
  args: {
    basePrice: v.number(),
    totalDays: v.number(),
    extras: v.object({
      insurance: v.boolean(),
      insuranceCost: v.number(),
      gps: v.boolean(),
      childSeat: v.boolean(),
      chauffer: v.boolean(),
      travelKit: v.boolean()
    }),
    promotionValue: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { basePrice, totalDays, extras, promotionValue } = args;
    
    // Calculate extras costs
    const extrasCost = (
      (extras.insurance ? extras.insuranceCost : 0) +
      (extras.gps ? 5 : 0) +
      (extras.childSeat ? 8 : 0) +
      (extras.chauffer ? 100 : 0)
    );
    
    let totalPrice = (basePrice + extrasCost) * totalDays;
    
    // Apply promotion if available
    if (promotionValue) {
      totalPrice = totalPrice * (1 - promotionValue / 100);
    }

    // Calculate installment details
    const numberOfInstallments = totalDays < 7 ? totalDays : Math.floor(totalDays / 7);
    const installmentAmount = totalPrice / numberOfInstallments;

    return {
      totalPrice,
      installmentAmount: Math.ceil(installmentAmount * 100) / 100,
      numberOfInstallments,
      pricePerDay: basePrice + extrasCost
    };
  }
});

// Get current active booking for a customer
export const getCurrentBooking = query({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get today's date and set time to start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Get date 7 days from now
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekISO = nextWeek.toISOString();
    
    // Get bookings that are either:
    // 1. Current (today falls between start and end date)
    // 2. Starting within the next week
    const relevantBookings = await ctx.db
      .query('bookings')
      .withIndex('by_customerId', (q) => q.eq('customerId', args.customerId))
      .filter((q) => 
        q.or(
          // Current bookings
          q.and(
            q.lte(q.field('startDate'), todayISO),
            q.gte(q.field('endDate'), todayISO)
          ),
          // Upcoming bookings within a week
          q.and(
            q.gt(q.field('startDate'), todayISO),
            q.lt(q.field('startDate'), nextWeekISO)
          )
        )
      )
      .collect();

    // If no relevant bookings, return null
    if (relevantBookings.length === 0) {
      return null;
    }

    // Sort bookings to prioritize current bookings over upcoming ones
    relevantBookings.sort((a, b) => {
      const aIsCurrent = new Date(a.startDate) <= today && new Date(a.endDate) >= today;
      const bIsCurrent = new Date(b.startDate) <= today && new Date(b.endDate) >= today;
      
      if (aIsCurrent && !bIsCurrent) return -1;
      if (!aIsCurrent && bIsCurrent) return 1;
      
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

    // Get car details for the booking
    const bookingsWithDetails = await Promise.all(
      relevantBookings.map(async (booking) => {
        const car = await ctx.db
          .query('cars')
          .withIndex('by_registrationNumber', (q) => 
            q.eq('registrationNumber', booking.carId)
          )
          .first();

        // Calculate days remaining or days until start
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        
        // Format dates for display
        const formattedStartDate = startDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const formattedEndDate = endDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        // Calculate days difference
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        let daysRemaining;
        const msPerDay = 1000 * 60 * 60 * 24;
        
        if (startDate <= today && today <= endDate) {
          // Current booking - calculate days remaining until end
          daysRemaining = Math.max(0, Math.ceil(
            (endDate.getTime() - today.getTime()) / msPerDay
          ));
        } else {
          // Upcoming booking - calculate days until start
          daysRemaining = Math.max(0, Math.ceil(
            (startDate.getTime() - today.getTime()) / msPerDay
          ));
        }

        // Calculate if the booking is current or upcoming
        const isCurrentBooking = (startDate <= today && today <= endDate) || (startDate <= today || today <= endDate);
        const status = isCurrentBooking ? 'Current' : 'Upcoming';

        return {
          ...booking,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          carDetails: car ? {
            maker: car.maker,
            model: car.model,
            year: car.year,
            color: car.color,
            trim: car.trim,
            registrationNumber: car.registrationNumber
          } : null,
          daysRemaining,
          status
        };
      })
    );

    // Return the most relevant booking (current or soonest upcoming)
    return bookingsWithDetails[0];
  }
});

// Add this new function for search suggestions
export const searchCarsByTerm = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const allCars = await ctx.db.query("cars").collect();
    
    // Get unique makes and models
    const uniqueMakes = new Set(allCars.map(car => car.maker.toLowerCase()));
    const uniqueModels = new Set(allCars.map(car => car.model.toLowerCase()));

    const searchTerms = args.searchTerm.toLowerCase().split(' ');
    let maker = "";
    let model = "";

    // Compare each word against our unique makes and models
    for (const term of searchTerms) {
      // Check if the term is part of any make
      const matchingMake = Array.from(uniqueMakes).find(make => 
        make.includes(term) || term.includes(make)
      );
      if (matchingMake) {
        maker = matchingMake;
        continue;
      }

      // Check if the term is part of any model
      const matchingModel = Array.from(uniqueModels).find(model => 
        model.includes(term) || term.includes(model)
      );
      if (matchingModel) {
        model = matchingModel;
      }
    }

    return {
      maker,
      model,
      searchTerms
    };
  },
});

// Add this new mutation for checking upcoming bookings and sending notifications
export const checkUpcomingBookings = mutation({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query('bookings')
      .withIndex('by_customerId', (q) => q.eq('customerId', args.customerId))
      .filter(q => q.neq(q.field('status'), 'cancelled'))
      .collect();

    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    for (const booking of bookings) {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      // Check for upcoming start date
      const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilStart <= 3 && daysUntilStart > 0) {
        // Create notification for upcoming booking start
        await ctx.db.insert('notifications', {
          userId: args.customerId,
          bookingId: booking._id.toString(),
          message: `Your booking starts in ${daysUntilStart} day${daysUntilStart === 1 ? '' : 's'}!`,
          type: 'reminder',
          isRead: false,
          createdAt: Date.now(),
        });
      }

      // Check for upcoming end date
      const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilEnd <= 3 && daysUntilEnd > 0) {
        // Create notification for upcoming booking end
        await ctx.db.insert('notifications', {
          userId: args.customerId,
          bookingId: booking._id.toString(),
          message: `Your booking ends in ${daysUntilEnd} day${daysUntilEnd === 1 ? '' : 's'}!`,
          type: 'reminder',
          isRead: false,
          createdAt: Date.now(),
        });
      }
    }

    return { success: true };
  },
});

// Add this new mutation for periodic booking checks
export const checkAllUsersUpcomingBookings = mutation({
  handler: async (ctx) => {
    // Get all customers
    const customers = await ctx.db.query('customers').collect();
    
    // Check bookings for each customer
    for (const customer of customers) {
      await ctx.db.query('bookings')
        .withIndex('by_customerId', (q) => q.eq('customerId', customer.userId))
        .filter(q => q.neq(q.field('status'), 'cancelled'))
        .collect()
        .then(async (bookings) => {
          const today = new Date();

          for (const booking of bookings) {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);

            // Check for upcoming start date
            const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilStart <= 3 && daysUntilStart > 0) {
              await ctx.db.insert('notifications', {
                userId: customer.userId,
                bookingId: booking._id.toString(),
                message: `Your booking starts in ${daysUntilStart} day${daysUntilStart === 1 ? '' : 's'}!`,
                type: 'reminder',
                isRead: false,
                createdAt: Date.now(),
              });
            }

            // Check for upcoming end date
            const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilEnd <= 3 && daysUntilEnd > 0) {
              await ctx.db.insert('notifications', {
                userId: customer.userId,
                bookingId: booking._id.toString(),
                message: `Your booking ends in ${daysUntilEnd} day${daysUntilEnd === 1 ? '' : 's'}!`,
                type: 'reminder',
                isRead: false,
                createdAt: Date.now(),
              });
            }
          }
        });
    }

    return { success: true };
  },
});

// Add this new mutation for reward points notifications
export const notifyRewardPointsChange = mutation({
  args: {
    userId: v.string(),
    oldPoints: v.number(),
    newPoints: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const pointsDiff = args.newPoints - args.oldPoints;
    const message = pointsDiff > 0 
      ? `You've earned ${pointsDiff} reward points from ${args.reason}!`
      : `${Math.abs(pointsDiff)} reward points were deducted for ${args.reason}.`;

    await ctx.scheduler.runAfter(0, api.notifications.createNotification, {
      userId: args.userId,
      message,
      type: 'rewards',

    });

    return { success: true };
  },
});

// Cron job using shared function
export default {
  checkBookings: {
    schedule: "0 * * * *", // Run every hour
    handler: async (ctx: any) => {
      return await checkAndNotifyBookings(ctx);
    }
  }
};

// Manual trigger using shared function
export const triggerBookingCheck = mutation({
  handler: async (ctx) => {
    return await checkAndNotifyBookings(ctx);
  },
});

// Add this new query for checking active bookings count
export const getActiveBookingsCount = query({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const activeBookings = await ctx.db
      .query('bookings')
      .withIndex('by_customerId', (q) => q.eq('customerId', args.customerId))
      .filter((q) => 
        q.and(
          q.neq(q.field('status'), 'cancelled'),
          q.gte(q.field('endDate'), todayISO)
        )
      )
      .collect();

    return activeBookings.length;
  },
});


export const getMinPricesByCategory = query({
	handler: async (ctx) => {
		const cars = await ctx.db
			.query("cars")
			.filter(q => 
				q.and(
					q.eq(q.field('disabled'), false),
					q.eq(q.field('available'), true)
				)
			)
			.collect();

		const minPrices: Record<string, number> = {};

		cars.forEach(car => {
			if (car.categories) {
				car.categories.forEach(category => {
					if (!minPrices[category] || car.pricePerDay < minPrices[category]) {
						minPrices[category] = car.pricePerDay;
					}
				});
			}
		});

		return minPrices;
	},
});
