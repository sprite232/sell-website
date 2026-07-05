'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProductForm from '@/components/AdminProductForm';
import { getProduct, updateProduct } from '@/lib/firestore';

async function uploadToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data?.error?.message || 'อัปโหลดรูปไม่สำเร็จ');
  }
  return data.secure_url;
}

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(setProduct)
      .catch(() => setError('ไม่พบสินค้านี้'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async ({ name, price, description, existingImages, newFiles }) => {
    setSubmitting(true);
    setError('');
    try {
      // Upload sequentially (more reliable)
      const uploadedUrls = [];
      for (const file of newFiles) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }
      const allImages = [...existingImages, ...uploadedUrls];
      await updateProduct(id, { name, price, description, images: allImages });
      setToast('✅ อัปเดตสินค้าเรียบร้อยแล้ว!');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (e) {
      console.error(e);
      setError(`เกิดข้อผิดพลาด: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <div className="admin-header">
        <div>
          <nav className="breadcrumb">
            <Link href="/admin">สินค้าทั้งหมด</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--fg)' }}>แก้ไขสินค้า</span>
          </nav>
          <h1 className="admin-title font-display">แก้ไขสินค้า</h1>
        </div>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: '24px' }}>{error}</div>
      )}

      {loading ? (
        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '52px', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      ) : product ? (
        <div style={{ maxWidth: '600px' }}>
          <AdminProductForm
            initialData={product}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      ) : null}
    </>
  );
}
