import type { Order } from '@rareimagery/types';
import { PriceDisplay } from '@rareimagery/ui';
import { Link } from 'react-router-dom';

interface OrderTableProps {
  orders: Order[];
}

const STATE_STYLES: Record<string, string> = {
  draft: 'dashboard__order-state--draft',
  placed: 'dashboard__order-state--placed',
  completed: 'dashboard__order-state--completed',
  canceled: 'dashboard__order-state--canceled',
};

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <table className="dashboard__table">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Date</th>
          <th>Email</th>
          <th>Type</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.uuid}>
            <td>
              <Link to={`/dashboard/orders/${order.uuid}`}>
                {order.orderNumber}
              </Link>
            </td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            <td>{order.email}</td>
            <td>{order.type.replace('_', ' ')}</td>
            <td>
              <PriceDisplay
                number={order.totalPrice.number}
                currencyCode={order.totalPrice.currencyCode}
              />
            </td>
            <td>
              <span className={STATE_STYLES[order.state] ?? ''}>
                {order.state}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
