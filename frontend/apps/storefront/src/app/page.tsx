import { fetchStores } from '@rareimagery/api';
import type { StoreSummary } from '@rareimagery/api';
import { drupalServer } from '@/lib/drupal';
import { StoreCardGrid } from '@/components/StoreCardGrid';

export const revalidate = 600;

export default async function CatalogPage() {
  let stores: StoreSummary[] = [];
  try {
    stores = await fetchStores(drupalServer);
  } catch {
    // stores remains []
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="max-w-site mx-auto px-4">
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">No creators yet</h3>
          <p className="text-gray-500">
            Check back soon for new creator stores!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-site mx-auto px-4 pt-8 pb-16">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Creators
        </h1>
        <p className="text-lg text-gray-500">
          Discover unique merchandise from your favorite creators
        </p>
      </header>
      <StoreCardGrid stores={stores} />
    </div>
  );
}
