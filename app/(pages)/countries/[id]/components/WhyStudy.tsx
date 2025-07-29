

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
interface UniversityType {
  _id: string;
  university_name: string;
  universityImages: {
    banner: string;
    logo: string;
  };
  qs_world_university_ranking: string;
  ranking: { detail: string }[];
}
interface StudyInUkProps {
  country: string;
  countryName: string;
}
const WhyStudy = ({ country, countryName }: StudyInUkProps) => {
  console.log(":white_tick: WhyStudy component rendered");
  const [universities, setUniversities] = useState<UniversityType[]>([]);
  const getCountryCode = (name: string) => {
    if (name === "United States of America") return "USA";
    return name;
  };
  const finalCountry = getCountryCode(countryName);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(
          `/api/getUniversities?country=${finalCountry}&limit=4`
        );
        const data = await res.json();
        if (Array.isArray(data.universities)) {
          setUniversities(data.universities);
        } else {
          console.error("Invalid universities response:", data);
          setUniversities([]); // fallback to empty
        }
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, [countryName]);
  const maxLength = 300;
  const [isExpanded, setIsExpanded] = useState(false);
  const fullText = country;
  const truncatedText =
    fullText.length > maxLength ? fullText.slice(0, maxLength) + "." : fullText;
  return (
    <>
      {/* Intro */}
      <div className="text-center w-5/6 lg:w-[70%] mx-auto md:pt-28">
        <h2 className="pt-4 pb-2 font-bold">Why Study In {countryName}!</h2>
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
      {/* Universities */}
      <section
        className="relative flex justify-center items-center text-center text-white mt-10 py-5"
        style={{ backgroundImage: "url('/bg-usa.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-90 z-0" />
        <div className="relative z-10 w-full  space-y-2">
          <h2 className="py-2">Popular Universities in {countryName}</h2>
          <div
            className="flex overflow-x-auto space-x-2 md:space-x-4 pl-16 md:pl-20 pr-4 p-6 hide-scrollbar justify-start xl:justify-center"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : (
              universities.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-xl rounded-2xl overflow-hidden p-2 md:p-3 relative flex-shrink-0 max-w-[180px] md:max-w-[230px] lg:max-w-[300px]"
                >
                  <div className="relative h-[130px] md:h-[150px] lg:h-[210px]">
                    <div className="absolute top-3 left-0 bg-gradient-to-r from-[#FCE7D2] to-transparent text-black px-2 rounded-tr-lg z-10 text-left leading-2">
                      <p className="md:text-sm text-[10px] font-medium">
                        QS World: {item.qs_world_university_ranking}
                      </p>
                      <p className="md:text-sm text-[10px] font-semibold">
                        Ranking: {item.ranking[0]?.detail}
                      </p>
                    </div>
                     <Link
                      target="blank"
                      rel="noopener noreferrer"
                      href={`/Universities/${item._id}`}
                      key={item._id}
                    >
                    <Image
                      src={item.universityImages.banner}
                      alt={item.university_name}
                      width={400}
                      height={250}
                      unoptimized
                      className="lg:h-[180px] lg:w-[350px] md:w-[320px] md:h-[135px] h-[120px] w-[300px] object-cover rounded-xl shadow-2xl border border-black"
                    />
                    </Link>
                    <div className="absolute lg:bottom-1 -bottom-8 md:-bottom-6 left-3 lg:left-5 w-14 h-14">
                      <Image
                        src={item.universityImages.logo}
                        alt={`${item.university_name} Logo`}
                        width={56}
                        height={56}
                        className="object-cover lg:w-[56px] lg:h-[56px] h-[35px] w-[35px]  rounded-full bg-white border border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="md:px-4 my-2 flex flex-col justify-between">
                     <Link
                                           href={`/Universities/${item._id}`}

            // href={`/Universities?country=${countryName}`}
            target="_blank"
            className="cursor-pointer"
          >
                    <p className="text-gray-900 text-left text-[10px] leading-3 md:text-[12px] lg:text-[16px] p-1 md:p-0 hover:underline underline-offset-2">
                      {item.university_name}
                    </p>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href={`/Universities?country=${countryName}`}
            // target="_blank"
            className="cursor-pointer"
          >
            <Button className="bg-red-700 mt-3">
              Explore All Universities
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};
export default WhyStudy;
