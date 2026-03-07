'use client';

import { useSearchParams } from 'next/navigation';
import { useSubscriptionCheckout } from '@rareimagery/api';
import { WizardStepIndicator } from '@/components/create/WizardStepIndicator';
import Link from 'next/link';
import { useState } from 'react';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const handle = searchParams.get('handle') || '';
  const storeNodeId = parseInt(searchParams.get('storeNodeId') || '0', 10);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const checkout = useSubscriptionCheckout();

  const handlePay = () => {
    if (!storeNodeId) return;
    setIsRedirecting(true);

    const origin = window.location.origin;
    checkout.mutate(
      {
        storeNodeId,
        successUrl: `${origin}/create/success?handle=${handle}`,
        cancelUrl: `${origin}/create/payment?handle=${handle}&storeNodeId=${storeNodeId}`,
      },
      {
        onSuccess: (data) => {
          window.location.href = data.url;
        },
        onError: () => {
          setIsRedirecting(false);
        },
      },
    );
  };

  if (!handle || !storeNodeId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Missing store information.</p>
        <Link href="/create" className="text-gray-900 underline font-medium">
          Start over
        </Link>
      </div>
    );
  }

  return (
    <>
      <WizardStepIndicator currentStep={3} />

      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Launch your store
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Subscribe to activate @{handle}&apos;s storefront.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Creator Plan
            </h3>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">$1</span>
              <span className="text-gray-500">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Branded storefront with your X profile
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Sell physical &amp; digital products
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Print-on-demand fulfillment via Printful
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Dashboard with analytics &amp; order management
            </li>
          </ul>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">One-time setup fee</span>
              <span className="font-medium text-gray-900">$5.00</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Monthly subscription</span>
              <span className="font-medium text-gray-900">$1.00/mo</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>First monthly charge</span>
              <span>in 30 days</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mb-4">
          Due today: $5.00. Your $1/month subscription starts in 30 days.
          Cancel anytime from your dashboard.
        </p>

        <button
          onClick={handlePay}
          disabled={isRedirecting || checkout.isPending}
          className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRedirecting || checkout.isPending
            ? 'Redirecting to payment...'
            : 'Subscribe & Launch Store — $5.00'}
        </button>

        {checkout.error && (
          <p className="text-red-600 text-sm text-center mt-3">
            {checkout.error instanceof Error
              ? checkout.error.message
              : 'Failed to start checkout. Please try again.'}
          </p>
        )}
      </div>
    </>
  );
}
