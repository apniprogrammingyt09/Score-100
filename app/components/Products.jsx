import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import { Suspense } from "react";
import MyRating from "./MyRating";
import { Smartphone } from "lucide-react";

export default function ProductsGridView({ products }) {
  return (
    <section className="w-full flex justify-center">
      <div className="flex flex-col gap-5 max-w-[900px] p-5">
        <h1 className="text-center font-semibold text-lg">Question Bank Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products?.map((item) => {
            return <ProductCard product={item} key={item?.id} />;
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }) {
  const isComingSoon = product?.isComingSoon;
  const isOutOfStock = product?.stock <= (product?.orders ?? 0);
  const hasEbook = product?.hasEbook;
  
  return (
    <div className="flex flex-col gap-3 border p-4 rounded-lg relative">
      <div className="relative w-full">
        <img
          src={product?.featureImageURL}
          className={`rounded-lg h-48 w-full object-cover ${isComingSoon ? 'opacity-80' : ''}`}
          alt={product?.title}
        />
        {isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-violet-900 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Coming Soon
            </span>
          </div>
        )}
        {hasEbook && !isComingSoon && (
          <div className="absolute top-1 left-1">
            <span className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Smartphone size={10} />
              eBook
            </span>
          </div>
        )}
        <div className="absolute top-1 right-1">
          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      </div>
      <Link href={`/products/${product?.id}`}>
        <h1 className="font-semibold line-clamp-2 text-sm">{product?.title}</h1>
      </Link>
      <div className="flex flex-col">
        <h2 className="text-green-500 text-sm font-semibold">
          ₹ {product?.salePrice}{" "}
          <span className="line-through text-xs text-gray-600">
            ₹ {product?.price}
          </span>
        </h2>
        {hasEbook && (
          <span className="text-emerald-600 text-xs">
            eBook: ₹{product?.ebookSalePrice}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 line-clamp-2">
        {product?.shortDescription}
      </p>
      <Suspense>
        <RatingReview product={product} />
      </Suspense>
      {isOutOfStock && !isComingSoon && (
        <div className="flex">
          <h3 className="text-red-500 rounded-lg text-xs font-semibold">
            Out Of Stock
          </h3>
        </div>
      )}
      {isComingSoon ? (
        <div className="flex items-center gap-4 w-full">
          <button 
            disabled
            className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-xs w-full cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4 w-full">
          <div className="w-full">
            <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
              <button className="flex-1 bg-violet-900 text-white px-4 py-2 rounded-lg text-xs w-full">
                Buy Now
              </button>
            </Link>
          </div>
          <AuthContextProvider>
            <AddToCartButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      )}
    </div>
  );
}

async function RatingReview({ product }) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  return (
    <div className="flex gap-3 items-center">
      <MyRating value={counts?.averageRating ?? 0} />
      <h1 className="text-xs text-gray-400">
        <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews}
        )
      </h1>
    </div>
  );
}
