import { useNavigate } from 'react-router-dom';
import { useProducts } from '@rareimagery/api';
import { ProductCard, LoadingSpinner, EmptyState } from '@rareimagery/ui';
import { useStore } from '../contexts/StoreContext';

export function ProductGrid() {
  const { store, handle } = useStore();
  const navigate = useNavigate();

  // Fetch all product types for this store
  const podProducts = useProducts('physical_pod', {
    storeNodeId: store?.nodeId,
  });
  const customProducts = useProducts('physical_custom', {
    storeNodeId: store?.nodeId,
  });
  const digitalProducts = useProducts('digital_download', {
    storeNodeId: store?.nodeId,
  });

  const isLoading =
    podProducts.isLoading ||
    customProducts.isLoading ||
    digitalProducts.isLoading;

  const allProducts = [
    ...(podProducts.data ?? []),
    ...(customProducts.data ?? []),
    ...(digitalProducts.data ?? []),
  ].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (isLoading) return <LoadingSpinner message="Loading products..." />;

  if (allProducts.length === 0) {
    return (
      <EmptyState
        title="No products available yet"
        description="Check back soon!"
      />
    );
  }

  return (
    <div className="xstore__product-grid">
      {allProducts.map((product) => (
        <ProductCard
          key={product.uuid}
          product={product}
          onClick={() =>
            navigate(`/${handle}/product/${product.uuid}`)
          }
        />
      ))}
    </div>
  );
}
