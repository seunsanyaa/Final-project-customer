import { MutationCtx, QueryCtx } from './_generated/server';

/**
 * Search for a car in the database based on model and maker.
 * @param ctx - The query or mutation context
 * @param model - The car model to search for
 * @param maker - The car maker to search for
 * @returns The first matching car or undefined if not found
 */
export function searchCar(
	ctx: QueryCtx | MutationCtx,
	model: string,
	maker: string
) {
	return ctx.db
		.query('cars')
		// Filter by model, falling back to maker if model is empty
		.filter((q) => q.eq(q.field('model'), model || maker))
		// Filter by maker, falling back to model if maker is empty
		.filter((q) => q.eq(q.field('maker'), maker || model))
		// Return only the first matching result
		.first();
}
