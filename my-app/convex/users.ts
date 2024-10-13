import { v } from 'convex/values';
import {
	MutationCtx,
	QueryCtx,
	mutation,
	query,
} from './_generated/server';
import { getUserId } from './util';

export const getUser = query({
	args: {},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		if (!userId) {
			throw new Error('User is not aunthicated');

		}

		return getFullUser(ctx, userId);
	},
});

export const createUser = mutation({	
	args: {
		email: v.string(),
		userId: v.string(),
		firstName: v.string(),
		lastName: v.string(),
		staff: v.boolean(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('users', {
			email: args.email,
			userId: args.userId,
			firstName: args.firstName,
			lastName: args.lastName,
			staff: args.staff,
		});
	},
});

export const deleteUser = mutation({
	// Allow either email or userId to be provided, but require at least one
	args: {
		userId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Ensure at least one identifier is provided
		if (!args.userId) {
			throw new Error('Either email or userId must be provided');
		}

		let userToDelete;

		if (args.userId) {
			// If userId is provided, query by userId
			userToDelete = await ctx.db
				.query('users')
				.withIndex('by_userId', (q) => q.eq('userId', args.userId ?? ''))
				.first();
		}

		// If no user found, throw an error
		if (!userToDelete) {
			throw new Error('User not found');
		}

		// Delete the user using the _id field
		await ctx.db.delete(userToDelete._id);
	},
});

export function getFullUser(ctx: QueryCtx | MutationCtx, userId: string) {
	return ctx.db
		.query('users')
		.withIndex('by_userId', (q) => q.eq('userId', userId))
		.first();
}

export const getAllUsers = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('users').collect();
	},
});

export const getUserByEmail = query({
	args: { email: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_email', (q) => q.eq('email', args.email))
			.first();

		if (!user) {
			throw new Error('User not found');
		}

		return user;
	},
});


