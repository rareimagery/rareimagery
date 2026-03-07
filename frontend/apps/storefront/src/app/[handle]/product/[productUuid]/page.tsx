'use client';

import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useProduct, useAddToCart } from '@rareimagery/api';
import { LoadingSpinner, PriceDisplay } from '@rareimagery/ui';
import type { ProductVariation, ProductType } from '@rareimagery/types';

interface ProductPageProps {
  params: Promise<{ handle: string; productUuid: string }>;
}

const TYPE_LABELS: Record<string, string> = {
  physical_pod: 'Print on Demand',
  physical_custom: 'Custom',
  digital_download: 'Digital Download',
};

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { handle, productUuid } = use(params);
  const searchParams = useSearchParams();
  const productType = (searchParams.get('type') || 'physical_pod') as ProductType;

  const { data: product, isLoading, error } = useProduct(productType, productUuid);
  const addToCart = useAddToCart();
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const variation = selectedVariation ?? product?.variations[0] ?? null;

  async function handleAddToCart() {
    if (!variation) return;
    await addToCart.mutateAsync({
      purchasedEntityType: 'commerce_product_variation',
      purchasedEntityId: variation.uuid,
      quantity: 1,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  }

  if (isLoading) {
    return (
      <div className="max-w-site mx-auto px-4 py-16">
        <LoadingSpinner message="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-site mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Product not found.</p>
        <Link href={`/${handle}`} className="text-sm text-[#1DA1F2] hover:underline">
          ← Back to store
        </Link>
      </div>
    );
  }

  const sizeOptions = [...new Set(product.variations.map((v) => v.attributes.size).filter(Boolean))];
  const colorOptions = [...new Set(product.variations.map((v) => v.attributes.color).filter(Boolean))];

  return (
    <div className="max-w-site mx-auto px-4 md:px-6 py-8">
      <Link
        href={`/${handle}`}
        className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 mb-6"
      >
        ← Back to @{handle}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-300 text-6xl">🖼</span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            {TYPE_LABELS[product.type] ?? product.type}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {product.title}
          </h1>

          {variation && (
            <div className="text-2xl font-semibold text-gray-900 mb-6">
              <PriceDisplay number={variation.price.number} currencyCode={variation.price.currencyCode} />
            </div>
          )}

          {/* Size selector */}
          {sizeOptions.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => {
                  const v = product.variations.find((va) => va.attributes.size === size);
                  const active = variation?.attributes.size === size;
                  return (
                    <button
                      key={size}
                      onClick={() => v && setSelectedVariation(v)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                        active ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color selector */}
          {colorOptions.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => {
                  const v = product.variations.find((va) => va.attributes.color === color);
                  const active = variation?.attributes.color === color;
                  return (
                    <button
                      key={color}
                      onClick={() => v && setSelectedVariation(v)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                        active ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending || !variation}
            className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all disabled:opacity-50 ${
              addedToCart ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            {addToCart.isPending ? 'Adding...' : addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>

          <Link
            href={`/${handle}/cart`}
            className="mt-3 w-full py-3 rounded-xl border border-gray-300 font-medium text-sm text-center hover:bg-gray-50 transition-colors block"
          >
            View Cart
          </Link>

          {/* Category tags */}
          {product.categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <span key={cat.uuid} className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
