import { v } from 'convex/values';

import { mutation } from './_generated/server';

// Define a type for the customer data structure
type CustomerData = {
	userId: string;
	nationality: string;
	age: number;
	phoneNumber: string;
	licenseNumber: string;
	address: string;
	dateOfBirth: string;
};

// Create a new customer
export const createCustomer = mutation({
	args: {
		userId: v.string(),
		nationality: v.string(),
		age: v.number(),
		phoneNumber: v.string(),
		licenseNumber: v.string(),
		address: v.string(),
		dateOfBirth: v.string(),
	},
	handler: async (ctx, args) => {
		// Check if a customer with the given userId already exists
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (existingCustomer) {
			throw new Error(`Customer with ID ${args.userId} already exists.`);
		}

		// Insert the new customer into the database
		const newCustomerId = await ctx.db.insert('customers', args);
		return { message: `Customer created successfully`, customerId: newCustomerId };
	},
});

// Delete an existing customer
export const deleteCustomer = mutation({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		// Find the customer by userId
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!existingCustomer) {
			throw new Error(`Customer with ID ${args.userId} does not exist.`);
		}

		// Delete the customer from the database
		await ctx.db.delete(existingCustomer._id);
		return { message: `Customer with ID ${args.userId} has been deleted.` };
	},
});

// Update an existing customer
export const updateCustomer = mutation({
	args: {
		userId: v.string(),
		nationality: v.optional(v.string()),
		age: v.optional(v.number()),
		phoneNumber: v.optional(v.string()),
		licenseNumber: v.optional(v.string()),
		address: v.optional(v.string()),
		dateOfBirth: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Find the customer by userId
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!existingCustomer) {
			throw new Error(`Customer with ID ${args.userId} does not exist.`);
		}

		// Create an object with only the fields that need to be updated
		const updatedFields: Partial<CustomerData> = Object.fromEntries(
			Object.entries(args).filter(([key, value]) => key !== 'userId' && value !== undefined)
		);

		// Update the customer in the database
		await ctx.db.patch(existingCustomer._id, updatedFields);
		return { message: `Customer with ID ${args.userId} has been updated.` };
	},
});
