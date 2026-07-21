'use client';
import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      setVisible(scrollTop > 400);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  // SVG circle progress
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference * (1 - scrollProgress);

  return (
    <button
      onClick={scrollToTop}
      className="back-to-top"
      aria-label="กลับขึ้นบน"
      style={{
        position: 'fixed',
        bottom: '96px',
        right: '28px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        boxShadow: 'var(--shadow-md)',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'rotate(-90deg)',
        }}
      >
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />
        {/* Progress circle */}
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="var(--fg)"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s ease' }}
        />
      </svg>
      <Icon name="arrowUp" size={18} style={{ color: 'var(--fg)', zIndex: 1 }} />
    </button>
  );
}
