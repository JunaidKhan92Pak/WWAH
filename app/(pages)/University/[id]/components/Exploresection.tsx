"use client";
import React from "react";
import Image from "next/image";
const Exploresection = () => {
  // Slider data with image paths and info
  const sliderData = [
    {
      src: "/university-1.png",
      title: "Massey University",
      country: "New Zealand",
      type: "Public",
      rate: "Acceptance Rate: 70%",
    },
    {
      src: "/university-2.png",
      title: "Massey University",
      country: "New Zealand",
      type: "Public",
      rate: "Acceptance Rate: 70%",
    },
    {
      src: "/university-3.png",
      title: "Massey University",
      country: "New Zealand",
      type: "Public",
      rate: "Acceptance Rate: 70%",
    },
  ];
  return (
    <section
      className="relative flex flex-col lg:flex-row items-center text-white bg-black bg-cover bg-center p-6 md:p-8 lg:px-12 lg:py-12 overflow-hidden justify-between w-full"
      style={{
        backgroundImage: "url('/bg-usa.png')",
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
      {/* Content Section */}
      <div className="relative z-10 w-full lg:w-[40%] flex flex-col justify-center space-y-4 sm:px-4 text-left">
        <h3 className="mb-2">Explore More Universities!</h3>
        <p className="text-[#9D9D9D] leading-relaxed">
          Discover the exciting world of universities in the United Kingdom,
          where you can gain a high-quality education and experience life in a
          new culture. Explore the perfect fit for your academic and career
          aspirations!
        </p>
      </div>
      {/* Slider Section */}
      <div className="relative z-10 w-full lg:w-[50%] mt-6 lg:mt-0">
        <div className="relative w-full flex justify-center overflow-hidden">
          <div
            className="flex overflow-x-auto space-x-4 hide-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {sliderData.map((item, index) => (
              <div
                key={index}
                className="relative w-[85%] sm:w-[85%] md:w-[70%] lg:w-[80%] h-[30vh] sm:h-[50vh]     md:h-[55vh] lg:h-[50vh] 2xl:h-[60vh] flex-shrink-0 rounded-3xl shadow-lg overflow-hidden"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  width={400}
                  height={350}
                  objectFit="cover"
                  className="rounded-3xl w-full h-full"
                />
                {/* Text Overlay */}

                <div className="absolute bottom-0 bg-white bg-opacity-30 backdrop-blur-sm rounded-3xl w-full text-white p-4 sm:p-6 md:p-8">
                  {/* Logo Image */}
                  <div className="absolute -top-8 left-2 sm:-top-10 sm:left-4 md:-top-12 lg:-top-10 2xl:-top-16 md:left-6">
                    <Image
                      src="/massey.png"
                      alt="University Logo"
                      width={50}
                      height={50}
                      className="rounded-full  sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px] lg:w-[70px] lg:h-[70px] 2xl:w-[100px] 2xl:h-[100px]"
                    />
                  </div>
                  {/* Title */}
                  <h4>{item.title}</h4>
                  {/* Additional Info */}
                  <div className="flex sm:flex-row gap-2 sm:gap-16 lg:gap-12 flex-wrap sm:flex-nowrap">
                    <p>{item.country}</p>
                    <p>{item.type}</p>
                    <p>{item.rate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Exploresection;
