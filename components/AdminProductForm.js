'use client';
import { useState, useRef } from 'react';
import Icon from '@/components/Icon';

// Predefined brand colors for stickers
const BRAND_COLORS = [
  { label: 'Nike', color: '#000000', text: '#ffffff' },
  { label: 'Adidas', color: '#000000', text: '#ffffff' },
  { label: 'Uniqlo', color: '#e60012', text: '#ffffff' },
  { label: 'Zara', color: '#1a1a1a', text: '#ffffff' },
  { label: 'H&M', color: '#e50010', text: '#ffffff' },
  { label: 'Champion', color: '#003087', text: '#ffffff' },
  { label: 'Polo', color: '#1b3a6b', text: '#ffffff' },
  { label: 'Levi\'s', color: '#c8102e', text: '#ffffff' },
  { label: 'Supreme', color: '#ff0000', text: '#ffffff' },
  { label: 'Off-White', color: '#f5f5f5', text: '#000000' },
  { label: 'No brand', color: '#888888', text: '#ffffff' },
];

export default function AdminProductForm({ initialData = {}, onSubmit, submitting }) {
  const [name, setName] = useState(initialData.name || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [status, setStatus] = useState(initialData.status || 'available');
  const [size, setSize] = useState(initialData.size || '');
  const [brand, setBrand] = useState(initialData.brand || '');
  const [brandColor, setBrandColor] = useState(initialData.brandColor || '#000000');
  const [brandTextColor, setBrandTextColor] = useState(initialData.brandTextColor || '#ffffff');
  const [existingImages, setExistingImages] = useState(initialData.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [customBrand, setCustomBrand] = useState(
    initialData.brand && !BRAND_COLORS.find(b => b.label === initialData.brand)
      ? initialData.brand : ''
  );
  const fileRef = useRef(null);

  const handleFiles = (files) => {
    const arr = Array.from(files);
    setNewFiles((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeExisting = (idx) => setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  const removeNew = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleBrandPreset = (b) => {
    setBrand(b.label);
    setBrandColor(b.color);
    setBrandTextColor(b.text);
    setCustomBrand('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalBrand = customBrand || brand;
    onSubmit({ name, price: Number(price), description, status, size, brand: finalBrand, brandColor, brandTextColor, existingImages, newFiles });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Product Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="prod-name">ชื่อสินค้า *</label>
        <input id="prod-name" type="text" className="form-input" value={name}
          onChange={(e) => setName(e.target.value)} placeholder="เช่น Oversized Tee สีดำ" required />
      </div>

      {/* Price */}
      <div className="form-group">
        <label className="form-label" htmlFor="prod-price">ราคา (฿) *</label>
        <input id="prod-price" type="number" min="0" className="form-input" value={price}
          onChange={(e) => setPrice(e.target.value)} placeholder="590" required />
      </div>

      {/* Size */}
      <div className="form-group">
        <label className="form-label">ไซส์สินค้า</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(size === s ? '' : s)}
              className={`size-chip ${size === s ? 'size-chip--active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
        {size && (
          <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '6px' }}>
            เลือกไว้: <strong>{size}</strong> — คลิกอีกครั้งเพื่อยกเลิก
          </p>
        )}
      </div>

      {/* Brand Tag / Sticker */}
      <div className="form-group">
        <label className="form-label">แบรนด์ / Tag สติกเกอร์</label>
        <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginBottom: '12px' }}>
          เลือกแบรนด์ที่มี หรือพิมพ์ชื่อแบรนด์เองด้านล่าง
        </p>

        {/* Preset brand buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {BRAND_COLORS.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => handleBrandPreset(b)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                background: b.color,
                color: b.text,
                border: `2px solid ${brand === b.label ? 'var(--accent)' : 'transparent'}`,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: brand === b.label ? '2px solid var(--fg)' : 'none',
                outlineOffset: '2px',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Custom brand input */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="หรือพิมพ์ชื่อแบรนด์เอง เช่น Muji, Gap..."
            value={customBrand}
            onChange={(e) => { setCustomBrand(e.target.value); setBrand(''); }}
            style={{ flex: 1 }}
          />
          <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)}
            title="สีพื้นหลัง sticker"
            style={{ width: '40px', height: '40px', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', padding: '2px' }} />
          <input type="color" value={brandTextColor} onChange={(e) => setBrandTextColor(e.target.value)}
            title="สีตัวอักษร sticker"
            style={{ width: '40px', height: '40px', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', padding: '2px', background: '#ccc' }} />
        </div>

        {/* Preview sticker */}
        {(brand || customBrand) && (
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>ตัวอย่าง sticker:</span>
            <span style={{
              background: brandColor, color: brandTextColor,
              padding: '4px 12px', borderRadius: '999px',
              fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              {customBrand || brand}
            </span>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="form-group">
        <label className="form-label">สถานะสินค้า</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button"
            onClick={() => setStatus('available')}
            className={`btn btn-sm ${status === 'available' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon name="circleDot" size={14} />
            เผยแพร่ (ขายอยู่)
          </button>
          <button type="button"
            onClick={() => setStatus('draft')}
            className={`btn btn-sm ${status === 'draft' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon name="pencil" size={14} />
            ฉบับร่าง
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '6px' }}>
          ฉบับร่าง = บันทึกไว้ก่อน ไม่แสดงในหน้าเว็บ แอดมินสามารถเปลี่ยนได้ภายหลัง
        </p>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="prod-desc">รายละเอียดสินค้า</label>
        <textarea id="prod-desc" className="form-textarea" value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="อธิบายสินค้า วัสดุ ไซส์ที่มี สภาพสินค้า ฯลฯ" rows={4} />
      </div>

      {/* Image Upload */}
      <div className="form-group">
        <label className="form-label">รูปภาพสินค้า (หลายรูปได้)</label>
        <div
          className={`upload-zone ${dragging ? 'drag-over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="upload-zone-icon">
            <Icon name="camera" size={32} style={{ opacity: 0.4 }} />
          </div>
          <p className="upload-zone-text">คลิกหรือลากรูปมาวางที่นี่</p>
          <p className="upload-zone-hint">JPG, PNG, WEBP — ไม่จำกัดจำนวน</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple
          style={{ display: 'none' }} onChange={(e) => handleFiles(e.target.files)} />

        {existingImages.length > 0 && (
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '16px', marginBottom: '8px' }}>รูปเดิม</p>
            <div className="preview-grid">
              {existingImages.map((url, i) => (
                <div key={i} className="preview-item">
                  <img src={url} alt={`Existing ${i}`} />
                  <button type="button" className="preview-item-remove" onClick={() => removeExisting(i)}>
                    <Icon name="x" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {previews.length > 0 && (
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '16px', marginBottom: '8px' }}>
              รูปใหม่ ({previews.length} รูป)
            </p>
            <div className="preview-grid">
              {previews.map((src, i) => (
                <div key={i} className="preview-item">
                  <img src={src} alt={`Preview ${i}`} />
                  <button type="button" className="preview-item-remove" onClick={() => removeNew(i)}>
                    <Icon name="x" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button type="submit" id="submit-product" className="btn btn-primary btn-full btn-lg" disabled={submitting}>
        {submitting ? 'กำลังบันทึก…' : 'บันทึกสินค้า'}
      </button>
    </form>
  );
}
