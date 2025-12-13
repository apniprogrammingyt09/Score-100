import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { toPlainObject, toPlainArray } from "@/lib/utils/firestoreUtils";

export const getProduct = async ({ id }) => {
  const data = await getDoc(doc(db, `products/${id}`));
  if (data.exists()) {
    return toPlainObject({ id: data.id, ...data.data() });
  } else {
    return null;
  }
};

export const getFeaturedProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), where("isFeatured", "==", true))
  );
  return toPlainArray(list.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
};

export const getProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), orderBy("timestampCreate", "desc"))
  );
  return toPlainArray(list.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
};

export const getProductsByCategory = async ({ categoryId }) => {
  const list = await getDocs(
    query(
      collection(db, "products"),
      orderBy("timestampCreate", "desc"),
      where("categoryId", "==", categoryId)
    )
  );
  return toPlainArray(list.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
};

export const getProductsByBrand = async ({ brandId }) => {
  // Since brandIds is an array, we need to use array-contains
  const list = await getDocs(
    query(
      collection(db, "products"),
      where("brandIds", "array-contains", brandId),
      orderBy("timestampCreate", "desc")
    )
  );
  return toPlainArray(list.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
};

export const getProductsByCollection = async ({ collectionId }) => {
  const list = await getDocs(
    query(
      collection(db, "products"),
      where("collectionIds", "array-contains", collectionId),
      orderBy("timestampCreate", "desc")
    )
  );
  return toPlainArray(list.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
};
