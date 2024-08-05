import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		userId: v.string(),
		email: v.string(),
	})
		.index('by_userId', ['userId'])
		.index('by_email', ['email']),

	cars: defineTable({
		carId: v.string(),
		model: v.string(),
		maker: v.string(),
	})
		.index('by_carId', ['carId'])
		.index('by_model', ['model'])
		.index('by_maker', ['maker']),
});
