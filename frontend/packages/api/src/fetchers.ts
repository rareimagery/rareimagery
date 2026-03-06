import type { DrupalServerClient } from './server-client';
import type { StoreSummary, StoreProfileResponse } from './hooks/useStoreApi';

export async function fetchStores(client: DrupalServerClient): Promise<StoreSummary[]> {
  return client.get<StoreSummary[]>('/api/stores', { _format: 'json' });
}

export async function fetchStoreProfile(
  client: DrupalServerClient,
  handle: string,
): Promise<StoreProfileResponse> {
  return client.get<StoreProfileResponse>(`/api/store/${handle}/profile`);
}
