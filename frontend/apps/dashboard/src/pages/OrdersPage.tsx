import { useOutletContext } from 'react-router-dom';
import type { CreatorStore } from '@rareimagery/types';
import { useOrders } from '@rareimagery/api';
import { LoadingSpinner, EmptyState } from '@rareimagery/ui';
import { OrderTable } from '../components/OrderTable';

export function OrdersPage() {
  const { store } = useOutletContext<{ store: CreatorStore }>();
  const { data: orders, isLoading } = useOrders(store.nodeId);

  if (isLoading) return <LoadingSpinner message="Loading orders..." />;

  return (
    <div>
      <h1>Orders</h1>

      {!orders || orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Orders will appear here once customers start purchasing."
        />
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
