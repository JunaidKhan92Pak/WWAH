"use client";
import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import "flowbite";

const Crouselflowbite = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [
    {
      image: "/bgimg.png",
      text: "Academic Life & Cultural Diversity in the United Kingdom",
      icon: "/vector.png",
    },
    {
      image: "/countrypage/Independent-study.jpg",
      text: "Teaching and Learning Approach",
      list: [
        "Lectures, Seminars, and Tutorials",
        "Research Opportunities",
        "Independent Study",
        "Assessments",
      ],
    },
    {
      image: "/countrypage/culturalfest.jpeg",
      text: "Cultural Festivities",
      list: [
        "Music, Dance, and Traditions",
        "Festivals Celebrating Heritage",
        "Community Engagement",
        "Learning Through Culture",
      ],
    },
  ];
  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);
  return (
    <div>
      {/* Slider Section */}
      <section>
        <div className="relative w-full">
          <div className="relative overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`${activeIndex === index ? "block" : "hidden"
                  } duration-700 ease-in-out`}
                data-carousel-item
              >
                <div
                  className="relative bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 h-[60vh]"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
                  <div className="lg:w-2/5 flex flex-col justify-center items-center text-white z-10">
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
                    {slide.list && (
                      <ul className="space-y-2 text-center">
                        {slide.list.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Slider Indicators */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-2 h-2 rounded-full ${activeIndex === index ? "bg-white" : "bg-gray-500"
                  }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          {/* Slider Controls */}
          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={prevSlide}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/30 ">
              <svg
                className="w-2 h-2 text-black"
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
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/30 ">
              <svg
                className="w-2 h-2 text-black"
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

export default Crouselflowbite;
