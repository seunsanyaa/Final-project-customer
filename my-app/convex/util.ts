import { ActionCtx, MutationCtx, QueryCtx } from './_generated/server';

/**
 * Retrieves the user ID from the authentication context.
 * @param ctx - The context object (QueryCtx, MutationCtx, or ActionCtx)
 * @returns The user ID (subject) or undefined if not authenticated
 */
export const getUserId = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
	const identity = await ctx.auth.getUserIdentity();
	return identity?.subject;
};

/**
 * Retrieves the full user identity from the authentication context.
 * @param ctx - The context object (QueryCtx, MutationCtx, or ActionCtx)
 * @returns The user identity object or null if not authenticated
 */
export const getUser = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
	return await ctx.auth.getUserIdentity();
};
