'use client';
import { useState } from 'react';

export default function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div style={{
        width: '100%',
        aspectRatio: '3/4',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--fg-muted)',
        fontSize: '2rem',
      }}>
        📷
      </div>
    );
  }

  const handlePrev = () => setActive((p) => (p === 0 ? images.length - 1 : p - 1));
  const handleNext = () => setActive((p) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <div>
      {/* Main Image */}
      <div style={{ position: 'relative' }}>
        <img
          src={images[active]}
          alt={`Product image ${active + 1}`}
          className="gallery-main"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              style={arrowStyle('left')}
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              style={arrowStyle('right')}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Thumbnail ${i + 1}`}
              className={`gallery-thumb ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function arrowStyle(side) {
  return {
    position: 'absolute',
    top: '50%',
    [side]: '12px',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--bg)',
    color: 'var(--fg)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    lineHeight: 1,
    boxShadow: 'var(--shadow-md)',
    transition: 'all 0.2s ease',
  };
}
