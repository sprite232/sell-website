'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import Link from 'next/link';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const { addToCart, isInCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAddToCart = (product) => {
    if (product.status === 'sold' || isInCart(product.id)) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      code: product.code,
      brand: product.brand,
      brandColor: product.brandColor,
      brandTextColor: product.brandTextColor,
      image: product.image,
    });
  };

  const handleClearAll = () => {
    clearFavorites();
    setShowClearConfirm(false);
  };

  return (
    <>
      <Navbar />
      <main style={{ padding: '48px 0 80px' }}>
        <div className="container" style={{ maxWidth: '960px' }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <h1 style={{
                fontFamily: 'Prompt, sans-serif',
                fontSize: '1.8rem',
                fontWeight: 800,
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Icon name="heart" size={24} style={{ color: '#ff2d55' }} />
                รายการโปรด
              </h1>
              <p style={{
                color: 'var(--fg-muted)',
                fontFamily: 'Prompt, sans-serif',
                fontSize: '0.9rem',
              }}>
                {favorites.length > 0
                  ? `มี ${favorites.length} รายการที่คุณชอบ`
                  : 'ยังไม่มีรายการโปรด'}
              </p>
            </div>

            {favorites.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontFamily: 'Prompt, sans-serif', color: '#ff3b30' }}
                >
                  <Icon name="trash" size={14} />
                  ล้างทั้งหมด
                </button>
              </div>
            )}
          </div>

          {/* Clear Confirmation Modal */}
          {showClearConfirm && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '24px',
            }} onClick={() => setShowClearConfirm(false)}>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                maxWidth: '360px',
                width: '100%',
                textAlign: 'center',
              }} onClick={e => e.stopPropagation()}>
                <Icon name="trash" size={32} style={{ color: '#ff3b30', marginBottom: '16px' }} />
                <h3 style={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}>
                  ล้างรายการโปรดทั้งหมด?
                </h3>
                <p style={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.9rem',
                  color: 'var(--fg-muted)',
                  marginBottom: '24px',
                }}>
                  การดำเนินการนี้ไม่สามารถย้อนกลับได้
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="btn btn-ghost"
                    style={{ fontFamily: 'Prompt, sans-serif' }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="btn btn-danger"
                    style={{ fontFamily: 'Prompt, sans-serif' }}
                  >
                    ล้างทั้งหมด
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {favorites.length === 0 ? (
            <div className="favorites-empty">
              <div className="favorites-empty-icon">
                <Icon name="heart" size={32} />
              </div>
              <h3 style={{
                fontFamily: 'Prompt, sans-serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                marginBottom: '8px',
              }}>
                ยังไม่มีรายการโปรด
              </h3>
              <p style={{
                fontFamily: 'Prompt, sans-serif',
                fontSize: '0.9rem',
                color: 'var(--fg-muted)',
                marginBottom: '24px',
                maxWidth: '320px',
                margin: '0 auto 24px',
              }}>
                กดหัวใจที่สินค้าที่คุณชอบ เพื่อบันทึกไว้ดูทีหลัง
              </p>
              <Link href="/" className="btn btn-primary" style={{ fontFamily: 'Prompt, sans-serif' }}>
                <Icon name="eye" size={16} />
                ดูสินค้า
              </Link>
            </div>
          ) : (
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {favorites.map(item => (
                <div key={item.id} className="reveal-card">
                  <div className="product-card" style={{ position: 'relative' }}>
                    {/* Image */}
                    <div className="product-card-image-wrapper">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="product-card-image"
                          style={{
                            filter: item.status === 'sold' ? 'grayscale(75%) brightness(0.65)' : 'none',
                          }}
                        />
                      ) : (
                        <div className="product-card-image" style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--bg-secondary)',
                        }}>
                          <Icon name="tag" size={40} style={{ opacity: 0.2 }} />
                        </div>
                      )}

                      {/* Sold overlay */}
                      {item.status === 'sold' && (
                        <div className="sold-overlay">
                          <span className="sold-ribbon">SOLD OUT</span>
                        </div>
                      )}

                      {/* Code badge */}
                      {item.code && (
                        <span className="product-card-badge">{item.code}</span>
                      )}

                      {/* Brand sticker */}
                      {item.brand && item.status !== 'sold' && (
                        <span className="brand-sticker" style={{
                          background: item.brandColor || '#000',
                          color: item.brandTextColor || '#fff',
                        }}>{item.brand}</span>
                      )}

                      {/* Add to cart button */}
                      {item.status !== 'sold' && (
                        <button
                          className={`card-cart-btn ${isInCart(item.id) ? 'card-cart-btn--in' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(item);
                          }}
                          style={{ opacity: 1, translate: '-50% 0', pointerEvents: 'auto' }}
                        >
                          <Icon name={isInCart(item.id) ? 'check' : 'bag'} size={13} />
                          {isInCart(item.id) ? 'ในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
                        </button>
                      )}
                    </div>

                    {/* Info */}
                    <div className="product-card-body">
                      <Link href={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 className="product-card-name" style={{
                          opacity: item.status === 'sold' ? 0.55 : 1,
                          cursor: 'pointer',
                        }}>
                          {item.name}
                        </h3>
                      </Link>
                      <p className="product-card-price" style={{
                        opacity: item.status === 'sold' ? 0.45 : 1,
                      }}>
                        {item.status === 'sold'
                          ? <s>฿{Number(item.price).toLocaleString()}</s>
                          : `฿${Number(item.price).toLocaleString()}`
                        }
                      </p>
                      {item.status === 'sold' && <p className="sold-tag-text">ขายแล้ว</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/" style={{
              fontFamily: 'Prompt, sans-serif',
              fontSize: '0.9rem',
              color: 'var(--fg-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Icon name="chevronRight" size={14} style={{ transform: 'rotate(180deg)' }} />
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
