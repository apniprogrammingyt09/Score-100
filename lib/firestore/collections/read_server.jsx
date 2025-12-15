import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { toPlainObject, toPlainArray } from "@/lib/utils/firestoreUtils";

export const getCollection = async ({ id }) => {
  // First try to get by ID
  const data = await getDoc(doc(db, `collections/${id}`));
  if (data.exists()) {
    return toPlainObject({ id: data.id, ...data.data() });
  }
  
  // If not found by ID, try to get by slug
  const slugQuery = query(collection(db, "collections"), where("slug", "==", id));
  const slugResult = await getDocs(slugQuery);
  
  if (!slugResult.empty) {
    const doc = slugResult.docs[0];
    return toPlainObject({ id: doc.id, ...doc.data() });
  }
  
  return null;
};

export const getCollections = async () => {
  const list = await getDocs(collection(db, "collections"));
  return toPlainArray(list.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
};
