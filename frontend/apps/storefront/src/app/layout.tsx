import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: {
    template: '%s | RareImagery',
    default: 'RareImagery - Creator Merch Platform',
  },
  description: 'Discover unique merchandise from your favorite creators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-gray-900 bg-white antialiased">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-site mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-gray-900 tracking-tight hover:opacity-80 transition-opacity">
              RareImagery
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                Explore
              </Link>
              <Link
                href="/create"
                className="px-4 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
              >
                Start a Store
              </Link>
            </nav>
          </div>
        </header>
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
