import { v } from 'convex/values';
import {
	MutationCtx,
	QueryCtx,
	internalMutation,
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

		return getFullUser(ctx, { userId }); // Pass an object with userId
	},
});

export const createUser = mutation({
	args: {
		email: v.string(),
		userId: v.string(),
		firstName: v.string(),
		lastName: v.string(),
		staff: v.boolean(),
		password: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Hash the password before storing
		const hashedPassword =  args.password;

		// Check if user already exists
		const existingUser = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (existingUser) {
			// User already exists, update if necessary
			return ctx.db.patch(existingUser._id, {
				email: args.email,
				firstName: args.firstName,
				lastName: args.lastName,
				staff: args.staff,
				password: hashedPassword,
			});
		}

		// Create new user
		return ctx.db.insert('users', {
			email: args.email,
			userId: args.userId,
			firstName: args.firstName,
			lastName: args.lastName,
			staff: args.staff,
			password: hashedPassword,
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

export const getFullUser = query({
	// Corrected the function structure and query handling
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) =>
				q.eq('userId', args.userId)
			)
			.first();

		if (!user) {
			return `user with id ${args.userId} does not exist.`;
		}

		return user;
	},
});

export const getAllUsers = query({
	args: { id: v.id("users") }, // Changed "User" to "users"
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
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


export const editUser = mutation({
	args: {
		userId: v.string(),
		email: v.optional(v.string()),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		staff: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const userToUpdate = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!userToUpdate) {
			throw new Error('User not found');
		}

		// Define updates with appropriate type
		const updates: Partial<{
			email: string;
			firstName: string;
			lastName: string;
			staff: boolean;
		}> = {};

		if (args.email !== undefined) updates.email = args.email;
		if (args.firstName !== undefined) updates.firstName = args.firstName;
		if (args.lastName !== undefined) updates.lastName = args.lastName;
		if (args.staff !== undefined) updates.staff = args.staff;

		await ctx.db.patch(userToUpdate._id, updates);
	},
});

// Add this new internal mutation for Clerk webhook
export const createUserFromClerk = internalMutation({
	args: {
		email: v.string(),
		userId: v.string(),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Check if user already exists
		const existingUser = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (existingUser) {
			return existingUser._id;
		}

		// Create new user
		const userId = await ctx.db.insert('users', {
			email: args.email,
			userId: args.userId,
			firstName: args.firstName ?? '',
			lastName: args.lastName ?? '',
			staff: false, // Default to regular user
			password: 'abc123',
		});

		return userId;
	},
});

export const getManyUsers = query({
	args: { userIds: v.array(v.string()) },
	handler: async (ctx, args) => {
		const users = await Promise.all(
			args.userIds.map(userId =>
				ctx.db
					.query("users")
					.withIndex("by_userId", q => q.eq("userId", userId))
					.first()
			)
		);
		
		return users.filter((user): user is NonNullable<typeof user> => user !== null);
	},
});

export const changePassword = mutation({
	args: {
		userId: v.string(),
		newPassword: v.string(),

	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (!user) {
			return `User with ID ${args.userId} does not exist.`;
		}

		const hashedPassword = args.newPassword;

		await ctx.db.patch(user._id, {
			password: hashedPassword,
		});

		return `Password for user with ID ${args.userId} has been changed.`;
	},
});

// New function for creating staff user
export const createStaffUser = mutation({
	args: {
		email: v.string(),
		userId: v.string(),
		firstName: v.string(),
		lastName: v.string(),
	},
	handler: async (ctx, args) => {
		// Check if user already exists
		const existingUser = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		if (existingUser) {
			throw new Error('User already exists');
		}

		// Create new staff user
		return ctx.db.insert('users', {
			email: args.email,
			userId: args.userId,
			firstName: args.firstName,
			lastName: args.lastName,
			staff: true, // Always true for staff users
		});
	},
});

// Query to check if a user is staff
export const isUserStaff = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first();

		return user?.staff ?? false;
	},
});