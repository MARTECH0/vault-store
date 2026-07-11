'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsAppWidget from '@/components/FloatingWhatsAppWidget';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section - Our Story */}
      <section className="bg-[#0B132B] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="inline-block bg-[#FFC800] text-gray-900 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide">
              JP OUR STORY
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white italic uppercase leading-tight">
              We Live & Breathe Pokémon
            </h1>
            <div className="space-y-4 text-white/90 text-lg leading-relaxed">
              <p>
                Elite TCG Vault was born out of pure passion for Pokémon TCG. What started as a personal collection has grown into a trusted destination for collectors worldwide who demand authenticity and quality.
              </p>
              <p>
                We understand the frustration of counterfeit products and unreliable sellers. That's why we made it our mission to provide a 100% authentic sourcing channel directly from Japan, with transparency and personal service at the core of everything we do.
              </p>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="/shop"
                className="bg-[#FFC800] hover:bg-[#e5b600] text-gray-900 font-bold py-4 px-8 rounded-full transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Browse Products
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi!%20I'd%20love%20to%20learn%20more%20about%20your%20products`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20b857] text-white font-bold py-4 px-8 rounded-full transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Chat With Us
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#FFC800] mb-1">500+</div>
                <div className="text-white/70 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#FFC800] mb-1">50+</div>
                <div className="text-white/70 text-sm">TCG Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#FFC800] mb-1">30+</div>
                <div className="text-white/70 text-sm">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#FFC800] mb-1">100%</div>
                <div className="text-white/70 text-sm">Authenticity Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 bg-[#FCF9F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B132B] mb-4">Why Choose Us</h2>
            <p className="text-gray-600 italic">We set the standard for Japanese Pokémon TCG imports</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🔍', title: 'Verified Authenticity', desc: 'Every product is inspected before it leaves our hands. No fakes, no compromises.' },
              { icon: '🇯🇵', title: 'Direct from Japan', desc: 'We source our inventory directly from Japanese retailers and distributors.' },
              { icon: '💬', title: 'Personal Service', desc: 'No bots, no ticketing systems. You speak directly to us via WhatsApp.' },
              { icon: '🚚', title: 'Careful Packaging', desc: 'Boxes are bubble-wrapped and shipped in secure boxes to ensure safe delivery.' },
              { icon: '💰', title: 'Fair Pricing', desc: 'We price our products fairly. No artificial markups, just honest value.' },
              { icon: '🌍', title: 'Ships Worldwide', desc: 'We ship to over 30 countries worldwide with reliable tracking.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#0B132B] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Ordering Works */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B132B] mb-4">How Ordering Works</h2>
            <p className="text-gray-600 italic">Simple, friendly, and completely hassle-free — no account needed</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6 mb-12">
            {[
              { num: '1', title: 'Browse the Shop', desc: 'Explore our catalogue at shop.html and find the products you love.' },
              { num: '2', title: 'Click "Order on WhatsApp"', desc: 'Press the big green button on any product to start your order.' },
              { num: '3', title: 'We Confirm & Quote', desc: 'We confirm the item is available and provide you with a total price including shipping.' },
              { num: '4', title: 'Pay Securely', desc: 'We accept multiple payment methods. Your transaction is always secure.' },
              { num: '5', title: 'Receive & Enjoy!', desc: 'Your authentic Japanese TCG product arrives safely at your doorstep.' },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#0B132B] text-white rounded-xl flex items-center justify-center font-bold text-xl">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#0B132B] mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </motion.div>
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
              href={`/shop`}
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b857] text-white font-bold py-4 px-8 rounded-full transition-colors text-lg shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
              Start Your Order Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-16 sm:py-24 bg-[#FCF9F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B132B] mb-4">Shipping Information</h2>
            <p className="text-gray-600 italic">We deliver worldwide with care and precision</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📦', title: 'Packaging', desc: 'Bubble-wrapped protection with factory-sealed shrink-wrap maintenance.' },
              { icon: '🌍', title: 'International Delivery', desc: 'Typically 7–21 business days depending on your location.' },
              { icon: '📍', title: 'Tracking', desc: 'All orders include tracking via WhatsApp for peace of mind.' },
              { icon: '⚡', title: 'Processing Time', desc: 'Orders are dispatched within 24–48 hours of confirmation.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#0B132B] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsAppWidget />
    </div>
  );
}
