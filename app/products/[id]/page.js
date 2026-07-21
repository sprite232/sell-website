'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ImageGallery from '@/components/ImageGallery';
import Icon from '@/components/Icon';
import SizeGuide from '@/components/SizeGuide';
import { getProduct } from '@/lib/firestore';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((p) => {
        if (!p) setNotFound(true);
        else setProduct(p);
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
          {loading ? (
            <div className="product-detail" style={{ display: 'flex', gap: '64px' }}>
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
            </div>
          ) : notFound ? (
            <div className="empty-state" style={{ padding: '120px 24px' }}>
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
              <Link href="/" className="btn btn-outline" style={{ marginTop: '16px' }}>
                <Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} />
                กลับหน้าหลัก
              </Link>
            </div>
          ) : product ? (
            <div className="product-detail">
              {/* Breadcrumb */}
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">หน้าหลัก</Link>
                <span className="breadcrumb-sep">/</span>
                <span style={{ color: 'var(--fg)' }}>{product.name}</span>
              </nav>

              <div className="product-detail-grid">
                {/* Left: Image Gallery */}
                <div>
                  <ImageGallery images={product.images || []} />
                </div>

                {/* Right: Product Info */}
                <div>
                  {/* Sold Out banner */}
                  {product.status === 'sold' && (
                    <div style={{
                      background: 'rgba(255,59,48,0.1)', border: '1.5px solid #ff3b30',
                      borderRadius: 'var(--radius)', padding: '10px 16px',
                      marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <Icon name="x" size={16} style={{ color: '#ff3b30' }} />
                      <span style={{ fontWeight: 700, color: '#ff3b30', fontFamily: 'Prompt, sans-serif' }}>
                        สินค้าชิ้นนี้ขายไปแล้ว
                      </span>
                    </div>
                  )}

                  {/* Brand sticker */}
                  {product.brand && (
                    <div style={{ marginBottom: '16px' }}>
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
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <h1 className="product-detail-title font-display"
                      style={{ opacity: product.status === 'sold' ? 0.7 : 1, flex: 1 }}>
                      {product.name}
                    </h1>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      {/* Favorite button */}
                      <button
                        onClick={() => toggleFavorite(product)}
                        className={`fav-btn ${liked ? 'fav-btn--active' : ''}`}
                        style={{ position: 'static', width: '40px', height: '40px' }}
                        aria-label={liked ? 'ลบออกจากรายการโปรด' : 'เพิ่มรายการโปรด'}
                      >
                        <Icon name={liked ? 'heartFilled' : 'heart'} size={18} />
                      </button>

                      {/* Share button */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => setShowShareMenu(!showShareMenu)}
                          className="fav-btn"
                          style={{ position: 'static', width: '40px', height: '40px' }}
                          aria-label="แชร์สินค้า"
                        >
                          <Icon name="share" size={18} />
                        </button>

                        {/* Share dropdown */}
                        {showShareMenu && (
                          <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setShowShareMenu(false)} />
                            <div style={{
                              position: 'absolute', top: '48px', right: 0,
                              background: 'var(--bg-card)', border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-lg)', padding: '8px',
                              boxShadow: 'var(--shadow-lg)', zIndex: 9999,
                              minWidth: '160px',
                            }}>
                              <button onClick={handleShare} style={{
                                width: '100%', padding: '10px 12px', textAlign: 'left',
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem',
                                color: 'var(--fg)', borderRadius: 'var(--radius)',
                                display: 'flex', alignItems: 'center', gap: '8px',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}
                              >
                                <Icon name="share" size={16} />
                                คัดลอกลิงก์
                              </button>
                              <a
                                href={`https://www.instagram.com/sell_second_hand_clothes.th`}
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
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {product.code && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginBottom: '8px', fontFamily: 'Prompt, sans-serif' }}>
                      รหัสสินค้า: <strong>{product.code}</strong>
                    </p>
                  )}
                  <p className="product-detail-price">
                    {product.status === 'sold'
                      ? <s style={{ opacity: 0.5 }}>฿{Number(product.price).toLocaleString()}</s>
                      : `฿${Number(product.price).toLocaleString()}`}
                  </p>

                  {/* Size + Size Guide */}
                  {product.size && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span className="size-badge" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                        ไซส์ {product.size}
                      </span>
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: 'Prompt, sans-serif', fontSize: '0.8rem',
                          color: '#cc2366', display: 'flex', alignItems: 'center', gap: '4px',
                          textDecoration: 'underline', textUnderlineOffset: '3px',
                        }}
                      >
                        <Icon name="ruler" size={14} />
                        คู่มือไซส์
                      </button>
                    </div>
                  )}

                  <hr className="product-detail-divider" />

                  {product.description && (
                    <p className="product-detail-desc">{product.description}</p>
                  )}

                  <hr className="product-detail-divider" />

                  {/* Contact CTA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {product.status === 'sold' ? (
                      <>
                        <p style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif', textAlign: 'center', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                          สินค้านี้ขายไปแล้ว แต่ยังมีสินค้าดีๆ อีกเยอะ!
                        </p>
                        <a href="https://www.instagram.com/sell_second_hand_clothes.th"
                          target="_blank" rel="noopener noreferrer"
                          className="btn btn-outline btn-full"
                          style={{ gap: '8px', fontFamily: 'Prompt, sans-serif' }}>
                          ดูสินค้าอื่นใน IG
                        </a>
                      </>
                    ) : (
                      <>
                        <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif' }}>
                          สนใจสินค้าชิ้นนี้? DM มาได้เลย!
                        </p>
                        {/* Add to Cart */}
                        <button
                          onClick={() => addToCart({
                            id: product.id, name: product.name,
                            price: product.price, code: product.code,
                            brand: product.brand, brandColor: product.brandColor,
                            brandTextColor: product.brandTextColor,
                            image: product.images?.[0],
                          })}
                          className={`btn btn-full btn-lg ${isInCart(product.id) ? 'btn-outline' : 'btn-secondary'}`}
                          style={{ gap: '10px', fontFamily: 'Prompt, sans-serif' }}
                        >
                          <Icon name={isInCart(product.id) ? 'check' : 'bag'} size={18} />
                          {isInCart(product.id) ? 'อยู่ในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
                        </button>
                        <a
                          id="contact-ig"
                          href="https://www.instagram.com/sell_second_hand_clothes.th"
                          target="_blank" rel="noopener noreferrer"
                          className="btn btn-primary btn-lg btn-full"
                          style={{ gap: '10px', fontFamily: 'Prompt, sans-serif' }}
                        >
                          <Icon name="instagram" size={20} />
                          DM สั่งซื้อผ่าน Instagram
                        </a>
                      </>
                    )}
                    <Link href="/" className="btn btn-ghost btn-full">
                      <Icon name="arrowRight" size={16} style={{ transform: 'rotate(180deg)' }} />
                      ดูสินค้าอื่น
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
