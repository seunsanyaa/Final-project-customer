'use node';

import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { Webhook } from 'svix';

export const fulfill = internalAction({
  args: { 
    payload: v.string(),
    headers: v.object({
      svixId: v.string(),
      svixTimestamp: v.string(),
      svixSignature: v.string(),
    })
  },
	handler: async (ctx, args) => {
		const WEBHOOK_SECRET = "whsec_xEIpDFkulG8bud0Aa5Gtphmaax3pjKJA";
		if (!WEBHOOK_SECRET) {
			throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }
    
    const wh = new Webhook(WEBHOOK_SECRET);
    
    try {
      const headers = {
        'svix-id': args.headers.svixId,
        'svix-timestamp': args.headers.svixTimestamp,
        'svix-signature': args.headers.svixSignature
      };

      const evt = wh.verify(args.payload, headers) as any;
      console.log('Webhook verified:', evt);
      return evt;
    } catch (err) {
      console.error('Webhook verification failed:', err);
      throw new Error('Webhook verification failed');
    }
  },
});
