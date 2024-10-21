import { ClerkProvider, useAuth } from '@clerk/nextjs';
import '@radix-ui/themes/styles.css';
import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';
import '@/styles/globals.css';
const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['100', '200', '300', '400', '500', '600'],
});

import { Toaster } from '@/components/ui/toaster';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { AppProps } from 'next/app';

// Access the Convex URL from environment variables
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
	throw new Error('Missing Publishable Key');
}

// Initialize Convex React Client with the environment variable
const convex = new ConvexReactClient(convexUrl!);

export default function App({ Component, pageProps }: AppProps) {
	return (
		// Clerk is for authentication
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			{/* Convex is the Database */}
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<main
					className={cn(
						'min-h-screen bg-white font-sans antialiased',
						fontSans.variable
					)}
				>
					<Toaster />
					<Component {...pageProps} />
				</main>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
}
