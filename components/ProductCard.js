'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function ProductCard({ product }) {
  const { id, name, price, description, images, code, brand, brandColor, brandTextColor, status } = product;
  const [hovered, setHovered] = useState(false);
  const { addToCart, isInCart } = useCart();

  const thumb   = images?.[0] || null;
  const thumb2  = images?.[1] || null;          // second image for hover swap
  const isSold  = status === 'sold';
  const isDraft = status === 'draft';
  const inCart  = isInCart(id);

  // Show second image on hover (PC only — handled via CSS @media(hover:hover))
  const displayImg = hovered && thumb2 && !isSold ? thumb2 : thumb;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSold || inCart) return;
    addToCart({
      id, name, price, code, brand, brandColor, brandTextColor,
      image: thumb,
    });
  };

  return (
    <div className="reveal-card">
      <Link
        href={`/products/${id}`}
        className={`product-card ${isSold ? 'product-card--sold' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="product-card-image-wrapper">
          {thumb ? (
            <img
              src={displayImg}
              alt={name}
              className="product-card-image"
              loading="lazy"
              style={{ filter: isSold ? 'grayscale(80%) brightness(0.7)' : 'none' }}
            />
          ) : (
            <div className="product-card-image" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', background: 'var(--bg-secondary)',
            }}>👗</div>
          )}

          {/* SOLD OUT overlay ribbon */}
          {isSold && (
            <div className="sold-overlay">
              <span className="sold-ribbon">SOLD OUT</span>
            </div>
          )}

          {/* DRAFT badge */}
          {isDraft && <span className="draft-badge">ร่าง</span>}

          {/* Brand Sticker — top right */}
          {brand && !isSold && (
            <span className="brand-sticker" style={{
              background: brandColor || '#000',
              color: brandTextColor || '#fff',
            }}>
              {brand}
            </span>
          )}

          {/* Product Code — top left */}
          {code && <span className="product-card-badge">{code}</span>}

          {/* Quick Add to Cart — shows on hover (PC only) */}
          {!isSold && (
            <button
              className={`card-cart-btn ${inCart ? 'card-cart-btn--in' : ''}`}
              onClick={handleAddToCart}
              aria-label={inCart ? 'อยู่ในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
            >
              {inCart ? '✓ ในตะกร้า' : '🛍️ ใส่ตะกร้า'}
            </button>
          )}
        </div>

        <div className="product-card-body">
          <h3 className="product-card-name" style={{ opacity: isSold ? 0.6 : 1 }}>{name}</h3>
          <p className="product-card-price" style={{ opacity: isSold ? 0.5 : 1 }}>
            {isSold ? <s>฿{Number(price).toLocaleString()}</s> : `฿${Number(price).toLocaleString()}`}
          </p>
          {description && !isSold && (
            <p className="product-card-desc">{description}</p>
          )}
          {isSold && (
            <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif' }}>ขายแล้ว 🎉</p>
          )}
        </div>
      </Link>
    </div>
  );
}
