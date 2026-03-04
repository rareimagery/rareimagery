import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCarts } from '@rareimagery/api';
import { LoadingSpinner, PriceDisplay } from '@rareimagery/ui';
import { CheckoutForm } from '../components/CheckoutForm';

type CheckoutStep = 'contact' | 'shipping' | 'payment' | 'confirmation';

export function CheckoutPage() {
  const { handle: _handle } = useParams();
  const { data: carts, isLoading } = useCarts();
  const [step, setStep] = useState<CheckoutStep>('contact');

  if (isLoading) return <LoadingSpinner message="Loading checkout..." />;
  if (!carts || carts.every((c) => c.items.length === 0)) {
    return <div className="xstore"><p>Your cart is empty.</p></div>;
  }

  const totalAmount = carts.reduce(
    (sum, cart) => sum + parseFloat(cart.totalPrice.number),
    0,
  );

  return (
    <div className="xstore">
      <h1>Checkout</h1>

      <div className="xstore__checkout">
        <div className="xstore__checkout-steps">
          {(['contact', 'shipping', 'payment', 'confirmation'] as const).map(
            (s) => (
              <span
                key={s}
                className={`xstore__checkout-step ${s === step ? 'xstore__checkout-step--active' : ''}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            ),
          )}
        </div>

        <div className="xstore__checkout-main">
          <CheckoutForm
            step={step}
            onNext={(next) => setStep(next)}
            carts={carts}
          />
        </div>

        <aside className="xstore__checkout-summary">
          <h2>Order Summary</h2>
          {carts.map((cart) =>
            cart.items.map((item) => (
              <div key={item.uuid} className="xstore__checkout-item">
                <span>
                  {item.title} x {item.quantity}
                </span>
                <PriceDisplay
                  number={item.totalPrice.number}
                  currencyCode={item.totalPrice.currencyCode}
                />
              </div>
            )),
          )}
          <div className="xstore__checkout-total">
            <strong>Total: </strong>
            <PriceDisplay
              number={String(totalAmount)}
              currencyCode={carts[0].totalPrice.currencyCode}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
