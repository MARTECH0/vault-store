'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingWhatsAppWidgetProps {
  whatsappNumber?: string;
}

export default function FloatingWhatsAppWidget({ whatsappNumber }: FloatingWhatsAppWidgetProps) {
  const number = whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';
  
  return (
    <motion.a
      href={`https://wa.me/${number}?text=Hi!%20I'm%20interested%20in%20your%20products`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20b857] text-white p-4 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
      aria-label="Chat on WhatsApp"
      animate={{
        scale: [1, 1.06, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.1,
        rotate: [0, 10, -10, 10, 0],
        transition: {
          rotate: { duration: 0.4 },
          scale: { duration: 0.2 },
        },
      }}
      style={{ willChange: 'transform' }}
    >
      <MessageCircle className="w-6 h-6" />
    </motion.a>
  );
}
