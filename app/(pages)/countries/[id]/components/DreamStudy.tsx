import Image from "next/image";
import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const DreamStudy = () => {
  // const arr3 = ["/turk.png", "/studycanada.png", "/edin.png", "/manch.png"];
  const arr3 = [
    { src: "/country1.png", alt: "United States(US) " },
    { src: "/country2.png", alt: "China " },
    { src: "/country3.png", alt: "Canada" },
    { src: "/country4.png", alt: "Italy " },
    { src: "/country5.png", alt: "United Kingdom(UK) " },
    { src: "/country6.png", alt: "Ireland " },
    { src: "/country7.png", alt: "New Zealand " },
    { src: "/country8.png", alt: "Denmark " },
    { src: "/country9.png", alt: "France" },
  ];

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
      <section
        className="relative flex justify-center items-center text-center text-white bg-5 bg-black bg-cover bg-center  mt-10"
        style={{
          backgroundImage: "url('/bg-usa.png')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
        <div className="my-6 md:my-10 z-10">
          <h3 className="text-center text-white text-xl md:text-2xl">
            Choose your Dream Study Abroad Destination!
          </h3>
          <section className="w-[90%] mx-auto relative">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black border border-gray-200 shadow-xl p-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowLeft />
            </button>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto space-x-4 pt-4 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {arr3.map((item, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 max-w-[300px] md:max-w-[400px] 2xl:max-w-[600px]"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600} // Set a base width
                    height={400} // Set a base height
                    className="rounded-3xl shadow-lg w-full h-[190px] md:h-[230px] xl:h-[250px]"
                  />
                </div>
              ))}
            </div>
            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black border border-gray-200 shadow-xl p-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowRight />
            </button>
          </section>
        </div>
      </section>
    </div>
  );
};

export default DreamStudy;
