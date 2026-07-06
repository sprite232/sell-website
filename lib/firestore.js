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

