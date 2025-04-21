"use client";
import React, { useEffect, useState } from "react";
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
        <div className="relative w-full flex justify-center overflow-hidden">
          <div
            className="flex overflow-x-auto space-x-4 hide-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {courses.slice(0, 4).map((item, index) => (
              <div
                key={index}
                className="relative w-[85%]  aspect-[16/9] flex-shrink-0 rounded-3xl shadow-lg overflow-hidden"
              >
                <img
                  src={
                    item?.universityData?.universityImages?.banner ??
                    "/fallback-image.jpg"
                  }
                  alt="University Banner"
                  className="w-full h-full object-cover rounded-xl"
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
        </div>
      </div>
    </section>
  );
};
