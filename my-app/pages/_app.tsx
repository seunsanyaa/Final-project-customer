import { Inter as FontSans } from 'next/font/google';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['100', '200', '300', '400', '500', '600'],
});
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

import { AppProps } from 'next/app'


export default function App({ Component, pageProps }: AppProps) {
	return (
		<ConvexProvider client={convex}>

				<main
					className={cn(
						'min-h-screen bg-white font-sans antialiased',
						fontSans.variable
					)}
				>
					<Component {...pageProps} />
				</main>
		</ConvexProvider>
	)
}
