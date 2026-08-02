'use client';

import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag, ExternalLink } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    itemCount,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
    closeDrawer,
  } = useCart();
  const router = useRouter();

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <div
        className={`cart-backdrop ${isDrawerOpen ? 'cart-backdrop--visible' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Drawer Panel ──────────────────────────────────────────────────── */}
      <aside
        className={`cart-drawer ${isDrawerOpen ? 'cart-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* ─── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-[#0B132B]">Your Vault Cart</h2>
            {itemCount > 0 && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {itemCount > 0 && (
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                View full cart
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
            <button
              onClick={closeDrawer}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* ─── Body (scrollable) ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 cart-drawer__body">
          {items.length === 0 ? (
            /* ── Empty State ──────────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-1">Your cart is empty</p>
              <p className="text-sm text-gray-500 mb-6">
                Explore our collection and add your favourites!
              </p>
              <button
                onClick={closeDrawer}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-sm"
              >
                ← Continue Shopping
              </button>
            </div>
          ) : (
            /* ── Item List ────────────────────────────────────────────── */
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 bg-gray-50/80 rounded-xl p-3 border border-gray-100 transition-all duration-200 hover:border-gray-200"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg border border-gray-200 bg-white overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#0B132B] line-clamp-2 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-sm font-bold text-emerald-600 mt-0.5">
                        €{item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-[#0B132B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ─── Footer ─────────────────────────────────────────────────── */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-5 space-y-4 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-700">Total</span>
              <span className="text-xl font-bold text-emerald-600">
                €{totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={() => {
                closeDrawer();
                router.push('/checkout');
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              Proceed to Checkout
            </button>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
