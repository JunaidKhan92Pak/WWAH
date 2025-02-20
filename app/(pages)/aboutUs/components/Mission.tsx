"use client";

import { useState } from "react";
import Image from "next/image";
import React from "react";

function Mission() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <section className="bg-gray-50 md:py-6 w-full">
      <div className="w-[90%] mx-auto">
        <h2 className=" text-gray-800 text-center py-5">What we stand for?</h2>
        {/* row 1 */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
          {/* Image Section */}
          <div className="w-full md:w-[50%]">
            <Image
              src="/mission.png"
              alt="Missionicon"
              className="w-full"
              width={683}
              height={297}
            />
          </div>

          {/* Text Section */}
          <div className="text-center md:text-left w-full md:w-[50%] pl-0 md:pl-8">
            <h4 className=" text-gray-900 mb-2">Our Mission!</h4>
            <p className="text-gray-700 text-justify leading-snug w-full lg:w-[85%]">
              Our mission is to revolutionize the way students and educational
              institutions connect and interact. We aim to simplify and
              streamline the admissions process, making higher education
              accessible to all aspiring learners worldwide.
            </p>
          </div>
        </div>
        {/* row 2 */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-2 md:gap-0">
          {/* Text Section */}
          <div className="text-center md:text-left w-full md:w-[50%] ">
            <h4 className=" text-gray-900 mb-2">Our Vision!</h4>
            <p className="text-gray-700 text-justify leading-snug w-full lg:w-[85%] pr-4">
              Our vision is to revolutionize the way students and educational
              institutions connect and interact. We aim to simplify and
              streamline the admissions process, making higher education
              accessible to all aspiring learners worldwide.
            </p>
          </div>
          {/* Image Section */}
          <div className="w-full md:w-[50%]">
            <Image
              src="/vision.png"
              alt="visionicon"
              className="w-full"
              width={683}
              height={297}
            />
          </div>
        </div>
        {/* row 3 */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
          {/* Image Section */}
          <div className="w-full md:w-[50%]">
            <Image
              src="/values.png"
              alt="Missionicon"
              className="w-full"
              width={683}
              height={297}
            />
          </div>

          {/* Text Section */}
          <div className="text-center md:text-left w-full md:w-[50%] pl-0 md:pl-8 pb-5 md:pb-0">
            <h4 className="text-gray-900 mb-2">Our Values!</h4>
            <p className="text-gray-700 text-justify leading-snug w-full lg:w-[85%]">
              <span className="font-bold">Innovation: </span>
              We continuously innovate to provide the best possible experience
              for our users, utilizing the hybrid model of latest artificial
              intelligence technology and human support to enhance our platform.
              {isExpanded && (
                <>
                  <br />
                  <span className="font-bold">Accessibility: </span>
                  We believe that education should be within reach for everyone,
                  and we strive to break down barriers to access.
                </>
              )}
              <span
                className="text-black font-bold cursor-pointer"
                onClick={toggleReadMore}
              >
                {isExpanded ? "Show less" : "Read more..."}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mission;
