'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Crown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#1a237e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">
              ELITE TCG VAULT
            </span>
            <div className="bg-yellow-500 rounded-full p-1">
              <Crown className="w-4 h-4 text-white" />
            </div>
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
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
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
