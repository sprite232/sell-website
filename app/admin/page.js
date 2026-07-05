'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, deleteProduct } from '@/lib/firestore';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const load = () => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`ลบสินค้า "${name}" ใช่ไหม? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
    try {
      await deleteProduct(id);
      showToast(`ลบ "${name}" เรียบร้อย`);
      load();
    } catch (e) {
      showToast('เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
  };

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <div className="admin-header">
        <h1 className="admin-title font-display">จัดการสินค้า</h1>
        <Link href="/admin/new" id="add-product-btn" className="btn btn-primary">
          + เพิ่มสินค้าใหม่
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '72px', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2 className="empty-state-title">ยังไม่มีสินค้า</h2>
          <p className="empty-state-desc">เริ่มต้นเพิ่มสินค้าชิ้นแรกของคุณ</p>
          <Link href="/admin/new" className="btn btn-primary">เพิ่มสินค้าใหม่</Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="product-table">
            <thead>
              <tr>
                <th>รูป</th>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>รูปภาพ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="product-table-thumb"
                      />
                    ) : (
                      <div
                        className="product-table-thumb"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', background: 'var(--bg-secondary)' }}
                      >
                        📷
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>฿{Number(p.price).toLocaleString()}</td>
                  <td style={{ color: 'var(--fg-muted)', fontSize: '0.8rem' }}>
                    {p.images?.length || 0} รูป
                  </td>
                  <td>
                    <div className="product-table-actions">
                      <Link
                        href={`/products/${p.id}`}
                        className="btn btn-ghost btn-sm"
                        target="_blank"
                        id={`view-${p.id}`}
                      >
                        ดู
                      </Link>
                      <Link
                        href={`/admin/edit/${p.id}`}
                        className="btn btn-outline btn-sm"
                        id={`edit-${p.id}`}
                      >
                        แก้ไข
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.id, p.name)}
                        id={`delete-${p.id}`}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
