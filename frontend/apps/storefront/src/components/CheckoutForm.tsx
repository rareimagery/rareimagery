import { useState } from 'react';
import type { Cart } from '@rareimagery/types';
import { StripePayment } from './StripePayment';

type CheckoutStep = 'contact' | 'shipping' | 'payment' | 'confirmation';

interface CheckoutFormProps {
  step: CheckoutStep;
  onNext: (step: CheckoutStep) => void;
  carts: Cart[];
}

interface CheckoutData {
  email: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export function CheckoutForm({ step, onNext, carts: _carts }: CheckoutFormProps) {
  const [data, setData] = useState<CheckoutData>({
    email: '',
    shippingAddress: {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
    },
  });

  if (step === 'contact') {
    return (
      <div className="xstore__checkout-form">
        <h2>Contact Information</h2>
        <label>
          Email
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
        </label>
        <button
          type="button"
          onClick={() => onNext('shipping')}
          disabled={!data.email}
        >
          Continue to Shipping
        </button>
      </div>
    );
  }

  if (step === 'shipping') {
    const addr = data.shippingAddress;
    const updateAddr = (field: string, value: string) =>
      setData({
        ...data,
        shippingAddress: { ...data.shippingAddress, [field]: value },
      });

    return (
      <div className="xstore__checkout-form">
        <h2>Shipping Address</h2>
        <div className="xstore__checkout-form-row">
          <label>
            First Name
            <input value={addr.firstName} onChange={(e) => updateAddr('firstName', e.target.value)} required />
          </label>
          <label>
            Last Name
            <input value={addr.lastName} onChange={(e) => updateAddr('lastName', e.target.value)} required />
          </label>
        </div>
        <label>
          Address
          <input value={addr.address1} onChange={(e) => updateAddr('address1', e.target.value)} required />
        </label>
        <label>
          Address 2
          <input value={addr.address2} onChange={(e) => updateAddr('address2', e.target.value)} />
        </label>
        <div className="xstore__checkout-form-row">
          <label>
            City
            <input value={addr.city} onChange={(e) => updateAddr('city', e.target.value)} required />
          </label>
          <label>
            State
            <input value={addr.state} onChange={(e) => updateAddr('state', e.target.value)} required />
          </label>
          <label>
            ZIP
            <input value={addr.zip} onChange={(e) => updateAddr('zip', e.target.value)} required />
          </label>
        </div>
        <div className="xstore__checkout-form-actions">
          <button type="button" onClick={() => onNext('contact')}>Back</button>
          <button
            type="button"
            onClick={() => onNext('payment')}
            disabled={!addr.firstName || !addr.address1 || !addr.city}
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="xstore__checkout-form">
        <h2>Payment</h2>
        <StripePayment
          onSuccess={() => onNext('confirmation')}
          onBack={() => onNext('shipping')}
        />
      </div>
    );
  }

  return (
    <div className="xstore__checkout-form">
      <h2>Order Confirmed!</h2>
      <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
    </div>
  );
}
