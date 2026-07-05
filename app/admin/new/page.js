'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProductForm from '@/components/AdminProductForm';
import { addProduct } from '@/lib/firestore';

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
}

export default function NewProductPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const router = useRouter();

  const handleSubmit = async ({ name, price, description, existingImages, newFiles }) => {
    setSubmitting(true);
    setError('');
    try {
      // Upload new images to Cloudinary
      const uploadedUrls = await Promise.all(newFiles.map(uploadToCloudinary));
      const allImages = [...existingImages, ...uploadedUrls];

      await addProduct({ name, price, description, images: allImages });
      setToast('เพิ่มสินค้าเรียบร้อยแล้ว!');
      setTimeout(() => router.push('/admin'), 1200);
    } catch (e) {
      console.error(e);
      setError('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง');
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
            <span style={{ color: 'var(--fg)' }}>เพิ่มสินค้าใหม่</span>
          </nav>
          <h1 className="admin-title font-display">เพิ่มสินค้าใหม่</h1>
        </div>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: '24px' }}>{error}</div>
      )}

      <div style={{ maxWidth: '600px' }}>
        <AdminProductForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </>
  );
}
