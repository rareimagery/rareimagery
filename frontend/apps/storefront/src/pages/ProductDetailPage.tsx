import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@rareimagery/api';
import { useAddToCart } from '@rareimagery/api';
import { PriceDisplay, LoadingSpinner } from '@rareimagery/ui';

export function ProductDetailPage() {
  const { handle = '', productUuid = '' } = useParams();
  // TODO: detect product type from URL or store context
  const { data: product, isLoading } = useProduct('physical_pod', productUuid);
  const addToCart = useAddToCart();
  const [selectedVariation, setSelectedVariation] = useState(0);

  if (isLoading) return <LoadingSpinner message="Loading product..." />;
  if (!product) return <div>Product not found.</div>;

  const variation = product.variations[selectedVariation];

  return (
    <div className="xstore">
      <nav className="xstore__breadcrumb">
        <Link to={`/${handle}`}>@{handle}</Link> / {product.title}
      </nav>

      <div className="xstore__product-detail">
        {product.imageUrl && (
          <div className="xstore__product-detail-image">
            <img src={product.imageUrl} alt={product.title} />
          </div>
        )}

        <div className="xstore__product-detail-info">
          <h1>{product.title}</h1>

          {variation && (
            <div className="xstore__product-detail-price">
              <PriceDisplay
                number={variation.price.number}
                currencyCode={variation.price.currencyCode}
              />
            </div>
          )}

          {product.variations.length > 1 && (
            <div className="xstore__variation-selector">
              {product.variations.map((v, i) => (
                <button
                  key={v.uuid}
                  className={`xstore__variation-option ${i === selectedVariation ? 'xstore__variation-option--active' : ''}`}
                  onClick={() => setSelectedVariation(i)}
                  type="button"
                >
                  {[v.attributes.size, v.attributes.color, v.attributes.material]
                    .filter(Boolean)
                    .join(' / ') || v.sku}
                </button>
              ))}
            </div>
          )}

          <button
            className="xstore__add-to-cart"
            onClick={() => {
              if (!variation) return;
              addToCart.mutate({
                purchasedEntityType: `commerce_product_variation--${variation.type}`,
                purchasedEntityId: variation.uuid,
                quantity: 1,
              });
            }}
            disabled={addToCart.isPending}
            type="button"
          >
            {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
          </button>

          {addToCart.isSuccess && (
            <p className="xstore__cart-success">
              Added to cart!{' '}
              <Link to={`/${handle}/cart`}>View Cart</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
