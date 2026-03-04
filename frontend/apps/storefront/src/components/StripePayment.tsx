import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

declare global {
  interface Window {
    drupalSettings?: {
      rareimagery_storefront?: {
        stripe_publishable_key?: string;
      };
    };
  }
}

const stripeKey =
  window.drupalSettings?.rareimagery_storefront?.stripe_publishable_key ?? '';
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface StripePaymentProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function StripePayment({ onSuccess, onBack }: StripePaymentProps) {
  if (!stripePromise) {
    return (
      <div>
        <p>Stripe is not configured. Payment cannot be processed.</p>
        <button type="button" onClick={onBack}>Back</button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  );
}

function PaymentForm({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message ?? 'Payment failed.');
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="xstore__payment-error">{error}</p>}
      <div className="xstore__checkout-form-actions">
        <button type="button" onClick={onBack} disabled={isProcessing}>
          Back
        </button>
        <button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}
