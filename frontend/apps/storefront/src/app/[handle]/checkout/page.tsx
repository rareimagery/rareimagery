'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCarts } from '@rareimagery/api';
import { LoadingSpinner, PriceDisplay } from '@rareimagery/ui';
import { drupalClient } from '@rareimagery/api';
import type { Cart } from '@rareimagery/types';

interface BillingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function CheckoutPage() {
  const { handle } = useParams<{ handle: string }>();
  const { data: carts, isLoading } = useCarts();

  const [email, setEmail] = useState('');
  const [address, setAddress] = useState<BillingAddress>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const allItems = (carts ?? []).flatMap((cart: Cart) => cart.items);
  const grandTotal = (carts ?? []).reduce((sum: number, cart: Cart) => sum + parseFloat(cart.totalPrice.number), 0);
  const currency = carts?.[0]?.totalPrice.currencyCode ?? 'USD';

  function updateAddress(field: keyof BillingAddress, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!carts || carts.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      // Place each cart order
      for (const cart of carts) {
        await drupalClient.post(`/api/checkout/${cart.orderId}`, {
          email,
          billing_address: {
            firstName: address.firstName,
            lastName: address.lastName,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
          },
        });
      }
      setConfirmed(true);
    } catch {
      setError('There was a problem placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-site mx-auto px-4 py-16">
        <LoadingSpinner message="Loading checkout..." />
      </div>
    );
  }

  if (allItems.length === 0 && !confirmed) {
    return (
      <div className="max-w-site mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link href={`/${handle}`} className="text-[#1DA1F2] hover:underline text-sm">
          ← Back to store
        </Link>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. A confirmation will be sent to <strong>{email}</strong>.
        </p>
        <Link
          href={`/${handle}`}
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/${handle}/cart`} className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Cart
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid gap-8">
        {/* Order summary */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
          <div className="space-y-2">
            {allItems.map((item) => (
              <div key={item.uuid} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.title} × {item.quantity}
                </span>
                <PriceDisplay number={item.totalPrice.number} currencyCode={item.totalPrice.currencyCode} />
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <PriceDisplay number={String(grandTotal)} currencyCode={currency} />
          </div>
        </div>

        {/* Checkout form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Contact</h2>
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Billing address */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Billing Address</h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="First name"
                value={address.firstName}
                onChange={(e) => updateAddress('firstName', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <input
                type="text"
                required
                placeholder="Last name"
                value={address.lastName}
                onChange={(e) => updateAddress('lastName', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <input
                type="text"
                required
                placeholder="Address"
                value={address.address1}
                onChange={(e) => updateAddress('address1', e.target.value)}
                className="col-span-2 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Apt, suite, etc. (optional)"
                value={address.address2}
                onChange={(e) => updateAddress('address2', e.target.value)}
                className="col-span-2 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <input
                type="text"
                required
                placeholder="City"
                value={address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <input
                type="text"
                required
                placeholder="State"
                value={address.state}
                onChange={(e) => updateAddress('state', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <input
                type="text"
                required
                placeholder="ZIP code"
                value={address.zip}
                onChange={(e) => updateAddress('zip', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <select
                value={address.country}
                onChange={(e) => updateAddress('country', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold text-base hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Placing Order...' : `Place Order · $${grandTotal.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
