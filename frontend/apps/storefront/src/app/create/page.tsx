'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useXProfilePreview } from '@rareimagery/api';
import { WizardStepIndicator } from '@/components/create/WizardStepIndicator';
import { XHandleInput } from '@/components/create/XHandleInput';
import { ProfilePreviewCard } from '@/components/create/ProfilePreviewCard';
import Link from 'next/link';

const ERROR_MESSAGES: Record<string, string> = {
  not_found: 'No X profile found for this handle. Please check the spelling.',
  private: 'This profile is private. Make it public to create a store.',
  suspended: 'This account is suspended on X.',
  scrape_failed:
    'Could not load profile data. X may be temporarily unavailable. Please try again.',
};

export default function CreatePage() {
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const {
    data: preview,
    isLoading,
    error: fetchError,
  } = useXProfilePreview(submitted ? handle : '');

  const handleLookup = (h: string) => {
    setHandle(h);
    setSubmitted(true);
  };

  const errorMessage = preview?.error
    ? ERROR_MESSAGES[preview.error] || 'An unexpected error occurred.'
    : fetchError
      ? 'Failed to reach the server. Please try again.'
      : null;

  return (
    <>
      <WizardStepIndicator currentStep={1} />

      <XHandleInput
        onSubmit={handleLookup}
        isLoading={isLoading}
        error={errorMessage}
      />

      {preview && !preview.error && (
        <div className="mt-8 space-y-6">
          <ProfilePreviewCard
            handle={preview.handle}
            displayName={preview.displayName}
            bio={preview.bio}
            avatarUrl={preview.avatarUrl}
            bannerUrl={preview.bannerUrl}
            followers={preview.followers}
            verified={preview.verified}
          />

          {preview.handleTaken ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                A store for <strong>@{preview.handle}</strong> already exists.{' '}
                <Link
                  href={`/${preview.handle}`}
                  className="underline font-medium"
                >
                  Visit the store
                </Link>
              </p>
            </div>
          ) : (
            <button
              onClick={() =>
                router.push(`/create/customize?handle=${preview.handle}`)
              }
              className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Continue with this profile
            </button>
          )}
        </div>
      )}
    </>
  );
}
