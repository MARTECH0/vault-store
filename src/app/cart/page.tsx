'use client';

import { useCart } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Package, Shield, Truck, CheckCircle, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const {
    items,
    itemCount,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const router = useRouter();

  const shipping = totalPrice * 0.10;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF9F2]">
      <Navbar />

      {/* Hero bar */}
      <section className="bg-[#0B132B] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFC800] text-[#0B132B] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide mb-3">
                <ShoppingBag className="w-3.5 h-3.5" />
                Your Cart
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white italic uppercase">
                Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h1>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center py-24 gap-6"
          >
            <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0B132B] mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* LEFT: Item list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-[#0B132B]">Items in your cart</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
                >
                  Clear all
                </button>
              </div>

              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.35 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex gap-4 sm:gap-6 items-center"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#0B132B] leading-snug line-clamp-2 mb-1">{item.name}</h3>
                      <p className="text-emerald-600 font-bold text-lg">${item.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 px-1 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                          aria-label={'Decrease ' + item.name}
                        >
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-[#0B132B]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                          aria-label={'Increase ' + item.name}
                        >
                          <Plus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={'Remove ' + item.name}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>


            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-[#0B132B] px-6 py-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#FFC800]" />
                      Order Summary
                    </h3>
                  </div>

                  <div className="p-5 space-y-3 border-b border-gray-100 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm gap-2">
                        <span className="text-gray-600 line-clamp-1 flex-1">
                          {item.name} <span className="text-gray-400">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-[#0B132B] flex-shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" /> Shipping (10%)
                      </span>
                      <span className="font-semibold">
                        ${shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <span className="font-bold text-[#0B132B]">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="px-5 pb-5 space-y-3">
                    <button
                      onClick={() => router.push('/checkout')}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
                    >
                      Proceed to Checkout
                    </button>
                    <Link
                      href="/shop"
                      className="w-full border-2 border-[#0B132B] text-[#0B132B] hover:bg-[#0B132B]/5 font-bold py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {([
                    { Icon: Shield, label: 'Secure Checkout' },
                    { Icon: CheckCircle, label: '100% Authentic' },
                    { Icon: Truck, label: 'Fast Dispatch' },
                  ] as const).map(({ Icon, label }) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col items-center gap-1.5 text-center shadow-sm">
                      <Icon className="w-4 h-4 text-emerald-500" />
                      <p className="text-xs font-semibold text-gray-600 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
