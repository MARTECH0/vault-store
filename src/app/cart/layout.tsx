import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review the items in your cart before proceeding to checkout.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
