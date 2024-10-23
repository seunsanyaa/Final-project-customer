import { v } from 'convex/values';
import { mutation, query, action } from './_generated/server';
import { api } from './_generated/api';

export const createCar = mutation({
	args: {
		model: v.string(),
		color: v.string(),
		maker: v.string(),
		trim: v.string(),
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
		trim: v.optional(v.string()),
		lastMaintenanceDate: v.optional(v.string()),
		available: v.optional(v.boolean()),
		year: v.optional(v.number()),
		pictures: v.optional(v.array(v.string())),
		disabled: v.optional(v.boolean()),
		pricePerDay: v.optional(v.number()), // Add price here
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
		year: v.number(),
		trim: v.string(),
	},
	handler: async (ctx, args) => {
		const { maker, model, year, trim } = args;
		// Extract the first word of the trim if it contains multiple words
		const trimFirstWord = trim.split(' ')[0];

		// Log the full URL with the first word of the trim
		console.log(`https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=${encodeURIComponent(maker)}&model=${encodeURIComponent(model)}&year=${year}&trim=${encodeURIComponent(trimFirstWord)}`);

		// Construct the API URL with the first word of the trim
		const apiUrl = `https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=${encodeURIComponent(maker)}&model=${encodeURIComponent(model)}&year=${year}&trim=${encodeURIComponent(trimFirstWord)}`;

		try {
			const response = await fetch(apiUrl);
			const text = await response.text();
			console.log('API Response:', text);
			// Extract JSON from JSONP response
			const jsonMatch = text.match(/\{.+\}/);
			if (!jsonMatch) {
				throw new Error('Invalid API response');
			}

			const json = JSON.parse(jsonMatch[0]);

			if (!json.Trims || json.Trims.length === 0) {
				throw new Error('No specifications found for the given car details');
			}

			// Find the trim that exactly matches the provided trim
			const matchingTrim = json.Trims.find((t: any) => t.model_trim === trim);

			if (!matchingTrim) {
				throw new Error(`No matching trim found for trim "${trim}"`);
			}

			const carData = matchingTrim;

			const specifications = {
				engineType: carData.model_engine_type || "N/A",
				engineCylinders: carData.model_engine_cyl || "N/A",
				engineHorsepower: carData.model_engine_power_ps
					? `${carData.model_engine_power_ps} PS`
					: "N/A",
				fuelType: carData.model_engine_fuel || "N/A",
				transmission: carData.model_transmission_type || "N/A",
				drive: carData.model_drive || "N/A",
				doors: carData.model_doors || "N/A",
			};

			return specifications;
		} catch (error) {
			console.error('Error fetching car specifications:', error);
			throw new Error('Failed to fetch specifications');
		}
	},
});
