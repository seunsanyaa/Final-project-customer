import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// Helper function to calculate age from date of birth
const calculateAge = (dob: string): number => {
	const [day, month, year] = dob.split('.').map(Number);
	const birthDate = new Date(year, month - 1, day);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	// Adjust age if today's date is before the birthday
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
};

export const createCustomer = mutation({
	args: {
		userId: v.string(),
		nationality: v.string(),
		dateOfBirth: v.string(),
		phoneNumber: v.string(),
		licenseNumber: v.string(),
		address: v.string(),
		expirationDate: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (existingCustomer) {
			return `Customer with ID ${args.userId} already exists.`;
		}

		const user = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!user) {
			return `User with ID ${args.userId} does not exist.`;
		}

		const age = calculateAge(args.dateOfBirth);

		await ctx.db.insert('customers', {
			userId: user.userId,
			nationality: args.nationality,
			age: age, // Dynamically calculated age
			phoneNumber: args.phoneNumber,
			licenseNumber: args.licenseNumber,
			address: args.address,
			dateOfBirth: args.dateOfBirth,
			expirationDate: args.expirationDate ?? '',
			goldenMember: false,
			rewardPoints: 0,
		});

		return `Customer with ID ${args.userId} has been created.`;
	},
});

export const deleteCustomer = mutation({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!existingCustomer) {
			return `Customer with ID ${args.userId} does not exist.`;
		}

		await ctx.db.delete(existingCustomer._id);
		return `Customer with ID ${args.userId} has been deleted.`;
	},
});

export const updateCustomer = mutation({
	args: {
		userId: v.string(),
		nationality: v.optional(v.string()),
		dateOfBirth: v.optional(v.string()),
		phoneNumber: v.optional(v.string()),
		licenseNumber: v.optional(v.string()),
		address: v.optional(v.string()),
		expirationDate: v.optional(v.string()),
		rewardPoints: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!existingCustomer) {
			return `Customer with ID ${args.userId} does not exist.`;
		}

		let updatedAge = existingCustomer.age;

		// If dateOfBirth is being updated, recalculate age
		if (args.dateOfBirth) {
			updatedAge = calculateAge(args.dateOfBirth);
		}

		const updatedData = {
			...existingCustomer,
			...args,
			age: updatedAge, // Ensure age is updated if dob changes
		};

		await ctx.db.patch(existingCustomer._id, updatedData);
		return `Customer with ID ${args.userId} has been updated.`;
	},
});

export const upsertCustomer = mutation({
	args: {
		userId: v.string(),
		nationality: v.optional(v.string()),
		dateOfBirth: v.optional(v.string()),
		phoneNumber: v.optional(v.string()),
		licenseNumber: v.optional(v.string()),
		address: v.optional(v.string()),
		expirationDate: v.optional(v.string()),
		rewardPoints: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (existingCustomer) {
			let updatedAge = existingCustomer.age;

			// If dateOfBirth is being updated, recalculate age
			if (args.dateOfBirth) {
				updatedAge = calculateAge(args.dateOfBirth);
			}

			// Prepare the fields to update, excluding userId
			const { userId, ...updateFields } = args;
			const dataToUpdate = {
				...updateFields,
				age: args.dateOfBirth ? updatedAge : existingCustomer.age,
			};

			await ctx.db.patch(existingCustomer._id, dataToUpdate);
			return `Customer with ID ${args.userId} has been updated.`;
		} else {
			// Ensure all required fields are provided for creation
			const requiredFields = ['nationality', 'dateOfBirth', 'phoneNumber', 'licenseNumber', 'address'];
			for (const field of requiredFields) {
				if (!(field in args) || args[field as keyof typeof args] === undefined) {
					return `Missing required field: ${field} for creating a new customer.`;
				}
			}

			const age = calculateAge(args.dateOfBirth!); // Non-null assertion since we've checked

			await ctx.db.insert('customers', {
				userId: args.userId,
				nationality: args.nationality ?? '',
				age: age, // Dynamically calculated age
				phoneNumber: args.phoneNumber ?? '',
				licenseNumber: args.licenseNumber ?? '',
				address: args.address ?? '',
				dateOfBirth: args.dateOfBirth ?? '',
				expirationDate: args.expirationDate ?? '',
				goldenMember: false,
				rewardPoints: args.rewardPoints ?? 0,
			});
			return `Customer with ID ${args.userId} has been created.`;
		}
	},
});

export const getAllCustomers = query({
	handler: async (ctx) => {
		const custs = await ctx.db.query('customers').collect();
		return custs;
	},
});

export const getCustomerByUserId = query({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const customer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!customer) {
			return null; // Return null if no customer is found
		}

		return customer; // Return the found customer
	},
});

export const upgradeCustomer = mutation({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!existingCustomer) {
			return `Customer with ID ${args.userId} does not exist.`;
		}

		await ctx.db.patch(existingCustomer._id, {
			goldenMember: true,
		});

		return `Customer with ID ${args.userId} has been upgraded to Golden Member.`;
	},
});

export const getRewardPointsByUserId = query({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const customer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!customer) {
			return null; // Return null if no customer is found
		}

		return customer.rewardPoints; // Return the reward points
	},
});

export const addRewardPoints = mutation({
	args: {
		userId: v.string(),
		points: v.number(),
	},
	handler: async (ctx, args) => {
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!existingCustomer) {
			return `Customer with ID ${args.userId} does not exist.`;
		}

		const newRewardPoints = (existingCustomer.rewardPoints || 0) + args.points;

		await ctx.db.patch(existingCustomer._id, {
			rewardPoints: newRewardPoints,
		});

		return `Customer with ID ${args.userId} now has ${newRewardPoints} reward points.`;
	},
});
