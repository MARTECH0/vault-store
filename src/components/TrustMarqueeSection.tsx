'use client';

import { motion } from 'framer-motion';

export default function TrustMarqueeSection() {
  const trustBadges = [
    { icon: '🇯🇵', text: '100% Authentic TCG Products' },
    { icon: '🚚', text: 'Fast International Delivery' },
    { icon: '💬', text: 'Direct Support via WhatsApp' },
    { icon: '🔒', text: 'Verified Seller' },
    { icon: '⭐', text: '500+ Happy Customers' },
  ];

  return (
    <section className="bg-[#FFC800] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-8"
        >
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-[#0B132B] font-semibold text-sm sm:text-base"
            >
              <span className="text-xl">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
