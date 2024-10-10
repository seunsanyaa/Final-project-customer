import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createCar = mutation({
	args: {
		model: v.string(),
		color: v.string(),
		maker: v.string(),
		lastMaintenanceDate: v.string(),
		available: v.boolean(),
		year: v.number(),
		registrationNumber: v.string(),
		pictures: v.array(v.string()),
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
			disabled: false,
		});
		return `Car with ID ${carId} has been created.`;
	},
});

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
		lastMaintenanceDate: v.optional(v.string()),
		available: v.optional(v.boolean()),
		year: v.optional(v.number()),
		disabled: v.optional(v.boolean()),
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
	args: {
		registrationNumber: v.string(),
	},
	handler: async (ctx, args) => {
		const car = await ctx.db
			.query('cars')
			.withIndex('by_registrationNumber', (q) =>
				q.eq('registrationNumber', args.registrationNumber)
			)
			.first();

		if (!car) {
			return `Car with registration number ${args.registrationNumber} does not exist.`;
		}

		return car;
	},
});

export const getAllCars = query({
	handler: async (ctx) => {
		const cars = await ctx.db.query('cars').collect();
		return cars;
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
