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

/** Fetch all products ordered by newest first (sorted in JS to avoid Firestore index) */
export async function getProducts() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  // Sort by createdAt descending
  docs.sort((a, b) => {
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
  const ref = await addDoc(collection(db, COLLECTION), {
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
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a product by ID */
export async function deleteProduct(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
