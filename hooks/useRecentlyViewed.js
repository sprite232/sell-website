'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'su-sell-recently-viewed';
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed]);

  const addRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p.id !== product.id);
      // Add to beginning
      const updated = [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || null,
          brand: product.brand,
          brandColor: product.brandColor,
          brandTextColor: product.brandTextColor,
          code: product.code,
          status: product.status,
          viewedAt: Date.now(),
        },
        ...filtered,
      ];
      // Keep only MAX_ITEMS
      return updated.slice(0, MAX_ITEMS);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  return {
    recentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}
