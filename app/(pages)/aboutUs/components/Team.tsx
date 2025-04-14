"use client";

import React from "react";
import Image from "next/image";

const teamCards = [
  {
    src: "/counselling.svg",
    alt: "WWAH Counselling Team",
  },
  {
    src: "/studentcare.svg",
    alt: "WWAH Service Team",
  },
  {
    src: "/serviceteam.svg",
    alt: "WWAH Student Care Team",
  },
];
function  Team() {
  return (
    <div className="lg:py-12 py-4 bg-black text-white">
      <div className=" mx-auto px-6 w-full flex flex-col items-center">
        <h2 className="lg:mb-6 py-2">Meet WWAH Team!</h2>
        <p className="lg:mb-8 mb-4 text-gray-300 w-full md:w-[70%] text-justify md:text-center">
          Our team is composed of passionate counsellors, student care, and
          service experts dedicated to helping students achieve their
          educational dreams. We are dedicated to providing exceptional guidance
          and support to help you achieve your academic and professional goals.
          Allow us to introduce the passionate and experienced individuals who
          make up the WWAH team:
        </p>
        {/* Image Cards */}
        <div className="flex overflow-x-auto space-x-2 md:space-x-4 md:p-4 hide-scrollbar justify-start lg:justify-center"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {teamCards.map((card, index) => (
            <div
              key={index}
              className="overflow-hidden relative flex-shrink-0 max-w-[200px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[320px] rounded-lg shadow-lg"
            >
              <Image
                src={card.src}
                alt={card.alt}
                className="w-[450px] md:h-[200px] lg:h-[230px] object-cover rounded-xl"
                width={200}
                height={100}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;
