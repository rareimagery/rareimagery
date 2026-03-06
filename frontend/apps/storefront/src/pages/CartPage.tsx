import { useParams, Link } from 'react-router-dom';
import { useCarts, useUpdateCartItem, useRemoveCartItem } from '@rareimagery/api';
import { PriceDisplay, LoadingSpinner, EmptyState } from '@rareimagery/ui';

export function CartPage() {
  const { handle = '' } = useParams();
  const { data: carts, isLoading } = useCarts();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading) return <LoadingSpinner message="Loading cart..." />;

  const hasItems = carts && carts.some((cart) => cart.items.length > 0);

  if (!hasItems) {
    return (
      <div className="xstore">
        <EmptyState
          title="Your cart is empty"
          description="Browse the store and add some items!"
          action={{
            label: 'Continue Shopping',
            onClick: () => window.location.assign(`/${handle}`),
          }}
        />
      </div>
    );
  }

  return (
    <div className="xstore">
      <h1>Shopping Cart</h1>

      {carts?.map((cart) => (
        <div key={cart.orderId} className="xstore__cart-group">
          <h2 className="xstore__cart-group-type">{cart.type.replace('_', ' ')}</h2>

          {cart.items.map((item) => (
            <div key={item.uuid} className="xstore__cart-item">
              <div className="xstore__cart-item-info">
                <h3>{item.title}</h3>
                <PriceDisplay
                  number={item.unitPrice.number}
                  currencyCode={item.unitPrice.currencyCode}
                />
              </div>

              <div className="xstore__cart-item-quantity">
                <button
                  type="button"
                  onClick={() =>
                    item.quantity <= 1
                      ? removeItem.mutate({
                          orderId: cart.orderId,
                          orderItemId: item.orderItemId,
                        })
                      : updateItem.mutate({
                          orderId: cart.orderId,
                          orderItemId: item.orderItemId,
                          quantity: item.quantity - 1,
                        })
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateItem.mutate({
                      orderId: cart.orderId,
                      orderItemId: item.orderItemId,
                      quantity: item.quantity + 1,
                    })
                  }
                >
                  +
                </button>
              </div>

              <div className="xstore__cart-item-total">
                <PriceDisplay
                  number={item.totalPrice.number}
                  currencyCode={item.totalPrice.currencyCode}
                />
              </div>

              <button
                type="button"
                className="xstore__cart-item-remove"
                onClick={() =>
                  removeItem.mutate({
                    orderId: cart.orderId,
                    orderItemId: item.orderItemId,
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}

          <div className="xstore__cart-total">
            <strong>Subtotal: </strong>
            <PriceDisplay
              number={cart.totalPrice.number}
              currencyCode={cart.totalPrice.currencyCode}
            />
          </div>
        </div>
      ))}

      <Link to={`/${handle}/checkout`} className="xstore__checkout-button">
        Proceed to Checkout
      </Link>
    </div>
  );
}
