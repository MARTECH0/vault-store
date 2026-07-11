import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsAppWidget from '@/components/FloatingWhatsAppWidget';
import HeroSection from '@/components/HeroSection';
import TrustMarqueeSection from '@/components/TrustMarqueeSection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import HowToOrderSection from '@/components/HowToOrderSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BottomCTASection from '@/components/BottomCTASection';

export default function Home() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <HeroSection whatsappNumber={whatsappNumber} />
      <TrustMarqueeSection />
      <FeaturedProductsSection />
      <HowToOrderSection />
      <TestimonialsSection />
      <BottomCTASection whatsappNumber={whatsappNumber} />
      <Footer />
      <FloatingWhatsAppWidget />
    </div>
  );
}
