import { MutationCtx, QueryCtx } from './_generated/server';

export function searchCar(
	ctx: QueryCtx | MutationCtx,

	model: string,
	maker: string
) {
	return ctx.db
		.query('cars')
    // Honda 
 
		.filter((q) => q.eq(q.field('model'), model || maker))
		.filter((q) => q.eq(q.field('maker'), maker || model))
		.first();
}
