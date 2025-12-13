import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { toPlainObject, toPlainArray } from "@/lib/utils/firestoreUtils";

export const getCategory = async ({ id }) => {
  // First try to get by document ID
  const data = await getDoc(doc(db, `categories/${id}`));
  if (data.exists()) {
    return toPlainObject({ id: data.id, ...data.data() });
  }
  
  // If not found, try to find by slug
  const slugQuery = await getDocs(
    query(collection(db, "categories"), where("slug", "==", id))
  );
  if (!slugQuery.empty) {
    const doc = slugQuery.docs[0];
    return toPlainObject({ id: doc.id, ...doc.data() });
  }
  
  // If still not found, try case-insensitive slug match
  const allCategories = await getDocs(collection(db, "categories"));
  const matchedCategory = allCategories.docs.find(
    (d) => d.data().slug?.toLowerCase() === id?.toLowerCase()
  );
  if (matchedCategory) {
    return toPlainObject({ id: matchedCategory.id, ...matchedCategory.data() });
  }
  
  return null;
};

export const getCategories = async () => {
  const list = await getDocs(collection(db, "categories"));
  return toPlainArray(list.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
};
