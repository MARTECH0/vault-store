'use client';

import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from './CartContext';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  category: string;
  tag: string;
  image_url: string;
  index?: number;
}

const badgeColors: Record<string, string> = {
  'Bestseller': 'bg-orange-500',
  'New': 'bg-green-500',
  'Rare': 'bg-purple-500',
  'Trending': 'bg-blue-500',
  'Popular': 'bg-pink-500',
  'Sale': 'bg-red-500',
};

export default function ProductCard({ id, title, price, category, tag, image_url, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const badgeColor = badgeColors[tag] || 'bg-gray-500';

  const handleAddToCart = () => {
    addToCart({
      id,
      name: title,
      price,
      imageUrl: image_url || '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
    >
      <div className="relative overflow-hidden">
        <img
          src={image_url}
          alt={title}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-3 left-3 ${badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
          {tag}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500 capitalize">{category}</span>
          <span className="text-2xl font-bold text-primary">${price.toFixed(2)}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
