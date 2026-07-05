'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            NOIR.
          </Link>

          <div className="navbar-actions">
            <Link href="/" className="navbar-link">Collection</Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
