'use client';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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
      <motion.button
        className="cart-fab"
        onClick={() => setOpen(true)}
        aria-label="ตะกร้าสินค้า"
        id="cart-fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Icon name="shoppingCart" size={22} />
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.span
              className="cart-fab-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              {cart.length}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="cart-backdrop"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            ref={drawerRef}
            className="cart-drawer cart-drawer--open"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <h2 className="cart-drawer-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="shoppingCart" size={20} />
                ตะกร้าสินค้า
              </h2>
              <motion.button
                onClick={() => setOpen(false)}
                className="cart-drawer-close"
                aria-label="ปิด"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon name="x" size={16} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="cart-drawer-body">
              <AnimatePresence mode="popLayout">
                {cart.length === 0 ? (
                  <motion.div
                    className="cart-empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
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
                  </motion.div>
                ) : (
                  <>
                    {cart.map((p, index) => (
                      <motion.div
                        key={p.id}
                        className="cart-item"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        {p.image && (
                          <motion.img
                            src={p.image}
                            alt={p.name}
                            className="cart-item-img"
                            whileHover={{ scale: 1.1 }}
                          />
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
                        <motion.button
                          onClick={() => removeFromCart(p.id)}
                          className="cart-item-remove"
                          aria-label="ลบออกจากตะกร้า"
                          whileHover={{ scale: 1.2, color: '#ff3b30' }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <Icon name="x" size={14} />
                        </motion.button>
                      </motion.div>
                    ))}

                    {/* Total */}
                    <motion.div
                      className="cart-total-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span style={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600 }}>ยอดรวม</span>
                      <span className="cart-total-price">฿{total.toLocaleString()}</span>
                    </motion.div>

                    {/* Message Preview */}
                    <motion.div
                      className="cart-msg-preview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', marginBottom: '6px', fontFamily: 'Prompt, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon name="chatBubble" size={12} />
                        ข้อความที่จะส่งไป IG:
                      </p>
                      <pre className="cart-msg-text">{buildMessage()}</pre>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.div
                  className="cart-drawer-footer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <motion.button
                    onClick={handleOrder}
                    className="btn btn-primary btn-full btn-lg"
                    style={{ gap: '10px', fontFamily: 'Prompt, sans-serif' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon name="instagram" size={20} />
                    คัดลอก & เปิด IG สั่งซื้อ!
                  </motion.button>
                  <motion.button
                    onClick={clearCart}
                    className="btn btn-ghost btn-sm btn-full"
                    style={{ marginTop: '8px', fontFamily: 'Prompt, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon name="trash" size={14} />
                    ล้างตะกร้า
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
