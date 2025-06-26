import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useScholarships } from "@/store/useScholarships";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ExploreScholarships = () => {
  const {
    scholarships,
    fetchScholarships,
    // New setter
  } = useScholarships();
  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <div>
      <section className="relative flex flex-col lg:flex-row gap-4 items-center text-white bg-black bg-cover bg-center mt-6 p-6 md:p-8 lg:px-12 lg:py-12 overflow-hidden justify-between w-full">
        <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

        <div className="relative z-10 w-full lg:w-[50%] flex flex-col justify-center md:space-y-2 sm:px-4 text-left">
          <h4 className="">Explore More Scholarships!</h4>
          <p className="text-[#9D9D9D] leading-relaxed">
            Discover a range of scholarship opportunities from across the globe!
            Whether you&apos;re aiming to study in the United States, Europe, or
            beyond, there are countless scholarships designed to support your
            academic journey. These scholarships can help you access world-class
            education without financial barriers.
          </p>
        </div>
        <div className="relative z-10 w-full lg:w-[50%] mt-6 lg:mt-0">
          <div className="relative w-full flex justify-center">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black border border-gray-200 shadow-xl p-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowLeft />
            </button>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto space-x-2 md:space-x-4 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {scholarships.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 rounded-3xl shadow-lg overflow-hidden"
                >
                  <Image
                    src={item.banner || "/default-university-banner.jpg"}
                    alt="University Image"
                    width={380}
                    height={350}
                    objectFit="cover"
                    // className="rounded-xl w-full h-full"
                    className="rounded-3xl w-[240px] md:w-[300px] lg:w-[330px] xl:w-[360px] h-[200px] md:h-[220px] xl:h-[260px] object-cover "
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 "></div>
                  <div className="absolute bottom-0 w-[235px] md:ml-2 md:w-[300px] xl:w-[350px]  text-white px-4 py-3">
                    <p className="font-semibold md:mb-2"> {item.name}</p>
                    <p className=" flex items-center gap-1">
                      <Image
                        src="/location-white.svg"
                        alt="locationwhite"
                        width={100}
                        height={100}
                        className="w-4 h-4"
                      />
                      {/* {item.universityName} */}
                      {item.hostCountry}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black border border-gray-200 shadow-xl p-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExploreScholarships;
