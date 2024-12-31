

import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
export const AdminSearchCustomer = query({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.query('customers').filter(q => q.eq(q.field('userId'), args.userId)).collect();
	}
});
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
		expirationDate: v.string(),
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
			goldenMember: false,
			rewardPoints: 0,
			expirationDate: args.expirationDate,
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
				goldenMember: false,
				rewardPoints: args.rewardPoints ?? 0,
				expirationDate: args.expirationDate ?? '',
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
		subscriptionPlan: v.string()
	},
	handler: async (ctx, args) => {
		const customer = await ctx.db
			.query('customers')
			.withIndex('by_userId', q => q.eq('userId', args.userId))
			.first();

		if (!customer) {
			throw new Error('Customer not found');
		}

		await ctx.db.patch(customer._id, {
			subscriptionPlan: args.subscriptionPlan,
			goldenMember: true,
		});

		return customer._id;
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

export const isGoldenMember = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		const customer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!customer) {
			return false; // Return false if customer doesn't exist
		}

		return customer.goldenMember; // Return the goldenMember status
	},
});

export const updateCustomerSubscription = mutation({
	args: {
		userId: v.string(),
		subscriptionPlan: v.string()
	},
	handler: async (ctx, args) => {
		const customer = await ctx.db
			.query('customers')
			.withIndex('by_userId', q => q.eq('userId', args.userId))
			.first();

		if (!customer) {
			throw new Error('Customer not found');
		}

		// Update customer record
		await ctx.db.patch(customer._id, {
			subscriptionPlan: undefined,
			goldenMember: false,
		});

		return customer._id;
	},
});

export const createSubscription = mutation({
	args: {
		userId: v.string(),
		plan: v.string(),
		amount: v.number(),
		paymentSessionId: v.id("paymentSessions"),
		stripeSubscriptionId: v.string()
	},
	handler: async (ctx, args) => {
		const currentDate = new Date();
		const nextMonth = new Date(currentDate);
		nextMonth.setMonth(currentDate.getMonth() + 1);

		const subscriptionId = await ctx.db.insert("subscriptions", {
			userId: args.userId,
			plan: args.plan,
			amount: args.amount,
			paymentSessionId: args.paymentSessionId,
			stripeSubscriptionId: args.stripeSubscriptionId,
			status: "active",
			startDate: currentDate.toISOString(),
			endDate: nextMonth.toISOString(),
			lastPaymentDate: currentDate.toISOString(),
			nextPaymentDate: nextMonth.toISOString()
		});

		// Update customer with subscription plan
		const customer = await ctx.db
			.query("customers")
			.withIndex("by_userId", q => q.eq("userId", args.userId))
			.first();

		if (customer) {
			await ctx.db.patch(customer._id, {
				subscriptionPlan: args.plan,
				goldenMember: true
			});
		}

		return { subscriptionId };
	}
});

export const getActiveSubscription = query({
	args: {
		userId: v.string()
	},
	handler: async (ctx, args) => {
		const subscription = await ctx.db
			.query("subscriptions")
			.withIndex("by_userId", q => q.eq("userId", args.userId))
			.filter(q => q.eq(q.field("status"), "active"))
			.first();

		return subscription;
	}
});

export const cancelSubscription = mutation({
	args: {
		userId: v.string()
	},
	handler: async (ctx, args) => {
		// Find the active subscription
		const subscription = await ctx.db
			.query("subscriptions")
			.withIndex("by_userId", q => q.eq("userId", args.userId))
			.filter(q => q.eq(q.field("status"), "active"))
			.first();

		if (subscription) {
			// Update subscription status
			await ctx.db.patch(subscription._id, {
				status: "cancelled"
			});
		}

		// Update customer status
		const customer = await ctx.db
			.query("customers")
			.withIndex("by_userId", q => q.eq("userId", args.userId))
			.first();

		if (customer) {
			await ctx.db.patch(customer._id, {
				subscriptionPlan: undefined,
				goldenMember: false
			});
		}

		return subscription?._id;
	}
});

export const getCustomerCount = query({
	handler: async (ctx) => {
		const customers = await ctx.db
			.query('customers')
			.collect();
		
		return customers.length;
	},
});


