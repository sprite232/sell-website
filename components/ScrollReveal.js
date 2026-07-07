'use client';
import { useEffect } from 'react';

/**
 * ScrollReveal — uses both IntersectionObserver (detect viewport entry)
 * and MutationObserver (detect new .reveal-card / .reveal-section elements
 * added to DOM after async data loads, e.g. Firestore products).
 *
 * This fixes the bug where products start at opacity:0 and never reveal
 * because Firestore loads them AFTER the observer was already set up.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const SELECTOR = '.reveal-card, .reveal-section';

    // ── IntersectionObserver ──────────────────────────────
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target); // done watching this element
          }
        });
      },
      {
        threshold: 0.05,          // trigger when just 5% is visible
        rootMargin: '0px 0px -10px 0px', // small negative margin so cards near viewport edge still trigger
      }
    );

    // Observe an element only if not already revealed
    const observe = (el) => {
      if (!el.classList.contains('revealed')) {
        io.observe(el);
      }
    };

    // Observe anything already in the DOM
    document.querySelectorAll(SELECTOR).forEach(observe);

    // ── MutationObserver ─────────────────────────────────
    // Watches for new elements added to DOM (e.g. product cards after Firestore loads)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return; // element nodes only

          // Check if the added node itself matches
          if (node.matches?.(SELECTOR)) observe(node);

          // Check descendants too (e.g. a <section> added with .reveal-card children)
          node.querySelectorAll?.(SELECTOR).forEach(observe);
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
