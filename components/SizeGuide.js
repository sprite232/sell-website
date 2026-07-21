'use client';
import { useState } from 'react';
import Icon from './Icon';

const SIZE_DATA = [
  { size: 'XS', chest: '30-32"', waist: '24-26"', fit: 'รัดรูป' },
  { size: 'S', chest: '32-34"', waist: '26-28"', fit: 'พอดีตัว' },
  { size: 'M', chest: '34-36"', waist: '28-30"', fit: 'พอดีตัว' },
  { size: 'L', chest: '36-38"', waist: '30-32"', fit: 'หลวมนิดหน่อย' },
  { size: 'XL', chest: '38-40"', waist: '32-34"', fit: 'หลวม' },
  { size: 'XXL', chest: '40-42"', waist: '34-36"', fit: 'หลวมมาก' },
  { size: 'Free', chest: 'ไม่ระบุ', waist: 'ไม่ระบุ', fit: 'Free Size' },
];

export default function SizeGuide({ isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState(null);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <h3 style={{
            fontFamily: 'Prompt, sans-serif',
            fontSize: '1.2rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Icon name="ruler" size={20} />
            คู่มือไซส์
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--fg)',
            }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* How to measure */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <p style={{
            fontFamily: 'Prompt, sans-serif',
            fontSize: '0.85rem',
            color: 'var(--fg-secondary)',
            lineHeight: 1.6,
          }}>
            <strong>วิธีวัด:</strong> วัดรอบอกที่ widest point, วัดเอวที่ narrowest point
            แล้วเทียบกับตารางด้านล่าง
          </p>
        </div>

        {/* Size Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'Prompt, sans-serif',
            fontSize: '0.85rem',
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700 }}>ไซส์</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700 }}>รอบอก</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700 }}>เอว</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700 }}>ฟิต</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_DATA.map((row, i) => (
                <tr
                  key={row.size}
                  onClick={() => setSelectedSize(selectedSize === row.size ? null : row.size)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: selectedSize === row.size ? 'var(--bg-secondary)' : 'transparent',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSize !== row.size) {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSize !== row.size) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <td style={{
                    padding: '10px 8px',
                    fontWeight: 700,
                    color: selectedSize === row.size ? '#cc2366' : 'var(--fg)',
                  }}>
                    {row.size}
                  </td>
                  <td style={{ padding: '10px 8px', color: 'var(--fg-secondary)' }}>{row.chest}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--fg-secondary)' }}>{row.waist}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--fg-muted)', fontSize: '0.8rem' }}>{row.fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(204, 35, 102, 0.08)',
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(204, 35, 102, 0.2)',
        }}>
          <p style={{
            fontFamily: 'Prompt, sans-serif',
            fontSize: '0.8rem',
            color: 'var(--fg-secondary)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            <strong>เคล็ดลับ:</strong> ถ้าอยู่ระหว่าง 2 ไซส์ แนะนำให้เลือกไซส์ที่ใหญ่กว่า
            เพราะเสื้อผ้ามือสองอาจหดตัวเล็กน้อยหลังซัก
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="btn btn-primary btn-full"
          style={{
            marginTop: '20px',
            fontFamily: 'Prompt, sans-serif',
          }}
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
