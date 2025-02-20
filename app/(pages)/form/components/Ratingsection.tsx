"use client";

// import { useState, useRef } from "react";
import Image from "next/image";


const RatingSection = () => {
  const testimonials = [
    {
      name: "Robert Smith",
      image: "/person1.png",
      rating: 4,
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
    },
    {
      name: "Sara James",
      image: "/Ratingsection.png",
      rating: 5,
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
    },
    {
      name: "Emily Brown",
      image: "/person1.png",
      rating: 4,
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
    },
    {
      name: "Sara James",
      image: "/Ratingsection.png",
      rating: 5,
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
    },
    {
      name: "Emily Brown",
      image: "/person1.png",
      rating: 4,
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
    },
  ];
  return (
    <div
      className="relative flex flex-col items-center justify-center text-white bg-black bg-cover py-4"
      style={{ backgroundImage: "url('/bg-usa.png')" }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* Content */}
      <div className="relative w-full mx-auto z-10 text-center">
        <h2 className="text-white mb-8">
          Our Students&apos; Journeys to Success!
        </h2>

        {/* Slider */}
        <div
          className="flex overflow-x-auto space-x-4 p-12"
          style={{
             scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="relative bg-gray-700 bg-opacity-80 w-[90%] md:w-[50%] lg:w-[45%] xl:w-[30%] h-[240px] md:h-[250px]  flex-shrink-0 rounded-3xl shadow-lg"
            >
              {/* Image */}
              <div className="absolute -top-11 left-1/2 transform -translate-x-1/2">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={90}
                  height={90}
                  className="rounded-full h-[70px] w-[70px] md:h-[90px] md:w-[90px]"
                />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 w-full bg-opacity-60 text-white rounded-b-3xl  ">
                <div className="text-center">
                  <h6>{testimonial.name}</h6>
                  <div className="flex justify-center space-x-1"
                  >
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <h6
                        key={starIdx}
                        className={`${
                          starIdx < testimonial.rating
                            ? "text-[#F0851D]"
                            : "text-[#9D9D9D]"
                        }`}
                      >
                        ★
                      </h6>
                    ))}
                  </div>
                  <p className="px-4 pb-4">{testimonial.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSection;
