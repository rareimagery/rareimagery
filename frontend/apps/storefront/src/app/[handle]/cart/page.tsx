'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCarts, useUpdateCartItem, useRemoveCartItem } from '@rareimagery/api';
import { LoadingSpinner, PriceDisplay } from '@rareimagery/ui';
import type { Cart } from '@rareimagery/types';

export default function CartPage() {
  const { handle } = useParams<{ handle: string }>();
  const { data: carts, isLoading } = useCarts();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const allItems = (carts ?? []).flatMap((cart: Cart) =>
    cart.items.map((item) => ({ ...item, orderId: cart.orderId, cart })),
  );

  const grandTotal = (carts ?? []).reduce((sum: number, cart: Cart) => {
    return sum + parseFloat(cart.totalPrice.number);
  }, 0);

  const currency = carts?.[0]?.totalPrice.currencyCode ?? 'USD';

  if (isLoading) {
    return (
      <div className="max-w-site mx-auto px-4 py-16">
        <LoadingSpinner message="Loading cart..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/${handle}`} className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to @{handle}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
      </div>

      {allItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <Link
            href={`/${handle}`}
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Cart items */}
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden mb-6">
            {allItems.map((item) => (
              <div key={item.uuid} className="flex items-center gap-4 p-4 bg-white">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    <PriceDisplay number={item.unitPrice.number} currencyCode={item.unitPrice.currencyCode} />
                    {' each'}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateItem.mutate({ orderId: item.orderId, orderItemId: item.orderItemId, quantity: item.quantity - 1 })
                        : removeItem.mutate({ orderId: item.orderId, orderItemId: item.orderItemId })
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-medium text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateItem.mutate({ orderId: item.orderId, orderItemId: item.orderItemId, quantity: item.quantity + 1 })
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Item total */}
                <div className="text-right w-20 flex-shrink-0">
                  <p className="font-semibold text-gray-900">
                    <PriceDisplay number={item.totalPrice.number} currencyCode={item.totalPrice.currencyCode} />
                  </p>
                  <button
                    onClick={() => removeItem.mutate({ orderId: item.orderId, orderItemId: item.orderItemId })}
                    className="text-xs text-red-400 hover:text-red-600 mt-0.5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total</span>
              <PriceDisplay number={String(grandTotal)} currencyCode={currency} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Shipping calculated at checkout</p>
          </div>

          <Link
            href={`/${handle}/checkout`}
            className="w-full block py-4 bg-gray-900 text-white text-center rounded-xl font-semibold text-base hover:bg-gray-700 transition-colors"
          >
            Proceed to Checkout →
          </Link>
        </>
      )}
    </div>
  );
}
