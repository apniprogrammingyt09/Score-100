import AddToCartButton from "@/app/components/AddToCartButton";
import FavoriteButton from "@/app/components/FavoriteButton";
import MyRating from "@/app/components/MyRating";
import AuthContextProvider from "@/contexts/AuthContext";
import { getBrand } from "@/lib/firestore/brands/read_server";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import { Book, BookOpen, Smartphone } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Details({ product }) {
  const isComingSoon = product?.isComingSoon;
  const isOutOfStock = product?.stock <= (product?.orders ?? 0);
  const hasEbook = product?.hasEbook;
  
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap">
        <Category categoryId={product?.categoryId} />
        <Brand brandId={product?.brandId} />
        {isComingSoon && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full">
            <span className="text-xs font-semibold">Coming Soon</span>
          </div>
        )}
        {hasEbook && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full">
            <Smartphone size={12} />
            <span className="text-xs font-semibold">eBook Available</span>
          </div>
        )}
      </div>
      <h1 className="font-semibold text-xl md:text-4xl">{product?.title}</h1>
      <Suspense fallback="Failed To Load">
        <RatingReview product={product} />
      </Suspense>
      <h2 className="text-gray-600 text-sm line-clamp-3 md:line-clamp-4">
        {product?.shortDescription}
      </h2>

      {/* Pricing Options */}
      {!isComingSoon && (
        <div className="flex flex-col gap-3 mt-2">
          {/* Hard Copy Option */}
          <div className="flex items-center justify-between p-4 border-2 border-indigo-200 rounded-xl bg-indigo-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Book size={20} className="text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Hard Copy</h4>
                <p className="text-xs text-gray-500">Physical book delivered to you</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-green-600 font-bold text-lg">
                ₹{product?.salePrice}
              </h3>
              <span className="line-through text-gray-400 text-xs">
                ₹{product?.price}
              </span>
            </div>
          </div>

          {/* eBook Option */}
          {hasEbook && (
            <div className="flex items-center justify-between p-4 border-2 border-emerald-200 rounded-xl bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Smartphone size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">eBook (PDF)</h4>
                  <p className="text-xs text-gray-500">Instant digital download</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-green-600 font-bold text-lg">
                  ₹{product?.ebookSalePrice}
                </h3>
                <span className="line-through text-gray-400 text-xs">
                  ₹{product?.ebookPrice}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {isComingSoon ? (
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <button 
            disabled
            className="bg-gray-300 text-gray-500 rounded-lg px-6 py-2 cursor-not-allowed font-medium"
          >
            Coming Soon - Notify Me
          </button>
          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-2">
          {/* Hard Copy Purchase */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
              <button className="flex items-center gap-2 bg-indigo-900 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-indigo-800 transition-colors">
                <Book size={16} />
                Buy Hard Copy - ₹{product?.salePrice}
              </button>
            </Link>
            <AuthContextProvider>
              <AddToCartButton type={"cute"} productId={product?.id} label="Add Hard Copy" />
            </AuthContextProvider>
          </div>

          {/* eBook Purchase */}
          {hasEbook && (
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/checkout?type=buynow&productId=${product?.id}&format=ebook`}>
                <button className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-emerald-700 transition-colors">
                  <Smartphone size={16} />
                  Buy eBook - ₹{product?.ebookSalePrice}
                </button>
              </Link>
              <AuthContextProvider>
                <AddToCartButton type={"ebook"} productId={`${product?.id}-ebook`} label="Add eBook" />
              </AuthContextProvider>
            </div>
          )}

          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      )}

      {isOutOfStock && !isComingSoon && (
        <div className="flex">
          <h3 className="text-red-500 py-1 rounded-lg text-sm font-semibold">
            Hard Copy Out Of Stock
          </h3>
        </div>
      )}
      <div className="flex flex-col gap-2 py-2">
        <div
          className="text-gray-600"
          dangerouslySetInnerHTML={{ __html: product?.description ?? "" }}
        ></div>
      </div>
    </div>
  );
}

async function Category({ categoryId }) {
  const category = await getCategory({ id: categoryId });
  return (
    <Link href={`/categories/${categoryId}`}>
      <div className="flex items-center gap-1 border px-3 py-1 rounded-full">
        <img className="h-4" src={category?.imageURL} alt="" />
        <h4 className="text-xs font-semibold">{category?.name}</h4>
      </div>
    </Link>
  );
}

async function Brand({ brandId }) {
  const brand = await getBrand({ id: brandId });
  return (
    <div className="flex items-center gap-1 border px-3 py-1 rounded-full">
      <img className="h-4" src={brand?.imageURL} alt="" />
      <h4 className="text-xs font-semibold">{brand?.name}</h4>
    </div>
  );
}

async function RatingReview({ product }) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  return (
    <div className="flex gap-3 items-center">
      <MyRating value={counts?.averageRating ?? 0} />
      <h1 className="text-sm text-gray-400">
        <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews}
        )
      </h1>
    </div>
  );
}
