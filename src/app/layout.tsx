import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Elite TCG Vault - Authentic Pokémon TCG Products",
  description: "Premium quality Pokémon TCG products sourced from trusted suppliers. Order directly through WhatsApp for a seamless shopping experience.",
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
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
