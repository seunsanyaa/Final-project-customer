import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const checkdropoffpickup = query({
	args: {
		customerId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.query('bookings').filter(q => q.eq(q.field('customerId'), args.customerId)).collect();
	}
});

export const adminbookings = query({
	handler: async (ctx) => {
		return await ctx.db.query('bookings').collect();
	}
});

export const filterBookings = query({
	args: {
		customerId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.query('bookings').filter(q => q.eq(q.field('customerId'), args.customerId)).collect();
	}
});
// Create a new booking
export const createBooking = mutation({
	args: {
		customerId: v.string(),
		carId: v.string(),
		startDate: v.string(),
		endDate: v.string(),
		totalCost: v.number(),
		paidAmount: v.number(),
		status: v.string(),
		pickupLocation: v.string(),
		dropoffLocation: v.string(),
		paymentType: v.optional(v.string()),
		installmentPlan: v.optional(
			v.object({
				frequency: v.string(),
				totalInstallments: v.number(),
				amountPerInstallment: v.number(),
				remainingInstallments: v.number(),
				nextInstallmentDate: v.string(),
			})
		),
		extras: v.optional(
			v.object({
				insurance: v.boolean(),
				insuranceCost: v.number(),
				gps: v.boolean(),
				childSeat: v.boolean(),
				chauffer: v.boolean(),
				travelKit: v.boolean()
			})
		)
	},
	handler: async (ctx, args) => {
		// 1. Find the car first to get its details
		const car = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', q => q.eq('registrationNumber', args.carId))
			.first();

		if (!car) {
			throw new Error('Car not found');
		}

		
	

		// 4. Update car availability
		await ctx.db.patch(car._id, {
			available: false
		});

		// 5. Create the booking
		const bookingId = await ctx.db.insert('bookings', args);

		return bookingId;
	},
});

// Read a booking by ID
export const getBooking = query({
	args: { id: v.id('bookings') },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

// Read all bookings
export const getAllBookings = query({
	handler: async (ctx) => {
		return await ctx.db.query('bookings').collect();
	},
});

// Update a booking
export const updateBooking = mutation({
	args: {
		id: v.id('bookings'),
		customerId: v.optional(v.string()),
		carId: v.optional(v.string()),
		startDate: v.optional(v.string()),
		endDate: v.optional(v.string()),
		totalCost: v.optional(v.number()),
		paidAmount: v.optional(v.number()),
		status: v.optional(v.string()),
		pickupLocation: v.optional(v.string()),
		dropoffLocation: v.optional(v.string()),
		paymentType: v.optional(v.string()),
		installmentPlan: v.optional(
			v.object({
				frequency: v.string(),
				totalInstallments: v.number(),
				amountPerInstallment: v.number(),
				remainingInstallments: v.number(),
				nextInstallmentDate: v.string(),
			})
		),
		extras: v.optional(
			v.object({
				insurance: v.boolean(),
				insuranceCost: v.number(),
				gps: v.boolean(),
				childSeat: v.boolean(),
				chauffer: v.boolean(),
				travelKit: v.boolean()
			})
		)
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;
		await ctx.db.patch(id, updates);
		return id;
	},
});



// Get bookings by customer ID
export const getBookingsByCustomer = query({
	args: { customerId: v.string() },
	handler: async (ctx, args) => {
		const bookings = await ctx.db
			.query('bookings')
			.withIndex('by_customerId', (q) => q.eq('customerId', args.customerId))
			.filter(q => q.neq(q.field('status'), 'cancelled'))
			.collect();

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Instead of updating the DB, just modify the local object
		const updatedBookings = await Promise.all(
			bookings.map(async (booking) => {
				const startDate = new Date(booking.startDate);
				const endDate = new Date(booking.endDate);
				startDate.setHours(0, 0, 0, 0);
				endDate.setHours(0, 0, 0, 0);

				// Only modify the local status without DB update
				if (booking.status !== 'completed' && today > endDate) {
					booking.status = 'completed';
				}

				const car = await ctx.db
					.query('cars')
					.withIndex('by_registrationNumber', (q) =>
						q.eq('registrationNumber', booking.carId)
					)
					.first();

				return {
					...booking,
					carDetails: car
						? `${car.maker} ${car.model} (${car.year})`
						: 'Not available',
					make: car?.maker || 'Not available',
					model: car?.model || 'Not available',
					color: car?.color || 'Not available',
					trim: car?.trim || 'Not available',
					customerName: 'Not available',
					rewardsPointsUsed: 0,
					rewardsPointsCredited: 'Not available',
					cancellationPolicy: 'Standard 24-hour cancellation policy applies',
					isCurrentBooking: today >= startDate && today <= endDate,
				};
			})
		);

		// Sort bookings: current bookings first, then by date
		return updatedBookings.sort((a, b) => {
			if (a.isCurrentBooking && !b.isCurrentBooking) return -1;
			if (!a.isCurrentBooking && b.isCurrentBooking) return 1;
			return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
		});
	},
});

export const addReview = mutation({
	args: { reviewId: v.string(), bookingId: v.id('bookings') },
	handler: async (ctx, args) => {
		return await ctx.db.patch(args.bookingId, { reviewId: args.reviewId });
	},
});

// Get bookings by car ID
export const getBookingsByCar = query({
	args: { carId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('bookings')
			.withIndex('by_carId', (q) => q.eq('carId', args.carId))
			.collect();
	},
});

// Add this new query
export const getBookingDetails = query({
	args: { bookingId: v.id('bookings') },
	handler: async (ctx, args) => {
		const booking = await ctx.db.get(args.bookingId);
		if (!booking) {
			throw new Error(`Booking with ID ${args.bookingId} not found.`);
		}

		const car = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', (q) =>
				q.eq('registrationNumber', booking.carId)
			)
			.first();

		const payments = await ctx.db
			.query('payments')
			.withIndex('by_bookingId', (q) => q.eq('bookingId', args.bookingId))
			.collect();

		const totalPaid = payments.reduce(
			(sum, payment) => sum + payment.amount,
			0
		);

		return {
			...booking,
			carDetails: car
				? `${car.maker} ${car.model} (${car.year})`
				: 'Not available',
			make: car?.maker,
			model: car?.model,
			color: car?.color,
			trim: car?.trim,
			customerName: 'Not available',
			totalPaid,
			rewardsPointsEarned: Math.floor(booking.totalCost * 0.1),
			rewardsPointsUsed: 0,
			rewardsPointsCredited: 'Not available',
			cancellationPolicy: 'Standard 24-hour cancellation policy applies',
		};
	},
});

// Update booking with total paid amount
export const updateBookingWithTotalPaid = mutation({
	args: {
		id: v.id('bookings'), // Booking ID
	},
	handler: async (ctx, args) => {
		// Manually call the query to fetch payments by booking ID
		const payments = await ctx.db
			.query('payments')
			.withIndex('by_bookingId', (q) => q.eq('bookingId', args.id))
			.collect();

		// Handle case where no payments exist
		if (!payments || payments.length === 0) {
			return `No payments found for booking ID ${args.id}.`;
		}

		// Sum the paid amounts
		const totalPaidAmount = payments.reduce(
			(sum, payment) => sum + payment.amount,
			0
		);

		// Update the booking with the new total paid amount
		await ctx.db.patch(args.id, { paidAmount: totalPaidAmount });

		return `Booking with ID ${args.id} has been updated with total paid amount: ${totalPaidAmount}.`;
	},
});

// Get car by car ID
export const getCarByCarId = query({
	args: { carId: v.string() },
	handler: async (ctx, args) => {
		const car = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', (q) =>
				q.eq('registrationNumber', args.carId)
			)
			.first();

		if (!car) {
			throw new Error(`Car with registration number ${args.carId} not found.`);
		}

		return car;
	},
});


export const getPendingReviewsByCustomer = query({
	args: { customerId: v.string() },
	handler: async (ctx, args) => {
		const { customerId } = args;

		// Fetch all bookings for the given customerId
		const bookings = await ctx.db
			.query('bookings')
			.withIndex('by_customerId', (q) => q.eq('customerId', customerId))
			.collect();

		// Filter out bookings that already have a reviewId
		const pendingReviews = bookings.filter((booking) => !booking.reviewId);

		// Fetch car details for each pending booking
		const bookingsWithCarDetails = await Promise.all(
			pendingReviews.map(async (booking) => {
				const car = await ctx.db
					.query('cars')
					.withIndex('by_registrationNumber', (q) =>
						q.eq('registrationNumber', booking.carId)
					)
					.first();

				return {
					...booking,
					carDetails: car
						? {
								maker: car.maker,
								model: car.model,
								year: car.year,
								color: car.color,
								trim: car.trim,
								pictures: car.pictures,
							}
						: null,
				};
			})
		);

		return bookingsWithCarDetails;
	},
});

// Add this mutation
export const checkAndUpdateBookingStatus = mutation({
	args: {
		bookingId: v.id('bookings'),
	},
	handler: async (ctx, args) => {
		const booking = await ctx.db.get(args.bookingId);
		if (!booking) {
			throw new Error('Booking not found');
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const endDate = new Date(booking.endDate);
		endDate.setHours(0, 0, 0, 0);

		// Check if booking is past and fully paid
		if (
			endDate < today &&
			booking.paidAmount >= booking.totalCost &&
			booking.status !== 'completed'
		) {
			// Update to completed
			await ctx.db.patch(args.bookingId, {
				status: 'completed',
			});

			return {
				success: true,
				message: 'Booking marked as completed',
				status: 'completed',
			};
		}

		return {
			success: false,
			message: 'Booking not eligible for completion',
			status: booking.status,
		};
	},
});

// Modify the awardBookingRewardPoints mutation to check payment session
export const awardBookingRewardPoints = mutation({
	args: {
		bookingId: v.id('bookings'),
		customerId: v.string(),
	},
	handler: async (ctx, args) => {
		// Check if there's a completed payment session for this booking
		const paymentSession = await ctx.db
			.query('paymentSessions')
			.withIndex('by_bookingId', (q) => q.eq('bookingId', args.bookingId))
			.filter((q) => q.eq(q.field('status'), 'completed'))
			.first();

		if (!paymentSession) {
			return {
				success: false,
				message: 'No completed payment session found for this booking',
			};
		}

		const booking = await ctx.db.get(args.bookingId);
		if (!booking) {
			throw new Error('Booking not found');
		}

		// Calculate points (10% of total cost)
		const pointsToAward = Math.floor(paymentSession.paidAmount * 0.1);

		// Award points to customer
		const customer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.customerId))
			.first();

		if (customer) {
			const oldPoints = customer.rewardPoints || 0;
			const newPoints = oldPoints + pointsToAward;
			
			await ctx.db.patch(customer._id, {
				rewardPoints: newPoints,
			});

			// Call the new notification function
			await ctx.db.insert('notifications', {
				userId: args.customerId,
				message: `You've earned ${pointsToAward} reward points from your recent booking!`,
				type: 'rewards',
				isRead: false,
				createdAt: Date.now(),
			});
		}

		return {
			success: true,
			message: `Awarded ${pointsToAward} points`,
			pointsAwarded: pointsToAward,
		};
	},
});

// Add this new query for daily booking statistics
export const getDailyBookingStats = query({
	handler: async (ctx) => {
		const bookings = await ctx.db.query('bookings').collect();

		// Get date 7 days ago
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // -6 to include today
		sevenDaysAgo.setHours(0, 0, 0, 0);

		// Create a map to store booking counts by day
		const dailyStats = new Map<string, number>();

		// Initialize all 7 days with 0 bookings
		for (let i = 0; i < 7; i++) {
			const date = new Date(sevenDaysAgo);
			date.setDate(date.getDate() + i);
			const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
			dailyStats.set(dayOfWeek, 0);
		}

		// Count bookings for the last 7 days
		bookings.forEach((booking) => {
			const bookingDate = new Date(booking.startDate);
			// Only count bookings from the last 7 days
			if (bookingDate >= sevenDaysAgo) {
				const dayOfWeek = bookingDate.toLocaleDateString('en-US', { weekday: 'short' });
				dailyStats.set(dayOfWeek, (dailyStats.get(dayOfWeek) || 0) + 1);
			}
		});

		// Convert to format needed for ResponsiveLine
		const data = Array.from(dailyStats.entries()).map(([x, y]) => ({
			x,
			y,
		}));

		return data;
	},
});

// Add this new query for booking growth statistics
export const getBookingGrowthStats = query({
	handler: async (ctx) => {
		const bookings = await ctx.db.query('bookings').collect();
		
		// Create a map to store bookings by date
		const bookingsByDate = new Map();
		
		bookings.forEach((booking) => {
			// Convert to YYYY-MM-DD format for consistent grouping
			const bookingDate = new Date(booking.startDate).toISOString().split('T')[0];
			
			if (!bookingsByDate.has(bookingDate)) {
				bookingsByDate.set(bookingDate, {
					date: bookingDate,
					count: 0,
					revenue: 0
				});
			}
			
			const dateStats = bookingsByDate.get(bookingDate);
			dateStats.count++;
			dateStats.revenue += booking.totalCost;
		});
		
		// Convert map to array and sort by date
		const growthData = Array.from(bookingsByDate.values())
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
		
		// Calculate cumulative totals
		let cumulativeCount = 0;
		let cumulativeRevenue = 0;
		
		const statsWithCumulative = growthData.map(stat => {
			cumulativeCount += stat.count;
			cumulativeRevenue += stat.revenue;
			return {
				...stat,
				cumulativeCount,
				cumulativeRevenue
			};
		});

		return statsWithCumulative;
	},
});

// Get total active/upcoming bookings
export const getActiveBookingsCount = query({
	handler: async (ctx) => {
		const bookings = await ctx.db.query('bookings').collect();
		
		// Get current date and set time to start of day for consistent comparison
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		// Filter bookings where end date is in the future or today
		const activeBookings = bookings.filter(booking => {
			const endDate = new Date(booking.endDate);
			endDate.setHours(0, 0, 0, 0);
			return endDate >= today;
		});
		
		return {
			total: activeBookings.length,
			bookings: activeBookings
		};
	},
});

// Add this new mutation
export const cancelBooking = mutation({
	args: {
		bookingId: v.id('bookings')
	},
	handler: async (ctx, args) => {
		// 1. Get the booking details
		const booking = await ctx.db.get(args.bookingId);
		if (!booking) {
			throw new Error('Booking not found');
		}

		// 2. Get the car details
		const car = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', q => q.eq('registrationNumber', booking.carId))
			.first();

		if (!car) {
			throw new Error('Car not found');
		}


	
		// 5. Update car availability
		await ctx.db.patch(car._id, {
			available: true
		});

		// 6. Update booking status
		await ctx.db.patch(args.bookingId, {
			status: 'cancelled'
		});

		return { success: true };
	}
});

// Add this new query for checking upcoming bookings and sending notifications
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
