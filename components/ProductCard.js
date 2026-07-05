'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const { id, name, price, description, images } = product;
  const thumb = images?.[0] || '/placeholder.png';

  return (
    <Link href={`/products/${id}`} className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={thumb}
          alt={name}
          className="product-card-image"
          loading="lazy"
        />
        {images?.length > 1 && (
          <span className="product-card-badge">{images.length} รูป</span>
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
