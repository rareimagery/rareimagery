import { useQuery } from '@tanstack/react-query';
import type { CreatorStore, CreatorTheme } from '@rareimagery/types';
import { drupalClient } from '../client';

/** API response from /api/store/{handle}/profile includes theme + stripe key. */
export interface StoreProfileResponse extends CreatorStore {
  theme: CreatorTheme | null;
  stripe_publishable_key: string;
}

export function useStoreProfile(handle: string) {
  return useQuery({
    queryKey: ['store', handle],
    queryFn: () =>
      drupalClient.get<StoreProfileResponse>(`/api/store/${handle}/profile`),
    staleTime: 5 * 60 * 1000,
    enabled: !!handle,
  });
}
