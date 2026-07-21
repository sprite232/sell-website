'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProductForm from '@/components/AdminProductForm';
import { addProduct } from '@/lib/firestore';
import { validateProductPayload, validateImageFiles } from '@/lib/validate';

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data?.error?.message || 'อัปโหลดรูปไม่สำเร็จ');
  return data.secure_url;
}

// Empty product template
const emptyProduct = () => ({ name: '', price: '', description: '', brand: '', brandColor: '#000000', brandTextColor: '#ffffff', images: [], newFiles: [], previews: [] });

export default function NewProductPage() {
  const [mode, setMode] = useState('single'); // 'single' | 'bulk'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [bulkItems, setBulkItems] = useState([emptyProduct(), emptyProduct()]);
  const router = useRouter();

  // ─── Single product submit ───
  const handleSingleSubmit = async (raw) => {
    const { data, errors } = validateProductPayload(raw);
    if (errors.length) { setError(errors.join('\n')); return; }
    setSubmitting(true);
    setError('');
    try {
      const { valid: validFiles, errors: fileErrs } = validateImageFiles(raw.newFiles || []);
      if (fileErrs.length) { setError(fileErrs.join('\n')); setSubmitting(false); return; }
      const uploadedUrls = [];
      for (const file of validFiles) uploadedUrls.push(await uploadToCloudinary(file));
      await addProduct({ ...data, images: [...(raw.existingImages || []), ...uploadedUrls] });
      setToast('เพิ่มสินค้าเรียบร้อยแล้ว');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (e) {
      setError(`เกิดข้อผิดพลาด: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Bulk product submit ───
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let saved = 0;
      for (const item of bulkItems) {
        if (!item.name || !item.price) continue;
        const { data, errors } = validateProductPayload(item);
        if (errors.length) { setError(`รายการบางชิ้น: ${errors.join(', ')}`); continue; }
        const { valid: validFiles } = validateImageFiles(item.newFiles || []);
        const uploadedUrls = [];
        for (const file of validFiles) uploadedUrls.push(await uploadToCloudinary(file));
        await addProduct({ ...data, images: uploadedUrls });
        saved++;
      }
      setToast(`เพิ่ม ${saved} สินค้าเรียบร้อย`);
      setTimeout(() => router.push('/admin'), 1500);
    } catch (e) {
      setError(`เกิดข้อผิดพลาด: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const updateBulkItem = (idx, field, value) => {
    setBulkItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleBulkFiles = (idx, files) => {
    const arr = Array.from(files);
    const previews = arr.map(f => URL.createObjectURL(f));
    setBulkItems(prev => prev.map((item, i) => i === idx
      ? { ...item, newFiles: [...(item.newFiles || []), ...arr], previews: [...(item.previews || []), ...previews] }
      : item));
  };

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <div className="admin-header">
        <div>
          <nav className="breadcrumb">
            <Link href="/admin">สินค้าทั้งหมด</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--fg)' }}>เพิ่มสินค้า</span>
          </nav>
          <h1 className="admin-title font-display">เพิ่มสินค้า</h1>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMode('single')}
            className={`btn btn-sm ${mode === 'single' ? 'btn-primary' : 'btn-ghost'}`}>
            ทีละชิ้น
          </button>
          <button onClick={() => setMode('bulk')}
            className={`btn btn-sm ${mode === 'bulk' ? 'btn-primary' : 'btn-ghost'}`}>
            หลายชิ้น
          </button>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: '24px' }}>{error}</div>}

      {/* ─── SINGLE MODE ─── */}
      {mode === 'single' && (
        <div style={{ maxWidth: '600px' }}>
          <AdminProductForm onSubmit={handleSingleSubmit} submitting={submitting} />
        </div>
      )}

      {/* ─── BULK MODE ─── */}
      {mode === 'bulk' && (
        <form onSubmit={handleBulkSubmit}>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
            กรอกข้อมูลสินค้าหลายชิ้นพร้อมกัน — ระบบจะบันทึกทีละชิ้นให้อัตโนมัติ
          </p>

          {bulkItems.map((item, idx) => (
            <div key={idx} style={{
              border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              padding: '20px', marginBottom: '16px', background: 'var(--bg-secondary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>สินค้าชิ้นที่ {idx + 1}</span>
                {bulkItems.length > 1 && (
                  <button type="button" className="btn btn-danger btn-sm"
                    onClick={() => setBulkItems(prev => prev.filter((_, i) => i !== idx))}>ลบ</button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">ชื่อสินค้า</label>
                  <input type="text" className="form-input" placeholder="ชื่อสินค้า"
                    value={item.name} onChange={e => updateBulkItem(idx, 'name', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">ราคา (฿)</label>
                  <input type="number" className="form-input" placeholder="0"
                    value={item.price} onChange={e => updateBulkItem(idx, 'price', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">แบรนด์</label>
                  <input type="text" className="form-input" placeholder="Nike, Adidas..."
                    value={item.brand} onChange={e => updateBulkItem(idx, 'brand', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">รายละเอียด</label>
                  <input type="text" className="form-input" placeholder="สภาพ, ไซส์..."
                    value={item.description} onChange={e => updateBulkItem(idx, 'description', e.target.value)} />
                </div>
              </div>

              {/* Image upload for bulk */}
              <div style={{ marginTop: '12px' }}>
                <label className="form-label">รูปภาพ</label>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', border: '1px dashed var(--border-strong)',
                  borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '0.8rem',
                  color: 'var(--fg-secondary)', marginTop: '6px',
                }}>
                  📷 เลือกรูป
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                    onChange={e => handleBulkFiles(idx, e.target.files)} />
                </label>
                {item.previews?.length > 0 && (
                  <div className="preview-grid" style={{ marginTop: '8px' }}>
                    {item.previews.map((src, i) => (
                      <div key={i} className="preview-item">
                        <img src={src} alt="" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button type="button" className="btn btn-outline"
              onClick={() => setBulkItems(prev => [...prev, emptyProduct()])}>
              + เพิ่มสินค้าอีกชิ้น
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? 'กำลังบันทึกทั้งหมด…' : `💾 บันทึก ${bulkItems.filter(i => i.name).length} สินค้า`}
          </button>
        </form>
      )}
    </>
  );
}
