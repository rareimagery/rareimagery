import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  XProfilePreview,
  StoreCreateRequest,
  StoreCreateResponse,
} from '@rareimagery/types';
import { drupalClient } from '../client';

export function useXProfilePreview(handle: string) {
  return useQuery({
    queryKey: ['x-profile-preview', handle],
    queryFn: () =>
      drupalClient.get<XProfilePreview>(
        `/api/x-profile/${handle}/preview`,
        { _format: 'json' },
      ),
    enabled: !!handle && handle.length >= 1,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreCreateRequest) =>
      drupalClient.post<StoreCreateResponse>('/api/store/create?_format=json', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
}
