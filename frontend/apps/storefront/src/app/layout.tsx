import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
