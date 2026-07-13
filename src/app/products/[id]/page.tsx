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
  console.log('Fetching product with ID:', id);
  try {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      console.error('Invalid product ID:', id);
      return null;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', numericId)
      .single();

    if (error) {
      console.error('Supabase error fetching product:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      // Only fall back to mock data if it's a connection error, not 404
      if (error.code === 'PGRST116') {
        // Record not found - return null to show 404
        console.log('Product not found in database');
        return null;
      }
      // For other errors, try mock data
      console.log('Falling back to mock data due to error');
      return mockProducts[id] || null;
    }

    console.log('Product fetched successfully:', data);
    return data;
  } catch (e) {
    console.error('Exception fetching product:', e);
    // Fall back to mock data if Supabase fails
    console.log('Falling back to mock data due to exception');
    return mockProducts[id] || null;
  }
}

async function getRelatedProducts(currentId: string) {
  try {
    const numericId = parseInt(currentId);
    if (isNaN(numericId)) {
      console.error('Invalid product ID for related products:', currentId);
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', numericId)
      .limit(4)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching related products:', error);
      // Fall back to mock data if Supabase fails
      return Object.values(mockProducts)
        .filter((p) => p.id !== numericId)
        .slice(0, 4);
    }

    return data || [];
  } catch (e) {
    console.error('Exception fetching related products:', e);
    // Fall back to mock data if Supabase fails
    return Object.values(mockProducts)
      .filter((p) => p.id !== parseInt(currentId))
      .slice(0, 4);
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  console.log('ProductPage called with params:', resolvedParams);
  console.log('Product ID from URL:', resolvedParams.id);
  
  const product = await getProduct(resolvedParams.id);
  const relatedProducts = await getRelatedProducts(resolvedParams.id);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';

  if (!product) {
    console.log('Product is null, showing 404 page');
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-4">Product ID: {resolvedParams.id}</p>
            <a href="/shop" className="text-[#0B132B] hover:underline">
              Return to Shop
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Construct proper Supabase Storage URL if image_url is just a filename
  let imageUrl = product.image_url;
  if (product.image_url && !product.image_url.startsWith('http')) {
    // If it's just a filename, construct the full Supabase Storage URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      imageUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${product.image_url}`;
    }
  }

  const formattedProduct = {
    id: product.id,
    title: product.title,
    subtitle: product.category,
    price: `$${product.price}`,
    description: product.description || `Authentic ${product.category} product. ${product.tag || 'Premium quality'}. This item is sourced directly from Japan and verified for authenticity.`,
    availability: 'In Stock',
    condition: '100% Authentic Japanese Import',
    imageUrl: imageUrl,
  };

  const formattedRelatedProducts = relatedProducts.map((p: any) => {
    // Construct proper Supabase Storage URL if image_url is just a filename
    let imageUrl = p.image_url;
    if (p.image_url && !p.image_url.startsWith('http')) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        imageUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${p.image_url}`;
      }
    }

    return {
      id: p.id,
      title: p.title,
      price: `$${p.price}`,
      tag: p.tag || 'New',
      image_url: imageUrl,
    };
  });

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
