import '../styles/globals.css';
import { AuthProvider } from '@/hooks/useAuth';

export const metadata = {
  title: 'NOIR. — Minimalist Clothing Store',
  description: 'คอลเลกชันเสื้อผ้าสไตล์ minimalist สีขาวดำ ออกแบบอย่างพิถีพิถัน',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
