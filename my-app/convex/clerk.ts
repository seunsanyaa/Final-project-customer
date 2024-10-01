'use node';

import type { WebhookEvent } from '@clerk/clerk-sdk-node';
import { v } from 'convex/values';
import { Webhook } from 'svix';
import { internalAction } from './_generated/server';

// Define an internal action to handle Clerk webhook verification
export const fulfill = internalAction({
    // Specify the expected arguments: headers and payload
    args: { headers: v.any(), payload: v.string() },
    handler: async (ctx, args) => {
        // Create a new Webhook instance with the Clerk webhook secret
        
        const wh = new Webhook('whsec_JhzHsLxjzEHoBnVZau1W4gFjzVqtJcPI');
        
        // Verify the webhook payload using the provided headers
        // This ensures the webhook is authentic and came from Clerk
        const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
        
        // Return the verified payload
        return payload;
    },
});