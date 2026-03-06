import { Routes, Route } from 'react-router-dom';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

export function App() {
  return (
    <Routes>
      <Route path="/:handle" element={<StorePage />} />
      <Route path="/:handle/product/:productUuid" element={<ProductDetailPage />} />
      <Route path="/:handle/cart" element={<CartPage />} />
      <Route path="/:handle/checkout" element={<CheckoutPage />} />
    </Routes>
  );
}
