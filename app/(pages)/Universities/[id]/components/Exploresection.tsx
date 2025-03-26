"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useUniversityStore } from "@/store/useUniversitiesStore";
import { SkeletonCard } from "@/components/skeleton";
const Exploresection = () => {
  // Slider data with image paths and info
  const { universities, fetchUniversities, loading } = useUniversityStore();
  useEffect(() => {
    if (universities.length === 0) fetchUniversities();
  }, [fetchUniversities]);
  return (
    <section
      className="relative flex flex-col lg:flex-row items-center text-white bg-black bg-cover bg-center p-6 md:p-8 lg:px-12 lg:py-12 overflow-hidden justify-between w-full mt-6"
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
            className="flex overflow-x-auto space-x-2 md:space-x-5 hide-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {loading ? (
              <SkeletonCard arr={1} />
            ) : (
              universities.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 rounded-3xl shadow-lg overflow-hidden"
                >
                  <Image
                    src={item.universityImages.banner}
                    alt={item.university_name}
                    width={400}
                    height={350}
                    objectFit="cover"
                    className="rounded-3xl w-[235px] md:w-[400px] xl:w-[450px] xl:h-[350px] h-[220px] md:h-[300px]"
                  />
                  {/* Text Overlay */}

                  <div className="absolute bottom-0 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl md:rounded-3xl w-full text-white p-4 sm:p-6 md:p-8 ">
                    {/* Logo Image */}
                    <div className="absolute -top-8 left-2 sm:-top-10 sm:left-4 md:-top-12 lg:-top-10 2xl:-top-16 md:left-6">
                      <Image
                        src={item.universityImages.logo}
                        alt="University Logo"
                        width={50}
                        height={50}
                        className="rounded-full  sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px] lg:w-[70px] lg:h-[70px] 2xl:w-[100px] 2xl:h-[100px]"
                      />
                    </div>
                    {/* Title */}
                    <h6>{item.university_name}</h6>
                    {/* Additional Info */}
                    <div className="flex w-full justify-between text-white text-sm sm:text-base">
                      <p>{item.country_name}</p>
                      <p>Public</p>
                      <p>{item.acceptance_rate}</p>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Exploresection;
