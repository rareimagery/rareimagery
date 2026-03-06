import { Link } from 'react-router-dom';
import { useCarts } from '@rareimagery/api';
import { PriceDisplay } from '@rareimagery/ui';

interface CartDrawerProps {
  handle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ handle, isOpen, onClose }: CartDrawerProps) {
  const { data: carts } = useCarts();

  const totalItems =
    carts?.reduce(
      (sum, cart) =>
        sum + cart.items.reduce((s, item) => s + item.quantity, 0),
      0,
    ) ?? 0;

  if (!isOpen) return null;

  return (
    <div className="xstore__cart-drawer-overlay" onClick={onClose}>
      <div
        className="xstore__cart-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="xstore__cart-drawer-header">
          <h2>Cart ({totalItems})</h2>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="xstore__cart-drawer-body">
          {(!carts || totalItems === 0) && <p>Your cart is empty.</p>}

          {carts?.map((cart) =>
            cart.items.map((item) => (
              <div key={item.uuid} className="xstore__cart-drawer-item">
                <span>{item.title}</span>
                <span>x{item.quantity}</span>
                <PriceDisplay
                  number={item.totalPrice.number}
                  currencyCode={item.totalPrice.currencyCode}
                />
              </div>
            )),
          )}
        </div>

        {totalItems > 0 && (
          <div className="xstore__cart-drawer-footer">
            <Link
              to={`/${handle}/cart`}
              className="xstore__cart-drawer-link"
              onClick={onClose}
            >
              View Cart
            </Link>
            <Link
              to={`/${handle}/checkout`}
              className="xstore__checkout-button"
              onClick={onClose}
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
