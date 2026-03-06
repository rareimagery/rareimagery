import { notFound } from 'next/navigation';
import { fetchStoreProfile } from '@rareimagery/api';
import { drupalServer } from '@/lib/drupal';
import type { Metadata } from 'next';

interface StorePageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { handle } = await params;
  try {
    const profile = await fetchStoreProfile(drupalServer, handle);
    return {
      title: `@${profile.handle}`,
      description: profile.bio || profile.tagline || `Shop @${profile.handle}`,
    };
  } catch {
    return { title: 'Store Not Found' };
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { handle } = await params;

  let profile;
  try {
    profile = await fetchStoreProfile(drupalServer, handle);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-site mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">@{profile.handle}</h1>
        {profile.tagline && (
          <p className="text-gray-500 mb-4">{profile.tagline}</p>
        )}
        {profile.bio && <p className="text-gray-600">{profile.bio}</p>}
        <p className="text-sm text-gray-400 mt-8">
          Full store page coming soon.
        </p>
      </div>
    </div>
  );
}
