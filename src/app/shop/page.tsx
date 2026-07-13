'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsAppWidget from '@/components/FloatingWhatsAppWidget';
import { supabase } from '@/lib/supabase';
import { Search, ChevronDown, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  tag: string;
  image_url: string;
  description?: string;
}

export default function Shop() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('All Series');
  const [selectedPrice, setSelectedPrice] = useState('All Prices');

  const seriesOptions = ['All Series', '151', 'Black Bolt', 'White Flare', 'Prismatic', 'Stellar Crown', 'Surging Sparks'];
  const priceOptions = ['All Prices', 'Under $100', '$100 - $200', '$200 - $500', 'Over $500'];

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
        setFilteredProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const getFilteredProducts = () => {
    let filtered = products;

    if (selectedSeries !== 'All Series') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase().includes(selectedSeries.toLowerCase()) ||
        product.tag?.toLowerCase().includes(selectedSeries.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedPrice !== 'All Prices') {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (selectedPrice) {
          case 'Under $100': return price < 100;
          case '$100 - $200': return price >= 100 && price <= 200;
          case '$200 - $500': return price > 200 && price <= 500;
          case 'Over $500': return price > 500;
          default: return true;
        }
      });
    }

    return filtered;
  };

  const computedFilteredProducts = getFilteredProducts();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello Elite TCG Vault! 👋

I would like to place an order for the following item:

📦 Product: ${product.title}
💰 Price: $${product.price}

Please let me know if this is available and how I can proceed with the payment. Thanks!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDetails = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#0B132B] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-block bg-[#FFC800] text-gray-900 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide">
              JP ALL AUTHENTIC JAPANESE
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white italic uppercase">
              Browse Our Collection
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Every product is 100% authentic, sourced directly from Japan
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Bar - Overlapping */}
      <div className="relative -mt-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products... (e.g. Prismatic, Journey Together)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent"
                />
              </div>

              {/* Series Dropdown */}
              <div className="relative w-full lg:w-48">
                <select
                  value={selectedSeries}
                  onChange={(e) => setSelectedSeries(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  {seriesOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Price Dropdown */}
              <div className="relative w-full lg:w-48">
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  {priceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Counter */}
              <div className="text-gray-500 text-sm font-medium whitespace-nowrap">
                {filteredProducts.length} product(s) found
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer h-full"
                  >
                    {/* Card Header - Tag */}
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      {product.tag || product.category}
                    </div>

                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-300 text-4xl">📦</div>
                      )}
                    </div>

                    {/* Product Info */}
                    <h3 className="font-bold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {product.description || `Authentic ${product.category} product sourced directly from Japan.`}
                    </p>
                    <p className="text-xl font-bold text-gray-900 mb-4">${product.price}</p>

                    {/* Card Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleDetails(e, product.id)}
                        className="flex-1 text-sm font-medium text-gray-600 hover:text-[#0B132B] transition-colors py-2"
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
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp CTA Banner */}
      <section className="py-16 bg-[#FCF9F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Not sure what to pick?
            </h2>
            <p className="text-gray-600 mb-8">
              Chat with us on WhatsApp — we'll help you find the perfect product!
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi!%20I%20need%20help%20choosing%20a%20product`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp hover:bg-[#20b857] text-white font-bold py-4 px-8 rounded-full transition-colors text-lg shadow-lg"
            >
              💬 Get Personalised Help
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsAppWidget />
    </div>
  );
}
