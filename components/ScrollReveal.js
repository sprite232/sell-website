'use client';
import { useEffect } from 'react';

/**
 * Attaches IntersectionObserver to all `.reveal-card` elements in the DOM.
 * When they enter the viewport, adds class `revealed` which triggers the CSS animation.
 * Should be mounted once at the page/layout level.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-card, .reveal-section');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Unobserve after animating — no need to re-trigger
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null; // no UI
}
