'use client';

import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';

interface FeaturedProductsSectionProps {
  products?: any[];
}

export default function FeaturedProductsSection({ products = [] }: FeaturedProductsSectionProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if ((product.stock ?? 0) <= 0) return;
    const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;
    addToCart({
      id: product.id,
      name: product.title,
      price,
      imageUrl: product.image_url || '',
    });
  };

  const handleDetails = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  const formatPrice = (price: any) => {
    if (typeof price === 'number') {
      return `$${price}`;
    }
    return price;
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FCF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-[#FFC800] text-[#0B132B] px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide mb-4">
            🔥 Most Wanted
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B132B] italic uppercase mb-4">Featured Products</h2>
          <p className="text-gray-600 italic max-w-2xl mx-auto">
            Hand-picked authentic Japanese Pokémon TCG products, ready to ship
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <Link href={`/products/${product.id}`} key={product.id || index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full"
              >
                {/* Card Header - Tag */}
                <div className="text-xs font-semibold text-[#0B132B] uppercase italic mb-3">
                  {product.tag || product.category}
                </div>

                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className={`w-full h-full object-cover ${(product.stock ?? 0) <= 0 ? 'opacity-50 grayscale' : ''}`} />
                  ) : (
                    <Sparkles className="w-12 h-12 text-gray-400" />
                  )}
                  {(product.stock ?? 0) <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Sold Out</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="font-bold text-[#0B132B] mb-2">{product.title}</h3>
                <p className="text-xl font-bold text-[#0B132B] mb-4">{formatPrice(product.price)}</p>

                {/* Card Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleDetails(e, product.id)}
                    className="flex-1 text-sm font-medium text-gray-600 hover:text-[#0B132B] transition-colors"
                  >
                    Details
                  </button>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={(product.stock ?? 0) <= 0}
                    className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 ${
                      (product.stock ?? 0) <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {(product.stock ?? 0) <= 0 ? 'Sold Out' : 'Add to Cart'}
                  </button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <a
            href="/shop"
            className="inline-flex items-center gap-2 text-[#0B132B] hover:text-[#0B132B]/80 font-semibold text-lg transition-colors"
          >
            View All Products
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
