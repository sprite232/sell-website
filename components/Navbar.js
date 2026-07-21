'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import Icon from './Icon';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function Navbar() {
  const { favorites } = useFavorites();

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <motion.span
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              Su Sell Second hand
            </motion.span>
          </Link>

          <div className="navbar-actions">
            <Link href="/favorites" className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', position: 'relative' }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Icon name="heart" size={16} />
              </motion.div>
              <span className="ig-label">รายการโปรด</span>
              {favorites.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: '-6px', right: '-8px',
                    background: '#ff2d55', color: '#fff',
                    fontSize: '0.6rem', fontWeight: 700,
                    width: '16px', height: '16px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {favorites.length}
                </motion.span>
              )}
            </Link>
            <Link href="/how-to-order" className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Icon name="questionCircle" size={16} />
              </motion.div>
              <span className="ig-label">วิธีสั่งซื้อ</span>
            </Link>
            <Link href="/about" className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Icon name="globe" size={16} />
              </motion.div>
              <span className="ig-label">เกี่ยวกับเรา</span>
            </Link>
            <motion.a
              href="https://www.instagram.com/sell_second_hand_clothes.th"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-link"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name="instagram" size={18} />
              <span className="ig-label">IG ร้าน</span>
            </motion.a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
