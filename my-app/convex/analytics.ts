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

export const deleteBooking = mutation({
	args: {
		bookingId: v.id('bookings'),
	},
	handler: async (ctx, args) => {
		return await ctx.db.delete(args.bookingId);
	},
});

export const getAllFleets = query({
  handler: async (ctx) => {
    // Get all fleets
    const fleets = await ctx.db.query("fleets").collect();
    const cars = await ctx.db.query("cars").collect();
    const processedFleets = [];
    const emptyFleetIds = [];

    // Process fleets to include car information
    for (const fleet of fleets) {
      const fleetCars = cars.filter(car => 
        fleet.registrationNumber.includes(car.registrationNumber)
      );

      // Track empty fleets for deletion
      if (fleetCars.length === 0) {
        emptyFleetIds.push(fleet._id);
        continue;
      }

      const activeCars = fleetCars.filter(car => car.available);
      const inactiveCars = fleetCars.filter(car => !car.available);

      let type = 'normal';
      if (fleetCars.some(car => car.golden)) {
        type = 'golden';
      } else if (fleetCars.some(car => car.disabled)) {
        type = 'accessibility';
      }

      processedFleets.push({
        ...fleet,
        type,
        totalCars: fleetCars.length,
        activeCars: activeCars.length,
        inactiveCars: inactiveCars.length,
        cars: fleetCars,
        isEmpty: fleetCars.length === 0,
        emptyFleetIds
      });
    }

    return processedFleets;
  },
});

// Add this mutation to handle empty fleet deletion
export const deleteEmptyFleets = mutation({
  args: {
    fleetIds: v.array(v.id("fleets"))
  },
  handler: async (ctx, args) => {
    for (const fleetId of args.fleetIds) {
      await ctx.db.delete(fleetId);
    }
    return { success: true };
  },
});

// Add this after getAllFleets query
export const cleanupEmptyFleets = mutation({
  handler: async (ctx) => {
    // Get all fleets
    const fleets = await ctx.db.query("fleets").collect();
    // Get all cars
    const cars = await ctx.db.query("cars").collect();

    let deletedCount = 0;
    
    // Check each fleet
    for (const fleet of fleets) {
      // Find cars in this fleet
      const fleetCars = cars.filter(car => 
        fleet.registrationNumber.includes(car.registrationNumber)
      );

      // If no cars found, delete the fleet
      if (fleetCars.length === 0) {
        await ctx.db.delete(fleet._id);
        deletedCount++;
      }
    }

    return `Deleted ${deletedCount} empty fleets`;
  },
});


// Chat Analytics
export const getUnreadMessageCount = query({
  args: { userId: v.string(), lastReadTimestamp: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .filter(q => 
        q.and(
          q.eq(q.field('isAdmin'), false),
          q.gt(q.field('timestamp'), args.lastReadTimestamp)
        )
      )
      .collect();
    return messages.length;
  },
});

export const getLastMessage = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_userId', q => q.eq('userId', args.userId))
      .order('desc')
      .take(1);
    return messages[0];
  },
});

export const getChatAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query('messages').collect();
    const customers = await ctx.db.query('customers').collect();

    const totalMessages = messages.length;
    const activeChats = new Set(messages.map(m => m.userId)).size;
    const goldenMemberChats = customers
      .filter(c => c.goldenMember)
      .filter(c => messages.some(m => m.userId === c.userId))
      .length;

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentMessages = messages.filter(
      m => new Date(m.timestamp) > lastWeek
    ).length;

    return {
      totalMessages,
      activeChats,
      goldenMemberChats,
      recentMessages,
    };
  },
});

// Helper function to get date range
function getDateRange(period: 'week' | 'month' | 'quarter' | 'year', endDate: Date = new Date()) {
  const startDate = new Date(endDate);
  
  switch (period) {
    case 'week':
      // Set to Monday of current week
      startDate.setDate(endDate.getDate() - endDate.getDay() + 1);
      break;
    case 'month':
      startDate.setDate(1);
      break;
    case 'quarter':
      const quarterMonth = Math.floor(endDate.getMonth() / 3) * 3;
      startDate.setMonth(quarterMonth, 1);
      break;
    case 'year':
      startDate.setMonth(0, 1);
      break;
  }
  
  startDate.setHours(0, 0, 0, 0);
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
}

// Helper function to generate sample data based on period
function generateSampleData(period: 'week' | 'month' | 'quarter' | 'year') {
  const data: Record<string, number> = {};
  const now = new Date();
  let days = 7;
  
  switch (period) {
    case 'week':
      days = 7;
      break;
    case 'month':
      days = 30;
      break;
    case 'quarter':
      days = 90;
      break;
    case 'year':
      days = 365;
      break;
  }

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data[date.toISOString().split('T')[0]] = Math.floor(Math.random() * 10000) + 1000;
  }

  return data;
}

// Revenue Analytics
export const getRevenueSummary = query({
  args: {
    period: v.union(
      v.literal('week'),
      v.literal('month'),
      v.literal('quarter'),
      v.literal('year')
    ),
  },
  handler: async (ctx, args) => {
    const dailyRevenue = generateSampleData(args.period);
    const totalRevenue = Object.values(dailyRevenue).reduce((sum, val) => sum + val, 0);
    const totalBookings = Object.values(dailyRevenue).length;

    return {
      totalRevenue,
      totalBookings,
      averageRevenuePerBooking: totalRevenue / totalBookings,
      dailyRevenue
    };
  }
});

// Customer Analytics
export const getCustomerMetrics = query({
  args: {
    period: v.union(
      v.literal('week'),
      v.literal('month'),
      v.literal('quarter'),
      v.literal('year')
    ),
  },
  handler: async (ctx, args) => {
    return {
      totalCustomers: 100,
      activeCustomers: 65,
      goldenMembers: 25,
      customerActivityRate: 65,
      goldenMemberRate: 25,
      topCustomers: [
        { id: '1', bookings: 15 },
        { id: '2', bookings: 12 },
        { id: '3', bookings: 10 }
      ]
    };
  }
});

// Booking Analytics
export const getBookingMetrics = query({
  args: {
    period: v.union(
      v.literal('week'),
      v.literal('month'),
      v.literal('quarter'),
      v.literal('year')
    ),
  },
  handler: async (ctx, args) => {
    const dailyBookings = generateSampleData(args.period);
    const totalBookings = Object.values(dailyBookings).reduce((sum, val) => sum + val, 0);

    return {
      totalBookings,
      averageDuration: 5.2,
      dailyBookings,
      pickupLocations: {
        'Downtown': 45,
        'Airport': 35,
        'Suburban': 20
      },
      extrasUsage: {
        'GPS': 80,
        'Child Seat': 45,
        'Additional Driver': 30,
        'Insurance': 90
      }
    };
  }
});

// Car Analytics
export const getCarMetrics = query({
  args: {
    period: v.union(
      v.literal('week'),
      v.literal('month'),
      v.literal('quarter'),
      v.literal('year')
    ),
  },
  handler: async (ctx, args) => {
    return {
      totalCars: 43,
      availableCars: 32,
      fleetUtilizationRate: 70,
      popularCategories: {
        'SUV': 15,
        'Sedan': 12,
        'Luxury': 8,
        'Sports': 5,
        'Van': 3
      },
      carRatings: {
        'Toyota Camry': 4.5,
        'Honda CR-V': 4.3,
        'BMW 3 Series': 4.8
      }
    };
  }
});

// Performance Metrics
export const getPerformanceMetrics = query({
  args: {
    period: v.union(
      v.literal('week'),
      v.literal('month'),
      v.literal('quarter'),
      v.literal('year')
    ),
  },
  handler: async (ctx, args) => {
    const dailyMetrics: Record<string, { revenue: number; bookings: number }> = {};
    const dailyRevenue = generateSampleData(args.period);
    
    Object.entries(dailyRevenue).forEach(([date, revenue]) => {
      dailyMetrics[date] = {
        revenue,
        bookings: Math.floor(revenue / 1000)
      };
    });

    return {
      totalRevenue: Object.values(dailyMetrics).reduce((sum, val) => sum + val.revenue, 0),
      bookingSuccessRate: 85.5,
      averageBookingValue: 1082.05,
      dailyMetrics
    };
  }
});

export const getPopularCars = query({
  args: {
    period: v.union(
      v.literal('week'),
      v.literal('month'),
      v.literal('quarter'),
      v.literal('year')
    ),
  },
  handler: async (ctx, args) => {
    return {
      totalRentals: 250,
      topModel: 'Toyota Camry',
      averageRating: 4.5,
      carRentals: {
        'Toyota Camry': 50,
        'Honda CR-V': 45,
        'BMW 3 Series': 40,
        'Tesla Model 3': 35,
        'Mercedes C-Class': 30
      },
      categoryRentals: {
        'Sedan': 95,
        'SUV': 85,
        'Luxury': 70
      }
    };
  }
});