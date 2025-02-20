"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import "flowbite";
const AccCrousel = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [nestedIndex, setNestedIndex] = useState(0);
  const slides = [
    {
      image: "/mainbanner.jpeg",
      text: "Academic Life and Cultural Diversity in United Kingdom",
      icon: "/vector.png",
    },
    {
      image: "/teaching&learning-approach.jpeg",
      heading: "Teaching and Learning Approach",
      list: [
        { text: "Lectures, Seminars, and Tutorials", image: "/LECTURES.jpg" },
        { text: "Research Opportunities", image: "/Research Opportunities.jpg" },
        { text: "Independent Study", image: "/Independent study.jpg" },
        { text: "Assessments", image: "/Assessment.jpg" },
      ],
    },
    {
      image: "/multiculturalenvironment.jpg",
      heading: "Multicultural Environment",
      list: [
        { text: "Student Mix", image: "/Student Mix.png" },
        { text: "Cultural Societies", image: "/Cultural Societies.jpg" },
        { text: "Festivals and Cultural Events", image: "/Cultural Festivals.jpeg" },
      ],
    },
  ];
  const nextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    setNestedIndex(0); // Reset nested index when moving to the next slide
  };
  const prevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setNestedIndex(0); // Reset nested index when moving to the previous slide
  };
  useEffect(() => {
    // Automatically change the nested index for slides with a list
    if (slides[activeSlideIndex]?.list?.length) {
      const interval = setInterval(() => {
        setNestedIndex((prev) =>
          (prev + 1) % (slides[activeSlideIndex]?.list?.length ?? 1)
        );
      }, 5000); // Change every 5 seconds
      return () => clearInterval(interval);
    }
  }, [slides]);
  return (
    <div>
      <section>
        <div className="relative w-full">
          <div className="relative overflow-hidden">
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className={`${activeSlideIndex === slideIndex ? "block" : "hidden"
                  } duration-700 ease-in-out`}
                data-carousel-item
              >
                <div
                  className="relative bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 h-[220px] sm:h-[60vh] lg:h-[70vh]"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
                  <div className="lg:w-3/5 mb-5 flex flex-col justify-center items-center text-white z-10">
                    {/* Common Heading */}
                    <h2 className="text-center mb-2 lg:mb-10 text-white text-nowrap">
                      {slide.heading}
                    </h2>
                    {slide.list ? (
                      <div className="flex flex-col md:flex-row w-full h-full items-center justify-between">
                        {/* Left Side - Image */}
                        <div className="w-1/2 flex items-center justify-center">
                          <Image
                            src={
                              slide.list[nestedIndex]?.image ||
                              "/placeholder.jpg"
                            }
                            alt={slide.list[nestedIndex]?.text || "Slide Image"}
                            width={400}
                            height={300}
                            className="rounded-xl shadow-lg w-[60vw] md:w-[35vw] lg:w-[25vw] h-[100px] sm:h-[35vh] object-cover"
                          />
                        </div>
                        {/* Right Side - Text */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center px-4 md:text-nowrap">
                          <h5 className="md:text-left text-center text-white py-2 items-center justify-center">
                            {slide.list[nestedIndex]?.text || "Default Text"}
                          </h5>
                        </div>
                      </div>
                    ) : (
                      <>
                        {slide.icon && (
                          <Image
                            src={slide.icon}
                            alt="Slide Icon"
                            width={50}
                            height={50}
                            className="mb-4"
                          />
                        )}
                        <h4 className="text-center py-5">{slide.text}</h4>

                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Slider Indicators */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
            {slides.map((_, slideIndex) => (
              <button
                key={slideIndex}
                type="button"
                className={`md:w-2 md:h-2 h-1 w-1 rounded-full ${activeSlideIndex === slideIndex
                  ? "bg-blue-500"
                  : "bg-gray-500"
                  }`}
                onClick={() => {
                  setActiveSlideIndex(slideIndex);
                  setNestedIndex(0); // Reset nested index when changing slides
                }}
                aria-label={`Slide ${slideIndex + 1}`}
              ></button>
            ))}
          </div>
          {/* Slider Controls */}
          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={prevSlide}
          >
            <span className="inline-flex items-center justify-center md:w-8 md:h-8 w-5 h-5 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg
                className="md:w-3 md:h-3 w-2 h-2 text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={nextSlide}
          >
            <span className="inline-flex items-center justify-center md:w-8 md:h-8 w-5 h-5 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg
                className="md:w-3 md:h-3 w-2 h-2 text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
export default AccCrousel; 