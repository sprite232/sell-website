'use client';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Icon from '@/components/Icon';

// Check if product is "new" — added within last 7 days
function isNewArrival(createdAt) {
  if (!createdAt) return false;
  const created = createdAt.seconds
    ? new Date(createdAt.seconds * 1000)
    : new Date(createdAt);
  const now = new Date();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

export default function ProductCard({ product }) {
  const {
    id, name, price, description, images,
    code, brand, brandColor, brandTextColor,
    status, size, createdAt,
  } = product;

  const { addToCart, isInCart } = useCart();

  const thumb   = images?.[0] || null;
  const thumb2  = images?.[1] || null;
  const isSold  = status === 'sold';
  const isDraft = status === 'draft';
  const inCart  = isInCart(id);
  const isNew   = isNewArrival(createdAt) && !isSold;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSold || inCart) return;
    addToCart({ id, name, price, code, brand, brandColor, brandTextColor, image: thumb });
  };

  return (
    <div className="reveal-card">
      <Link href={`/products/${id}`} className={`product-card ${isSold ? 'product-card--sold' : ''}`}>
        <div className="product-card-image-wrapper">
          {/* Primary image */}
          {thumb ? (
            <img
              src={thumb}
              alt={name}
              className={`product-card-image img-primary ${thumb2 && !isSold ? 'has-secondary' : ''}`}
              loading="lazy"
              style={{ filter: isSold ? 'grayscale(75%) brightness(0.65)' : 'none' }}
            />
          ) : (
            <div className="product-card-image img-primary" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-secondary)',
            }}>
              <Icon name="tag" size={40} style={{ opacity: 0.2 }} />
            </div>
          )}

          {/* Secondary image — CSS cross-fade on hover (PC only) */}
          {thumb2 && !isSold && (
            <img src={thumb2} alt={`${name} — มุมอื่น`}
              className="product-card-image img-secondary" loading="lazy" />
          )}

          {/* SOLD OUT ribbon */}
          {isSold && (
            <div className="sold-overlay">
              <span className="sold-ribbon">SOLD OUT</span>
            </div>
          )}

          {/* DRAFT badge */}
          {isDraft && <span className="draft-badge">ร่าง</span>}

          {/* NEW badge — auto, within 7 days */}
          {isNew && (
            <span className="new-badge">
              <Icon name="sparkle" size={10} />
              ใหม่
            </span>
          )}

          {/* Brand Sticker — top right */}
          {brand && !isSold && (
            <span className="brand-sticker" style={{
              background: brandColor || '#000',
              color: brandTextColor || '#fff',
            }}>{brand}</span>
          )}

          {/* Product Code — top left */}
          {code && <span className="product-card-badge">{code}</span>}

          {/* Quick Add to Cart — visible on hover (PC only via CSS) */}
          {!isSold && (
            <button
              className={`card-cart-btn ${inCart ? 'card-cart-btn--in' : ''}`}
              onClick={handleAddToCart}
              aria-label={inCart ? 'อยู่ในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
            >
              <Icon name={inCart ? 'check' : 'bag'} size={13} />
              {inCart ? 'ในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
            </button>
          )}
        </div>

        <div className="product-card-body">
          <h3 className="product-card-name" style={{ opacity: isSold ? 0.55 : 1 }}>{name}</h3>

          {/* Size badge */}
          {size && !isSold && (
            <span className="size-badge">{size}</span>
          )}

          <p className="product-card-price" style={{ opacity: isSold ? 0.45 : 1 }}>
            {isSold ? <s>฿{Number(price).toLocaleString()}</s> : `฿${Number(price).toLocaleString()}`}
          </p>
          {description && !isSold && <p className="product-card-desc">{description}</p>}
          {isSold && <p className="sold-tag-text">ขายแล้ว</p>}
        </div>
      </Link>
    </div>
  );
}
