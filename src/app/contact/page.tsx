'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsAppWidget from '@/components/FloatingWhatsAppWidget';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';
  const [formData, setFormData] = useState({
    name: '',
    interestedIn: 'Not sure yet',
    message: '',
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Are your products 100% authentic Japanese originals?',
      answer: 'Yes! Every product we sell is 100% authentic. We source directly from Japan and verify each item for factory inspection seals and authenticity markers before shipping to you.',
    },
    {
      question: 'Do you ship original factory-sealed booster boxes?',
      answer: 'Absolutely. All our booster boxes are shipped in their original factory-sealed condition with manufacturer shrink-wrap intact. We never open or tamper with sealed products.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods including PayPal, bank transfers, and mobile money options. Payment details are provided during the WhatsApp ordering process.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by destination: USA/Canada (7-14 days), Europe (10-21 days), Africa (14-21 days), Rest of World (14-28 days). All orders include tracking.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hi! I'm ${formData.name}. I'm interested in: ${formData.interestedIn}. ${formData.message}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#0B132B] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-block bg-[#FFC800] text-gray-900 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide">
              📞 GET IN TOUCH
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white italic uppercase">
              LET'S TALK!
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              We're friendly, fast to respond, and here to help you find the perfect Pokémon TCG product.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Highlight Bar */}
      <section className="bg-[#25D366] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white font-bold text-lg">
              The fastest way to reach us: We reply within minutes on WhatsApp!
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi!%20I'd%20like%20to%20chat`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-100 text-[#0B132B] font-bold py-3 px-6 rounded-full transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat Now
            </a>
          </div>
        </div>
      </section>

      {/* Split Main Content */}
      <section className="py-16 bg-[#FCF9F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-[#0B132B] mb-4">Reach Out Anytime</h2>
                <p className="text-gray-600 italic mb-6">
                  We provide English support, assist with orders, verify authenticity, check stock, and handle shipping inquiries.
                </p>
              </div>

              {/* Channels Grid */}
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi!%20I'd%20like%20to%20chat`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-[#25D366]"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                    <div>
                      <h3 className="font-bold text-[#0B132B]">WhatsApp (Primary)</h3>
                      <p className="text-gray-600 text-sm">Tap to open chat — fastest response</p>
                    </div>
                  </div>
                </a>

                <a
                  href="https://tiktok.com/@japanesetcg_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎵</span>
                    <div>
                      <h3 className="font-bold text-[#0B132B]">TikTok</h3>
                      <p className="text-gray-600 text-sm">@japanesetcg_ — Unboxings & product checks</p>
                    </div>
                  </div>
                </a>
              </div>

              {/* Response Times Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-[#0B132B] mb-4">Response Times</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    <span className="text-gray-700">WhatsApp — Usually within 30 minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⏰</span>
                    <span className="text-gray-700">Available Mon – Sat, 9:00 AM – 9:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-[#0B132B] mb-4">Send Us a Message</h2>
                <p className="text-gray-600 italic">
                  Fill in the form and we'll open a WhatsApp conversation with your message pre-filled — easy!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0B132B] mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ash Ketchum"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0B132B] mb-2">Interested In</label>
                  <select
                    value={formData.interestedIn}
                    onChange={(e) => setFormData({ ...formData, interestedIn: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                  >
                    <option>Not sure yet</option>
                    <option>Pokémon 151 UPC</option>
                    <option>Prismatic Evolutions ETB</option>
                    <option>Surging Sparks Booster Box</option>
                    <option>Other / Asking a question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0B132B] mb-2">Message</label>
                  <textarea
                    placeholder="Hi! I'm interested in... Is this game in stock? What payment methods do you accept?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#20b857] text-white font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2 text-lg shadow-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  Send via WhatsApp
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#0B132B] mb-4">FAQ</h2>
            <p className="text-gray-600 italic">Quick answers to common questions</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#FCF9F2] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left"
                >
                  <span className="font-semibold text-[#0B132B] pr-8">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#0B132B] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#0B132B] flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-8"
          >
            <p className="text-gray-600">
              Still have a question?{' '}
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi!%20I%20have%20a%20question`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] font-semibold hover:underline"
              >
                💬 Ask Us on WhatsApp
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsAppWidget />
    </div>
  );
}
