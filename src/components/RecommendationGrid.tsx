'use client';

import { Sparkles, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  title: string;
  price: string;
  tag: string;
}

interface RecommendationGridProps {
  products: Product[];
}

export default function RecommendationGrid({ products }: RecommendationGridProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello Elite TCG Vault! 👋

I would like to place an order for the following item:

📦 Product: ${product.title}
💰 Price: ${product.price}

Please let me know if this is available and how I can proceed with the payment. Thanks!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDetails = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  return (
    <section className="py-16 bg-[#F5F5FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0B132B] mb-2">You Might Also Like</h2>
          <p className="text-gray-600 italic">More authentic Japanese Pokémon TCG products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="text-xs font-semibold text-[#0B132B] uppercase mb-2">{product.tag}</div>
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="font-semibold text-[#0B132B] mb-2">{product.title}</h3>
                <p className="text-lg font-bold text-[#0B132B] mb-3">{product.price}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleDetails(e, product.id)}
                    className="flex-1 text-sm font-medium text-gray-700 hover:text-[#0B132B] transition-colors"
                  >
                    Details
                  </button>
                  <button 
                    onClick={(e) => handleBuyNow(e, product)}
                    className="flex-1 bg-[#0B132B] hover:bg-[#0B132B]/80 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
