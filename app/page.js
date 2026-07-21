'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import BackToTop from '@/components/BackToTop';
import Icon from '@/components/Icon';
import { getProducts, getActiveAnnouncements } from '@/lib/firestore';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  Floating,
  PulseGlow,
} from '@/components/MotionWrapper';

export default function HomePage() {
  const [products, setProducts]       = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeBrand, setActiveBrand] = useState('ทั้งหมด');
  const [activeSize, setActiveSize]   = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [annIdx, setAnnIdx]           = useState(0);
  const { recentlyViewed } = useRecentlyViewed();

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

  // Brand counts
  const brandMap = {};
  publicProducts.forEach(p => {
    const b = p.brand || 'ไม่ระบุแบรนด์';
    brandMap[b] = (brandMap[b] || 0) + 1;
  });
  const brands = Object.entries(brandMap).sort((a, b) => b[1] - a[1]);

  // Available sizes (from products that have size set)
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
  const availableSizes = sizeOrder.filter(s =>
    publicProducts.some(p => p.size === s && p.status !== 'sold')
  );

  // Filter by brand then size
  let filtered = activeBrand === 'ทั้งหมด'
    ? publicProducts
    : publicProducts.filter(p => (p.brand || 'ไม่ระบุแบรนด์') === activeBrand);
  if (activeSize) {
    filtered = filtered.filter(p => p.size === activeSize);
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.code || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  const ann = announcements[annIdx];

  return (
    <>
      <Navbar />
      <ScrollReveal />

      {/* Announcement Banner */}
      <AnimatePresence mode="wait">
        {ann && (
          <motion.div
            key={annIdx}
            className="announcement-banner"
            style={{ background: ann.bgColor || '#ff3b30', color: ann.textColor || '#fff' }}
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <span className="announcement-text">{ann.message}</span>
            {announcements.length > 1 && (
              <span className="announcement-dots">
                {announcements.map((_, i) => (
                  <motion.span
                    key={i}
                    onClick={() => setAnnIdx(i)}
                    className={`ann-dot ${i === annIdx ? 'active' : ''}`}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-text-col">
                {/* Icon chips */}
                <FadeInUp delay={0.1}>
                  <div className="hero-chips">
                    <motion.span
                      className="hero-chip hero-chip--pink"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <Icon name="badgeCheck" size={14} /> ของแท้ 100%
                    </motion.span>
                    <motion.span
                      className="hero-chip hero-chip--blue"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <Icon name="tag" size={14} /> มือ 1-2
                    </motion.span>
                    <motion.span
                      className="hero-chip hero-chip--green"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <Icon name="coins" size={14} /> ราคาดี
                    </motion.span>
                  </div>
                </FadeInUp>

                <FadeInUp delay={0.2}>
                  <h1 className="hero-title-casual">
                    Su Sell<br />
                    <span className="hero-title-accent">Second hand</span>
                  </h1>
                </FadeInUp>

                <FadeInUp delay={0.3}>
                  <p className="hero-subtitle-casual">
                    เสื้อผ้าคัดสรรมาดีๆ ของแท้ทุกชิ้น<br />
                    ถามก่อนได้เลย ไม่กัด — DM มาเลย!
                  </p>
                </FadeInUp>

                <FadeInUp delay={0.4}>
                  <PulseGlow>
                    <motion.a
                      href="https://www.instagram.com/sell_second_hand_clothes.th"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ig-hero"
                      id="hero-ig-cta"
                      whileHover={{ scale: 1.03, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="btn-ig-icon">
                        <Icon name="instagram" size={22} />
                      </span>
                      <span className="btn-ig-text">
                        <span className="btn-ig-main">DM สั่งซื้อเลย</span>
                        <span className="btn-ig-sub">@sell_second_hand_clothes.th</span>
                      </span>
                      <motion.span
                        className="btn-ig-arrow"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Icon name="arrowRight" size={18} />
                      </motion.span>
                    </motion.a>
                  </PulseGlow>
                </FadeInUp>
              </div>

              {/* 3D Logo */}
              <FadeInRight delay={0.3}>
                <div className="hero-logo-col">
                  <Floating duration={4}>
                    <div className="logo-3d-wrapper">
                      <div className="logo-3d-spin">
                        <div className="logo-3d-front">
                          <img src="/logo.png" alt="Su Sell Second hand" className="logo-img" />
                        </div>
                        <div className="logo-3d-back">
                          <img src="/logo.png" alt="Su Sell Second hand" className="logo-img logo-img-back" />
                        </div>
                      </div>
                      <motion.div
                        className="logo-badge logo-badge-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        ของแท้
                      </motion.div>
                      <motion.div
                        className="logo-badge logo-badge-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        มือ 1-2
                      </motion.div>
                      <motion.div
                        className="logo-badge logo-badge-3"
                        whileHover={{ scale: 1.1 }}
                      >
                        DM ได้เลย
                      </motion.div>
                    </div>
                  </Floating>
                </div>
              </FadeInRight>
            </div>
          </div>
        </section>

        {/* IG Contact Strip */}
        <ScrollReveal>
          <section className="ig-strip">
            <div className="container">
              <div className="ig-strip-inner">
                <div className="ig-strip-left">
                  <motion.div
                    className="ig-avatar-pulse"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon name="instagram" size={24} />
                  </motion.div>
                  <div>
                    <p className="ig-strip-name">@sell_second_hand_clothes.th</p>
                    <p className="ig-strip-desc">ทักมาได้เลย ตอบไว ไม่ต้องรอนาน</p>
                  </div>
                </div>
                <motion.a
                  href="https://www.instagram.com/sell_second_hand_clothes.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-strip-btn"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ไปที่ IG <Icon name="arrowRight" size={14} />
                </motion.a>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Brand Filter */}
        {!loading && brands.length > 0 && (
          <ScrollReveal>
            <section className="filter-section">
              <div className="container">
                {/* Search Bar */}
                <div style={{ padding: '16px 0 8px' }}>
                  <motion.div
                    className="search-bar"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <input
                      type="text"
                      className="search-input"
                      placeholder="ค้นหาสินค้า รหัส แบรนด์..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Icon name="search" size={18} className="search-icon" />
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.button
                          className="search-clear"
                          onClick={() => setSearchQuery('')}
                          aria-label="ล้างการค้นหา"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        >
                          <Icon name="x" size={12} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <div className="filter-row">
                  {/* Brand pills */}
                  <div className="brand-filter-bar">
                    <motion.button
                      className={`brand-filter-btn ${activeBrand === 'ทั้งหมด' ? 'active' : ''}`}
                      onClick={() => setActiveBrand('ทั้งหมด')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ทั้งหมด <span className="brand-filter-count">{publicProducts.length}</span>
                    </motion.button>
                    {brands.map(([b, count]) => (
                      <motion.button
                        key={b}
                        className={`brand-filter-btn ${activeBrand === b ? 'active' : ''}`}
                        onClick={() => setActiveBrand(b)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {b} <span className="brand-filter-count">{count}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Size pills */}
                  {availableSizes.length > 0 && (
                    <div className="size-filter-bar">
                      <span className="size-filter-label">
                        <Icon name="ruler" size={14} />
                        ไซส์
                      </span>
                      {availableSizes.map(s => (
                        <motion.button
                          key={s}
                          className={`size-filter-btn ${activeSize === s ? 'active' : ''}`}
                          onClick={() => setActiveSize(activeSize === s ? '' : s)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Product Grid */}
        <section className="product-grid-section">
          <div className="container">
            <ScrollReveal>
              <div className="section-header">
                <h2 className="section-title-casual">
                  {activeBrand === 'ทั้งหมด' ? 'สินค้าทั้หมด' : activeBrand}
                  {activeSize && <span className="size-filter-active-label">· ไซส์ {activeSize}</span>}
                </h2>
                {!loading && <span className="section-count">{filtered.length} รายการ</span>}
              </div>
            </ScrollReveal>

            {loading ? (
              <StaggerContainer className="product-grid">
                {[...Array(6)].map((_, i) => (
                  <StaggerItem key={i}>
                    <div>
                      <div className="skeleton" style={{ width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />
                      <div className="skeleton" style={{ height: '20px', marginTop: '16px', width: '70%' }} />
                      <div className="skeleton" style={{ height: '16px', marginTop: '8px', width: '40%' }} />
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : filtered.length === 0 ? (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Icon name="tag" size={48} style={{ opacity: 0.15, marginBottom: '16px' }} />
                <h3 className="empty-state-title">ไม่มีสินค้าในหมวดนี้</h3>
                <p className="empty-state-desc">ลองเปลี่ยนตัวกรอง หรือติดตามสินค้าใหม่ที่ IG</p>
                <motion.a
                  href="https://www.instagram.com/sell_second_hand_clothes.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-strip-btn"
                  style={{ marginTop: '20px', display: 'inline-flex' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ดู IG ร้าน <Icon name="arrowRight" size={14} />
                </motion.a>
              </motion.div>
            ) : (
              <StaggerContainer className="product-grid">
                {filtered.map(p => (
                  <StaggerItem key={p.id}>
                    <ProductCard product={p} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <ScrollReveal>
            <section className="product-grid-section" style={{ paddingTop: 0 }}>
              <div className="container">
                <div className="section-header">
                  <h2 className="section-title-casual" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name="eye" size={20} style={{ opacity: 0.5 }} />
                    เพิ่งดูไป
                  </h2>
                </div>
                <StaggerContainer style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '16px',
                }}>
                  {recentlyViewed.slice(0, 4).map(item => (
                    <StaggerItem key={item.id}>
                      <motion.a
                        href={`/products/${item.id}`}
                        style={{
                          display: 'block',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          overflow: 'hidden',
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                        whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%', aspectRatio: '1',
                            background: 'var(--bg-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon name="tag" size={24} style={{ opacity: 0.2 }} />
                          </div>
                        )}
                        <div style={{ padding: '8px 10px' }}>
                          <p style={{
                            fontFamily: 'Prompt, sans-serif', fontSize: '0.75rem',
                            fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {item.name}
                          </p>
                          <p style={{
                            fontFamily: 'Prompt, sans-serif', fontSize: '0.7rem',
                            color: 'var(--fg-muted)',
                          }}>
                            ฿{Number(item.price).toLocaleString()}
                          </p>
                        </div>
                      </motion.a>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </section>
          </ScrollReveal>
        )}
      </main>

      {/* Footer */}
      <ScrollReveal>
        <footer className="footer">
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px',
              marginBottom: '32px',
            }}>
              {/* Brand */}
              <div>
                <h3 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
                  Su Sell Second hand
                </h3>
                <p style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.8rem', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
                  เสื้อผ้ามือสองแบรนด์เนมของแท้ คัดสรรมาอย่างดี
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
                  ลิงก์ด่วน
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Link href="/how-to-order" style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.8rem', color: 'var(--fg-muted)', textDecoration: 'none' }}>
                    วิธีสั่งซื้อ
                  </Link>
                  <Link href="/about" style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.8rem', color: 'var(--fg-muted)', textDecoration: 'none' }}>
                    เกี่ยวกับเรา
                  </Link>
                  <Link href="/favorites" style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.8rem', color: 'var(--fg-muted)', textDecoration: 'none' }}>
                    รายการโปรด
                  </Link>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
                  ติดต่อเรา
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <motion.a
                    href="https://www.instagram.com/sell_second_hand_clothes.th"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.8rem', color: 'var(--fg-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                    whileHover={{ color: '#cc2366' }}
                  >
                    <Icon name="instagram" size={14} />
                    @sell_second_hand_clothes.th
                  </motion.a>
                  <motion.a
                    href="https://line.me/ti/p/~@sellsecondhand"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.8rem', color: 'var(--fg-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                    whileHover={{ color: '#06c755' }}
                  >
                    <Icon name="line" size={14} />
                    @sellsecondhand
                  </motion.a>
                </div>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              <span className="footer-copy">© 2026 Su Sell Second hand</span>
              <span style={{ fontFamily: 'Prompt, sans-serif', fontSize: '0.7rem', color: 'var(--fg-muted)' }}>
                ของแท้ 100% | ราคาเป็นกันเอง | จัดส่งทั่วไทย
              </span>
            </div>
          </div>
        </footer>
      </ScrollReveal>

      <BackToTop />
    </>
  );
}
