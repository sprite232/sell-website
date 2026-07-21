'use client';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useRef } from 'react';
import Icon from './Icon';

const IG_URL = 'https://www.instagram.com/sell_second_hand_clothes.th';

export default function CartDrawer() {
  const { cart, open, setOpen, removeFromCart, clearCart, total } = useCart();
  const drawerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, setOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setOpen]);

  const buildMessage = () => {
    const lines = cart.map((p, i) =>
      `${i + 1}. ${p.code ? `[${p.code}] ` : ''}${p.name}${p.brand ? ` (${p.brand})` : ''} — ฿${Number(p.price).toLocaleString()}`
    );
    return (
      `สวัสดีครับ สนใจสั่งซื้อ ${cart.length} รายการครับ:\n` +
      lines.join('\n') +
      `\n\nยอดรวม: ฿${total.toLocaleString()} บาท\nรบกวนสอบถามราคาและนัดรับได้เลยนะครับ`
    );
  };

  const handleOrder = async () => {
    const msg = buildMessage();
    try {
      await navigator.clipboard.writeText(msg);
    } catch { /* fallback: no clipboard */ }
    window.open(IG_URL, '_blank');
    setOpen(false);
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        className="cart-fab"
        onClick={() => setOpen(true)}
        aria-label="ตะกร้าสินค้า"
        id="cart-fab"
      >
        <Icon name="shoppingCart" size={22} />
        {cart.length > 0 && (
          <span className="cart-fab-badge">{cart.length}</span>
        )}
      </button>

      {/* Backdrop */}
      {open && <div className="cart-backdrop" onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <aside ref={drawerRef} className={`cart-drawer ${open ? 'cart-drawer--open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="shoppingCart" size={20} />
            ตะกร้าสินค้า
          </h2>
          <button onClick={() => setOpen(false)} className="cart-drawer-close" aria-label="ปิด">
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--bg-secondary)', border: '2px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px', color: 'var(--fg-muted)',
              }}>
                <Icon name="shoppingCart" size={28} />
              </div>
              <p style={{ color: 'var(--fg-muted)', fontFamily: 'Prompt, sans-serif' }}>
                ยังไม่มีสินค้าในตะกร้า<br />
                กดปุ่ม "ใส่ตะกร้า" ที่สินค้าที่สนใจได้เลย!
              </p>
            </div>
          ) : (
            <>
              {cart.map(p => (
                <div key={p.id} className="cart-item">
                  {p.image && (
                    <img src={p.image} alt={p.name} className="cart-item-img" />
                  )}
                  <div className="cart-item-info">
                    {p.code && <span className="cart-item-code">{p.code}</span>}
                    <p className="cart-item-name">{p.name}</p>
                    {p.brand && (
                      <span className="cart-item-brand" style={{
                        background: p.brandColor || '#000',
                        color: p.brandTextColor || '#fff',
                      }}>{p.brand}</span>
                    )}
                    <p className="cart-item-price">฿{Number(p.price).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(p.id)}
                    className="cart-item-remove"
                    aria-label="ลบออกจากตะกร้า"
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}

              {/* Total */}
              <div className="cart-total-row">
                <span style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600 }}>ยอดรวม</span>
                <span className="cart-total-price">฿{total.toLocaleString()}</span>
              </div>

              {/* Message Preview */}
              <div className="cart-msg-preview">
                <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', marginBottom: '6px', fontFamily: 'Prompt, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="chatBubble" size={12} />
                  ข้อความที่จะส่งไป IG:
                </p>
                <pre className="cart-msg-text">{buildMessage()}</pre>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <button onClick={handleOrder} className="btn btn-primary btn-full btn-lg" style={{ gap: '10px', fontFamily: 'Prompt, sans-serif' }}>
              <Icon name="instagram" size={20} />
              คัดลอก & เปิด IG สั่งซื้อ!
            </button>
            <button onClick={clearCart} className="btn btn-ghost btn-sm btn-full" style={{ marginTop: '8px', fontFamily: 'Prompt, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Icon name="trash" size={14} />
              ล้างตะกร้า
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
