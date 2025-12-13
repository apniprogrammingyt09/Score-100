import { ProductCard } from "@/app/components/Products";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { toPlainArray } from "@/lib/utils/firestoreUtils";
import { getCategories } from "@/lib/firestore/categories/read_server";
import { getCollections } from "@/lib/firestore/collections/read_server";
import { getBrands } from "@/lib/firestore/brands/read_server";
import SearchPageClient from "./components/SearchPageClient";

const getAllProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), orderBy("timestampCreate", "desc"))
  );
  return toPlainArray(list.docs.map((snap) => ({ id: snap.id, ...snap.data() })));
};

export default async function Page({ searchParams }) {
  const [products, categories, collections, brands] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getCollections(),
    getBrands(),
  ]);

  return (
    <SearchPageClient 
      products={products}
      categories={categories || []}
      collections={collections || []}
      brands={brands || []}
      searchParams={searchParams}
    />
  );
}
