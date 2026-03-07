'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@rareimagery/api';
import { ProductCard, LoadingSpinner, EmptyState } from '@rareimagery/ui';
import type { Product, ProductType } from '@rareimagery/types';

type Tab = 'all' | ProductType;

const TABS: { label: string; value: Tab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Print on Demand', value: 'physical_pod' },
  { label: 'Custom', value: 'physical_custom' },
  { label: 'Digital', value: 'digital_download' },
];

interface StoreProductsProps {
  handle: string;
  storeNodeId: number;
}

export function StoreProducts({ handle, storeNodeId }: StoreProductsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const podQuery = useProducts('physical_pod', { storeNodeId });
  const customQuery = useProducts('physical_custom', { storeNodeId });
  const digitalQuery = useProducts('digital_download', { storeNodeId });

  const isLoading =
    podQuery.isLoading || customQuery.isLoading || digitalQuery.isLoading;

  const allProducts: Product[] = [
    ...(podQuery.data ?? []),
    ...(customQuery.data ?? []),
    ...(digitalQuery.data ?? []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const visibleProducts =
    activeTab === 'all'
      ? allProducts
      : allProducts.filter((p) => p.type === activeTab);

  return (
    <div className="max-w-site mx-auto px-4 md:px-6 py-8">
      {/* Type tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? allProducts.length
              : allProducts.filter((p) => p.type === tab.value).length;

          if (tab.value !== 'all' && count === 0 && !isLoading) return null;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                activeTab === tab.value
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 text-xs text-gray-400">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && <LoadingSpinner message="Loading products..." />}

      {/* Empty */}
      {!isLoading && visibleProducts.length === 0 && (
        <EmptyState
          title="No products yet"
          description="Check back soon — this creator is adding products."
        />
      )}

      {/* Product grid */}
      {!isLoading && visibleProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {visibleProducts.map((product) => (
            <Link
              key={product.uuid}
              href={`/${handle}/product/${product.uuid}?type=${product.type}`}
              className="block"
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
