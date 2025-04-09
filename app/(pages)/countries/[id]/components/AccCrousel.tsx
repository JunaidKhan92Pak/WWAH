"use client";
import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import "flowbite";
import { useMemo } from "react";

interface AccCrouselProps {
  countryName: string;
  teaching_and_learning_approach: string[];
  multicultural_environment: string[];
}

const AccCrousel = ({
  countryName,
  teaching_and_learning_approach,
  multicultural_environment,
}: AccCrouselProps) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [nestedIndex, setNestedIndex] = useState(0);


  const slides = useMemo(() => [
    {
      image: "/mainbanner.jpeg",
      text: `Academic Life and Cultural Diversity in ${countryName || ""}`,
      icon: "/vector.png",
    },
    {
      image: "/teaching&learning-approach.jpeg",
      heading: "Teaching and Learning Approach",
      list: [
        { text: teaching_and_learning_approach?.[0] || "", image: "/LECTURES.jpg" },
        { text: teaching_and_learning_approach?.[1] || "", image: "/Research Opportunities.jpg" },
        { text: teaching_and_learning_approach?.[2] || "", image: "/Independent study.jpg" },
        { text: teaching_and_learning_approach?.[3] || "", image: "/Assessment.jpg" },
      ],
    },
    {
      image: "/multiculturalenvironment.jpg",
      heading: "Multicultural Environment",
      list: [
        { text: multicultural_environment?.[0] || "", image: "/Student Mix.png" },
        { text: multicultural_environment?.[1] || "", image: "/Cultural Societies.jpg" },
        { text: multicultural_environment?.[2] || "", image: "/Cultural Festivals.jpeg" },
      ],
    },
  ], [countryName, teaching_and_learning_approach, multicultural_environment]);


  const nextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    setNestedIndex(0);
  };

  const prevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setNestedIndex(0);
  };

  useEffect(() => {
    const currentSlide = slides[activeSlideIndex]; // Store in a variable

    if (activeSlideIndex > 0 && currentSlide?.list?.length) {
      const interval = setInterval(() => {
        setNestedIndex((prev) => (prev + 1) % (currentSlide.list?.length || 1));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [activeSlideIndex, slides]);


  return (
    <div>
      <section>
        <div className="relative w-full">
          <div className="relative overflow-hidden">
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className={`${activeSlideIndex === slideIndex ? "block" : "hidden"} duration-700 ease-in-out`}
                data-carousel-item
              >
                <div
                  className="relative bg-cover bg-center flex flex-col items-center justify-center h-[400px] md:h-[450px]"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
                  <div className="w-[90%] md:w-[80%] mx-auto flex flex-col justify-center items-center text-white z-10">
                    {/* Common Heading */}
                    <h2 className="text-center mb-2 md:mb-4 text-white text-nowrap">{slide.heading}</h2>

                    {slide.list ? (
                      <div className="flex flex-col md:gap-6 md:flex-row items-center justify-center">
                        {/* Left Side - Image */}
                        <div className="w-[230px] md:w-[300px] flex-none">
                          <Image
                            src={slide.list[nestedIndex]?.image || "/placeholder.jpg"}
                            alt={slide.list[nestedIndex]?.text || "Slide Image"}
                            width={400}
                            height={300}
                            className="rounded-xl shadow-lg object-cover w-full h-full"
                          />
                        </div>

                        {/* Right Side - Static Text (Bullet Points) */}
                        <div className="flex flex-col md:w-[50%] xl:w-[72%]">
                          <ul className="md:text-start text-center text-white list-disc list-inside ">
                            {slide.list?.map((item, index) => (
                              <li key={index} className="text-sm md:text-lg">{item.text}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <>
                        {slide.icon && (
                          <Image src={slide.icon} alt="Slide Icon" width={50} height={50} className="mb-4" />
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
                className={`md:w-2 md:h-2 h-1 w-1 rounded-full ${activeSlideIndex === slideIndex ? "bg-blue-500" : "bg-gray-500"
                  }`}
                onClick={() => {
                  setActiveSlideIndex(slideIndex);
                  setNestedIndex(0);
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
              <svg className="md:w-3 md:h-3 w-2 h-2 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
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
              <svg className="md:w-3 md:h-3 w-2 h-2 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
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
