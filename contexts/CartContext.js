'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('su-sell-cart');
      if (saved) setCart(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('su-sell-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      if (prev.find(p => p.id === product.id)) return prev; // no duplicates
      return [...prev, product];
    });
    setOpen(true); // open drawer when adding
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id));
  const clearCart = () => setCart([]);
  const isInCart = (id) => cart.some(p => p.id === id);

  const total = cart.reduce((s, p) => s + Number(p.price || 0), 0);

  return (
    <CartContext.Provider value={{ cart, open, setOpen, addToCart, removeFromCart, clearCart, isInCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
