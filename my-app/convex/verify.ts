import { v } from 'convex/values';
import * as jose from 'jose';
import { mutation, query } from './_generated/server';

// Helper function to verify tokens
async function verifyToken(token: string): Promise<boolean> {
	try {
		const secret = new TextEncoder().encode(
			(process.env.JWT_SECRET as string) ?? 'my_secret_key_here'
		);
		
		await jose.jwtVerify(token, secret);
		return true;
	} catch (error) {
		return false;
	}
}

// Define the verification mutation
export const verifyStaffToken = query({
	args: { token: v.string() },
	handler: async (ctx, args) => {
		const { token } = args;

		try {
			// Find the staff member with this token
			const staffMember = await ctx.db
				.query('staff')
				.filter((q) => q.eq(q.field('token'), token))
				.unique();

			if (!staffMember) {
				return {
					success: false,
					error: 'Invalid token',
				};
			}

			// Verify the token using our helper function
			const isValid = await verifyToken(token);
			if (!isValid) {
				throw new Error('Token verification failed');
			}

			// Update the staff member's record

			return {
				success: true,
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

export const generateStaffToken = mutation({
	args: {
		email: v.string(),
	},
	handler: async (ctx, args) => {
		const { email } = args;

		const staffMember = await ctx.db
			.query('staff')
			.filter((q) => q.eq(q.field('email'), email))
			.unique();

		if (!staffMember) {
			return {
				success: false,
				error: 'Staff member not found',
			};
		}

		// Generate token using jose
		const secret = new TextEncoder().encode(
			(process.env.JWT_SECRET as string) ?? 'my_secret_key_here'
		);
		
		const token = await new jose.SignJWT({
			email,
			staffId: staffMember._id,
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('24h')
			.sign(secret);

		// Update staff member with new token
		await ctx.db.patch(staffMember._id, { token });

		return {
			success: true,
			token,
		};
	},
});
