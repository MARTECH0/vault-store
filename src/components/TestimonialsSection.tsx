'use client';

import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const testimonials = [
    {
      initial: 'M',
      name: 'Marcus T.',
      flag: '🇺🇸',
      rating: 5,
      review: 'Absolutely authentic products! The WhatsApp ordering was so easy and my booster box arrived in perfect condition with factory seal intact. Will definitely order again.',
    },
    {
      initial: 'S',
      name: 'Sophie L.',
      flag: '🇫🇷',
      rating: 5,
      review: 'Best TCG store I have found. The collection is incredible and the customer service via WhatsApp is top-notch. Smooth shipping and great communication!',
    },
    {
      initial: 'K',
      name: 'Kenji W.',
      flag: '🇨🇦',
      rating: 5,
      review: 'Fast international shipping and 100% authentic Japanese products. The whole process was seamless from WhatsApp chat to delivery. Thank you Elite TCG Vault!',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FCF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B132B] mb-4">What Trainers Say</h2>
          <p className="text-gray-600 italic max-w-2xl mx-auto">
            Join hundreds of happy Pokémon fans worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl text-[#FFC800] mb-4">"</div>
              <p className="text-gray-600 mb-6 leading-relaxed">{testimonial.review}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0B132B] text-white rounded-full flex items-center justify-center font-bold">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B132B]">{testimonial.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="text-lg">{testimonial.flag}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
