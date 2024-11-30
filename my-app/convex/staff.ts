import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Define a staff member type
interface StaffMember {
	role: string;
	email: string;
}

// Query to get all staff members
export const getAllStaff = query({
	handler: async (ctx) => {
		return await ctx.db.query('staff').collect();
	},
});

// Mutation to add a new staff member
export const addStaffMember = mutation({
	args: {
		role: v.string(),
		email: v.string(),
	},
	handler: async (ctx, args) => {
		const newStaffMember: StaffMember = {
			role: args.role,
			email: args.email,
		};
		return await ctx.db.insert('staff', newStaffMember);
	},
});

// Query to get a staff member by ID
export const getStaffMember = query({
	args: {
		id: v.optional(v.id('staff')),
		email: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		if (args.id) {
			return await ctx.db.get(args.id);
		}
		if (args.email) {
			return await ctx.db
				.query('staff')
				.filter(q => q.eq(q.field('email'), args.email))
				.first();
		}
		return null;
	},
});

// Mutation to update a staff member
export const updateStaffMember = mutation({
	args: {
		id: v.id('staff'),
		role: v.optional(v.string()),
		email: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;
		return await ctx.db.patch(id, updates);
	},
});

// Mutation to delete a staff member
export const deleteStaffMember = mutation({
	args: { id: v.id('staff') },
	handler: async (ctx, args) => {
		return await ctx.db.delete(args.id);
	},
});
