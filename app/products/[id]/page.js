'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ImageGallery from '@/components/ImageGallery';
import Icon from '@/components/Icon';
import SizeGuide from '@/components/SizeGuide';
import { getProduct } from '@/lib/firestore';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { FadeInUp, FadeInLeft, FadeInRight, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/MotionWrapper';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { recentlyViewed, addRecentlyViewed } = useRecentlyViewed();
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((p) => {
        if (!p) setNotFound(true);
        else {
          setProduct(p);
          addRecentlyViewed(p);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const liked = product ? isFavorite(product.id) : false;

  const handleShare = async () => {
    const url = window.location.href;
    const text = `ดูสินค้านี้: ${product.name} ราคา ฿${Number(product.price).toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert('คัดลอกลิงก์แล้ว!');
    }
    setShowShareMenu(false);
  };

  return (
    <>
      <Navbar />
      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
      <main>
        <div className="container">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="product-detail"
                style={{ display: 'flex', gap: '64px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: '40px', width: '80%', marginBottom: '16px' }} />
                  <div className="skeleton" style={{ height: '28px', width: '40%', marginBottom: '32px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '75%' }} />
                </div>
              </motion.div>
            ) : notFound ? (
              <motion.div
                key="notfound"
                className="empty-state"
                style={{ padding: '120px 24px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'var(--bg-secondary)', border: '2px dashed var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', color: 'var(--fg-muted)',
                }}>
                  <Icon name="search" size={32} />
                </div>
                <h2 className="empty-state-title">ไม่พบสินค้านี้</h2>
                <p className="empty-state-desc">สินค้าอาจถูกลบไปแล้ว หรือลิงก์อาจไม่ถูกต้อง</p>
                <motion.div style={{ marginTop: '16px' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/" className="btn btn-outline">
                    <Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} />
                    กลับหน้าหลัก
                  </Link>
                </motion.div>
              </motion.div>
            ) : product ? (
              <motion.div
                key="product"
                className="product-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Breadcrumb */}
                <motion.nav
                  className="breadcrumb"
                  aria-label="Breadcrumb"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link href="/">หน้าหลัก</Link>
                  <span className="breadcrumb-sep">/</span>
                  <span style={{ color: 'var(--fg)' }}>{product.name}</span>
                </motion.nav>

                <div className="product-detail-grid">
                  {/* Left: Image Gallery */}
                  <FadeInLeft delay={0.2}>
                    <ImageGallery images={product.images || []} />
                  </FadeInLeft>

                  {/* Right: Product Info */}
                  <FadeInRight delay={0.3}>
                    <div>
                      {/* Sold Out banner */}
                      <AnimatePresence>
                        {product.status === 'sold' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                              background: 'rgba(255,59,48,0.1)', border: '1.5px solid #ff3b30',
                              borderRadius: 'var(--radius)', padding: '10px 16px',
                              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
                            }}
                          >
                            <Icon name="x" size={16} style={{ color: '#ff3b30' }} />
                            <span style={{ fontWeight: 700, color: '#ff3b30', fontFamily: 'Prompt, sans-serif' }}>
                              สินค้าชิ้นนี้ขายไปแล้ว
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Brand sticker */}
                      {product.brand && (
                        <motion.div
                          style={{ marginBottom: '16px' }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <span style={{
                            background: product.brandColor || '#000',
                            color: product.brandTextColor || '#fff',
                            padding: '5px 14px', borderRadius: '999px',
                            fontSize: '0.8rem', fontWeight: 800,
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                            fontFamily: 'Prompt, sans-serif',
                          }}>
                            {product.brand}
                          </span>
                        </motion.div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <motion.h1
                          className="product-detail-title font-display"
                          style={{ opacity: product.status === 'sold' ? 0.7 : 1, flex: 1 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: product.status === 'sold' ? 0.7 : 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {product.name}
                        </motion.h1>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          {/* Favorite button */}
                          <motion.button
                            onClick={() => toggleFavorite(product)}
                            className={`fav-btn ${liked ? 'fav-btn--active' : ''}`}
                            style={{ position: 'static', width: '40px', height: '40px' }}
                            aria-label={liked ? 'ลบออกจากรายการโปรด' : 'เพิ่มรายการโปรด'}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={liked ? 'liked' : 'notliked'}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                              >
                                <Icon name={liked ? 'heartFilled' : 'heart'} size={18} />
                              </motion.div>
                            </AnimatePresence>
                          </motion.button>

                          {/* Share button */}
                          <div style={{ position: 'relative' }}>
                            <motion.button
                              onClick={() => setShowShareMenu(!showShareMenu)}
                              className="fav-btn"
                              style={{ position: 'static', width: '40px', height: '40px' }}
                              aria-label="แชร์สินค้า"
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                            >
                              <Icon name="share" size={18} />
                            </motion.button>

                            {/* Share dropdown */}
                            <AnimatePresence>
                              {showShareMenu && (
                                <>
                                  <motion.div
                                    style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                                    onClick={() => setShowShareMenu(false)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                  />
                                  <motion.div
                                    style={{
                                      position: 'absolute', top: '48px', right: 0,
                                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                                      borderRadius: 'var(--radius-lg)', padding: '8px',
                                      boxShadow: 'var(--shadow-lg)', zIndex: 9999,
                                      minWidth: '160px',
                                    }}
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <motion.button onClick={handleShare} style={{
                                      width: '100%', padding: '10px 12px', textAlign: 'left',
                                      background: 'none', border: 'none', cursor: 'pointer',
                                      fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem',
                                      color: 'var(--fg)', borderRadius: 'var(--radius)',
                                      display: 'flex', alignItems: 'center', gap: '8px',
                                    }}
                                    whileHover={{ background: 'var(--bg-secondary)' }}
                                    >
                                      <Icon name="share" size={16} />
                                      คัดลอกลิงก์
                                    </motion.button>
                                    <a
                                      href={`https://www.instagram.com/${settings.igUsername}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setShowShareMenu(false)}
                                      style={{
                                        width: '100%', padding: '10px 12px', textAlign: 'left',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem',
                                        color: 'var(--fg)', borderRadius: 'var(--radius)',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        textDecoration: 'none',
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                      <Icon name="instagram" size={16} />
                                      ส่งทาง IG
                                    </a>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {product.code && (
                        <motion.p
                          style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginBottom: '8px', fontFamily: 'Prompt, sans-serif' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          รหัสสินค้า: <strong>{product.code}</strong>
                        </motion.p>
                      )}
                      <motion.p
                        className="product-detail-price"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {product.status === 'sold'
                          ? <s style={{ opacity: 0.5 }}>฿{Number(product.price).toLocaleString()}</s>
                          : `฿${Number(product.price).toLocaleString()}`}
                      </motion.p>

                      {/* Size + Size Guide */}
                      {product.size && (
                        <motion.div
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <span className="size-badge" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                            ไซส์ {product.size}
                          </span>
                          <motion.button
                            onClick={() => setShowSizeGuide(true)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontFamily: 'Prompt, sans-serif', fontSize: '0.8rem',
                              color: '#cc2366', display: 'flex', alignItems: 'center', gap: '4px',
                              textDecoration: 'underline', textUnderlineOffset: '3px',
                            }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Icon name="ruler" size={14} />
                            คู่มือไซส์
                          </motion.button>
                        </motion.div>
                      )}

                      <hr className="product-detail-divider" />

                      {product.description && (
                        <motion.p
                          className="product-detail-desc"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          {product.description}
                        </motion.p>
                      )}

                      <hr className="product-detail-divider" />

                      {/* Contact CTA */}
                      <motion.div
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        {product.status === 'sold' ? (
                          <>
                            <p style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif', textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                              สินค้านี้ขายไปแล้ว แต่ยังมีสินค้าดีๆ อีกเยอะ!
                            </p>
                            <motion.a href={`https://www.instagram.com/${settings.igUsername}`}
                              target="_blank" rel="noopener noreferrer"
                              className="btn btn-outline btn-full"
                              style={{ gap: '8px', fontFamily: 'Prompt, sans-serif' }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              ดูสินค้าอื่นใน IG
                            </motion.a>
                          </>
                        ) : (
                          <>
                            <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif' }}>
                              สนใจสินค้าชิ้นนี้? DM มาได้เลย!
                            </p>
                            {/* Add to Cart */}
                            <motion.button
                              onClick={() => addToCart({
                                id: product.id, name: product.name,
                                price: product.price, code: product.code,
                                brand: product.brand, brandColor: product.brandColor,
                                brandTextColor: product.brandTextColor,
                                image: product.images?.[0],
                              })}
                              className={`btn btn-full btn-lg ${isInCart(product.id) ? 'btn-outline' : 'btn-secondary'}`}
                              style={{ gap: '10px', fontFamily: 'Prompt, sans-serif' }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Icon name={isInCart(product.id) ? 'check' : 'bag'} size={18} />
                              {isInCart(product.id) ? 'อยู่ในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
                            </motion.button>
                            <motion.a
                              id="contact-ig"
                              href={`https://www.instagram.com/${settings.igUsername}`}
                              target="_blank" rel="noopener noreferrer"
                              className="btn btn-primary btn-lg btn-full"
                              style={{ gap: '10px', fontFamily: 'Prompt, sans-serif' }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Icon name="instagram" size={20} />
                              DM สั่งซื้อผ่าน Instagram
                            </motion.a>
                          </>
                        )}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link href="/" className="btn btn-ghost btn-full">
                            <Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} />
                            ดูสินค้าอื่น
                          </Link>
                        </motion.div>
                      </motion.div>
                    </div>
                  </FadeInRight>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
