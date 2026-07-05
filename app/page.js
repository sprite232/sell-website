'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/firestore';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <main>
        {/* ─── Hero ─── */}
        <section className="hero">
          <div className="container">
            <p className="hero-label">เสื้อผ้ามือสอง ของแท้ 100%</p>
            <h1 className="hero-title font-display">
              Su Sell<br />Second hand
            </h1>
            <p className="hero-subtitle">
              เสื้อผ้ามือ 1-2 คัดสรรมาอย่างดี ของแท้ทุกชิ้น
              DM สอบถามหรือสั่งซื้อได้เลยที่ IG{' '}
              <a
                href="https://www.instagram.com/sell_second_hand_clothes.th"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 600, borderBottom: '1px solid currentColor' }}
              >
                @sell_second_hand_clothes.th
              </a>
            </p>
          </div>
        </section>

        {/* ─── Product Grid ─── */}
        <section className="product-grid-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title font-display">สินค้าทั้งหมด</h2>
              {!loading && (
                <span className="section-count">{products.length} รายการ</span>
              )}
            </div>

            {loading ? (
              <div className="product-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="skeleton" style={{ width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />
                    <div className="skeleton" style={{ height: '20px', marginTop: '16px', width: '70%' }} />
                    <div className="skeleton" style={{ height: '16px', marginTop: '8px', width: '40%' }} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👗</div>
                <h3 className="empty-state-title">ยังไม่มีสินค้า</h3>
                <p className="empty-state-desc">กำลังเพิ่มสินค้าเร็วๆ นี้ ติดตามได้ที่ IG ร้านนะครับ</p>
                <a
                  href="https://www.instagram.com/sell_second_hand_clothes.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ marginTop: '16px', display: 'inline-flex' }}
                >
                  ติดตาม IG ร้าน
                </a>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="footer-copy">© 2026 Su Sell Second hand</span>
            <a
              href="https://www.instagram.com/sell_second_hand_clothes.th"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-copy"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/>
              </svg>
              @sell_second_hand_clothes.th
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
