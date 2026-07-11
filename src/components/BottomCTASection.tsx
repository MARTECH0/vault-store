'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';

interface BottomCTASectionProps {
  whatsappNumber: string;
}

export default function BottomCTASection({ whatsappNumber }: BottomCTASectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-[#0B132B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Catch 'Em All?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto italic">
            Browse our full catalogue of authentic Pokémon TCG products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="w-full sm:w-auto bg-[#FFC800] hover:bg-[#e5b600] text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Browse Full Catalogue
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi!%20I'm%20interested%20in%20browsing%20your%20products`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20b857] text-white px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
