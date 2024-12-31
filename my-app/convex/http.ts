import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api, internal } from './_generated/api';

// Create an HTTP router instance
const http = httpRouter();

// Define a route for handling POST requests to '/clerk'
http.route({
	path: '/clerk',
	method: 'POST',
	handler: httpAction(async (ctx, request) => {
		// Extract the payload and headers from the incoming request
		const payloadString = await request.text();

		try {
			// Log the incoming request for debugging
			console.log('Received webhook:', {
				headers: Object.fromEntries(request.headers.entries()),
				body: payloadString,
			});

			// Run the clerk.fulfill action with the payload and necessary headers
			const result = await ctx.runAction(internal.clerk.fulfill, {
				payload: payloadString,
				headers: {
					svixId: request.headers.get('svix-id') ?? '',
					svixTimestamp: request.headers.get('svix-timestamp') ?? '',
					svixSignature: request.headers.get('svix-signature') ?? '',
				},
			});

			console.log('Webhook result:', result);

			if (result.type === 'user.created') {
				// Check if email exists in staff table
				const email = result.data.email_addresses[0]?.email_address ?? '';
				const isStaff = await ctx.runQuery(api.staff.getStaffByEmail, { email });
				
				const userId = await ctx.runMutation(api.users.createUser, {
					email: email,
					userId: result.data.id,
					firstName: result.data.first_name ?? '',
					lastName: result.data.last_name ?? '',
					staff: isStaff?.email ? true : false,
				});
				console.log('Created user:', userId);
			}

			// Return a successful response
			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} catch (err) {
			// Log any errors and return a 400 status code
			console.error('Webhook error:', err);
			return new Response(JSON.stringify({ error: err }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}
	}),
});

// Export the configured HTTP router
export default http;
