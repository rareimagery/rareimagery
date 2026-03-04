import type { Product } from '@rareimagery/types';
import { PriceDisplay } from './PriceDisplay';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  physical_pod: 'Print on Demand',
  physical_custom: 'Custom',
  digital_download: 'Digital',
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  const minPrice = product.variations.reduce(
    (min, v) => {
      const num = parseFloat(v.price.number);
      return num < min ? num : min;
    },
    Infinity,
  );

  const maxPrice = product.variations.reduce(
    (max, v) => {
      const num = parseFloat(v.price.number);
      return num > max ? num : max;
    },
    0,
  );

  const currency =
    product.variations[0]?.price.currencyCode ?? 'USD';

  return (
    <div className="xstore__product-card" onClick={onClick} role="button" tabIndex={0}>
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="xstore__product-card-image"
          loading="lazy"
        />
      )}
      <div className="xstore__product-card-body">
        <span className="xstore__product-type-badge">
          {TYPE_LABELS[product.type] ?? product.type}
        </span>
        <h3 className="xstore__product-card-title">{product.title}</h3>
        <div className="xstore__product-card-price">
          <PriceDisplay
            number={String(minPrice)}
            currencyCode={currency}
          />
          {maxPrice > minPrice && (
            <>
              {' - '}
              <PriceDisplay
                number={String(maxPrice)}
                currencyCode={currency}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
