import { notFound } from 'next/navigation';
import { fetchStoreProfile } from '@rareimagery/api';
import { drupalServer } from '@/lib/drupal';
import { StoreHeader } from '@/components/store/StoreHeader';
import { StoreProducts } from '@/components/store/StoreProducts';
import type { Metadata } from 'next';

interface StorePageProps {
  params: Promise<{ handle: string }>;
}

export const revalidate = 300;

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { handle } = await params;
  try {
    const profile = await fetchStoreProfile(drupalServer, handle);
    return {
      title: `@${profile.handle}`,
      description: profile.bio || profile.tagline || `Shop @${profile.handle}`,
      openGraph: {
        title: `@${profile.handle} | RareImagery`,
        description: profile.bio || profile.tagline || '',
        images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : [],
      },
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
    <div>
      <StoreHeader profile={profile} />
      <StoreProducts handle={handle} storeNodeId={profile.nodeId} />
    </div>
  );
}
