'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useXProfilePreview, useCreateStore } from '@rareimagery/api';
import type { StoreCreateRequest } from '@rareimagery/types';
import { WizardStepIndicator } from '@/components/create/WizardStepIndicator';
import { ProfilePreviewCard } from '@/components/create/ProfilePreviewCard';
import { StoreCustomizeForm } from '@/components/create/StoreCustomizeForm';
import Link from 'next/link';

export default function CustomizePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handle = searchParams.get('handle') || '';

  const { data: preview, isLoading: previewLoading } =
    useXProfilePreview(handle);

  const createStore = useCreateStore();

  const handleCreate = (data: StoreCreateRequest) => {
    createStore.mutate(data, {
      onSuccess: () => {
        router.push(`/create/success?handle=${handle}`);
      },
    });
  };

  if (!handle) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No handle specified.</p>
        <Link
          href="/create"
          className="text-gray-900 underline font-medium"
        >
          Start over
        </Link>
      </div>
    );
  }

  if (previewLoading || !preview) {
    return (
      <>
        <WizardStepIndicator currentStep={2} />
        <div className="flex justify-center py-12 text-gray-400">
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </>
    );
  }

  return (
    <>
      <WizardStepIndicator currentStep={2} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Customize your store
          </h2>
          <StoreCustomizeForm
            preview={preview}
            onSubmit={handleCreate}
            isSubmitting={createStore.isPending}
            error={
              createStore.error
                ? createStore.error instanceof Error
                  ? createStore.error.message
                  : 'Failed to create store. Please try again.'
                : null
            }
          />
        </div>

        {/* Right: Live preview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Preview
          </h2>
          <ProfilePreviewCard
            handle={preview.handle}
            displayName={preview.displayName}
            bio={preview.bio}
            avatarUrl={preview.avatarUrl}
            bannerUrl={preview.bannerUrl}
            followers={preview.followers}
            verified={preview.verified}
          />
        </div>
      </div>
    </>
  );
}
