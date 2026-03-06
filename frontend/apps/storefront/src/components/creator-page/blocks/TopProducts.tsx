import { useProducts } from '@rareimagery/api';
import { ProductCard } from '@rareimagery/ui';
import { useStore } from '../../../contexts/StoreContext';
import { useNavigate } from 'react-router-dom';

export function TopProducts() {
  const { store } = useStore();
  const navigate = useNavigate();

  const { data: podProducts } = useProducts('physical_pod', {
    storeNodeId: store?.nodeId,
    limit: 4,
  });
  const { data: customProducts } = useProducts('physical_custom', {
    storeNodeId: store?.nodeId,
    limit: 4,
  });

  const allProducts = [
    ...(podProducts?.data ?? []),
    ...(customProducts?.data ?? []),
  ].slice(0, 4);

  if (allProducts.length === 0) return null;

  return (
    <section className="creator-page__top-products">
      <h2 className="creator-page__section-title">Featured Merch</h2>
      <div className="creator-page__product-grid">
        {allProducts.map((product) => (
          <ProductCard
            key={product.uuid}
            product={product}
            onClick={() => navigate(`/${store?.handle}/product/${product.uuid}`)}
          />
        ))}
      </div>
    </section>
  );
}
