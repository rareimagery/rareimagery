import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Cart, AddToCartRequest } from '@rareimagery/types';
import { drupalClient } from '../client';

export function useCarts() {
  return useQuery({
    queryKey: ['carts'],
    queryFn: () =>
      drupalClient.get<Cart[]>('/cart', { _format: 'json' }),
    staleTime: 30 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: AddToCartRequest) =>
      drupalClient.post<unknown>('/cart/add', [
        {
          purchased_entity_type: item.purchasedEntityType,
          purchased_entity_id: item.purchasedEntityId,
          quantity: item.quantity,
        },
      ]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      orderItemId,
      quantity,
    }: {
      orderId: number;
      orderItemId: number;
      quantity: number;
    }) =>
      drupalClient.patch<unknown>(
        `/cart/${orderId}/items/${orderItemId}`,
        { quantity },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      orderItemId,
    }: {
      orderId: number;
      orderItemId: number;
    }) => drupalClient.delete(`/cart/${orderId}/items/${orderItemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] });
    },
  });
}
