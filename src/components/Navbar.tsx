'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const [badgeKey, setBadgeKey] = useState(0);
  const prevCount = useRef(itemCount);

  // Trigger pulse animation when count changes
  useEffect(() => {
    if (itemCount !== prevCount.current) {
      setBadgeKey((k) => k + 1);
      prevCount.current = itemCount;
    }
  }, [itemCount]);

  return (
    <nav className="sticky top-0 z-50 bg-[#1a237e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="relative w-40 h-40 overflow-hidden">
            <Image src="/logo.png" alt="Elite TCG Vault logo" fill sizes="160px" className="object-contain" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/80 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link href="/shop" className="text-white/80 hover:text-white transition-colors font-medium">
              Shop
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors font-medium">
              Contact
            </Link>

            {/* Cart Button */}
            <button
              onClick={openDrawer}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {itemCount > 0 && (
                <span
                  key={badgeKey}
                  className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center cart-badge-animate"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile: Cart + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openDrawer}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {itemCount > 0 && (
                <span
                  key={badgeKey}
                  className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center cart-badge-animate"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1442]">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-white/80 hover:text-white font-medium py-2" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/shop" className="block text-white/80 hover:text-white font-medium py-2" onClick={() => setIsOpen(false)}>
              Shop
            </Link>
            <Link href="/about" className="block text-white/80 hover:text-white font-medium py-2" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block text-white/80 hover:text-white font-medium py-2" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
