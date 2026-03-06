import { useNavigate } from 'react-router-dom';
import { useStores } from '@rareimagery/api';
import { StoreCard, LoadingSpinner, EmptyState } from '@rareimagery/ui';

export function CatalogPage() {
  const { data: stores, isLoading } = useStores();
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner message="Loading creators..." />;

  if (!stores || stores.length === 0) {
    return (
      <div className="xstore">
        <EmptyState
          title="No creators yet"
          description="Check back soon for new creator stores!"
        />
      </div>
    );
  }

  return (
    <div className="xstore xstore__catalog">
      <header className="xstore__catalog-header">
        <h1 className="xstore__catalog-title">Explore Creators</h1>
        <p className="xstore__catalog-subtitle">
          Discover unique merchandise from your favorite creators
        </p>
      </header>

      <div className="xstore__store-grid">
        {stores.map((store) => (
          <StoreCard
            key={store.handle}
            store={store}
            onClick={() => navigate(`/${store.handle}`)}
          />
        ))}
      </div>
    </div>
  );
}
