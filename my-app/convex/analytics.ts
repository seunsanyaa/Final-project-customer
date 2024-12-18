import { v } from 'convex/values';
import { query } from './_generated/server';

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
    const insurancePrice = extras.insurance ? 10 : 0;
    const gpsPrice = extras.gps ? 5 : 0;
    const childSeatPrice = extras.childSeat ? 8 : 0;
    const chaufferPrice = extras.chauffer ? 100 : 0;
    const travelKitPrice = extras.travelKit ? 0 : 0;
    let totalsum = basePrice + insurancePrice + gpsPrice + childSeatPrice + chaufferPrice + travelKitPrice;
    
    // Apply promotion if available
    if (promotionValue) {
      totalsum = totalsum * (1 - promotionValue / 100);
    }

    // Calculate total price
    const totalprice = Math.ceil(totalsum * totalDays * 100) / 100;
    
    // Calculate installment amount
    const installmentAmount = totalDays < 7 
      ? totalsum 
      : (totalsum * totalDays) / Math.floor(totalDays / 7);
    
    // Round installment to 2 decimal places
    const roundedInstallmentAmount = Math.ceil(installmentAmount * 100) / 100;

    return {
      totalPrice: totalprice,
      installmentAmount: roundedInstallmentAmount,
      numberOfInstallments: totalDays < 7 ? totalDays : Math.floor(totalDays / 7),
      pricePerDay: totalsum
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

    // Get tomorrow's date (end of today)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString();
    
    // Get bookings where today falls between start and end date (inclusive)
    const currentBookings = await ctx.db
      .query('bookings')
      .withIndex('by_customerId', (q) => q.eq('customerId', args.customerId))
      .filter((q) => 
        q.and(
          q.lt(q.field('startDate'), tomorrowISO), // booking starts before tomorrow
          q.gt(q.field('endDate'), todayISO)       // booking ends after today
        )
      )
      .collect();

    // If no current bookings, return null
    if (currentBookings.length === 0) {
      return null;
    }

    // Get car details for the booking
    const bookingsWithDetails = await Promise.all(
      currentBookings.map(async (booking) => {
        const car = await ctx.db
          .query('cars')
          .withIndex('by_registrationNumber', (q) => 
            q.eq('registrationNumber', booking.carId)
          )
          .first();

        // Calculate days remaining using Date objects
        const endDate = new Date(booking.endDate);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        
        const daysRemaining = Math.ceil(
          (endDate.getTime() - today.getTime()) / 
          (1000 * 60 * 60 * 24)
        );

        return {
          ...booking,
          carDetails: car ? {
            maker: car.maker,
            model: car.model,
            year: car.year,
            color: car.color,
            trim: car.trim,
            registrationNumber: car.registrationNumber
          } : null,
          daysRemaining
        };
      })
    );

    // Return the first current booking (in case there are multiple)
    return bookingsWithDetails[0];
  }
});


