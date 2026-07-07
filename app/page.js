'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import { getProducts, getActiveAnnouncements } from '@/lib/firestore';

export default function HomePage() {
  const [products, setProducts]       = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeBrand, setActiveBrand] = useState('ทั้งหมด');
  const [annIdx, setAnnIdx]           = useState(0);

  useEffect(() => {
    Promise.all([getProducts(), getActiveAnnouncements()])
      .then(([prods, anns]) => { setProducts(prods); setAnnouncements(anns); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => setAnnIdx(i => (i + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, [announcements.length]);

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
      <ScrollReveal />

      {/* ─── Announcement Banner ─── */}
      {ann && (
        <div className="announcement-banner"
          style={{ background: ann.bgColor || '#ff3b30', color: ann.textColor || '#fff' }}>
          <span className="announcement-text">{ann.emoji} {ann.message}</span>
          {announcements.length > 1 && (
            <span className="announcement-dots">
              {announcements.map((_, i) => (
                <span key={i} onClick={() => setAnnIdx(i)}
                  className={`ann-dot ${i === annIdx ? 'active' : ''}`} />
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
                {/* Casual chips row */}
                <div className="hero-chips">
                  <span className="hero-chip hero-chip--pink">✨ ของแท้ 100%</span>
                  <span className="hero-chip hero-chip--blue">👕 มือ 1-2</span>
                  <span className="hero-chip hero-chip--green">🏷️ ราคาดี</span>
                </div>

                <h1 className="hero-title-casual">
                  Su Sell<br />
                  <span className="hero-title-accent">Second hand</span>
                </h1>

                <p className="hero-subtitle-casual">
                  เสื้อผ้าคัดสรรมาดีๆ ของแท้ทุกชิ้น<br />
                  ถามก่อนได้เลย ไม่กัด 😄 DM มาเลย!
                </p>

                {/* IG CTA — gradient animated */}
                <a
                  href="https://www.instagram.com/sell_second_hand_clothes.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ig-hero"
                  id="hero-ig-cta"
                >
                  <span className="btn-ig-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/>
                    </svg>
                  </span>
                  <span className="btn-ig-text">
                    <span className="btn-ig-main">DM สั่งซื้อเลย!</span>
                    <span className="btn-ig-sub">@sell_second_hand_clothes.th</span>
                  </span>
                  <span className="btn-ig-arrow">→</span>
                </a>
              </div>

              {/* Right: 3D Logo */}
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
                  <div className="logo-badge logo-badge-1">ของแท้ ✓</div>
                  <div className="logo-badge logo-badge-2">มือ 1-2 ✓</div>
                  <div className="logo-badge logo-badge-3">DM สั่งได้ ✓</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── IG Contact Strip ─── */}
        <section className="ig-strip reveal-section">
          <div className="container">
            <div className="ig-strip-inner">
              <div className="ig-strip-left">
                <div className="ig-avatar-pulse">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/>
                  </svg>
                </div>
                <div>
                  <p className="ig-strip-name">@sell_second_hand_clothes.th</p>
                  <p className="ig-strip-desc">ทักมาได้เลย ตอบไว ไม่ต้องรอนาน 💬</p>
                </div>
              </div>
              <a
                href="https://www.instagram.com/sell_second_hand_clothes.th"
                target="_blank"
                rel="noopener noreferrer"
                className="ig-strip-btn"
              >
                ไปที่ IG →
              </a>
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
                  ทั้งหมด <span className="brand-filter-count">{publicProducts.length}</span>
                </button>
                {brands.map(([b, count]) => (
                  <button key={b}
                    className={`brand-filter-btn ${activeBrand === b ? 'active' : ''}`}
                    onClick={() => setActiveBrand(b)}
                  >
                    {b} <span className="brand-filter-count">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Product Grid ─── */}
        <section className="product-grid-section reveal-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title-casual">
                {activeBrand === 'ทั้งหมด' ? 'สินค้าทั้งหมด' : `แบรนด์: ${activeBrand}`}
              </h2>
              {!loading && <span className="section-count">{filtered.length} รายการ</span>}
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
                <h3 className="empty-state-title">ยังไม่มีสินค้าในหมวดนี้</h3>
                <p className="empty-state-desc">ติดตามสินค้าใหม่ได้ที่ IG ร้านเลย!</p>
                <a href="https://www.instagram.com/sell_second_hand_clothes.th"
                  target="_blank" rel="noopener noreferrer"
                  className="ig-strip-btn" style={{ marginTop: '20px', display: 'inline-flex' }}>
                  ดู IG ร้าน →
                </a>
              </div>
            ) : (
              <div className="product-grid">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="footer-copy">© 2026 Su Sell Second hand 🧡</span>
            <a href="https://www.instagram.com/sell_second_hand_clothes.th"
              target="_blank" rel="noopener noreferrer"
              className="footer-ig-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
