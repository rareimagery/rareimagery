import { useParams } from 'react-router-dom';
import { useOrder } from '@rareimagery/api';
import { LoadingSpinner, PriceDisplay } from '@rareimagery/ui';

export function OrderDetailPage() {
  const { orderUuid = '' } = useParams();
  // TODO: detect order type
  const { data: order, isLoading } = useOrder('pod_order', orderUuid);

  if (isLoading) return <LoadingSpinner message="Loading order..." />;
  if (!order) return <div>Order not found.</div>;

  return (
    <div>
      <h1>Order {order.orderNumber}</h1>

      <div className="dashboard__order-detail">
        <div className="dashboard__order-meta">
          <p>
            <strong>Status:</strong> {order.state}
          </p>
          <p>
            <strong>Type:</strong> {order.type.replace('_', ' ')}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <h2>Items</h2>
        <table className="dashboard__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.uuid}>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>
                  <PriceDisplay
                    number={item.unitPrice.number}
                    currencyCode={item.unitPrice.currencyCode}
                  />
                </td>
                <td>
                  <PriceDisplay
                    number={item.totalPrice.number}
                    currencyCode={item.totalPrice.currencyCode}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="dashboard__order-total">
          <strong>Total: </strong>
          <PriceDisplay
            number={order.totalPrice.number}
            currencyCode={order.totalPrice.currencyCode}
          />
        </div>
      </div>
    </div>
  );
}
