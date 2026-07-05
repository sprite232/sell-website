'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ImageGallery from '@/components/ImageGallery';
import { getProduct } from '@/lib/firestore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
                  <h1 className="product-detail-title font-display">{product.name}</h1>
                  <p className="product-detail-price">฿{Number(product.price).toLocaleString()}</p>

                  <hr className="product-detail-divider" />

                  {product.description && (
                    <p className="product-detail-desc">{product.description}</p>
                  )}

                  <hr className="product-detail-divider" />

                  {/* Contact CTA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', letterSpacing: '0.05em' }}>
                      สั่งซื้อผ่านช่องทางด้านล่าง
                    </p>
                    <a
                      id="contact-line"
                      href="https://line.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-lg btn-full"
                    >
                      สั่งซื้อผ่าน LINE
                    </a>
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
