import { ProductGrid } from '../../ProductGrid';
import { ProductFilters } from '../../ProductFilters';

export function ProductGridBlock() {
  return (
    <section className="creator-page__catalog">
      <h2 className="creator-page__section-title">Shop</h2>
      <div className="creator-page__catalog-content">
        <aside className="creator-page__catalog-sidebar">
          <ProductFilters />
        </aside>
        <main className="creator-page__catalog-grid">
          <ProductGrid />
        </main>
      </div>
    </section>
  );
}
