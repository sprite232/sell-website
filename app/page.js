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
            <p className="hero-label">New Collection 2026</p>
            <h1 className="hero-title font-display">
              Minimal.<br />Timeless.<br />Yours.
            </h1>
            <p className="hero-subtitle">
              คอลเลกชันเสื้อผ้าสไตล์ minimalist ออกแบบมาเพื่อความสะอาดตาและสวมใส่สบาย ในทุกโอกาส
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
              /* Skeleton Loading */
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
              /* Empty State */
              <div className="empty-state">
                <div className="empty-state-icon">🛍️</div>
                <h3 className="empty-state-title">ยังไม่มีสินค้า</h3>
                <p className="empty-state-desc">กำลังเพิ่มสินค้าเร็วๆ นี้ กลับมาเยี่ยมชมใหม่นะครับ</p>
              </div>
            ) : (
              /* Product Cards */
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
            <span className="footer-copy">© 2026 NOIR. All rights reserved.</span>
            <span className="footer-copy" style={{ fontSize: '0.75rem' }}>Minimalist Clothing</span>
          </div>
        </div>
      </footer>
    </>
  );
}
