'use client';
import { motion } from 'framer-motion';

// Shimmer animation for skeleton
const shimmer = {
  initial: { backgroundPosition: '-600px 0' },
  animate: {
    backgroundPosition: '600px 0',
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
};

const skeletonStyle = {
  background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--border) 50%, var(--bg-secondary) 75%)',
  backgroundSize: '600px 100%',
  borderRadius: 'var(--radius)',
};

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div style={{ opacity: 1 }}>
      <div style={{
        ...skeletonStyle,
        width: '100%',
        aspectRatio: '3/4',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '12px',
      }} />
      <motion.div
        style={{ ...skeletonStyle, height: '18px', width: '70%', marginBottom: '8px' }}
        variants={shimmer}
        initial="initial"
        animate="animate"
      />
      <motion.div
        style={{ ...skeletonStyle, height: '14px', width: '40%' }}
        variants={shimmer}
        initial="initial"
        animate="animate"
      />
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Hero Skeleton
export function HeroSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', padding: '80px 0' }}>
      <div>
        <motion.div
          style={{ ...skeletonStyle, height: '16px', width: '200px', marginBottom: '16px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '48px', width: '80%', marginBottom: '12px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '48px', width: '60%', marginBottom: '24px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '16px', width: '100%', marginBottom: '8px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '16px', width: '80%', marginBottom: '32px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '56px', width: '240px', borderRadius: '18px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div
          style={{ ...skeletonStyle, width: '220px', height: '220px', borderRadius: '50%' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
      </div>
    </div>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', padding: '48px 0' }}>
      <div>
        <motion.div
          style={{ ...skeletonStyle, width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              style={{ ...skeletonStyle, width: '72px', height: '72px' }}
              variants={shimmer}
              initial="initial"
              animate="animate"
            />
          ))}
        </div>
      </div>
      <div>
        <motion.div
          style={{ ...skeletonStyle, height: '16px', width: '120px', marginBottom: '16px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '12px', width: '80px', marginBottom: '16px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '36px', width: '60%', marginBottom: '24px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '1px', width: '100%', marginBottom: '24px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '14px', width: '100%', marginBottom: '8px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '14px', width: '90%', marginBottom: '8px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '14px', width: '70%', marginBottom: '32px' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
        <motion.div
          style={{ ...skeletonStyle, height: '56px', width: '100%', borderRadius: 'var(--radius)' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ count = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          style={{ ...skeletonStyle, height: '72px', borderRadius: 'var(--radius)' }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
      ))}
    </div>
  );
}

// Text Line Skeleton
export function TextSkeleton({ lines = 3, width = '100%' }) {
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            ...skeletonStyle,
            height: '14px',
            width: i === lines - 1 ? '70%' : width,
            marginBottom: '8px',
          }}
          variants={shimmer}
          initial="initial"
          animate="animate"
        />
      ))}
    </div>
  );
}
