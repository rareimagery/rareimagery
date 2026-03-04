import { Routes, Route } from 'react-router-dom';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

export function App() {
  return (
    <Routes>
      <Route path="/store/:handle" element={<StorePage />} />
      <Route path="/store/:handle/product/:productUuid" element={<ProductDetailPage />} />
      <Route path="/store/:handle/cart" element={<CartPage />} />
      <Route path="/store/:handle/checkout" element={<CheckoutPage />} />
    </Routes>
  );
}
