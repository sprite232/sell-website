'use client';
import { useState, useEffect } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState('light');

  // On mount: read saved preference or system preference
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const preferred = saved
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    setTheme(preferred);
    document.documentElement.setAttribute('data-theme', preferred);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return { theme, toggleTheme };
}
