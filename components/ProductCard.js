'use client';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const { id, name, price, description, images, code, brand, brandColor, brandTextColor, status } = product;
  const thumb  = images?.[0] || null;
  const isSold  = status === 'sold';
  const isDraft = status === 'draft';

  return (
    <Link href={`/products/${id}`} className={`product-card ${isSold ? 'product-card--sold' : ''}`}>
      <div className="product-card-image-wrapper">
        {thumb ? (
          <img src={thumb} alt={name} className="product-card-image" loading="lazy"
            style={{ filter: isSold ? 'grayscale(80%) brightness(0.7)' : 'none' }} />
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
        {isDraft && (
          <span className="draft-badge">ร่าง</span>
        )}

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
        {code && (
          <span className="product-card-badge">{code}</span>
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
  );
}
