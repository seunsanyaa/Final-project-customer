//function to make search bar work on the admin side to filter


import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Define a staff member type
interface StaffMember {
	role: string;
	email: string;
	token?: string;
	userId?: string;
}
export const AdminSearchStaff = query({
	args: {
		userId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		return await ctx.db.query('staff').filter(q => q.eq(q.field('userId'), args.userId)).collect();
	}
});
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
		token: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const newStaffMember: StaffMember = {
			role: args.role,
			email: args.email,
			token: args.token,
		};
		return await ctx.db.insert('staff', newStaffMember);
	},
});

// Query to get a staff member by ID
export const getStaffMemberById = query({
	args: { id: v.id('staff') },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

// Mutation to update a staff member
export const updateStaffMember = mutation({
	args: {
		id: v.id('staff'),
		role: v.optional(v.string()),
		email: v.optional(v.string()),
		token: v.optional(v.string()),
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

// Add this new query
export const getStaffByEmail = query({
	args: { email: v.string() },
	handler: async (ctx, args) => {
		const staff = await ctx.db
			.query('staff')
			.withIndex('by_email', (q) => q.eq('email', args.email))
			.first();
		return staff;
	},
});

// Query to get total number of staff members
export const getStaffCount = query({
	handler: async (ctx) => {
		const staffMembers = await ctx.db.query('staff').collect();
		return staffMembers.length;
	},
});

// New mutation to update staff userId
export const updateStaffUserId = mutation({
	args: {
		email: v.string(),
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const staff = await ctx.db
			.query('staff')
			.withIndex('by_email', (q) => q.eq('email', args.email))
			.first();

		if (!staff) {
			throw new Error('Staff member not found');
		}

		return await ctx.db.patch(staff._id, { userId: args.userId });
	},
});
