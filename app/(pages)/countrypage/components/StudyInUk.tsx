"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

const StudyInUk = () => {
  const UniArr = [
    {
      universityImage: "/bannerNY.JPG",
      ranking: "184",
      logo: "/LogoNY.JPG",
      universityName: "UNIVERSITY OF YORK",
    },
    {
      universityImage: "/bannerCA.JPG",
      ranking: "101-105",
      logo: "/LogoCA.JPG",
      universityName: "UNIVERSITY OF CREATIVE ARTS",
    },
    {
      universityImage: "/bannerHull.JPG",
      ranking: "516",
      logo: "/logoHull.JPEG",
      universityName: "UNIVERSITY OF HULL",
    },
  ];
  // const sliderArray = ["/edin.png", "/manch.png", "/edin.png", "/manch.png"];
  const fullText = `
  Studying in the United Kingdom offers a wealth of advantages that make
  it an attractive destination for international students. The UK is
  home to world-class universities renowned for their high academic
  standards and cutting-edge research. Students can experience a rich
  blend of cultures, as campuses are filled with individuals from around
  the globe, fostering an inclusive environment. Many UK degree programs,
  especially at the postgraduate level, are shorter in duration than
  those in other countries, allowing for time and cost savings. UK
  qualifications are globally recognized and highly regarded by employers,
  enhancing career prospects. Additionally, universities provide extensive
  support services, including orientation programs and academic assistance,
  helping students transition smoothly. The opportunity to immerse oneself
  in the UKs rich history, culture, and language further enriches the experience.
  With options for part-time work and numerous networking opportunities
  through university events, studying in the UK not only provides an exceptional
  education but also valuable life experiences.
`;

  const truncatedText = `
  Studying in the United Kingdom offers a wealth of advantages that make
  it an attractive destination for international students. The UK is
  home to world-class universities renowned for their high academic
  standards and cutting-edge research. Students can experience a rich
  blend of cultures, as campuses are filled with individuals from around
  the globe, fostering an inclusive environment. Many UK degree programs,
  especially at the postgraduate level, are shorter in duration than
  those in other countries.`;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Introduction Section */}
      <div className="text-center w-5/6 lg:w-[70%] mx-auto md:pt-28">
        <h2 className="pt-4 pb-2">Why Study In United Kingdom!</h2>
        <div className="text-center">
          <p>
            {isExpanded ? fullText : truncatedText}
            <span
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-black-200  underline underline-offset-4 font-normal cursor-pointer ml-2"
            >
              {isExpanded ? "...Read less" : "Read more..."}
            </span>
          </p>
        </div>
      </div>

      {/* Carousel Section */}
      <section
        className="relative flex justify-center items-center text-center text-white bg-5 bg-black bg-cover bg-center min-h-[60px] md:min-h-[100vh] mt-10 py-5"
        style={{
          backgroundImage: "url('/bg-usa.png')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-90 z-0"></div>

        <div className="relative z-10 w-full md:px-6 space-y-2">
          <h2 className="md:pt-10 pb-4">Popular Universities in United Kingdom</h2>

          <div
            className="flex overflow-x-auto md:space-x-4 md:p-4 hide-scrollbar gap-1 max-w-[90%] mx-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* {sliderArray.map((imgSrc, index) => (
              <div
                key={index}
                className="flex-shrink-0 max-w-[300px] md:max-w-[400px] xl:max-w-[500px]"
              >
                <Image
                  src={imgSrc}
                  alt={`Slide ${index + 1}`}
                  width={500} 
                  height={300} 
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 70vw, (max-width: 2560px) 200vw, 40vw"
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
            ))} */}
            {UniArr.map((course, index) => (
              <div
                key={index}
                className=" bg-white  shadow-xl rounded-2xl overflow-hidden p-1 md:p-3"
              >
                <div className="relative md:h-[120px] lg:h-[200px]">
                  <div className="absolute top-5 left-0 bg-gradient-to-r from-[#fce7d2] to-transparent text-black px-2 rounded-tr-lg z-10 text-left leading-2">
                    <p className="md:text-sm text-[10px] font-medium">QS World:</p>
                    <p className="md:text-sm text-[10px] font-semibold">
                      Ranking: {course.ranking}
                    </p>
                  </div>

                  <Image
                    src={course.universityImage}
                    alt={course.universityName}
                    width={400}
                    height={250}
                    className="lg:h-[180px] lg:w-[400px] md:w-[320px] md:h-[100px] h-[70px] w-[300px] object-cover rounded-xl shadow-2xl border border-black"
                  />

                  <div className="absolute lg:bottom-1 -bottom-4 left-3 lg:left-5 w-14 h-14">
                    <Image
                      src={course.logo}
                      alt={`${course.universityName} Logo`}
                      width={56}
                      height={56}
                      className="object-fit lg:w-[56px] lg:h-[56px] md:h-[35px] md:w-[35px] w-[30px] h-[30px] rounded-full bg-white border border-gray-200"
                    />
                  </div>
                </div>

                <div className="md:px-4 lg:h-[40px] flex flex-col justify-between">
                  <div>
                    {/* <p className="lg:font-bold text-black text-left">{course.universityName}</p> */}
                    <p className="text-gray-900 text-left text-[10px] leading-3 md:text-[12px] font-semibold lg:text-[14px] p-1 md:p-0">{course.universityName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/uniarchive">
          <Button className="bg-red-700 mt-3">Explore All Universities</Button></Link>
        </div>
      </section>
    </>
  );
};

export default StudyInUk;
