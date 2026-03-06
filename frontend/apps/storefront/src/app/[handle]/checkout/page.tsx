'use client';

import { useParams } from 'next/navigation';

export default function CheckoutPage() {
  const { handle } = useParams<{ handle: string }>();

  return (
    <div className="max-w-site mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-2">Checkout</h1>
      <p className="text-gray-500">Store: @{handle}</p>
      <p className="text-sm text-gray-400 mt-8">Coming soon.</p>
    </div>
  );
}
