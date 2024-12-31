import { v } from 'convex/values';
import { mutation, query, action } from './_generated/server';
import { api } from './_generated/api';


export const getSimilarCar = query({
	args: {
		registrationNumber: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.query('cars').filter(q => q.eq(q.field('registrationNumber'), args.registrationNumber)).collect();
	}
});

export const AdminSearchCar = query({
	args: {
		registrationNumber: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.query('cars').filter(q => q.eq(q.field('registrationNumber'), args.registrationNumber)).collect();
	}
});
// Action to fetch and store car specifications
export const fetchAndStoreCarSpecifications = action({
	args: {
		maker: v.string(),
		model: v.string(),
		year: v.number(),
		trim: v.string(),
		registrationNumber: v.string(),
	},
	handler: async (ctx, args) => {
		const { maker, model, year, trim, registrationNumber } = args;
		const trimFirstWord = trim.split(' ')[0];
		const apiUrl = `https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=${encodeURIComponent(
			maker
		)}&model=${encodeURIComponent(model)}&year=${year}&trim=${encodeURIComponent(trimFirstWord)}`;

		try {
			const response = await fetch(apiUrl);
			const text = await response.text();
			const jsonMatch = text.match(/\{.+\}/);
			if (!jsonMatch) {
				throw new Error('Invalid API response');
			}

			const json = JSON.parse(jsonMatch[0]);

			if (!json.Trims || json.Trims.length === 0) {
				throw new Error('No specifications found for the given car details');
			}

			const matchingTrim = json.Trims.find((t: any) => t.model_trim === trim);
			if (!matchingTrim) {
				throw new Error(`No matching trim found for trim "${trim}"`);
			}

			const specifications = {
				registrationNumber: registrationNumber,
				engineType: matchingTrim.model_engine_type || "N/A",
				engineCylinders: matchingTrim.model_engine_cyl || "N/A",
				engineHorsepower: matchingTrim.model_engine_power_ps
					? `${matchingTrim.model_engine_power_ps} PS`
					: "N/A",
				fuelType: matchingTrim.model_engine_fuel || "N/A",
				transmission: matchingTrim.model_transmission_type || "N/A",
				drive: matchingTrim.model_drive || "N/A",
				doors: matchingTrim.model_doors || "N/A",
				bodyType: matchingTrim.model_body || "N/A",
			};

			// Call the addSpecification mutation
			const result:any = await ctx.runMutation(api.car.addSpecification, { specifications });
			return result;
		} catch (error) {
			console.error('Error fetching car specifications:', error);
			throw new Error('Failed to fetch specifications');
		}
	},
});

// New Mutation to Add Specifications
export const addSpecification = mutation({
	args: {
		specifications: v.object({
			registrationNumber: v.string(),
			engineType: v.string(),
			engineCylinders: v.string(),
			engineHorsepower: v.string(),
			fuelType: v.string(),
			transmission: v.string(),
			drive: v.string(),
			doors: v.string(),
			bodyType: v.string(),
		}),
	},
	handler: async (ctx, { specifications }) => {
		await ctx.db.insert('specifications', specifications);
		console.log(`Specifications for car ID ${specifications.registrationNumber} have been stored.`);
		return `Specifications for car ID ${specifications.registrationNumber} have been stored.`;
	},
});

// Modified createCar mutation

export const createCar = mutation({
	args: {
		model: v.string(),
    color: v.string(),
    maker: v.string(),
    trim: v.string(),
    lastMaintenanceDate: v.string(),
    available: v.boolean(),
    disabled: v.boolean(),
    golden: v.boolean(),
    year: v.number(),
    registrationNumber: v.string(),
    pictures: v.array(v.string()),
    pricePerDay: v.number(),
    averageRating: v.optional(v.number()),
    categories: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const existingCar = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', (q) =>
				q.eq('registrationNumber', args.registrationNumber)
			)
			.first();

		if (existingCar) {
			return `Car with registration number ${args.registrationNumber} already exists.`;
		}

		const carId = await ctx.db.insert('cars', {
			...args,

		});

		// Fetch and return the newly created car
		const newCar = await ctx.db.get(carId);
		return newCar;
	},
});

// Existing mutations, queries, and actions...
export const deleteCar = mutation({
	args: {
		registrationNumber: v.string(),
	},
	handler: async (ctx, args) => {
		const existingCar = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', (q) =>
				q.eq('registrationNumber', args.registrationNumber)
			)
			.first();

		if (!existingCar) {
			throw new Error(`Car with registration number ${args.registrationNumber} does not exist.`);
		}

		await ctx.db.delete(existingCar._id);
		return `Car with registration number ${args.registrationNumber} has been deleted.`;
	},
});

export const updateCar = mutation({
	args: {
		registrationNumber: v.string(),
		model: v.optional(v.string()),
		color: v.optional(v.string()),
		maker: v.optional(v.string()),
		trim: v.optional(v.string()),
		lastMaintenanceDate: v.optional(v.string()),
		available: v.optional(v.boolean()),
		disabled: v.optional(v.boolean()),
		golden: v.optional(v.boolean()),
		year: v.optional(v.number()),
		pictures: v.optional(v.array(v.string())),
		pricePerDay: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const existingCar = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', (q) =>
				q.eq('registrationNumber', args.registrationNumber)
			)
			.first();

		if (!existingCar) {
			return `Car with registration number ${args.registrationNumber} does not exist.`;
		}

		const updatedData = {
			...existingCar,
			...args,
		};

		await ctx.db.patch(existingCar._id, updatedData);

		return `Car with registration number ${args.registrationNumber} has been updated.`;
	},
});

export const getCar = query({
	args: { registrationNumber: v.string() },
	handler: async (ctx, args) => {
		const car = await ctx.db
			.query("cars")
			.withIndex("by_registrationNumber", (q) => 
				q.eq("registrationNumber", args.registrationNumber)
			)
			.first();

		if (!car) {
			throw new Error(`Car with registration number ${args.registrationNumber} not found`);
		}

		return car;
	}
});

export const getAllCars = query({
	args: {
		golden: v.optional(v.boolean()),
		disabled: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		// If no filters are provided, return all cars (including disabled ones)
		if (args.disabled === undefined && args.golden === undefined) {
			return await ctx.db.query("cars").collect();
		}

		// If golden filter is provided
		if (args.golden !== undefined) {
			return await ctx.db
				.query("cars")
				.filter((q) => q.eq(q.field('golden'), args.golden))
				.collect();
		}

		// If disabled filter is provided
		if (args.disabled !== undefined) {
			return await ctx.db
				.query("cars")
				.filter((q) => q.eq(q.field('disabled'), args.disabled))
				.collect();
		}

		// Fallback (should never reach here due to the first condition)
		return await ctx.db.query("cars").collect();
	},
});

export const getAllAvailableCarsGrouped = query({
	handler: async (ctx) => {
		const cars = await ctx.db
			.query('cars')
			.filter((q) => q.eq(q.field('available'), true))
			.collect();

		const groupedCars = cars.reduce((acc, car) => {
			const key = `${car.maker}:${car.model}`;
			if (!acc[key]) {
				acc[key] = [];
			}
			acc[key].push(car);
			return acc;
		}, {} as Record<string, typeof cars>);

		return Object.entries(groupedCars).map(([key, cars]) => {
			const [maker, model] = key.split(':');
			return { maker, model, cars };
		});
	},
});

export const getCarSpecifications = query({
	args: {
		registrationNumber: v.string(),
	},
	handler: async (ctx, args) => {
		const specifications = await ctx.db
			.query("specifications")
			.withIndex("by_registrationNumber", (q) => 
				q.eq("registrationNumber", args.registrationNumber)
			)
			.first();

		if (!specifications) {
			throw new Error(`No specifications found for car with registration number ${args.registrationNumber}`);
		}

		return specifications;
	},
});

export const getFilteredCars = query({
	args: {
		maker: v.optional(v.string()),
		model: v.optional(v.string()),
		year: v.optional(v.number()),
		engineType: v.optional(v.string()),
		engineCylinders: v.optional(v.string()),
		fuelType: v.optional(v.string()),
		transmission: v.optional(v.string()),
		drive: v.optional(v.string()),
		doors: v.optional(v.string()),
		engineHorsepower: v.optional(v.string()),
		golden: v.optional(v.boolean()),
		disabled: v.optional(v.boolean()),
		categories: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		// First get all non-disabled cars
		const cars = await ctx.db
			.query("cars")
			.filter((q) => {
				// Start with the disabled check
				let filter = q.eq(q.field('disabled'), args.disabled ?? false);
				filter = q.and(
					filter,
					q.eq(q.field('available'), true)
				);
				
				// If golden filter is provided, add it to the query
				if (args.golden !== undefined) {
					filter = q.and(
						filter,
						q.eq(q.field('golden'), args.golden)
					);
				}
				
				return filter;
			})
			.collect();

		const specs = await ctx.db.query("specifications").collect();

		const specsMap = specs.reduce((acc, spec) => {
			acc[spec.registrationNumber] = spec;
			return acc;
		}, {} as Record<string, typeof specs[0]>);

		return cars.filter((car) => {
			const carSpecs = specsMap[car.registrationNumber];
			
			// Apply other filters
			if (args.maker && !car.maker.toLowerCase().includes(args.maker.toLowerCase())) return false;
			if (args.model && !car.model.toLowerCase().includes(args.model.toLowerCase())) return false;
			if (args.year && car.year !== args.year) return false;

			// Category filter
			if (args.categories && args.categories.length > 0) {
				if (!car.categories) return false;
				// Check if any of the searched categories match the car's categories
				if (!args.categories.some(category => car.categories?.includes(category))) return false;
			}

			// Specification filters
			if (!carSpecs) return true;

			if (args.engineType && !carSpecs.engineType.toLowerCase().includes(args.engineType.toLowerCase())) return false;
			if (args.engineCylinders && !carSpecs.engineCylinders.toLowerCase().includes(args.engineCylinders.toLowerCase())) return false;
			if (args.fuelType && !carSpecs.fuelType.toLowerCase().includes(args.fuelType.toLowerCase())) return false;
			if (args.transmission && !carSpecs.transmission.toLowerCase().includes(args.transmission.toLowerCase())) return false;
			if (args.drive && !carSpecs.drive.toLowerCase().includes(args.drive.toLowerCase())) return false;
			if (args.doors && !carSpecs.doors.toLowerCase().includes(args.doors.toLowerCase())) return false;
			if (args.engineHorsepower && !carSpecs.engineHorsepower.toLowerCase().includes(args.engineHorsepower.toLowerCase())) return false;
			
			return true;
		});
	},
});

export const getCarsWithReviews = query({
	handler: async (ctx) => {
		// Fetch all cars that have an averageRating
		const cars = await ctx.db
			.query("cars")
			.filter((q) => q.neq(q.field("averageRating"), undefined))
			.collect();
		
		return cars;
	},
});
export const getCarWithTopReviews = query({
	args: { registrationNumber: v.string() },
	handler: async (ctx, args) => {
		// Get the car
		const car = await ctx.db
			.query("cars")
			.withIndex("by_registrationNumber", (q) => 
				q.eq("registrationNumber", args.registrationNumber)
			)
			.first();

		if (!car) {
			throw new Error(`Car with registration number ${args.registrationNumber} not found`);
		}

		// Get all bookings for this car
		const bookings = await ctx.db
			.query("bookings")
			.withIndex("by_carId", (q) => q.eq("carId", args.registrationNumber))
			.collect();

		// Get reviews for these bookings
		const reviews = await Promise.all(
			bookings
				.filter(booking => booking.reviewId) // Only get bookings with reviews
				.map(async (booking) => {
					const review = await ctx.db
						.query("reviews")
						.withIndex("by_bookingId", (q) => q.eq("bookingId", booking._id))
						.first();

					if (review) {
						// Get user details
						const user = await ctx.db
							.query("users")
							.withIndex("by_userId", (q) => q.eq("userId", review.userId))
							.first();

						return {
							...review,
							userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
						};
					}
					return null;
				})
		);

		// Filter out null reviews
		const validReviews = reviews
			.filter((review): review is NonNullable<typeof review> => review !== null)
			// Sort reviews by numberOfStars in descending order
			.sort((a, b) => b.numberOfStars - a.numberOfStars)
			// Get the top three reviews
			.slice(0, 3);

		return {
			...car,
			reviews: validReviews,
		};
	},
});
export const getCarWithReviews = query({
	args: { 
		registrationNumber: v.string(),
		userId: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const car = await ctx.db
			.query("cars")
			.withIndex("by_registrationNumber", (q) => 
				q.eq("registrationNumber", args.registrationNumber)
			)
			.first();

		if (!car) {
			throw new Error(`Car with registration number ${args.registrationNumber} not found`);
		}

		// Get all bookings for this car
		const bookings = await ctx.db
			.query("bookings")
			.withIndex("by_carId", (q) => q.eq("carId", args.registrationNumber))
			.collect();

		// Get reviews for these bookings
		const reviews = await Promise.all(
			bookings
				.filter(booking => booking.reviewId)
				.map(async (booking) => {
					const review = await ctx.db
						.query("reviews")
						.withIndex("by_bookingId", (q) => q.eq("bookingId", booking._id))
						.first();

					if (review) {
						const isUserReview = args.userId ? review.userId === args.userId : false;
						
						// Include review if it's the user's review OR if it has 3+ stars
						if (isUserReview || review.numberOfStars >= 3) {
							// Get user details
							const user = await ctx.db
								.query("users")
								.withIndex("by_userId", (q) => q.eq("userId", review.userId))
								.first();

							return {
								...review,
								userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
								isUserReview
							};
						}
					}
					return null;
				})
		);

		// Filter out null reviews and sort them
		const validReviews = reviews
			.filter((review): review is NonNullable<typeof review> => review !== null)
			.sort((a, b) => {
				// First sort by user's own reviews
				if (a.isUserReview && !b.isUserReview) return -1;
				if (!a.isUserReview && b.isUserReview) return 1;
				// Then sort by date (most recent first)
				return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
			});

		return {
			...car,
			reviews: validReviews,
		};
	},
});

export const getSimilarCars = query({
	args: { 
		maker: v.optional(v.string()),
		model: v.optional(v.string()),
		excludeId: v.string(),
		limit: v.optional(v.number()),
		userId: v.optional(v.string()),
		categories: v.optional(v.array(v.string()))
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 3;
		const recommendations: any[] = [];
		
		// 1. Get previously rented cars if userId is provided
		if (args.userId) {
			const bookings = await ctx.db
				.query("bookings")
				.withIndex("by_customerId", q => q.eq("customerId", args.userId as string))
				.collect();

			for (const booking of bookings) {
				if (!booking.carId) continue;
				const rentedCar = await ctx.db
					.query("cars")
					.withIndex("by_registrationNumber", q => q.eq("registrationNumber", booking.carId))
					.filter(q => 
						q.and(
							q.neq(q.field("registrationNumber"), args.excludeId),
							q.eq(q.field('available'), true)
						)
					)
					.first();
				
				if (rentedCar && !recommendations.some(car => car.registrationNumber === rentedCar.registrationNumber)) {
					recommendations.push(rentedCar);
					if (recommendations.length >= Math.floor(limit / 3)) break;
				}
			}
		}

		// 2. Get cars with similar categories
		if (args.categories && args.categories.length > 0) {
			const similarCategoryCars = await ctx.db
				.query("cars")
				.filter(q => 
					q.and(
						q.neq(q.field("registrationNumber"), args.excludeId),
						q.eq(q.field('available'), true)
					)
				)
				.collect();

			const categoryCars = similarCategoryCars
				.filter(car => 
					car.categories?.some(category => args.categories?.includes(category)) &&
					!recommendations.some(rec => rec.registrationNumber === car.registrationNumber)
				)
				.slice(0, Math.floor(limit / 3));

			recommendations.push(...categoryCars);
		}

		// 3. Get cars with similar make/model
		if (args.maker || args.model) {
			const similarMakeModelCars = await ctx.db
				.query("cars")
				.filter(q => 
					q.and(
						q.neq(q.field("registrationNumber"), args.excludeId),
						q.eq(q.field('available'), true),
						args.maker ? q.eq(q.field("maker"), args.maker) :
						args.model ? q.eq(q.field("model"), args.model) :
						q.eq(q.field("available"), true)
					)
				)
				.collect();

			const filteredMakeModelCars = similarMakeModelCars
				.filter(car => !recommendations.some(rec => rec.registrationNumber === car.registrationNumber))
				.slice(0, limit - recommendations.length);

			recommendations.push(...filteredMakeModelCars);
		}

		// If we still haven't reached the limit, add random available cars
		if (recommendations.length < limit) {
			const remainingCount = limit - recommendations.length;
			const randomCars = await ctx.db
				.query("cars")
				.filter(q => 
					q.and(
						q.neq(q.field("registrationNumber"), args.excludeId),
						q.eq(q.field('available'), true)
					)
				)
				.collect();

			const filteredRandomCars = randomCars
				.filter(car => !recommendations.some(rec => rec.registrationNumber === car.registrationNumber))
				.slice(0, remainingCount);

			recommendations.push(...filteredRandomCars);
		}

		// Shuffle the recommendations to mix the different types
		const shuffled = recommendations.sort(() => Math.random() - 0.5);
		return shuffled.slice(0, limit);
	},
});

// Add new query for categories
export const getCarsByCategory = query({
	args: {
		category: v.optional(v.string()),
		disabled: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		if (!args.category || args.category === "all") {
			return ctx.db
				.query("cars")
				.filter((q) => 
					q.and(
						q.eq(q.field('disabled'), args.disabled ?? false),
						q.eq(q.field('available'), true)
					)
				)
				.collect();
		}

		const cars = await ctx.db
			.query("cars")
			.filter((q) => 
				q.and(
					q.eq(q.field('disabled'), args.disabled ?? false),
					q.eq(q.field('available'), true)
				)
			)
			.collect();

		// Filter cars that have the category in their categories array
		return cars.filter(car => 
			car.categories?.includes(args.category as string)
		);
	},
});

export const getNumberOfCars = query({
	handler: async (ctx): Promise<number> => {
		const cars = await ctx.db
			.query('cars')
			.collect();
		return cars.length;
	},
});

