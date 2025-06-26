"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { SkeletonCard } from "@/components/skeleton";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface UniversityImages {
  banner: string;
  logo: string;
}

interface UniversityType {
  university_name: string;
  country_name: string;
  acceptance_rate: string;
  universityImages: UniversityImages;
}

interface ExploresectionProps {
  countryName: string;
  uniname: string;
}

const Exploresection: React.FC<ExploresectionProps> = ({
  countryName,
  uniname,
}) => {
  const [universities, setUniversities] = useState<UniversityType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(
          `/api/getUniversities?country=${countryName}&limit=4${
            uniname ? `&excludeUni=${encodeURIComponent(uniname)}` : ""
          }`
        );
        const data = await res.json();
        if (Array.isArray(data.universities)) {
          setUniversities(data.universities);
        } else {
          console.error("Invalid universities response:", data);
          setUniversities([]); // fallback to empty
        }
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [countryName]);

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
    <section
      className="relative flex flex-col lg:flex-row items-center text-white bg-black bg-cover bg-center p-6 md:p-8 lg:px-12 lg:py-12 overflow-hidden justify-between w-full mt-6"
      style={{
        backgroundImage: "url('/bg-usa.png')",
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
      {/* Content Section */}
      <div className="relative z-10 w-full lg:w-[40%] flex flex-col justify-center lg:space-y-4 sm:px-4 text-left">
        <h3 className="mb-2">Explore More Universities!</h3>
        <p className="text-[#9D9D9D] leading-relaxed">
          Discover the exciting world of universities in the {countryName},
          where you can gain a high-quality education and experience life in a
          new culture. Explore the perfect fit for your academic and career
          aspirations!
        </p>
      </div>
      {/* Slider Section */}
      <div className="relative z-10 w-full lg:w-[50%] mt-6 lg:mt-0">
        <div className="relative w-full flex justify-center ">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-1 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black border border-gray-200 shadow-xl p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft />
          </button>
          <div
            ref={scrollRef}
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
                    className="rounded-3xl w-[250px] md:w-[400px] xl:w-[430px] lg:h-[274px] md:h-[250px] h-[200px]"

/>
                  {/* Text Overlay */}

                  <div className="absolute bottom-0 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl md:rounded-3xl w-full text-white ">
                    {/* Logo Image */}
                    <div className="absolute -top-8 left-4 sm:-top-10 sm:left-4 md:-top-10  2xl:-top-16 md:left-6">
                      <Image
                        src={item.universityImages.logo}
                        alt="University Logo"
                        width={50}
                        height={50}
                        className="rounded-full w-[50px] h-[50px] md:w-[70px] md:h-[70px] 2xl:w-[100px] 2xl:h-[100px]"
                      />
                    </div>
                    {/* Title */}
                    <div className="p-4 sm:py-6 md:pt-8 md:px-6">
                    <h6>{item.university_name}</h6>
                    {/* Additional Info */}
                    <div className="flex w-full justify-between  text-white text-sm sm:text-base flex-wrap">
                      <p>{item.country_name}</p>
                      <p>Type: Public</p>
                      <p>Accceptance Rate: {item.acceptance_rate}</p>
                    </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-1 md:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black border border-gray-200 shadow-xl p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};
export default Exploresection;
