'use client';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const { id, name, price, description, images, code } = product;
  const thumb = images?.[0] || null;

  return (
    <Link href={`/products/${id}`} className="product-card">
      <div className="product-card-image-wrapper">
        {thumb ? (
          <img
            src={thumb}
            alt={name}
            className="product-card-image"
            loading="lazy"
          />
        ) : (
          <div className="product-card-image" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', background: 'var(--bg-secondary)',
          }}>
            👗
          </div>
        )}
        {/* Product Code Badge */}
        {code && (
          <span className="product-card-badge">{code}</span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-price">฿{Number(price).toLocaleString()}</p>
        {description && (
          <p className="product-card-desc">{description}</p>
        )}
      </div>
    </Link>
  );
}
