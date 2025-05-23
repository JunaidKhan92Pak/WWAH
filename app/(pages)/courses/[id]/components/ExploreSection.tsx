"use client";
import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ExploreSectionProps {
  data: string;
  course: string; // Adjust the type according to the actual data type
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({
  data,
  course,
}) => {
  const [courses, setCourses] = useState<
    {
      universityData?: {
        universityImages?: { banner?: string };
        university_name?: string;
      };
      course_title?: string;
    }[]
  >([]); // Define the type explicitly
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(`/api/getCourses?search=${course}&limit=4`);
        const data = await res.json();
        if (Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          console.error("Invalid universities response:", data);
          setCourses([]); // fallback to empty
        }
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);
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
    <section className="relative flex flex-col lg:flex-row items-center text-white bg-black bg-cover bg-center p-6 md:p-8 lg:px-12 lg:py-12 overflow-hidden justify-between w-full">
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* Content Section */}
      <div className="relative z-10 w-full lg:w-[52%] flex flex-col justify-center md:space-y-4 sm:px-4 text-left">
        <h6 className="mb-2">Explore More Courses!</h6>
        <p className="text-[#9D9D9D] leading-relaxed">
          Discover the exciting world of universities in the {data}, where you
          can gain a high-quality education and experience life in a new
          culture. Explore the perfect fit for your academic and career
          aspirations!
        </p>
      </div>

      {/* Slider Section */}
      <div className="relative z-10 w-full lg:w-[50%] mt-6 lg:mt-0">
        <div className="relative w-full flex justify-center">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-1 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black border border-gray-200 shadow-xl p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 hide-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {courses.slice(0, 4).map((item, index) => (
              <div
                key={index}
                  className="relative flex-shrink-0 rounded-3xl shadow-lg overflow-hidden"

>
                <img
                  src={
                    item?.universityData?.universityImages?.banner ??
                    "/fallback-image.jpg"
                  }
                  alt="University Banner"
                    className="rounded-3xl w-[250px] md:w-[400px] xl:w-[430px] lg:h-[274px] h-[200px] "

/>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 w-full text-white px-4 py-3">
                  <p className="font-semibold mb-2">{item.course_title}</p>
                  <p className="flex items-center gap-1">
                    <img
                      src="/location-white.svg"
                      alt="Location Icon"
                      className="w-4 h-4"
                    />
                    {item?.universityData?.university_name}
                  </p>
                </div>
              </div>
            ))}
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
