'use client';

import { Truck, Lock, MessageCircle } from 'lucide-react';

export default function TrustBanner() {
  const trustItems = [
    {
      icon: '🇯🇵',
      title: '100% Authentic',
      description: 'Every product verified genuine',
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Worldwide delivery available',
    },
    {
      icon: MessageCircle,
      title: 'Direct Support',
      description: 'WhatsApp us with any questions',
    },
    {
      icon: Lock,
      title: 'Secure Transaction',
      description: 'Trusted by 500+ collectors',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {trustItems.map((item, index) => (
        <div key={index} className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-3xl mb-2">
            {typeof item.icon === 'string' ? item.icon : <item.icon className="w-8 h-8 text-[#1a237e]" />}
          </div>
          <h4 className="font-bold text-gray-900 italic mb-1">{item.title}</h4>
          <p className="text-xs text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
