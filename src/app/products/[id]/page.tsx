import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsAppWidget from '@/components/FloatingWhatsAppWidget';
import ProductDetailPage from '@/components/ProductDetailPage';
import { supabase } from '@/lib/supabase';

// Mock data for when database is not set up
const mockProducts: Record<string, any> = {
  '1': {
    id: 1,
    title: 'Prismatic SPC',
    category: '151',
    price: 180,
    tag: 'New',
    image_url: null,
  },
  '2': {
    id: 2,
    title: 'Stellar Crown Booster Box',
    category: 'Stellar Crown',
    price: 145,
    tag: 'Popular',
    image_url: null,
  },
  '3': {
    id: 3,
    title: 'Surging Sparks Booster Box',
    category: 'Surging Sparks',
    price: 135,
    tag: 'Trending',
    image_url: null,
  },
  '4': {
    id: 4,
    title: 'White Flare Booster Box',
    category: 'White Flare',
    price: 150,
    tag: 'Rare',
    image_url: null,
  },
};

async function getProduct(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) {
      // Fall back to mock data if Supabase fails
      return mockProducts[id] || null;
    }

    return data;
  } catch (e) {
    // Fall back to mock data if Supabase fails
    return mockProducts[id] || null;
  }
}

async function getRelatedProducts(currentId: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', parseInt(currentId))
      .limit(4)
      .order('created_at', { ascending: false });

    if (error) {
      // Fall back to mock data if Supabase fails
      return Object.values(mockProducts)
        .filter((p) => p.id !== parseInt(currentId))
        .slice(0, 4);
    }

    return data || [];
  } catch (e) {
    // Fall back to mock data if Supabase fails
    return Object.values(mockProducts)
      .filter((p) => p.id !== parseInt(currentId))
      .slice(0, 4);
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  const relatedProducts = await getRelatedProducts(params.id);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <a href="/shop" className="text-[#0B132B] hover:underline">
              Return to Shop
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedProduct = {
    id: product.id,
    title: product.title,
    subtitle: product.category,
    price: `$${product.price}`,
    description: `Authentic ${product.category} product. ${product.tag || 'Premium quality'}. This item is sourced directly from Japan and verified for authenticity.`,
    availability: 'In Stock',
    condition: '100% Authentic Japanese Import',
    imageUrl: product.image_url,
  };

  const formattedRelatedProducts = relatedProducts.map((p: any) => ({
    id: p.id,
    title: p.title,
    price: `$${p.price}`,
    tag: p.tag || 'New',
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ProductDetailPage
        product={formattedProduct}
        whatsappNumber={whatsappNumber}
        relatedProducts={formattedRelatedProducts}
      />
      <Footer />
      <FloatingWhatsAppWidget />
    </div>
  );
}
