import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		userId: v.string(),
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
	})
		.index('by_userId', ['userId'])
		.index('by_email', ['email']),

	customers: defineTable({
		userId: v.string(),
		nationality: v.string(),
		age: v.number(),
		phoneNumber: v.string(),
		licenseNumber: v.string(),
		address: v.string(),
		dateOfBirth: v.string(),
	})
		.index('by_userId', ['userId'])
		.index('by_licenseNumber', ['licenseNumber']),

	cars: defineTable({
		carId: v.string(),
		model: v.string(),
		maker: v.string(),
	})
		.index('by_carId', ['carId'])
		.index('by_model', ['model'])
		.index('by_maker', ['maker']),
});
