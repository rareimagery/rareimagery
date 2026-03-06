'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WizardStepIndicator } from '@/components/create/WizardStepIndicator';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const handle = searchParams.get('handle') || '';

  return (
    <>
      <WizardStepIndicator currentStep={3} />

      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your store is live!
        </h2>
        <p className="text-gray-500 mb-8">
          @{handle}&apos;s store has been created and is ready for products.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${handle}`}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Visit your store
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to catalog
          </Link>
        </div>
      </div>
    </>
  );
}
