import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { CreatorStore } from '@rareimagery/types';
import { drupalClient } from '@rareimagery/api';
import { LoadingSpinner } from '@rareimagery/ui';
import { StatsCards } from '../components/StatsCards';
import { PrintfulSyncButton } from '../components/PrintfulSyncButton';

interface AnalyticsData {
  total_orders: number;
  total_revenue: { number: string; currency_code: string };
  orders_by_status: Record<string, number>;
}

export function OverviewPage() {
  const { store } = useOutletContext<{ store: CreatorStore }>();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    drupalClient
      .get<AnalyticsData>(
        `/api/dashboard/stores/${store.nodeId}/analytics`,
      )
      .then(setAnalytics)
      .catch(() => setAnalytics(null))
      .finally(() => setIsLoading(false));
  }, [store.nodeId]);

  if (isLoading) return <LoadingSpinner message="Loading analytics..." />;

  return (
    <div>
      <h1>Dashboard</h1>

      {analytics && (
        <StatsCards
          stats={{
            totalOrders: analytics.total_orders,
            totalRevenue: {
              number: analytics.total_revenue.number,
              currencyCode: analytics.total_revenue.currency_code,
            },
            pendingOrders: analytics.orders_by_status.pending ?? 0,
          }}
        />
      )}

      <div className="dashboard__quick-actions">
        <h2>Quick Actions</h2>
        <PrintfulSyncButton storeNodeId={store.nodeId} />
        <a
          href={`/${store.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="dashboard__action-link"
        >
          View Public Store
        </a>
      </div>
    </div>
  );
}
