import { useState } from 'react';
import { drupalClient } from '@rareimagery/api';

interface StripeOnboardingProps {
  storeNodeId: number;
  stripeAccountId?: string;
}

export function StripeOnboarding({
  storeNodeId,
  stripeAccountId,
}: StripeOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const res = await drupalClient.post<{ url: string }>(
        `/api/dashboard/stores/${storeNodeId}/stripe-onboarding`,
        {},
      );
      window.location.href = res.url;
    } catch (err) {
      alert(
        `Failed to start Stripe onboarding: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
      setIsLoading(false);
    }
  };

  if (stripeAccountId) {
    return (
      <div className="dashboard__stripe-status">
        <span className="dashboard__stripe-connected">Stripe Connected</span>
        <span className="dashboard__stripe-account-id">
          Account: {stripeAccountId}
        </span>
      </div>
    );
  }

  return (
    <div className="dashboard__stripe-status">
      <p>Connect your Stripe account to receive payments.</p>
      <button
        type="button"
        onClick={handleConnect}
        disabled={isLoading}
        className="dashboard__stripe-connect-button"
      >
        {isLoading ? 'Redirecting...' : 'Connect with Stripe'}
      </button>
    </div>
  );
}
