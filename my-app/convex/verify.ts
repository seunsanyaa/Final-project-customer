import { v } from 'convex/values';
import { mutation } from './_generated/server';

// Define the verification mutation
export const verifyStaffToken = mutation({
	args: { token: v.string() },
	handler: async (ctx, args) => {
		const { token } = args;

		try {
			// Find the staff member with this token
			const staffMember = await ctx.db
				.query("staff")
				.filter((q) => q.eq(q.field("token"), token))
				.first();

			if (!staffMember) {
				throw new Error('Invalid token');
			}

			// You might want to store your API base URL in environment variables
			const API_BASE_URL =
				process.env.API_BASE_URL || 'https://your-api-base-url';

			// Make the verification request to your backend
			const response = await fetch(`${API_BASE_URL}/verifyToken`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			});

			if (!response.ok) {
				throw new Error('Token verification failed');
			}

			const data = await response.json();

			// Update the staff member's record
			await ctx.db.patch(staffMember._id, {
				// Clear the token after verification if needed
				token: undefined,
				// Add any additional fields you want to update
				// verifiedAt: new Date().toISOString(),
			});

			return {
				success: true,
				data,
				staffMember,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Verification failed',
			};
		}
	},
});
