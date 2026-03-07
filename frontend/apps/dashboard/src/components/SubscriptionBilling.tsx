import { useState } from 'react';
import { drupalClient } from '@rareimagery/api';

interface SubscriptionBillingProps {
  storeNodeId: number;
  subscriptionStatus?: string | null;
}

export function SubscriptionBilling({
  storeNodeId,
  subscriptionStatus,
}: SubscriptionBillingProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const res = await drupalClient.post<{ url: string }>(
        `/api/dashboard/stores/${storeNodeId}/subscription/portal?_format=json`,
        { return_url: window.location.href },
      );
      window.location.href = res.url;
    } catch (err) {
      alert(
        `Failed to open billing portal: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
      setIsLoading(false);
    }
  };

  const statusConfig: Record<string, { label: string; className: string; description: string }> = {
    active: {
      label: 'Active',
      className: 'dashboard__subscription-badge--active',
      description: 'Your store subscription is active.',
    },
    past_due: {
      label: 'Past Due',
      className: 'dashboard__subscription-badge--past-due',
      description: 'Your payment failed. Please update your payment method to keep your store active.',
    },
    canceled: {
      label: 'Canceled',
      className: 'dashboard__subscription-badge--canceled',
      description: 'Your subscription has been canceled. Your store is no longer visible to customers.',
    },
    pending: {
      label: 'Pending',
      className: 'dashboard__subscription-badge--pending',
      description: 'Complete payment to activate your store.',
    },
  };

  const status = subscriptionStatus ?? 'pending';
  const config = statusConfig[status] ?? statusConfig.pending;

  return (
    <div className="dashboard__subscription-billing">
      <div className="dashboard__subscription-status-row">
        <span>Status:</span>
        <span className={`dashboard__subscription-badge ${config.className}`}>
          {config.label}
        </span>
      </div>

      <p className="dashboard__subscription-description">{config.description}</p>

      {status !== 'pending' && (
        <button
          type="button"
          onClick={handleManageBilling}
          disabled={isLoading}
          className="dashboard__stripe-connect-button"
        >
          {isLoading ? 'Redirecting...' : 'Manage Billing'}
        </button>
      )}
    </div>
  );
}
