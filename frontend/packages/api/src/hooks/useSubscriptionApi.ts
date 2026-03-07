import { useMutation, useQuery } from '@tanstack/react-query';
import { drupalClient } from '../client';

export interface SubscriptionCheckoutResponse {
  url: string;
}

export interface SubscriptionPortalResponse {
  url: string;
}

export interface SubscriptionStatusResponse {
  status: string;
  subscriptionId: string | null;
  customerId: string | null;
}

export function useSubscriptionCheckout() {
  return useMutation({
    mutationFn: (params: {
      storeNodeId: number;
      successUrl: string;
      cancelUrl: string;
    }) =>
      drupalClient.post<SubscriptionCheckoutResponse>(
        `/api/store/${params.storeNodeId}/subscription/checkout?_format=json`,
        { success_url: params.successUrl, cancel_url: params.cancelUrl },
      ),
  });
}

export function useSubscriptionPortal() {
  return useMutation({
    mutationFn: (params: { storeNodeId: number; returnUrl: string }) =>
      drupalClient.post<SubscriptionPortalResponse>(
        `/api/dashboard/stores/${params.storeNodeId}/subscription/portal?_format=json`,
        { return_url: params.returnUrl },
      ),
  });
}

export function useSubscriptionStatus(storeNodeId: number) {
  return useQuery({
    queryKey: ['subscription-status', storeNodeId],
    queryFn: () =>
      drupalClient.get<SubscriptionStatusResponse>(
        `/api/dashboard/stores/${storeNodeId}/subscription/status`,
        { _format: 'json' },
      ),
    enabled: storeNodeId > 0,
  });
}
