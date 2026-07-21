'use client';
import { useState, useEffect } from 'react';
import {
  getAnnouncements, addAnnouncement,
  updateAnnouncement, deleteAnnouncement
} from '@/lib/firestore';

const TYPE_OPTIONS = [
  { value: 'sale',    label: '🔥 ลดราคา',      bg: '#ff3b30', text: '#fff' },
  { value: 'new',     label: '✨ สินค้าใหม่',   bg: '#34c759', text: '#fff' },
  { value: 'info',    label: '📢 ประกาศทั่วไป', bg: '#007aff', text: '#fff' },
  { value: 'warning', label: '⚠️ แจ้งเตือน',   bg: '#ff9500', text: '#fff' },
  { value: 'custom',  label: '🎨 กำหนดเอง',    bg: '#8e44ad', text: '#fff' },
];

export default function AnnouncementAdminPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Form state
  const [message, setMessage] = useState('');
  const [type, setType] = useState('sale');
  const [customBg, setCustomBg] = useState('#ff3b30');
  const [customText, setCustomText] = useState('#ffffff');
  const [emoji, setEmoji] = useState('🔥');

  const load = async () => {
    setLoading(true);
    try { setAnnouncements(await getAnnouncements()); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const getColors = () => {
    if (type === 'custom') return { bg: customBg, text: customText };
    const t = TYPE_OPTIONS.find(o => o.value === type);
    return { bg: t?.bg || '#000', text: t?.text || '#fff' };
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSaving(true);
    const { bg, text } = getColors();
    try {
      await addAnnouncement({ message: message.trim(), type, emoji, bgColor: bg, textColor: text });
      setMessage(''); setEmoji('🔥'); setType('sale');
      setShowForm(false);
      setToast('✅ เพิ่มประกาศแล้ว!');
      setTimeout(() => setToast(''), 2500);
      await load();
    } catch(e) { alert('เกิดข้อผิดพลาด: ' + e.message); }
    finally { setSaving(false); }
  };

  const toggleActive = async (ann) => {
    try {
      await updateAnnouncement(ann.id, { active: !ann.active });
      await load();
    } catch(e) { alert('เกิดข้อผิดพลาด'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('ลบประกาศนี้?')) return;
    try {
      await deleteAnnouncement(id);
      setToast('🗑️ ลบประกาศแล้ว');
      setTimeout(() => setToast(''), 2000);
      await load();
    } catch(e) { alert('เกิดข้อผิดพลาด'); }
  };

  const { bg: previewBg, text: previewText } = getColors();

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <div className="admin-header">
        <div>
          <h1 className="admin-title font-display">📢 ประกาศ / แบนเนอร์</h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            จัดการแบนเนอร์ประกาศที่แสดงบนหน้าเว็บไซต์
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ ยกเลิก' : '+ เพิ่มประกาศใหม่'}
        </button>
      </div>

      {/* ─── Add Form ─── */}
      {showForm && (
        <div style={{
          border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: '24px', marginBottom: '32px', background: 'var(--bg-secondary)'
        }}>
          <h3 style={{ marginBottom: '20px', fontFamily: 'Prompt, sans-serif' }}>สร้างประกาศใหม่</h3>
          <form onSubmit={handleAdd}>
            {/* Type */}
            <div className="form-group">
              <label className="form-label">ประเภทประกาศ</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TYPE_OPTIONS.map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setType(opt.value)}
                    style={{
                      padding: '8px 16px', borderRadius: 'var(--radius)',
                      background: type === opt.value ? opt.bg : 'var(--bg)',
                      color: type === opt.value ? opt.text : 'var(--fg)',
                      border: `2px solid ${type === opt.value ? opt.bg : 'var(--border)'}`,
                      fontFamily: 'Prompt, sans-serif', fontSize: '0.85rem',
                      fontWeight: 600, cursor: 'pointer',
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            {type === 'custom' && (
              <div className="form-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <label className="form-label">สีพื้นหลัง</label>
                  <input type="color" value={customBg} onChange={e => setCustomBg(e.target.value)}
                    style={{ width: '60px', height: '40px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', cursor: 'pointer' }} />
                </div>
                <div>
                  <label className="form-label">สีตัวอักษร</label>
                  <input type="color" value={customText} onChange={e => setCustomText(e.target.value)}
                    style={{ width: '60px', height: '40px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', cursor: 'pointer' }} />
                </div>
              </div>
            )}

            {/* Emoji + Message */}
            <div className="form-group">
              <label className="form-label">ข้อความประกาศ</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)}
                  className="form-input" placeholder="🔥" style={{ width: '64px', textAlign: 'center', fontSize: '1.4rem' }} />
                <input type="text" value={message} onChange={e => setMessage(e.target.value)}
                  className="form-input" placeholder="เช่น ลดราคาทุกชิ้น 20% วันนี้วันเดียว!" required style={{ flex: 1 }} />
              </div>
            </div>

            {/* Preview */}
            {message && (
              <div style={{
                padding: '12px 20px', borderRadius: 'var(--radius)',
                background: previewBg, color: previewText,
                marginBottom: '16px', fontFamily: 'Prompt, sans-serif',
                fontWeight: 600, fontSize: '0.9rem', textAlign: 'center',
              }}>
                {emoji} {message}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'กำลังบันทึก…' : '📢 เผยแพร่ประกาศ'}
            </button>
          </form>
        </div>
      )}

      {/* ─── Announcement List ─── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2].map(i => <div key={i} className="skeleton" style={{ height: '64px', borderRadius: 'var(--radius)' }} />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="empty-state" style={{ padding: '60px 24px' }}>
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">ยังไม่มีประกาศ</h3>
          <p className="empty-state-desc">กด "+ เพิ่มประกาศใหม่" เพื่อสร้างแบนเนอร์บนหน้าเว็บ</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {announcements.map(ann => (
            <div key={ann.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              padding: '16px', background: 'var(--bg-card)',
              opacity: ann.active ? 1 : 0.5,
            }}>
              {/* Color dot */}
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: ann.bgColor, flexShrink: 0 }} />

              {/* Message */}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontFamily: 'Prompt, sans-serif' }}>
                  {ann.emoji} {ann.message}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '2px' }}>
                  {ann.active ? 'กำลังแสดง' : 'ซ่อนอยู่'}
                  {ann.type && ` · ${TYPE_OPTIONS.find(t => t.value === ann.type)?.label || ann.type}`}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => toggleActive(ann)}
                  className={`btn btn-sm ${ann.active ? 'btn-ghost' : 'btn-outline'}`}>
                  {ann.active ? 'ซ่อน' : 'แสดง'}
                </button>
                <button onClick={() => handleDelete(ann.id)} className="btn btn-danger btn-sm">
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
