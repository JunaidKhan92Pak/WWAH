"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUniversityStore } from "@/store/useUniversitiesStore";

interface StudyInUkProps {
  country: string;
  countryName: string;
}

const StudyInUk = ({ countryName }: StudyInUkProps) => {
  const { universities, fetchUniversities } = useUniversityStore();
  useEffect(() => {
    if (universities.length === 0) fetchUniversities();
  }, [fetchUniversities]);

  const fullText =
    "Studying in the United Kingdom offers a wealth of advantages that make it an attractive destination for international students. The UK is home to world-class universities renowned for their high academic standards and cutting-edge research. Students can experience a rich blend of cultures, as campuses are filled with individuals from around the globe, fostering an inclusive environment. Many UK degree programs, especially at the postgraduate level, are shorter in duration than those in other countries.";
  const maxLength = 300;

  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedText =
    fullText.length > maxLength ? fullText.slice(0, maxLength) + "." : fullText;

  return (
    <>
      {/* Introduction Section */}
      <div className="text-center w-5/6 lg:w-[70%] mx-auto md:pt-28">
        <h2 className="pt-4 pb-2 font-bold">Why Study In {countryName}!</h2>
        <div className="text-center">
          <p>
            {isExpanded ? fullText : truncatedText}
            {fullText.length > maxLength && (
              <span
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-red-600 font-semibold underline hover:font-bold underline-offset-4 cursor-pointer ml-2"
              >
                {isExpanded ? "Read less" : "Read more..."}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Carousel Section */}
      <section
        className="relative flex justify-center items-center text-center text-white bg-5 bg-black bg-cover bg-center  mt-10 py-5"
        style={{
          backgroundImage: "url('/bg-usa.png')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-90 z-0"></div>

        <div className="relative z-10 w-full md:px-6 space-y-2">
          <h2 className="py-2 ">Popular Universities in {countryName}</h2>

          <div
            className="flex overflow-x-auto justify-center px-4 md:space-x-4 md:p-4 hide-scrollbar gap-1 mx-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {universities.slice(2, 6).map((item) => (
              <div
                key={item._id}
                className=" bg-white shadow-xl rounded-2xl overflow-hidden p-1 md:p-3"
              >
                <div className="relative md:h-[120px] lg:h-[200px]">
                  <div className="absolute top-3 left-0 bg-gradient-to-r from-[#fce7d2] to-transparent text-black px-2 rounded-tr-lg z-10 text-left leading-2">
                    <p className="md:text-sm text-[10px] font-medium">
                      QS World:{item.qs_world_university_ranking}
                    </p>
                    <p className="md:text-sm text-[10px] font-semibold">
                      Ranking:{item.ranking[0].detail}
                    </p>
                  </div>

                  <Image
                    src={item.universityImages.banner}
                    alt={item.university_name}
                    width={400}
                    height={250}
                    className="lg:h-[180px] lg:w-[350px] md:w-[320px] md:h-[100px] h-[100px] w-[300px] object-cover rounded-xl shadow-2xl border border-black "
                  />

                  <div className="absolute lg:bottom-1 -bottom-7 left-3 lg:left-5 w-14 h-14">
                    <Image
                      src={item.universityImages.logo}
                      alt={`${item.university_name}Logo`}
                      width={56}
                      height={56}
                      className="object-fit lg:w-[56px] lg:h-[56px] md:h-[35px] md:w-[35px] w-[25px] h-[30px] rounded-full bg-white border border-gray-200"
                    />
                  </div>
                </div>

                <div className="md:px-4 lg:h-[40px] flex flex-col justify-between">
                  <div>
                    {/* <p className="lg:font-bold text-black text-left">{item.universityName}</p> */}
                    <p className="text-gray-900 text-left text-[10px] leading-3 md:text-[12px] font-semibold lg:text-[14px] p-1 md:p-0">
                      {item.university_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/Universities">
            <Button className="bg-red-700 mt-3">
              Explore All Universities
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default StudyInUk;
