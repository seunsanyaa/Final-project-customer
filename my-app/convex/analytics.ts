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
