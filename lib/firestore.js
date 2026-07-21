import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'products';

/** Generate next product code: S1, S2, S3... */
export async function getNextProductCode() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  if (snapshot.empty) return 'S1';

  // Extract all numeric parts from codes like S1, S2, S10
  const codes = snapshot.docs
    .map((d) => d.data().code)
    .filter(Boolean)
    .map((c) => parseInt(c.replace(/^S/, ''), 10))
    .filter((n) => !isNaN(n));

  const maxNum = codes.length > 0 ? Math.max(...codes) : 0;
  return `S${maxNum + 1}`;
}

/** Fetch all products ordered by `order` field first, then newest first */
export async function getProducts() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  docs.sort((a, b) => {
    const oa = a.order ?? 999999;
    const ob = b.order ?? 999999;
    if (oa !== ob) return oa - ob;
    const ta = a.createdAt?.seconds ?? 0;
    const tb = b.createdAt?.seconds ?? 0;
    return tb - ta;
  });
  return docs;
}

/** Fetch a single product by ID */
export async function getProduct(id) {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

/** Create a new product (auto-generates product code) */
export async function addProduct(data) {
  const code = await getNextProductCode();
  const snapshot = await getDocs(collection(db, COLLECTION));
  const maxOrder = snapshot.docs.reduce((m, d) => {
    const o = d.data().order ?? 0;
    return o > m ? o : m;
  }, 0);

  const ref = await addDoc(collection(db, COLLECTION), {
    status: 'available',
    order: maxOrder + 1,
    ...data,
    code,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update an existing product */
export async function updateProduct(id, data) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** Batch update order for drag & drop reordering */
export async function batchUpdateOrder(orderedIds) {
  await Promise.all(
    orderedIds.map((id, idx) =>
      updateDoc(doc(db, COLLECTION, id), { order: idx })
    )
  );
}

/** Delete a product by ID */
export async function deleteProduct(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

// ─────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────
const ANN_COLLECTION = 'announcements';

/** Get all announcements */
export async function getAnnouncements() {
  const snapshot = await getDocs(collection(db, ANN_COLLECTION));
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  docs.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  return docs;
}

/** Get only active announcements (for homepage) */
export async function getActiveAnnouncements() {
  const snapshot = await getDocs(collection(db, ANN_COLLECTION));
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((a) => a.active);
}

/** Create announcement */
export async function addAnnouncement(data) {
  const ref = await addDoc(collection(db, ANN_COLLECTION), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update announcement */
export async function updateAnnouncement(id, data) {
  await updateDoc(doc(db, ANN_COLLECTION, id), data);
}

/** Delete announcement */
export async function deleteAnnouncement(id) {
  await deleteDoc(doc(db, ANN_COLLECTION, id));
}

// ─────────────────────────────────────────
// SITE SETTINGS (CMS)
// ─────────────────────────────────────────
const SETTINGS_COLLECTION = 'siteSettings';

// Default settings structure
const DEFAULT_SETTINGS = {
  // General
  siteName: 'Su Sell Second hand',
  siteDescription: 'เสื้อผ้ามือ 1-2 คัดสรรมาอย่างดี ของแท้ทุกชิ้น DM สอบถามหรือสั่งซื้อได้เลย',
  logoUrl: '/logo.png',

  // Hero Section
  heroTitle: 'Su Sell',
  heroTitleAccent: 'Second hand',
  heroSubtitle: 'เสื้อผ้าคัดสรรมาดีๆ ของแท้ทุกชิ้น\nถามก่อนได้เลย ไม่กัด — DM มาเลย!',

  // Hero Chips
  heroChip1: 'ของแท้ 100%',
  heroChip2: 'มือ 1-2',
  heroChip3: 'ราคาดี',

  // Badges around logo
  badge1: 'ของแท้',
  badge2: 'มือ 1-2',
  badge3: 'DM ได้เลย',

  // IG Contact
  igUsername: 'sell_second_hand_clothes.th',
  igCtaText: 'DM สั่งซื้อเลย',

  // Footer
  footerCopyright: '© 2026 Su Sell Second hand',
  footerTagline: 'ของแท้ 100% | ราคาเป็นกันเอง | จัดส่งทั่วไทย',
  footerAbout: 'เสื้อผ้ามือสองแบรนด์เนมของแท้ คัดสรรมาอย่างดี',

  // LINE
  lineUsername: '@sellsecondhand',

  // Shipping
  shippingBangkok: '35-50 บาท',
  shippingUpcountry: '50-80 บาท',
  shippingFreeThreshold: '1,000 บาท',
  shippingBangkokTime: '1-2 วัน',
  shippingUpcountryTime: '2-3 วัน',

  // About Page
  aboutStory1: 'เราเชื่อว่าเสื้อผ้าแบรนด์เนมไม่จำเป็นต้องราคาแพงเสมอไป สินค้ามือสองคุณภาพดี ราคาเป็นกันเอง ช่วยให้ทุกคนเข้าถึงแบรนด์ที่รักได้',
  aboutStory2: 'ทุกชิ้นผ่านการตรวจสอบอย่างละเอียด เราบอกรายละเอียดและตำหนิอย่างชัดเจน เพื่อให้ลูกค้ามั่นใจว่าจะได้รับสินค้าที่ตรงตามความคาดหวัง',
};

/** Get site settings */
export async function getSiteSettings() {
  const ref = doc(db, SETTINGS_COLLECTION, 'main');
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    // Create default settings
    await updateDoc(ref, { ...DEFAULT_SETTINGS, updatedAt: serverTimestamp() }).catch(async () => {
      // If doc doesn't exist, create it
      const { setDoc } = await import('firebase/firestore');
      await setDoc(ref, { ...DEFAULT_SETTINGS, updatedAt: serverTimestamp() });
    });
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...snapshot.data() };
}

/** Update site settings */
export async function updateSiteSettings(data) {
  const ref = doc(db, SETTINGS_COLLECTION, 'main');
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } else {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }
}

