import { httpRouter } from 'convex/server';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

// Create an HTTP router instance
const http = httpRouter();

// Define a route for handling POST requests to '/clerk'
http.route({
	path: '/clerk',
	method: 'POST',
	handler: httpAction(async (ctx, request) => {
		// Extract the payload and headers from the incoming request
		const payloadString = await request.text();
		const headerPayload = request.headers;

		try {
			// Run the clerk.fulfill action with the payload and necessary headers
			const result = await ctx.runAction(internal.clerk.fulfill, {
				payload: payloadString,
				headers: {
					'svix-id': headerPayload.get('svix-id')!,
					'svix-timestamp': headerPayload.get('svix-timestamp')!,
					'svix-signature': headerPayload.get('svix-signature')!,
				},
			});

			console.log(result, 'convex result');

			// Handle different types of webhook events
			switch (result.type) {
				case 'user.created':
					// Create a new user in the system when a user is created in Clerk
					await ctx.runMutation(internal.users.createUser, {
						email: result.data?.email_addresses[0]?.email_address ?? '',
						userId: result.data.id,
					});
					break;

				case 'user.deleted':
					// Create a new user in the system when a user is created in Clerk
					await ctx.runMutation(internal.users.deleteUser, {
						userId: result.data.id,
					});
					break;

				// Add more cases here for other event types if needed
			}

			// Return a successful response
			return new Response(null, {
				status: 200,
			});
		} catch (err) {
			// Log any errors and return a 400 status code
			console.error(err);
			return new Response('Webhook Error', {
				status: 400,
			});
		}
	}),
});

// Export the configured HTTP router
export default http;
