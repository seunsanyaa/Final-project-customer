import { v } from 'convex/values';
import { mutation, query, action } from './_generated/server';
import { api } from './_generated/api';

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
		pricePerDay: v.number(), 
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
		price: v.optional(v.number()), // Add price here
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

export const getCarSpecifications = action({
	args: {
		maker: v.string(),
		model: v.string(),
		year: v.string(),
	},
	handler: async (ctx, args) => {
		const { maker, model, year } = args;

		// Log the extracted values
		console.log('Input values:', { maker, model, year });

		const response = await fetch(
			`https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=${encodeURIComponent(
				maker
			)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`
		);

		const text = await response.text();

		// The API returns JSONP, so we need to extract the JSON
		const json = JSON.parse(text.replace(/^\s*\w+\s*\(|\)\s*$/g, ""));

		if (!json.Trims || json.Trims.length === 0) {
			throw new Error("No specifications found for the given car.");
		}

		// Pick the first trim
		const trim = json.Trims[0];

		// Extract necessary specifications
		const specifications: {
			engineType: string;
			engineCylinders: string;
			engineHorsepower: string;
			fuelType: string;
			transmission: string;
			drive: string;
			seats: string;
		} = {
			engineType: trim.model_engine_type || "N/A",
			engineCylinders: trim.model_engine_cyl || "N/A",
			engineHorsepower: trim.model_engine_power_ps
				? `${trim.model_engine_power_ps} PS`
					: "N/A",
			fuelType: trim.model_engine_fuel || "N/A",
			transmission: trim.model_transmission_type || "N/A",
			drive: trim.model_drive || "N/A",
			seats: trim.model_seats || "N/A",
		};

		return specifications;
	},
});
