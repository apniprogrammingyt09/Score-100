"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId, type, label }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isAdded = data?.carts?.find((item) => item?.id === productId);

  const handlClick = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please Logged In First!");
      }
      if (isAdded) {
        const newList = data?.carts?.filter((item) => item?.id != productId);
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        await updateCarts({
          list: [...(data?.carts ?? []), { id: productId, quantity: 1 }],
          uid: user?.uid,
        });
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  if (type === "cute") {
    return (
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handlClick}
        variant="bordered"
        className="text-indigo-900 border-indigo-900"
      >
        {!isAdded && (label || "Add To Cart")}
        {isAdded && "Remove from Cart"}
      </Button>
    );
  }

  if (type === "ebook") {
    return (
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handlClick}
        variant="bordered"
        className="text-emerald-700 border-emerald-600"
      >
        {!isAdded && (label || "Add eBook")}
        {isAdded && "Remove eBook"}
      </Button>
    );
  }

  if (type === "large") {
    return (
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handlClick}
        variant="bordered"
        className="text-violet-900 border-violet-900"
        size="sm"
      >
        {!isAdded && <AddShoppingCartIcon className="text-xs" />}
        {isAdded && <ShoppingCartIcon className="text-xs" />}
        {!isAdded && (label || "Add To Cart")}
        {isAdded && "Click To Remove"}
      </Button>
    );
  }

  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handlClick}
      variant="flat"
      isIconOnly
      size="sm"
    >
      {!isAdded && <AddShoppingCartIcon className="text-xs" />}
      {isAdded && <ShoppingCartIcon className="text-xs" />}
    </Button>
  );
}
