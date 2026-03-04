import { useOutletContext, Link } from 'react-router-dom';
import type { CreatorStore } from '@rareimagery/types';
import { useProducts } from '@rareimagery/api';
import { PriceDisplay, LoadingSpinner, EmptyState } from '@rareimagery/ui';

export function ProductsPage() {
  const { store } = useOutletContext<{ store: CreatorStore }>();

  const podProducts = useProducts('physical_pod', {
    storeNodeId: store.nodeId,
  });
  const customProducts = useProducts('physical_custom', {
    storeNodeId: store.nodeId,
  });
  const digitalProducts = useProducts('digital_download', {
    storeNodeId: store.nodeId,
  });

  const isLoading =
    podProducts.isLoading ||
    customProducts.isLoading ||
    digitalProducts.isLoading;

  const allProducts = [
    ...(podProducts.data ?? []),
    ...(customProducts.data ?? []),
    ...(digitalProducts.data ?? []),
  ];

  if (isLoading) return <LoadingSpinner message="Loading products..." />;

  return (
    <div>
      <div className="dashboard__page-header">
        <h1>Products ({allProducts.length})</h1>
        <Link to="/dashboard/products/new" className="dashboard__add-button">
          Add Product
        </Link>
      </div>

      {allProducts.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Create your first product to start selling."
          action={{
            label: 'Add Product',
            onClick: () => window.location.assign('/dashboard/products/new'),
          }}
        />
      ) : (
        <table className="dashboard__table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product) => {
              const minPrice = product.variations[0]?.price;
              return (
                <tr key={product.uuid}>
                  <td>{product.title}</td>
                  <td>{product.type.replace(/_/g, ' ')}</td>
                  <td>
                    {minPrice && (
                      <PriceDisplay
                        number={minPrice.number}
                        currencyCode={minPrice.currencyCode}
                      />
                    )}
                  </td>
                  <td>{product.status ? 'Published' : 'Draft'}</td>
                  <td>
                    <Link to={`/dashboard/products/${product.uuid}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
