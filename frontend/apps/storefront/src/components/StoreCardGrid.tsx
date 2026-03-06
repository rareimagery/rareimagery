'use client';

import Link from 'next/link';
import { StoreCard } from '@rareimagery/ui';
import type { StoreSummary } from '@rareimagery/api';

interface StoreCardGridProps {
  stores: StoreSummary[];
}

export function StoreCardGrid({ stores }: StoreCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <Link key={store.handle} href={`/${store.handle}`} className="block">
          <StoreCard store={store} />
        </Link>
      ))}
    </div>
  );
}
