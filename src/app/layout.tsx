import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Wanderlust AI — Your Personal AI Travel Concierge',
    template: '%s | Wanderlust AI',
  },
  description:
    'Plan your perfect trip with AI. Wanderlust AI builds personalized travel itineraries based on your budget, preferences, and schedule using real-time data.',
  keywords: ['AI travel planner', 'trip planner', 'itinerary generator', 'travel AI', 'budget travel'],
  openGraph: {
    title: 'Wanderlust AI — Your Personal AI Travel Concierge',
    description: 'Plan your perfect trip with AI-powered itineraries tailored to your budget.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
