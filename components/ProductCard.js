'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
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
  const { toggleFavorite, isFavorite } = useFavorites();

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

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ id, name, price, images, brand, brandColor, brandTextColor, code, status });
  };

  const liked = isFavorite(id);

  return (
    <motion.div
      className="reveal-card"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/products/${id}`} className={`product-card ${isSold ? 'product-card--sold' : ''}`}>
        <div className="product-card-image-wrapper">
          {/* Primary image */}
          {thumb ? (
            <motion.img
              src={thumb}
              alt={name}
              className={`product-card-image img-primary ${thumb2 && !isSold ? 'has-secondary' : ''}`}
              loading="lazy"
              style={{ filter: isSold ? 'grayscale(75%) brightness(0.65)' : 'none' }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
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
              <motion.span
                className="sold-ribbon"
                initial={{ rotate: -25, scale: 0 }}
                animate={{ rotate: -25, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                SOLD OUT
              </motion.span>
            </div>
          )}

          {/* DRAFT badge */}
          {isDraft && <span className="draft-badge">ร่าง</span>}

          {/* NEW badge — auto, within 7 days */}
          {isNew && (
            <motion.span
              className="new-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Icon name="sparkle" size={10} />
              ใหม่
            </motion.span>
          )}

          {/* Brand Sticker — top right */}
          {brand && !isSold && (
            <motion.span
              className="brand-sticker"
              style={{
                background: brandColor || '#000',
                color: brandTextColor || '#fff',
              }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {brand}
            </motion.span>
          )}

          {/* Product Code — top left */}
          {code && <span className="product-card-badge">{code}</span>}

          {/* Favorite Button */}
          {!isDraft && (
            <motion.button
              className={`fav-btn ${liked ? 'fav-btn--active' : ''}`}
              onClick={handleToggleFavorite}
              aria-label={liked ? 'ลบออกจากรายการโปรด' : 'เพิ่มรายการโปรด'}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.85 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Icon name={liked ? 'heartFilled' : 'heart'} size={16} />
            </motion.button>
          )}

          {/* Quick Add to Cart — visible on hover (PC only via CSS) */}
          {!isSold && (
            <motion.button
              className={`card-cart-btn ${inCart ? 'card-cart-btn--in' : ''}`}
              onClick={handleAddToCart}
              aria-label={inCart ? 'อยู่ในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name={inCart ? 'check' : 'bag'} size={13} />
              {inCart ? 'ในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
            </motion.button>
          )}
        </div>

        <div className="product-card-body">
          <h3 className="product-card-name" style={{ opacity: isSold ? 0.55 : 1 }}>{name}</h3>

          {/* Size badge */}
          {size && !isSold && (
            <motion.span
              className="size-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {size}
            </motion.span>
          )}

          <p className="product-card-price" style={{ opacity: isSold ? 0.45 : 1 }}>
            {isSold ? <s>฿{Number(price).toLocaleString()}</s> : `฿${Number(price).toLocaleString()}`}
          </p>
          {description && !isSold && <p className="product-card-desc">{description}</p>}
          {isSold && <p className="sold-tag-text">ขายแล้ว</p>}
        </div>
      </Link>
    </motion.div>
  );
}
