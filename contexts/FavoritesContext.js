'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('su-sell-favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('su-sell-favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || null,
        brand: product.brand,
        brandColor: product.brandColor,
        brandTextColor: product.brandTextColor,
        code: product.code,
        status: product.status,
      }];
    });
  };

  const isFavorite = (productId) => {
    return favorites.some(p => p.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
