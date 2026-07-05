'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProductForm from '@/components/AdminProductForm';
import { addProduct } from '@/lib/firestore';

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
    console.error('Cloudinary error:', data);
    throw new Error(data?.error?.message || 'อัปโหลดรูปไม่สำเร็จ');
  }

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
      let uploadedUrls = [];

      // Upload each image one by one (more reliable than parallel)
      for (const file of newFiles) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }

      const allImages = [...existingImages, ...uploadedUrls];
      await addProduct({ name, price, description, images: allImages });

      setToast('✅ เพิ่มสินค้าเรียบร้อยแล้ว!');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (e) {
      console.error('Submit error:', e);
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
