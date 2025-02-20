"use client";

import React from "react";
import Image from "next/image";

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
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-4 lg:gap-8">
          {/* Card 1 */}
          <div className="w-full sm:w-[32%] lg:w-[25%] rounded-lg shadow-lg flex-shrink-0">
            <Image
              src="/counselling.svg"
              alt="WWAH Counselling Team"
              className="rounded-t-lg w-[450px] h-[230px] object-fit rounded-xl"
              width={200}
              height={100}
            />
            
          </div>

          {/* Card 2 */}
          <div className="w-full sm:w-[32%] lg:w-[25%] rounded-lg  shadow-lg flex-shrink-0">
            <Image
              src="/studentcare.svg"
              alt="WWAH Service Team"
              className="rounded-t-lg w-[450px] h-[230px] rounded-xl object-fit"
              width={200}
              height={100}
            />
          </div>

          {/* Card 3 */}
          <div className="w-full sm:w-[32%] lg:w-[25%] rounded-lg shadow-lg flex-shrink-0">
            <Image
              src="/serviceteam.svg"
              alt="WWAH Student Care Team"
              className="rounded-t-lg w-[450px] h-[230px] rounded-xl"
              width={200}
              height={100}
            />
            </div>
        </div>
      </div>
    </div>
  );
}

export default Team;
