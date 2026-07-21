import '../styles/globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import CartDrawer from '@/components/CartDrawer';
import CursorGlow from '@/components/CursorGlow';

export const metadata = {
  title: 'Su Sell Second hand — เสื้อผ้ามือสอง ของแท้ 100%',
  description: 'เสื้อผ้ามือ 1-2 คัดสรรมาอย่างดี ของแท้ทุกชิ้น DM สอบถามหรือสั่งซื้อได้เลย | Brand name สภาพดี ราคาเป็นกันเอง',
  keywords: ['เสื้อผ้ามือสอง', 'second hand', 'brand name', 'เสื้อผ้าของแท้', 'ขายเสื้อผ้า', 'Su Sell'],
  authors: [{ name: 'Su Sell Second hand' }],
  openGraph: {
    title: 'Su Sell Second hand — เสื้อผ้ามือสอง ของแท้ 100%',
    description: 'เสื้อผ้ามือ 1-2 คัดสรรมาอย่างดี ของแท้ทุกชิ้น DM สอบถามหรือสั่งซื้อได้เลย',
    type: 'website',
    locale: 'th_TH',
    siteName: 'Su Sell Second hand',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Su Sell Second hand — เสื้อผ้ามือสอง ของแท้ 100%',
    description: 'เสื้อผ้ามือ 1-2 คัดสรรมาอย่างดี ของแท้ทุกชิ้น',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Prompt:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <CursorGlow />
              {children}
              <CartDrawer />
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
