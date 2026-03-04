import { useQuery } from '@tanstack/react-query';
import type { Order } from '@rareimagery/types';
import { drupalClient } from '../client';
import { buildJsonApiFilter, deserializeJsonApi } from '../jsonapi';

export function useOrders(storeNodeId: number) {
  return useQuery({
    queryKey: ['orders', storeNodeId],
    queryFn: async () => {
      const params = {
        ...buildJsonApiFilter({
          'field_store.meta.drupal_internal__nid': String(storeNodeId),
        }),
        sort: '-created',
      };

      const data = await drupalClient.get<unknown>(
        '/jsonapi/commerce-order/pod_order',
        params,
      );

      return deserializeJsonApi<Order>(
        data as Parameters<typeof deserializeJsonApi>[0],
      );
    },
    enabled: !!storeNodeId,
  });
}

export function useOrder(orderType: string, uuid: string) {
  return useQuery({
    queryKey: ['order', uuid],
    queryFn: async () => {
      const data = await drupalClient.get<unknown>(
        `/jsonapi/commerce-order/${orderType}/${uuid}`,
        { include: 'order_items' },
      );

      const results = deserializeJsonApi<Order>(
        data as Parameters<typeof deserializeJsonApi>[0],
      );
      return results[0] ?? null;
    },
    enabled: !!uuid,
  });
}
