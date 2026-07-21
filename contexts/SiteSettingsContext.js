'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/firestore';

const SiteSettingsContext = createContext(null);

// Default settings (fallback if Firestore fails)
const DEFAULT_SETTINGS = {
  siteName: 'Su Sell Second hand',
  siteDescription: 'เสื้อผ้ามือ 1-2 คัดสรรมาอย่างดี ของแท้ทุกชิ้น DM สอบถามหรือสั่งซื้อได้เลย',
  logoUrl: '/logo.png',
  heroTitle: 'Su Sell',
  heroTitleAccent: 'Second hand',
  heroSubtitle: 'เสื้อผ้าคัดสรรมาดีๆ ของแท้ทุกชิ้น\nถามก่อนได้เลย ไม่กัด — DM มาเลย!',
  heroChip1: 'ของแท้ 100%',
  heroChip2: 'มือ 1-2',
  heroChip3: 'ราคาดี',
  badge1: 'ของแท้',
  badge2: 'มือ 1-2',
  badge3: 'DM ได้เลย',
  igUsername: 'sell_second_hand_clothes.th',
  igCtaText: 'DM สั่งซื้อเลย',
  footerCopyright: '© 2026 Su Sell Second hand',
  footerTagline: 'ของแท้ 100% | ราคาเป็นกันเอง | จัดส่งทั่วไทย',
  footerAbout: 'เสื้อผ้ามือสองแบรนด์เนมของแท้ คัดสรรมาอย่างดี',
  lineUsername: '@sellsecondhand',
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteSettings()
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Function to refresh settings (after admin update)
  const refreshSettings = async () => {
    try {
      const data = await getSiteSettings();
      if (data) setSettings(data);
    } catch (e) {
      console.error('Failed to refresh settings:', e);
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return context;
}
