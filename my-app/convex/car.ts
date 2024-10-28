import { v } from 'convex/values';
import { mutation, query, action } from './_generated/server';
import { api } from './_generated/api';

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
	},
	handler: async (ctx, args) => {
		const cars = await ctx.db.query("cars").collect();
		const specs = await ctx.db.query("specifications").collect();

		const specsMap = specs.reduce((acc, spec) => {
			acc[spec.registrationNumber] = spec;
			return acc;
		}, {} as Record<string, typeof specs[0]>);

		return cars.filter((car) => {
			const carSpecs = specsMap[car.registrationNumber];
			
			// Basic car filters
			if (args.maker && !car.maker.toLowerCase().includes(args.maker.toLowerCase())) return false;
			if (args.model && !car.model.toLowerCase().includes(args.model.toLowerCase())) return false;
			if (args.year && car.year !== args.year) return false;

			// Specification filters - only apply if specs exist and filter is provided
			if (!carSpecs) return true; // Show cars without specs unless specifically filtering for specs

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
