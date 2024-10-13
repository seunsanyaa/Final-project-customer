import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

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
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (existingCustomer) {
			return `Customer with ID ${args.userId} already exists.`;
		}

		await ctx.db.insert('customers', {
			userId: args.userId,
			nationality: args.nationality,
			age: args.age,
			phoneNumber: args.phoneNumber,
			licenseNumber: args.licenseNumber,
			address: args.address,
			dateOfBirth: args.dateOfBirth,
		});
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
		age: v.optional(v.number()), // Changed to optional string
		phoneNumber: v.optional(v.string()), // Changed to optional string
		licenseNumber: v.optional(v.string()), // Changed to optional string
		address: v.optional(v.string()), // Changed to optional string
		dateOfBirth: v.optional(v.string()), // Changed to optional string
	},
	handler: async (ctx, args) => {
		const existingCustomer = await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!existingCustomer) {
			return `Customer with ID ${args.userId} does not exist.`;
		}

		const updatedData = {
			...existingCustomer,
			...args,
		};

		await ctx.db.patch(existingCustomer._id, updatedData);
		return `Customer with ID ${args.userId} has been updated.`;
	},
});
export const getAllCustomers = query({
	handler: async (ctx) => {
		const custs = await ctx.db.query('customers').collect();
		return custs;
	},
});