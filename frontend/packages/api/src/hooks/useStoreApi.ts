import { useQuery } from '@tanstack/react-query';
import type { CreatorStore } from '@rareimagery/types';
import { drupalClient } from '../client';

export function useStoreProfile(handle: string) {
  return useQuery({
    queryKey: ['store', handle],
    queryFn: () =>
      drupalClient.get<CreatorStore>(`/api/store/${handle}/profile`),
    staleTime: 5 * 60 * 1000,
    enabled: !!handle,
  });
}
