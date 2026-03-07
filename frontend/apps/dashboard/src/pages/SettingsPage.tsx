import { useOutletContext } from 'react-router-dom';
import type { CreatorStore } from '@rareimagery/types';
import { StoreSettingsForm } from '../components/StoreSettingsForm';
import { SubscriptionBilling } from '../components/SubscriptionBilling';
import { StripeOnboarding } from '../components/StripeOnboarding';
import { PrintfulSyncButton } from '../components/PrintfulSyncButton';

export function SettingsPage() {
  const { store } = useOutletContext<{ store: CreatorStore }>();

  return (
    <div>
      <h1>Settings</h1>

      <section className="dashboard__settings-section">
        <h2>Store Branding</h2>
        <StoreSettingsForm store={store} />
      </section>

      <section className="dashboard__settings-section">
        <h2>Subscription</h2>
        <SubscriptionBilling
          storeNodeId={store.nodeId}
          subscriptionStatus={store.subscriptionStatus}
        />
      </section>

      <section className="dashboard__settings-section">
        <h2>Payments</h2>
        <StripeOnboarding
          storeNodeId={store.nodeId}
          stripeAccountId={store.stripeAccountId}
        />
      </section>

      <section className="dashboard__settings-section">
        <h2>Printful Integration</h2>
        {store.printfulStoreId ? (
          <>
            <p>
              Printful Store ID: <code>{store.printfulStoreId}</code>
            </p>
            <PrintfulSyncButton storeNodeId={store.nodeId} />
          </>
        ) : (
          <p>No Printful store linked. Set the Printful Store ID on your store node.</p>
        )}
      </section>
    </div>
  );
}
