import { v } from 'convex/values';
import {
	MutationCtx,
	QueryCtx,
	internalMutation,
	query,
} from './_generated/server';
import { getUserId } from './util';

export const getUser = query({
	args: {},
	handler: async (ctx, args) => {
		// Retrieve the authenticated user's ID
		const userId = await getUserId(ctx);

		if (!userId) {
			throw new Error('User is not authenticated');
		}

		// Fetch and return the full user object
		return getFullUser(ctx, userId);
	},
});

export const createUser = internalMutation({
	args: {
		// ... existing args ...
	},
	handler: async (ctx, args) => {
		// Insert a new user record into the database
		await ctx.db.insert('users', {
			email: args.email,
			userId: args.userId,
			firstName: args.firstName,
			lastName: args.lastName
		});
	},
});

export const deleteUser = internalMutation({
	args: {
		userId: v.string(), // Changed to required string
	},
	handler: async (ctx, args) => {
		// Find the user to delete by their userId
		const userToDelete = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!userToDelete) {
			throw new Error(`User with ID ${args.userId} not found`);
		}

		// Delete the user from the database
		await ctx.db.delete(userToDelete._id);
	},
});

export function getFullUser(ctx: QueryCtx | MutationCtx, userId: string) {
	// Retrieve the full user object from the database using the userId
	return ctx.db
		.query('users')
		.withIndex('by_userId', (q) => q.eq('userId', userId))
		.first();
}

// Add a new function to update user information
export const updateUser = internalMutation({
	args: {
		userId: v.string(),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		email: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { userId, ...updateFields } = args;
		
		// Check if the user exists
		const existingUser = await getFullUser(ctx, userId);

		if (!existingUser) {
			throw new Error(`User with ID ${userId} not found`);
		}

		// Update the user's information in the database
		await ctx.db.patch(existingUser._id, updateFields);
	},
});
