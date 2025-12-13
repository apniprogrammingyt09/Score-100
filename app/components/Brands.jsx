"use client";

import Slider from "react-slick";

export default function Brands({ brands }) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  if (brands.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5">
      <h1 className="text-center font-semibold text-xl">Our Boards</h1>
      <Slider {...settings}>
        {(brands?.length <= 2
          ? [...brands, ...brands, ...brands]
          : brands
        )?.map((brand, index) => {
          return (
            <div className="px-2" key={`${brand?.id}-${index}`}>
              <div className="flex flex-col gap-2 items-center justify-center">
                <div className="h-28 w-full rounded-lg p-3 border flex items-center justify-center">
                  <img
                    className="h-full w-auto object-contain"
                    src={brand?.imageURL}
                    alt={brand?.name}
                  />
                </div>
                <h3 className="text-sm font-medium text-center">{brand?.name}</h3>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
