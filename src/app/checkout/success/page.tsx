'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Home, MessageCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const [orderRef, setOrderRef] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ref = `VLT-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setOrderRef(ref);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#FCF9F2] flex flex-col">
      {/* Header */}
      <header className="bg-[#0B132B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-[#FFC800] bg-clip-text text-transparent">
            Elite TCG Vault
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          className="max-w-lg w-full text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Animated checkmark */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B132B] mb-3">
            Order Sent!
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Your order has been sent to us via WhatsApp. We will review your details and confirm everything with you shortly.
          </p>

          {/* Order reference */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Reference</p>
            <p className="text-2xl font-bold text-[#0B132B] tracking-wider font-mono">{orderRef}</p>
            <p className="text-xs text-gray-500 mt-2">Keep this reference handy for your records</p>
          </div>

          {/* What happens next */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 text-left">
            <p className="text-sm font-bold text-[#0B132B] mb-4">What happens next?</p>
            <div className="space-y-3">
              {[
                { step: '1', text: 'We review your order details on WhatsApp', color: 'bg-emerald-500' },
                { step: '2', text: 'We confirm availability and send payment details', color: 'bg-emerald-500' },
                { step: '3', text: 'Your order is packed and dispatched', color: 'bg-emerald-500' },
                { step: '4', text: 'You receive your authentic TCG products!', color: 'bg-[#FFC800]' },
              ].map(({ step, text, color }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full ${color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {step}
                  </div>
                  <p className="text-sm text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl active:scale-[0.98]">
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#0B132B] font-bold py-4 rounded-2xl border border-gray-200 transition-all hover:border-gray-300 active:scale-[0.98]">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Questions? Chat with us on{' '}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-semibold hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
