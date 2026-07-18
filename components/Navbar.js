'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import Icon from './Icon';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            Su Sell Second hand
          </Link>

          <div className="navbar-actions">
            <Link href="/how-to-order" className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <Icon name="questionCircle" size={16} />
              <span className="ig-label">วิธีสั่งซื้อ</span>
            </Link>
            <a
              href="https://www.instagram.com/sell_second_hand_clothes.th"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-link"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon name="instagram" size={18} />
              <span className="ig-label">IG ร้าน</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
