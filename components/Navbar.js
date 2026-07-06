'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo" style={{ fontFamily: 'Prompt, sans-serif', fontSize: '1.2rem', fontWeight: 800 }}>
            Su Sell Second hand
          </Link>

          <div className="navbar-actions">
            <a
              href="https://www.instagram.com/sell_second_hand_clothes.th"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-link"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/>
              </svg>
              <span className="ig-label">IG ร้าน</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
