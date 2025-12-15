"use client";

import { Button } from "@nextui-org/react";
import { collection } from "firebase/firestore";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";

export default function Collections({ collections }) {
  // Ensure we have enough items for the slider to work
  const items = collections?.length > 0 
    ? (collections.length < 4 ? [...collections, ...collections] : collections)
    : [];

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!collections || collections.length === 0) {
    return <></>;
  }

  return (
    <div className="overflow-hidden md:p-10 p-5">
      <Slider {...settings}>
        {items.map((collection, index) => {
          return (
            <div className="px-2" key={`${collection?.id}-${index}`}>
              <div className="flex gap-4 bg-gradient-to-tr to-[#d9e2f1] from-[#cce7f5] p-7 w-full rounded-xl h-full">
                <div className="w-full flex flex-col gap-2">
                  <div className="flex flex-col gap-4">
                    <h2 className="md:text-lg text-base font-semibold">
                      {collection?.title}
                    </h2>
                    <p className="text-gray-600 text-xs md:text-sm max-w-96 line-clamp-2">
                      {collection?.subTitle}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Link href={`/collections/${collection?.slug || collection?.id}`}>
                      <button className="bg-violet-900 text-white text-xs md:text-sm px-4 py-2 rounded-lg">
                        BROWSE BOOKS
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="w-full">
                  <img
                    className="h-[4rem] md:h-[9rem]"
                    src={collection?.imageURL}
                    alt={collection?.title}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
