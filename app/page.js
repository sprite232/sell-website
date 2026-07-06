'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { getProducts, getActiveAnnouncements } from '@/lib/firestore';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState('ทั้งหมด');
  const [annIdx, setAnnIdx] = useState(0);

  useEffect(() => {
    Promise.all([getProducts(), getActiveAnnouncements()])
      .then(([prods, anns]) => { setProducts(prods); setAnnouncements(anns); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Rotate announcements every 4 seconds
  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => setAnnIdx(i => (i + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, [announcements.length]);

  // Brand counts — exclude drafts
  const publicProducts = products.filter(p => p.status !== 'draft');
  const brandMap = {};
  publicProducts.forEach(p => {
    const b = p.brand || 'ไม่ระบุแบรนด์';
    brandMap[b] = (brandMap[b] || 0) + 1;
  });
  const brands = Object.entries(brandMap).sort((a, b) => b[1] - a[1]);

  const filtered = activeBrand === 'ทั้งหมด'
    ? publicProducts
    : publicProducts.filter(p => (p.brand || 'ไม่ระบุแบรนด์') === activeBrand);

  const ann = announcements[annIdx];

  return (
    <>
      <Navbar />

      {/* ─── Announcement Banner ─── */}
      {ann && (
        <div
          className="announcement-banner"
          style={{ background: ann.bgColor || '#ff3b30', color: ann.textColor || '#fff' }}
        >
          <span className="announcement-text">
            {ann.emoji} {ann.message}
          </span>
          {announcements.length > 1 && (
            <span className="announcement-dots">
              {announcements.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setAnnIdx(i)}
                  className={`ann-dot ${i === annIdx ? 'active' : ''}`}
                />
              ))}
            </span>
          )}
        </div>
      )}

      <main>
        {/* ─── Hero ─── */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              {/* Left: Text */}
              <div className="hero-text-col">
                <p className="hero-label">🏷️ เสื้อผ้ามือสอง ของแท้ 100%</p>
                <h1 className="hero-title-casual">
                  Su Sell<br />
                  <span className="hero-title-accent">Second hand</span>
                </h1>
                <p className="hero-subtitle-casual">
                  เสื้อผ้ามือ 1-2 คัดสรรมาอย่างดี ของแท้ทุกชิ้น 👕<br />
                  DM สอบถามหรือสั่งซื้อได้เลยที่ IG{' '}
                  <a
                    href="https://www.instagram.com/sell_second_hand_clothes.th"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-ig-link"
                  >
                    @sell_second_hand_clothes.th
                  </a>
                </p>
                <a
                  href="https://www.instagram.com/sell_second_hand_clothes.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg hero-cta"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/>
                  </svg>
                  DM สั่งซื้อเลย!
                </a>
              </div>

              {/* Right: Real Logo spinning 3D */}
              <div className="hero-logo-col">
                <div className="logo-3d-wrapper">
                  <div className="logo-3d-spin">
                    <div className="logo-3d-front">
                      <img src="/logo.png" alt="Su Sell Second hand" className="logo-img" />
                    </div>
                    <div className="logo-3d-back">
                      <img src="/logo.png" alt="Su Sell Second hand" className="logo-img logo-img-back" />
                    </div>
                  </div>
                  {/* Floating badges */}
                  <div className="logo-badge logo-badge-1">ของแท้ ✓</div>
                  <div className="logo-badge logo-badge-2">มือ 1-2 ✓</div>
                  <div className="logo-badge logo-badge-3">DM สั่งได้ ✓</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Brand Filter ─── */}
        {!loading && brands.length > 0 && (
          <section style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="container">
              <div className="brand-filter-bar">
                <button
                  className={`brand-filter-btn ${activeBrand === 'ทั้งหมด' ? 'active' : ''}`}
                  onClick={() => setActiveBrand('ทั้งหมด')}
                >
                  ทั้งหมด
                  <span className="brand-filter-count">{products.length}</span>
                </button>
                {brands.map(([b, count]) => (
                  <button
                    key={b}
                    className={`brand-filter-btn ${activeBrand === b ? 'active' : ''}`}
                    onClick={() => setActiveBrand(b)}
                  >
                    {b}
                    <span className="brand-filter-count">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Product Grid ─── */}
        <section className="product-grid-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title-casual">
                {activeBrand === 'ทั้งหมด' ? 'สินค้าทั้งหมด' : `แบรนด์: ${activeBrand}`}
              </h2>
              {!loading && (
                <span className="section-count">{filtered.length} รายการ</span>
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
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👗</div>
                <h3 className="empty-state-title">ยังไม่มีสินค้า</h3>
                <p className="empty-state-desc">ติดตามได้ที่ IG ร้านนะครับ!</p>
                <a href="https://www.instagram.com/sell_second_hand_clothes.th"
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline" style={{ marginTop: '16px', display: 'inline-flex' }}>
                  ดู IG ร้าน
                </a>
              </div>
            ) : (
              <div className="product-grid">
                {filtered.map(p => (
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
            <a href="https://www.instagram.com/sell_second_hand_clothes.th"
              target="_blank" rel="noopener noreferrer"
              className="footer-copy" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
