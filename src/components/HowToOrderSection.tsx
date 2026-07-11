'use client';

import { motion } from 'framer-motion';

export default function HowToOrderSection() {
  const steps = [
    {
      number: '1',
      title: 'Browse & Pick',
      description: 'Find your favourite Pokémon TCG product in our catalogue.',
    },
    {
      number: '2',
      title: "Tap 'Order on WhatsApp'",
      description: 'One click opens WhatsApp with your product details pre-filled.',
    },
    {
      number: '3',
      title: 'Confirm & Pay',
      description: 'We confirm availability and arrange secure payment with you directly.',
    },
    {
      number: '4',
      title: 'Receive & Play!',
      description: 'Your authentic Japanese TCG products ship straight to your door.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B132B] mb-4">How to Order</h2>
          <p className="text-gray-600 italic max-w-2xl mx-auto">
            Buying is simple — no account needed, no checkout hassle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#0B132B] text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-[#0B132B] mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
