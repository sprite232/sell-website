'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getProducts, deleteProduct, updateProduct, batchUpdateOrder } from '@/lib/firestore';
import Icon from '@/components/Icon';

const STATUS_CONFIG = {
  available: { label: 'ขายอยู่',  color: '#34c759', bg: 'rgba(52,199,89,0.12)'  },
  sold:      { label: 'ขายแล้ว', color: '#ff3b30', bg: 'rgba(255,59,48,0.12)'  },
  draft:     { label: 'ฉบับร่าง', color: '#ff9500', bg: 'rgba(255,149,0,0.12)'  },
};

export default function AdminDashboard() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState('');
  const [filterStatus, setFilter] = useState('all');
  const [savingOrder, setSaving]  = useState(false);

  // drag & drop refs
  const dragIdx = useRef(null);

  const load = async () => {
    setLoading(true);
    try { setProducts(await getProducts()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ─── Stats ───
  const total     = products.length;
  const available = products.filter(p => p.status === 'available' || !p.status).length;
  const sold      = products.filter(p => p.status === 'sold').length;
  const draft     = products.filter(p => p.status === 'draft').length;
  const totalValue = products
    .filter(p => p.status === 'available' || !p.status)
    .reduce((s, p) => s + Number(p.price || 0), 0);

  // ─── Cycle status ───
  const cycleStatus = async (p) => {
    const next = { available: 'sold', sold: 'draft', draft: 'available' };
    const newStatus = next[p.status || 'available'];
    try {
      await updateProduct(p.id, { status: newStatus });
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus } : x));
      showToast(`เปลี่ยน "${p.name}" → ${STATUS_CONFIG[newStatus].label}`);
    } catch (e) { showToast('เกิดข้อผิดพลาด'); }
  };

  // ─── Delete ───
  const handleDelete = async (id, name) => {
    if (!confirm(`ลบสินค้า "${name}" ใช่ไหม?`)) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast(`ลบ "${name}" เรียบร้อย`);
    } catch (e) { showToast('เกิดข้อผิดพลาด'); }
  };

  // ─── Drag & Drop ───
  const onDragStart = (idx) => { dragIdx.current = idx; };

  const onDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx.current === idx) return;
    setProducts(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx.current, 1);
      arr.splice(idx, 0, moved);
      dragIdx.current = idx;
      return arr;
    });
  };

  const onDrop = async () => {
    setSaving(true);
    try {
      await batchUpdateOrder(products.map(p => p.id));
      showToast('✅ บันทึกลำดับใหม่แล้ว!');
    } catch (e) { showToast('บันทึกลำดับไม่สำเร็จ'); }
    finally { setSaving(false); }
  };

  // ─── Filter ───
  const displayed = filterStatus === 'all'
    ? products
    : filterStatus === 'available'
    ? products.filter(p => !p.status || p.status === 'available')
    : products.filter(p => p.status === filterStatus);

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      {/* ─── Header ─── */}
      <div className="admin-header">
        <h1 className="admin-title" style={{ fontFamily: 'Prompt, sans-serif' }}>จัดการสินค้า</h1>
        <Link href="/admin/new" id="add-product-btn" className="btn btn-primary">
          + เพิ่มสินค้า
        </Link>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon" style={{ color: 'var(--fg)' }}><Icon name="box" size={20} /></span>
          <div>
            <div className="stat-num">{total}</div>
            <div className="stat-label">สินค้าทั้งหมด</div>
          </div>
        </div>
        <div className="stat-card stat-card--green" onClick={() => setFilter(filterStatus === 'available' ? 'all' : 'available')} style={{ cursor: 'pointer' }}>
          <span className="stat-icon" style={{ color: '#34c759' }}><Icon name="circleDot" size={20} /></span>
          <div>
            <div className="stat-num">{available}</div>
            <div className="stat-label">ขายอยู่</div>
          </div>
        </div>
        <div className="stat-card stat-card--red" onClick={() => setFilter(filterStatus === 'sold' ? 'all' : 'sold')} style={{ cursor: 'pointer' }}>
          <span className="stat-icon" style={{ color: '#ff3b30' }}><Icon name="x" size={20} /></span>
          <div>
            <div className="stat-num">{sold}</div>
            <div className="stat-label">ขายแล้ว</div>
          </div>
        </div>
        <div className="stat-card stat-card--orange" onClick={() => setFilter(filterStatus === 'draft' ? 'all' : 'draft')} style={{ cursor: 'pointer' }}>
          <span className="stat-icon" style={{ color: '#ff9500' }}><Icon name="pencil" size={20} /></span>
          <div>
            <div className="stat-num">{draft}</div>
            <div className="stat-label">ฉบับร่าง</div>
          </div>
        </div>
        <div className="stat-card stat-card--blue">
          <span className="stat-icon" style={{ color: '#007aff' }}><Icon name="coins" size={20} /></span>
          <div>
            <div className="stat-num" style={{ fontSize: '1.1rem' }}>฿{totalValue.toLocaleString()}</div>
            <div className="stat-label">มูลค่าสินค้าคงเหลือ</div>
          </div>
        </div>
      </div>

      {/* ─── Filter + drag hint ─── */}
      {!loading && products.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'available', 'sold', 'draft'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}>
                {s === 'all' ? 'ทั้งหมด' : s === 'available' ? 'ขายอยู่' : s === 'sold' ? 'ขายแล้ว' : 'ร่าง'}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif' }}>
            ลากแถวเพื่อเรียงลำดับ{savingOrder ? ' (กำลังบันทึก...)' : ''}
          </span>
        </div>
      )}

      {/* ─── Product List ─── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '72px', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="box" size={32} /></div>
          <h2 className="empty-state-title">ไม่มีสินค้าในหมวดนี้</h2>
          <p className="empty-state-desc">เลือกหมวดอื่น หรือเพิ่มสินค้าใหม่</p>
          <Link href="/admin/new" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
            + เพิ่มสินค้า
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {displayed.map((p, idx) => {
            const st = p.status || 'available';
            const cfg = STATUS_CONFIG[st] || STATUS_CONFIG.available;
            return (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDrop={onDrop}
                className="admin-product-row"
              >
                {/* Drag handle */}
                <span className="drag-handle" title="ลากเพื่อเรียงลำดับ">⠿</span>

                {/* Thumb */}
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="product-table-thumb" />
                ) : (
                  <div className="product-table-thumb" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', background: 'var(--bg-secondary)',
                  }}>📷</div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {p.code && <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', fontWeight: 500 }}>{p.code}</span>}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                    {p.brand && (
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px',
                        borderRadius: '999px', background: p.brandColor || '#000',
                        color: p.brandTextColor || '#fff', flexShrink: 0,
                      }}>{p.brand}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginTop: '2px' }}>
                    ฿{Number(p.price).toLocaleString()} · {p.images?.length || 0} รูป
                  </div>
                </div>

                {/* Status toggle */}
                <button
                  onClick={() => cycleStatus(p)}
                  title="คลิกเพื่อเปลี่ยนสถานะ"
                  style={{
                    padding: '4px 12px', borderRadius: '999px', border: 'none',
                    background: cfg.bg, color: cfg.color,
                    fontSize: '0.75rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'Prompt, sans-serif',
                    flexShrink: 0, whiteSpace: 'nowrap',
                  }}>
                  {cfg.label}
                </button>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <Link href={`/products/${p.id}`} target="_blank"
                    className="btn btn-ghost btn-sm" id={`view-${p.id}`}>ดู</Link>
                  <Link href={`/admin/edit/${p.id}`}
                    className="btn btn-outline btn-sm" id={`edit-${p.id}`}>แก้ไข</Link>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id, p.name)}
                    id={`delete-${p.id}`}>ลบ</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
