'use client';

import { MessageCircle } from 'lucide-react';
import TrustBanner from './TrustBanner';
import RecommendationGrid from './RecommendationGrid';

interface Product {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  availability: string;
  condition: string;
  imageUrl?: string;
}

interface ProductDetailPageProps {
  product: Product;
  whatsappNumber: string;
  relatedProducts: Array<{
    id: number;
    title: string;
    price: string;
    tag: string;
  }>;
}

export default function ProductDetailPage({ product, whatsappNumber, relatedProducts }: ProductDetailPageProps) {
  const handleOrderNow = () => {
    const message = `Hello Elite TCG Vault! 👋

I would like to place an order for the following item:

📦 Product: ${product.title}
💰 Price: ${product.price}

Please let me know if this is available and how I can proceed with the payment. Thanks!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-[#FCF9F2]">
        <nav className="text-sm text-gray-500">
          <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
          <span className="mx-2">›</span>
          <a href="/shop" className="hover:text-gray-900 transition-colors">Shop</a>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>
      </div>

      {/* Hero Product Section */}
      <section className="py-12 bg-[#FCF9F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-gray-400 text-6xl">📦</div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-[#0B132B] uppercase italic mb-2">
                  {product.subtitle}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#0B132B]">
                  {product.title}
                </h1>
                <p className="text-4xl font-bold text-[#0B132B] mt-4">{product.price}</p>
              </div>

              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0B132B]">Availability:</span>
                  <span className="font-bold text-[#0B132B]">{product.availability}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0B132B]">Condition:</span>
                  <span className="text-gray-700">{product.condition}</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleOrderNow}
                className="w-full bg-[#25D366] hover:bg-[#20b857] text-white font-bold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-6 h-6" />
                Order via WhatsApp
              </button>

              {/* Trust Banner */}
              <TrustBanner />
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <RecommendationGrid products={relatedProducts} />
    </div>
  );
}
