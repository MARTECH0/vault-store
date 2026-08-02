import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://elitetcgvault.com'),
  title: {
    default: "Elite TCG Vault - Authentic Pokémon TCG Products",
    template: "%s | Elite TCG Vault"
  },
  description: "Premium quality Pokémon TCG products sourced from trusted suppliers. Order directly through WhatsApp for a seamless shopping experience.",
  keywords: ["Pokémon TCG", "Trading Card Game", "Pokémon Cards", "TCG Vault", "Authentic Pokémon"],
  openGraph: {
    title: "Elite TCG Vault - Authentic Pokémon TCG Products",
    description: "Premium quality Pokémon TCG products sourced from trusted suppliers. Order directly through WhatsApp.",
    url: '/',
    siteName: 'Elite TCG Vault',
    locale: 'en_IE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Elite TCG Vault - Authentic Pokémon TCG Products",
    description: "Premium quality Pokémon TCG products sourced from trusted suppliers.",
  },
  icons: {
    icon: [{ url: "/Favicon.png", type: "image/png" }],
    shortcut: "/Favicon.png",
    apple: "/Favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Elite TCG Vault",
              "description": "Premium quality Pokémon TCG products sourced from trusted suppliers.",
              "url": "https://elitetcgvault.com",
              "image": "https://elitetcgvault.com/Favicon.png",
              "currenciesAccepted": "EUR",
              "paymentAccepted": "Cash, Bank Transfer, Bitcoin"
            })
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
