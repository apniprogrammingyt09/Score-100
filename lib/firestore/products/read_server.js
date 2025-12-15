import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";

export const getProduct = async ({ id }) => {
  const docRef = doc(db, `products/${id}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      timestampCreate: data.timestampCreate?.toDate?.() || null,
      timestampUpdate: data.timestampUpdate?.toDate?.() || null,
    };
  } else {
    return null;
  }
};

export const getProducts = async () => {
  const list = await getDocs(collection(db, "products"));
  return list.docs.map((snap) => {
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      timestampCreate: data.timestampCreate?.toDate?.() || null,
      timestampUpdate: data.timestampUpdate?.toDate?.() || null,
    };
  });
};

export const getFeaturedProducts = async () => {
  const q = query(
    collection(db, "products"),
    where("isFeatured", "==", true),
    orderBy("timestampCreate", "desc"),
    limit(10)
  );
  const list = await getDocs(q);
  return list.docs.map((snap) => {
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      timestampCreate: data.timestampCreate?.toDate?.() || null,
      timestampUpdate: data.timestampUpdate?.toDate?.() || null,
    };
  });
};

export const getProductsByCategory = async ({ categoryId }) => {
  const q = query(
    collection(db, "products"),
    where("categoryId", "==", categoryId),
    orderBy("timestampCreate", "desc")
  );
  const list = await getDocs(q);
  return list.docs.map((snap) => {
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      timestampCreate: data.timestampCreate?.toDate?.() || null,
      timestampUpdate: data.timestampUpdate?.toDate?.() || null,
    };
  });
};

export const getProductsByBrand = async ({ brandId }) => {
  const q = query(
    collection(db, "products"),
    where("brandId", "==", brandId),
    orderBy("timestampCreate", "desc")
  );
  const list = await getDocs(q);
  return list.docs.map((snap) => {
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      timestampCreate: data.timestampCreate?.toDate?.() || null,
      timestampUpdate: data.timestampUpdate?.toDate?.() || null,
    };
  });
};

export const getProductsByCollection = async ({ collectionId }) => {
  const q = query(
    collection(db, "products"),
    where("collectionId", "==", collectionId),
    orderBy("timestampCreate", "desc")
  );
  const list = await getDocs(q);
  return list.docs.map((snap) => {
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      timestampCreate: data.timestampCreate?.toDate?.() || null,
      timestampUpdate: data.timestampUpdate?.toDate?.() || null,
    };
  });
};

export const searchProducts = async (searchQuery) => {
  if (!searchQuery) return [];
  
  try {
    // Get all products and filter client-side for better search
    const allProducts = await getProducts();
    
    const searchTerm = searchQuery.toLowerCase();
    
    return allProducts.filter(product => {
      const title = (product.title || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const shortDescription = (product.shortDescription || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const author = (product.author || '').toLowerCase();
      
      return title.includes(searchTerm) ||
             description.includes(searchTerm) ||
             shortDescription.includes(searchTerm) ||
             category.includes(searchTerm) ||
             author.includes(searchTerm);
    });
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};