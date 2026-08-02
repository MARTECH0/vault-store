import Link from 'next/link';
import { MessageCircle, Facebook } from 'lucide-react';

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';
  
  return (
    <footer className="bg-[#1a237e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">ELITE TCG VAULT</h3>
            <p className="text-white/70 mb-6">
              Your trusted source for authentic Pokémon TCG products. We specialize in rare Japanese booster boxes, premium collections, and special edition sets.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#1877F2] rounded-full flex items-center justify-center transition-colors text-white" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">SHOP</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-white/70 hover:text-white transition-colors">
                  All Sets
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-white/70 hover:text-white transition-colors">
                  Pokémon 151
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-white/70 hover:text-white transition-colors">
                  Stellar Crown
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-white/70 hover:text-white transition-colors">
                  Surging Sparks
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Info & Contact */}
          <div>
            <h4 className="font-semibold mb-4">INFO & CONTACT</h4>
            <ul className="space-y-2 mb-6">
              <li className="text-white/70">
                <span className="font-semibold text-white">Hours:</span> Mon-Sun 9AM-8PM
              </li>
              <li className="text-white/70">
                <span className="font-semibold text-white">Shipping:</span> Ships worldwide
              </li>
            </ul>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi!%20I%20need%20support`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Chat Now
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © 2025 Elite TCG Vault. All rights reserved. Pokémon is Nintendo / Game Freak.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-white/60 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
