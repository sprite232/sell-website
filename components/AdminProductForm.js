'use client';
import { useState, useRef } from 'react';

export default function AdminProductForm({ initialData = {}, onSubmit, submitting }) {
  const [name, setName] = useState(initialData.name || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [existingImages, setExistingImages] = useState(initialData.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragging, setDragging] = useState(false);
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

  const removeExisting = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNew = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, price: Number(price), description, existingImages, newFiles });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Product Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="prod-name">ชื่อสินค้า *</label>
        <input
          id="prod-name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น Oversized Tee สีดำ"
          required
        />
      </div>

      {/* Price */}
      <div className="form-group">
        <label className="form-label" htmlFor="prod-price">ราคา (฿) *</label>
        <input
          id="prod-price"
          type="number"
          min="0"
          className="form-input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="590"
          required
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="prod-desc">รายละเอียดสินค้า</label>
        <textarea
          id="prod-desc"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="อธิบายสินค้า วัสดุ ไซส์ที่มี ฯลฯ"
          rows={5}
        />
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
          <div className="upload-zone-icon">📁</div>
          <p className="upload-zone-text">คลิกเพื่อเลือกรูป หรือลากมาวางที่นี่</p>
          <p className="upload-zone-hint">รองรับ JPG, PNG, WEBP (ไม่จำกัดจำนวน)</p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '16px', marginBottom: '8px' }}>
              รูปภาพเดิม
            </p>
            <div className="preview-grid">
              {existingImages.map((url, i) => (
                <div key={i} className="preview-item">
                  <img src={url} alt={`Existing ${i}`} />
                  <button
                    type="button"
                    className="preview-item-remove"
                    onClick={() => removeExisting(i)}
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Previews */}
        {previews.length > 0 && (
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '16px', marginBottom: '8px' }}>
              รูปใหม่ที่จะอัปโหลด
            </p>
            <div className="preview-grid">
              {previews.map((src, i) => (
                <div key={i} className="preview-item">
                  <img src={src} alt={`Preview ${i}`} />
                  <button
                    type="button"
                    className="preview-item-remove"
                    onClick={() => removeNew(i)}
                    aria-label="Remove preview"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        id="submit-product"
        className="btn btn-primary btn-full btn-lg"
        disabled={submitting}
      >
        {submitting ? 'กำลังบันทึก…' : 'บันทึกสินค้า'}
      </button>
    </form>
  );
}
