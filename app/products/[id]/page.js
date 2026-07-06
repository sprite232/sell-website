'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ImageGallery from '@/components/ImageGallery';
import { getProduct } from '@/lib/firestore';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addToCart, isInCart } = useCart();

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

  return (
    <>
      <Navbar />
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
              <div className="empty-state-icon">🔍</div>
              <h2 className="empty-state-title">ไม่พบสินค้านี้</h2>
              <p className="empty-state-desc">สินค้าอาจถูกลบไปแล้ว หรือลิงก์อาจไม่ถูกต้อง</p>
              <Link href="/" className="btn btn-outline">← กลับหน้าหลัก</Link>
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
                      <span style={{ fontSize: '1.2rem' }}>🔴</span>
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

                  <h1 className="product-detail-title font-display"
                    style={{ opacity: product.status === 'sold' ? 0.7 : 1 }}>
                    {product.name}
                  </h1>
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
                          😢 สินค้านี้ขายไปแล้ว แต่ยังมีสินค้าดีๆ อีกเยอะ!
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
                          📩 สนใจสินค้าชิ้นนี้? DM มาได้เลย!
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
                          {isInCart(product.id) ? '✓ อยู่ในตะกร้าแล้ว' : '🛒 ใส่ตะกร้า'}
                        </button>
                        <a
                          id="contact-ig"
                          href="https://www.instagram.com/sell_second_hand_clothes.th"
                          target="_blank" rel="noopener noreferrer"
                          className="btn btn-primary btn-lg btn-full"
                          style={{ gap: '10px', fontFamily: 'Prompt, sans-serif' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                            <circle cx="12" cy="12" r="4"/>
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/>
                          </svg>
                          DM สั่งซื้อผ่าน Instagram
                        </a>
                      </>
                    )}
                    <Link href="/" className="btn btn-ghost btn-full">
                      ← ดูสินค้าอื่น
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
