'use client';

import { Sparkles, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';

interface Product {
  id: number;
  title: string;
  price: string;
  tag: string;
  image_url?: string;
}

interface RecommendationGridProps {
  products: Product[];
}

export default function RecommendationGrid({ products }: RecommendationGridProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const price = parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;
    addToCart({
      id: product.id,
      name: product.title,
      price,
      imageUrl: product.image_url || '',
    });
  };

  const handleDetails = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/product-images/${imageUrl}`;
    }
    return null;
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
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {getImageUrl(product.image_url) ? (
                    <img src={getImageUrl(product.image_url)!} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles className="w-12 h-12 text-gray-400" />
                  )}
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
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white text-sm font-medium py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
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
