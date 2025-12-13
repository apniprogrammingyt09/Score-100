"use client";

import { Button } from "@nextui-org/react";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { useRef } from "react";

export default function FeaturedProductSlider({ featuredProducts }) {
  const sliderRef = useRef(null);

  var settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    fade: true,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
    dotsClass: "slick-dots custom-dots",
  };
  return (
    <div className="overflow-hidden relative">
      <Slider ref={sliderRef} {...settings}>
        {featuredProducts?.map((product) => {
          const isComingSoon = product?.isComingSoon;
          return (
            <div key={product?.id}>
              <div className="flex flex-col-reverse md:flex-row gap-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-5 md:px-24 md:py-20 w-full min-h-[400px] md:min-h-[500px]">
                <div className="flex-1 flex flex-col md:gap-10 gap-4 justify-center">
                  <div className="flex items-center gap-3">
                    <h2 className="text-indigo-600 text-xs md:text-base font-semibold">
                      SCORE 100 SERIES
                    </h2>
                    {isComingSoon && (
                      <span className="bg-violet-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <Link href={`/products/${product?.id}`}>
                      <h1 className="md:text-4xl text-xl font-bold text-indigo-900">
                        {product?.title}
                      </h1>
                    </Link>
                    <h1 className="text-gray-600 md:text-sm text-xs max-w-96 line-clamp-2">
                      {product?.shortDescription}
                    </h1>
                  </div>
                  <AuthContextProvider>
                    {isComingSoon ? (
                      <div className="flex items-center gap-4">
                        <button 
                          disabled
                          className="bg-gray-300 text-gray-500 text-xs md:text-sm px-6 py-2.5 rounded-full font-semibold cursor-not-allowed"
                        >
                          COMING SOON
                        </button>
                        <FavoriteButton productId={product?.id} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/checkout?type=buynow&productId=${product?.id}`}
                        >
                          <button className="bg-indigo-900 text-white text-xs md:text-sm px-6 py-2.5 rounded-full font-semibold shadow-lg hover:translate-y-[-1px] transition-transform">
                            BUY NOW
                          </button>
                        </Link>
                        <AddToCartButton productId={product?.id} type={"large"} />
                        <FavoriteButton productId={product?.id} />
                      </div>
                    )}
                  </AuthContextProvider>
                </div>
                <div className="flex items-center justify-center relative">
                  {isComingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="bg-violet-900/90 text-white px-6 py-3 rounded-2xl text-lg font-bold shadow-xl">
                        Coming Soon
                      </div>
                    </div>
                  )}
                  <Link href={`/products/${product?.id}`}>
                    <img
                      className={`h-[14rem] md:h-[23rem] object-contain drop-shadow-xl ${isComingSoon ? 'opacity-70' : ''}`}
                      src={product?.featureImageURL}
                      alt={product?.title}
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
      <style jsx global>{`
        .custom-dots {
          bottom: 20px !important;
        }
        .custom-dots li button:before {
          font-size: 10px !important;
          color: #6366f1 !important;
        }
        .custom-dots li.slick-active button:before {
          color: #312e81 !important;
        }
      `}</style>
    </div>
  );
}
