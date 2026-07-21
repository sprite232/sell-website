'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSiteSettings, updateSiteSettings } from '@/lib/firestore';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import Icon from '@/components/Icon';

export default function AdminSettingsPage() {
  const { refreshSettings } = useSiteSettings();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    getSiteSettings()
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      await refreshSettings();
      showToast('บันทึกสำเร็จ!');
    } catch (e) {
      console.error(e);
      showToast('เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'ทั่วไป', icon: 'globe' },
    { id: 'hero', label: 'Hero', icon: 'sparkle' },
    { id: 'social', label: 'Social Media', icon: 'instagram' },
    { id: 'shipping', label: 'จัดส่ง', icon: 'truck' },
    { id: 'about', label: 'เกี่ยวกับเรา', icon: 'questionCircle' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
        <div className="skeleton" style={{ width: '200px', height: '24px' }} />
      </div>
    );
  }

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title" style={{ fontFamily: 'Prompt, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="pencil" size={24} />
          แก้ไขเนื้อหาเว็บไซต์
        </h1>
        <motion.button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
        </motion.button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        background: 'var(--bg-secondary)',
        padding: '4px',
        borderRadius: 'var(--radius)',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: activeTab === tab.id ? 'var(--bg)' : 'transparent',
              color: activeTab === tab.id ? 'var(--fg)' : 'var(--fg-muted)',
              fontFamily: 'Prompt, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
            }}
            whileHover={{ background: activeTab === tab.id ? 'var(--bg)' : 'var(--bg)' }}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
      }}>
        {/* General Tab */}
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, marginBottom: '8px' }}>
              ตั้งค่าทั่วไป
            </h3>

            <div className="form-group">
              <label className="form-label">ชื่อเว็บไซต์</label>
              <input
                type="text"
                className="form-input"
                value={settings.siteName || ''}
                onChange={(e) => handleChange('siteName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">คำอธิบายเว็บไซต์</label>
              <textarea
                className="form-textarea"
                value={settings.siteDescription || ''}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={2}
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL โลโก้ (รูปภาพหลัก)</label>
              <input
                type="text"
                className="form-input"
                value={settings.logoUrl || ''}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="/logo.png หรือ URL รูปภาพ"
              />
              {settings.logoUrl && (
                <div style={{ marginTop: '8px' }}>
                  <img
                    src={settings.logoUrl}
                    alt="Logo preview"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--border)',
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">ลิ้งค์ Instagram</label>
              <input
                type="text"
                className="form-input"
                value={settings.igUsername || ''}
                onChange={(e) => handleChange('igUsername', e.target.value)}
                placeholder="sell_second_hand_clothes.th"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ลิ้งค์ LINE</label>
              <input
                type="text"
                className="form-input"
                value={settings.lineUsername || ''}
                onChange={(e) => handleChange('lineUsername', e.target.value)}
                placeholder="@sellsecondhand"
              />
            </div>
          </div>
        )}

        {/* Hero Tab */}
        {activeTab === 'hero' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, marginBottom: '8px' }}>
              ส่วน Hero (หน้าแรก)
            </h3>

            <div className="form-group">
              <label className="form-label">หัวข้อหลัก</label>
              <input
                type="text"
                className="form-input"
                value={settings.heroTitle || ''}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">หัวข้อเน้น (สี.Gradient)</label>
              <input
                type="text"
                className="form-input"
                value={settings.heroTitleAccent || ''}
                onChange={(e) => handleChange('heroTitleAccent', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">คำอธิบาย Hero</label>
              <textarea
                className="form-textarea"
                value={settings.heroSubtitle || ''}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Chip 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.heroChip1 || ''}
                  onChange={(e) => handleChange('heroChip1', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Chip 2</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.heroChip2 || ''}
                  onChange={(e) => handleChange('heroChip2', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Chip 3</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.heroChip3 || ''}
                  onChange={(e) => handleChange('heroChip3', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Badge รอบโลโก้ 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.badge1 || ''}
                  onChange={(e) => handleChange('badge1', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Badge รอบโลโก้ 2</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.badge2 || ''}
                  onChange={(e) => handleChange('badge2', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Badge รอบโลโก้ 3</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.badge3 || ''}
                  onChange={(e) => handleChange('badge3', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, marginBottom: '8px' }}>
              Social Media & CTA
            </h3>

            <div className="form-group">
              <label className="form-label">ข้อความปุ่ม CTA (IG)</label>
              <input
                type="text"
                className="form-input"
                value={settings.igCtaText || ''}
                onChange={(e) => handleChange('igCtaText', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ข้อความ Footer</label>
              <input
                type="text"
                className="form-input"
                value={settings.footerTagline || ''}
                onChange={(e) => handleChange('footerTagline', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ลิขสิทธิ์</label>
              <input
                type="text"
                className="form-input"
                value={settings.footerCopyright || ''}
                onChange={(e) => handleChange('footerCopyright', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">คำอธิบายร้าน (Footer)</label>
              <textarea
                className="form-textarea"
                value={settings.footerAbout || ''}
                onChange={(e) => handleChange('footerAbout', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, marginBottom: '8px' }}>
              ข้อมูลการจัดส่ง
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">ค่าส่ง กรุงเทพ</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.shippingBangkok || ''}
                  onChange={(e) => handleChange('shippingBangkok', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">ค่าส่ง ต่างจังหวัด</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.shippingUpcountry || ''}
                  onChange={(e) => handleChange('shippingUpcountry', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Free Shipping สำหรับยอดสั่งซื้อ</label>
              <input
                type="text"
                className="form-input"
                value={settings.shippingFreeThreshold || ''}
                onChange={(e) => handleChange('shippingFreeThreshold', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">เวลาจัดส่ง กรุงเทพ</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.shippingBangkokTime || ''}
                  onChange={(e) => handleChange('shippingBangkokTime', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">เวลาจัดส่ง ต่างจังหวัด</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.shippingUpcountryTime || ''}
                  onChange={(e) => handleChange('shippingUpcountryTime', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, marginBottom: '8px' }}>
              เกี่ยวกับเรา
            </h3>

            <div className="form-group">
              <label className="form-label">เรื่องราวร้าน (ย่อหน้า 1)</label>
              <textarea
                className="form-textarea"
                value={settings.aboutStory1 || ''}
                onChange={(e) => handleChange('aboutStory1', e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">เรื่องราวร้าน (ย่อหน้า 2)</label>
              <textarea
                className="form-textarea"
                value={settings.aboutStory2 || ''}
                onChange={(e) => handleChange('aboutStory2', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}
      </div>

      {/* Save button at bottom */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <motion.button
          onClick={handleSave}
          className="btn btn-primary btn-lg"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
        </motion.button>
      </div>
    </>
  );
}
