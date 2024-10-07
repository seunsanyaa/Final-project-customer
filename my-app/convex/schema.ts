import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	// Users table: Stores basic user information
	users: defineTable({
		userId: v.string(), // Unique identifier for the user
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
	})
		.index('by_userId', ['userId'])
		.index('by_email', ['email']),

	// Customers table: Stores additional customer-specific information
	customers: defineTable({
		userId: v.string(), // Reference to the user in the users table
		nationality: v.string(),
		age: v.number(),
		phoneNumber: v.string(),
		licenseNumber: v.string(),
		address: v.string(),
		dateOfBirth: v.string(), // Consider using v.float64() for timestamp instead
	})
		.index('by_userId', ['userId'])
		.index('by_licenseNumber', ['licenseNumber']),

	// Cars table: Stores information about individual cars
	cars: defineTable({
		carId: v.string(), // Unique identifier for the car
		model: v.string(),
		maker: v.string(),
		fleetId: v.string(), // Reference to the fleet this car belongs to
		plateNumber: v.string(), // Unique plate number for the individual car
		status: v.string(), // Add a status field (e.g., 'available', 'rented', 'maintenance')
	})
		.index('by_carId', ['carId'])
		.index('by_model', ['model'])
		.index('by_maker', ['maker'])
		.index('by_fleetId', ['fleetId'])
		.index('by_status', ['status']), // Add an index for querying by status

	// Fleets table: Stores information about car fleets
	fleets: defineTable({
		fleetId: v.string(), // Unique identifier for the fleet
		model: v.string(),
		maker: v.string(),
		plateNumbers: v.array(v.string()), // Array to hold different plate numbers for the same model
		totalCars: v.number(), // Add a field to track the total number of cars in the fleet
	})
		.index('by_fleetId', ['fleetId'])
		.index('by_model', ['model'])
		.index('by_maker', ['maker']),
});
