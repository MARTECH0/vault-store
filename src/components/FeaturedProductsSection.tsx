'use client';

import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeaturedProductsSectionProps {
  products?: any[];
}

const featuredTCGProducts = [
  { id: 1, title: '151 UPC', price: '$550', tag: '151' },
  { id: 2, title: 'Black Bolt Booster Box', price: '$90', tag: 'BLACK BOLT' },
  { id: 3, title: 'White Flare Booster Box', price: '$150', tag: 'WHITE FLARE' },
  { id: 4, title: 'Prismatic Evolutions ETB', price: '$180', tag: 'PRISMATIC' },
];

export default function FeaturedProductsSection({ products = featuredTCGProducts }: FeaturedProductsSectionProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';

  const handleBuyNow = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello Elite TCG Vault! 👋

I would like to place an order for the following item:

📦 Product: ${product.title}
💰 Price: ${product.price}

Please let me know if this is available and how I can proceed with the payment. Thanks!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

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
            <Link href={`/products/${product.id}`} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full"
              >
                {/* Card Header - Tag */}
                <div className="text-xs font-semibold text-[#0B132B] uppercase italic mb-3">
                  {product.tag}
                </div>

                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-gray-400" />
                </div>

                {/* Product Info */}
                <h3 className="font-bold text-[#0B132B] mb-2">{product.title}</h3>
                <p className="text-xl font-bold text-[#0B132B] mb-4">{product.price}</p>

                {/* Card Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 text-sm font-medium text-gray-600 hover:text-[#0B132B] transition-colors">
                    Details
                  </button>
                  <button 
                    onClick={(e) => handleBuyNow(e, product)}
                    className="flex-1 bg-[#0B132B] hover:bg-[#0B132B]/80 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
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
