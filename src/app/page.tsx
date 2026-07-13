import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsAppWidget from '@/components/FloatingWhatsAppWidget';
import HeroSection from '@/components/HeroSection';
import TrustMarqueeSection from '@/components/TrustMarqueeSection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import HowToOrderSection from '@/components/HowToOrderSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BottomCTASection from '@/components/BottomCTASection';
import { supabase } from '@/lib/supabase';

async function getFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('Error fetching featured products:', e);
    return [];
  }
}

export default async function Home() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <HeroSection whatsappNumber={whatsappNumber} />
      <TrustMarqueeSection />
      <FeaturedProductsSection products={featuredProducts} />
      <HowToOrderSection />
      <TestimonialsSection />
      <BottomCTASection whatsappNumber={whatsappNumber} />
      <Footer />
      <FloatingWhatsAppWidget />
    </div>
  );
}
