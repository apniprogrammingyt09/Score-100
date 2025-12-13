import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { toPlainObject, toPlainArray } from "@/lib/utils/firestoreUtils";

export const getBrand = async ({ id }) => {
  // First try to get by document ID
  const data = await getDoc(doc(db, `brands/${id}`));
  if (data.exists()) {
    return toPlainObject({ id: data.id, ...data.data() });
  }
  
  // If not found, try to find by name (case-insensitive)
  const allBrands = await getDocs(collection(db, "brands"));
  const matchedBrand = allBrands.docs.find(
    (d) => d.data().name?.toLowerCase() === id?.toLowerCase()
  );
  if (matchedBrand) {
    return toPlainObject({ id: matchedBrand.id, ...matchedBrand.data() });
  }
  
  return null;
};

export const getBrands = async () => {
  const list = await getDocs(collection(db, "brands"));
  return toPlainArray(list.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
};
