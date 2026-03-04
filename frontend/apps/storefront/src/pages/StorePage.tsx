import { useParams } from 'react-router-dom';
import { useStoreProfile } from '@rareimagery/api';
import { LoadingSpinner } from '@rareimagery/ui';
import { StoreHeader } from '../components/StoreHeader';
import { ProductGrid } from '../components/ProductGrid';
import { ProductFilters } from '../components/ProductFilters';
import { StoreProvider } from '../contexts/StoreContext';

export function StorePage() {
  const { handle = '' } = useParams<{ handle: string }>();
  const { data: store, isLoading } = useStoreProfile(handle);

  if (isLoading) {
    return <LoadingSpinner message="Loading store..." />;
  }

  if (!store) {
    return (
      <div className="xstore">
        <h1>Store not found</h1>
        <p>The store @{handle} does not exist.</p>
      </div>
    );
  }

  return (
    <StoreProvider store={store} handle={handle} isLoading={false}>
      <div className="xstore">
        <StoreHeader />
        <div className="xstore__content">
          <aside className="xstore__sidebar">
            <ProductFilters />
          </aside>
          <main className="xstore__products">
            <ProductGrid />
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
