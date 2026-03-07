import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { CreatorStore } from '@rareimagery/types';
import { drupalClient } from '@rareimagery/api';
import { Avatar, LoadingSpinner } from '@rareimagery/ui';

interface MyStoresResponse {
  stores: CreatorStore[];
}

export function DashboardLayout() {
  const [store, setStore] = useState<CreatorStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    drupalClient
      .get<MyStoresResponse>('/api/dashboard/my-stores')
      .then((res) => {
        setStore(res.stores[0] ?? null);
      })
      .catch(() => {
        // Not authenticated or no stores
        setStore(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner message="Loading dashboard..." />;

  if (!store) {
    return (
      <div className="dashboard">
        <p>You don't have a store yet, or you need to log in.</p>
        <a href="/user/login">Log in</a>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="dashboard__sidebar">
        <div className="dashboard__store-info">
          <Avatar src={store.avatarUrl} handle={store.handle} size={48} />
          <span className="dashboard__store-handle">@{store.handle}</span>
        </div>

        <ul className="dashboard__nav">
          <li>
            <NavLink to="/dashboard" end>
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/products">Products</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/orders">Orders</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/settings">Settings</NavLink>
          </li>
        </ul>

        <div className="dashboard__nav-footer">
          <a
            href={`/${store.handle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Store
          </a>
        </div>
      </nav>

      <main className="dashboard__content">
        {store.subscriptionStatus && store.subscriptionStatus !== 'active' && (
          <div className="dashboard__subscription-banner">
            {store.subscriptionStatus === 'pending' && (
              <p>Your store is not yet active. Complete payment to launch your store.</p>
            )}
            {store.subscriptionStatus === 'past_due' && (
              <p>Your subscription payment failed. Update your payment method in Settings to reactivate your store.</p>
            )}
            {store.subscriptionStatus === 'canceled' && (
              <p>Your subscription has been canceled. Your store is no longer visible to customers.</p>
            )}
          </div>
        )}
        <Outlet context={{ store }} />
      </main>
    </div>
  );
}

export function useDashboardStore(): CreatorStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { store } = (window as any).__OUTLET_CONTEXT ?? {};
  return store;
}
