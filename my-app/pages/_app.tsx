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

import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { AppProps } from 'next/app';
import { Toaster } from '@/components/ui/toaster';

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
	throw new Error('Missing Publishable Key');
}

const convex = new ConvexReactClient('https://terrific-bee-97.convex.cloud');

export default function App({ Component, pageProps }: AppProps) {
	return (
		// clerk is authentication
		<ClerkProvider
			publishableKey={'pk_test_YWJvdmUtZ29hdC02Ny5jbGVyay5hY2NvdW50cy5kZXYk'}
		>
			{/* convex is Database */}
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
