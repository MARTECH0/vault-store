'use client';

import { ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  whatsappNumber: string;
}


const floatingIcons = [
  { icon: '⚡', delay: 0, duration: 8 },
  { icon: '🔥', delay: 1, duration: 7 },
  { icon: '💧', delay: 2, duration: 9 },
  { icon: '🌿', delay: 0.5, duration: 6 },
  { icon: '⭐', delay: 1.5, duration: 10 },
];

export default function HeroSection({ whatsappNumber }: HeroSectionProps) {
  return (
    <section className="bg-[#0B132B] py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Ambient Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl sm:text-6xl opacity-10"
            style={{
              top: `${20 + index * 15}%`,
              left: `${10 + index * 20}%`,
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [-3, 3, -3],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-8"
        >
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-wrap justify-center items-center gap-2 text-white/80 text-sm"
            style={{ willChange: 'transform, opacity' }}
          >
            <span>⚡</span>
            <span>🔥</span>
            <span>💧</span>
            <span>🌿</span>
            <span>⭐</span>
            <span className="italic uppercase">🇯🇵 Authentic Japanese Import</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white italic uppercase leading-tight"
            style={{ willChange: 'transform, opacity' }}
          >
            Authentic Pokémon TCG Products Delivered to You
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="text-white/80 text-lg max-w-3xl mx-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            The rarest Pokémon TCG products shipped directly to your door. 100% authentic, verified booster boxes, bundles, and special collections.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.a
              href="/shop"
              className="relative bg-[#FFC800] text-gray-900 font-bold py-4 px-8 rounded-full flex items-center justify-center gap-2 text-lg overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: 'transform' }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <ShoppingCart className="w-5 h-5" />
              Shop Now
            </motion.a>
            <motion.a
              href="/shop"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-2 text-lg overflow-hidden"
              whileHover={{ 
                scale: 1.03,
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: 'transform' }}
            >
              Browse Collection
            </motion.a>
          </motion.div>

          {/* Quick Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-4 text-white/70 text-sm"
            style={{ willChange: 'opacity' }}
          >
            <span>100% Authentic</span>
            <span>•</span>
            <span>Fast Delivery</span>
            <span>•</span>
            <span>WhatsApp Support</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
