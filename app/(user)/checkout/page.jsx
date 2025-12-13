"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProductsByIds } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import Checkout from "./components/Checkout";

export default function Page() {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");
  const format = searchParams.get("format"); // "ebook" or null for physical

  // Get unique product IDs (without format suffix)
  const getBaseProductId = (id) => id?.replace(/-ebook$/, "");
  
  const productIdsList =
    type === "buynow" 
      ? [productId] 
      : data?.carts?.map((item) => getBaseProductId(item?.id));

  // Remove duplicates
  const uniqueProductIds = [...new Set(productIdsList)];

  const {
    data: products,
    error,
    isLoading,
  } = useProductsByIds({
    idsList: uniqueProductIds,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!productIdsList || productIdsList?.length === 0) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl text-gray-500">No Products Found</h1>
      </div>
    );
  }

  // Build product list with format info
  const productList =
    type === "buynow"
      ? [
          {
            id: format === "ebook" ? `${productId}-ebook` : productId,
            quantity: 1,
            format: format === "ebook" ? "ebook" : "physical",
            product: products[0],
          },
        ]
      : data?.carts?.map((item) => {
          const isEbook = item?.id?.endsWith("-ebook");
          const baseId = getBaseProductId(item?.id);
          return {
            ...item,
            format: isEbook ? "ebook" : "physical",
            product: products?.find((e) => e?.id === baseId),
          };
        });

  // Check if cart has any eBooks
  const hasEbooks = productList?.some((item) => item?.format === "ebook");
  const hasPhysical = productList?.some((item) => item?.format === "physical");

  return (
    <main className="p-5 flex flex-col gap-4">
      <h1 className="text-xl">Checkout</h1>
      {hasEbooks && hasPhysical && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
          <strong>Note:</strong> Your cart contains both physical books and eBooks. Physical books will be shipped, while eBooks will be available for instant download after payment.
        </div>
      )}
      <Checkout productList={productList} hasEbooks={hasEbooks} hasPhysical={hasPhysical} />
    </main>
  );
}
