"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Minus, Plus, X, Book, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { user } = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });
  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <main className="flex flex-col gap-3 justify-center items-center p-5">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {(!data?.carts || data?.carts?.length === 0) && (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <div className="flex justify-center">
            <img className="h-[200px]" src="/svgs/Empty-pana.svg" alt="" />
          </div>
          <h1 className="text-gray-600 font-semibold">
            Please Add Products To Cart
          </h1>
        </div>
      )}
      <div className="p-5 w-full md:max-w-[900px] gap-4 grid grid-cols-1 md:grid-cols-2">
        {data?.carts?.map((item, key) => {
          return <ProductItem item={item} key={item?.id} />;
        })}
      </div>
      {data?.carts?.length > 0 && (
        <div>
          <Link href={`/checkout?type=cart`}>
            <button className="bg-violet-900 px-5 py-2 text-sm rounded-lg text-white">
              Checkout
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}

function ProductItem({ item }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });

  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if this is an eBook item
  const isEbook = item?.id?.endsWith("-ebook");
  const baseProductId = item?.id?.replace(/-ebook$/, "");
  
  const { data: product } = useProduct({ productId: baseProductId });

  // Get correct price based on format
  const price = isEbook 
    ? (product?.ebookSalePrice || product?.salePrice)
    : product?.salePrice;
  const originalPrice = isEbook 
    ? (product?.ebookPrice || product?.price)
    : product?.price;

  const handleRemove = async () => {
    if (!confirm("Are you sure?")) return;
    setIsRemoving(true);
    try {
      const newList = data?.carts?.filter((d) => d?.id != item?.id);
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error) {
      toast.error(error?.message);
    }
    setIsRemoving(false);
  };

  const handleUpdate = async (quantity) => {
    setIsUpdating(true);
    try {
      const newList = data?.carts?.map((d) => {
        if (d?.id === item?.id) {
          return {
            ...d,
            quantity: parseInt(quantity),
          };
        } else {
          return d;
        }
      });
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error) {
      toast.error(error?.message);
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex gap-3 items-center border px-3 py-3 rounded-xl">
      <div className="h-14 w-14 p-1 relative">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={product?.featureImageURL}
          alt=""
        />
        {isEbook ? (
          <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1">
            <Smartphone size={10} className="text-white" />
          </div>
        ) : (
          <div className="absolute -top-1 -right-1 bg-indigo-500 rounded-full p-1">
            <Book size={10} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 w-full">
        <h1 className="text-sm font-semibold">{product?.title}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${
          isEbook 
            ? "bg-emerald-100 text-emerald-700" 
            : "bg-indigo-100 text-indigo-700"
        }`}>
          {isEbook ? "eBook (PDF)" : "Hard Copy"}
        </span>
        <h1 className="text-green-500 text-sm">
          ₹ {price}{" "}
          <span className="line-through text-xs text-gray-500">
            ₹ {originalPrice}
          </span>
        </h1>
        <div className="flex text-xs items-center gap-2">
          <Button
            onClick={() => {
              handleUpdate(item?.quantity - 1);
            }}
            isDisabled={isUpdating || item?.quantity <= 1}
            isIconOnly
            size="sm"
            className="h-6 w-4"
          >
            <Minus size={12} />
          </Button>
          <h2>{item?.quantity}</h2>
          <Button
            onClick={() => {
              handleUpdate(item?.quantity + 1);
            }}
            isDisabled={isUpdating}
            isIconOnly
            size="sm"
            className="h-6 w-4"
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <Button
          onClick={handleRemove}
          isLoading={isRemoving}
          isDisabled={isRemoving}
          isIconOnly
          color="danger"
          size="sm"
        >
          <X size={13} />
        </Button>
      </div>
    </div>
  );
}
