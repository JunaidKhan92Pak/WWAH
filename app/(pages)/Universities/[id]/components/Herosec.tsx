import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";

interface UniversityData {
  establishment_year?: string;
  national_students?: string;
  international_students?: string;
  acceptance_rate?: string;
  distance_from_city?: string;
  qs_world_university_ranking?: string;
  times_higher_education_ranking?: string;
  universityImages?: {
    banner?: string;
    logo?: string;
  };
  university_name?: string;
  location?: string;
  virtual_tour?: string;
}

const Herosec = ({ data }: { data: UniversityData }) => {
  // Memoize the derived array
  const universityDetails = useMemo(
    () => [
      {
        Image: "/university/shop.svg",
        Heading: "Establishment Year",
        Name: `${data.establishment_year}`,
      },
      {
        Image: "/university/bagpack.svg",
        Heading: "National Students",
        Name: `${data.national_students}`,
      },
      {
        Image: "/university/Earth.svg",
        Heading: "International Students",
        Name: `${data.international_students}`,
      },
      {
        Image: "/university/Chat.svg",
        Heading: "Acceptance Rate",
        Name: `${data.acceptance_rate}`,
      },
      {
        Image: "/university/Map.svg",
        Heading: "Distance From City",
        Name: `${data.distance_from_city}`,
      },
      {
        Image: "/university/Ranking.svg",
        Heading: "QS World University Ranking",
        Name: `${data.qs_world_university_ranking}`,
      },
      {
        Image: "/university/graph.svg",
        Heading: "Times Higher Education Ranking",
        Name: `${data.times_higher_education_ranking}`,
      },
    ],
    [data] // Dependencies: Only re-calculate if `data` changes
  );

  return (
    <>
      <section className="mx-auto w-[90%] md:w-[95%]">
        <div>
          <div
            // className="relative md:h-[80vh] h-[95%] flex justify-center items-center text-center rounded-2xl text-white sm:bg-cover sm:bg-center"
            className="relative min-h-[250px] sm:min-h-[400px] w-full overflow-hidden flex justify-center items-center text-center rounded-2xl text-white bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                data?.universityImages?.banner
                  ? data.universityImages.banner
                  : "/banner.jpg"
              })`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-100"></div>
            <div className="w-[90%] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-2 items-center justify-evenly lg:justify-items-center py-4 sm:py-12  relative z-10 w-[90%] xl:w-full mx-auto">
                <div className="space-y-2 text-left">
                  <Image
                    src={data?.universityImages?.logo || "/default-logo.png"}
                    alt="University Logo"
                    width={80}
                    height={80}
                    className="object-cover rounded-full w-10 md:w-16 h-10 md:h-16"
                  />
                  <h3 className="text-white text-start font-bold">
                    {data.university_name}
                  </h3>

                  <div className="bg-white bg-opacity-10 rounded-lg text-white inline-block text-left px-2 md:py-2">
                    <div className="flex items-center gap-1 py-1">
                      {" "}
                      <CiLocationOn className="h-4  w-4 sm:h-5  sm:w-5 lg:h-5 lg:w-8" />
                      <p className="">{data.location}</p>
                    </div>
                  </div>

                  {data.virtual_tour &&
                    data.virtual_tour !== "NA" &&
                    data.virtual_tour.trim() !== "" && (
                      <Link
                        target="_blank"
                        href={data.virtual_tour}
                        rel="noopener noreferrer"
                      >
                        <div className="px-4 py-1 mt-1 md:my-4 w-4/5 bg-[#F9CEA5] rounded-lg flex items-center gap-3">
                          <Image
                            src="/university/camera.svg"
                            alt="Virtual Tour Icon"
                            width={20}
                            height={20}
                          />
                          <p className="text-[#313131] text-left leading-5 md:leading-6">
                            Get a virtual tour of {data.university_name}
                          </p>
                        </div>
                      </Link>
                    )}
                </div>

                {/* Right Section */}
                <div
                  className="w-full md:w-4/5  lg:w-[60%]  2xl:w-[60%] bg-white bg-opacity-30 backdrop-blur-sm rounded-3xl 
py-4 md:py-8 2xl:py-6 flex flex-col justify-center items-center text-center mt-2 sm:mt-0"
                >
                  <Link
                    target="blank"
                    href="/schedulesession"
                    className="[text-align:-webkit-center]"
                  >
                    <p className="text-white w-4/5 hover:underline">
                      Book Your Online Video Counselling Session with WWAH
                      Advisor!
                    </p>
                  </Link>
                  <div className="flex items-center w-[50%] my-2">
                    <div className="flex-1 border-t border-gray-100"></div>
                    <p className="mx-4 text-white">Or</p>
                    <div className="flex-1 border-t border-gray-100"></div>
                  </div>
                  {/* <Link target="blank" href="/contactus"> */}
                  <Link target="blank" href="/coursearchive">
                    <Button className="w-full px-[12vw] md:px-[5vw] md:py-3 2xl:py-5 bg-white bg-opacity-20 backdrop-blur-md  text-white rounded-lg hover:bg-gray-300 transition duration-300 ">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="relative  mt-0 lg:-mt-10 md:mt-4 flex  justify-center">
          <div
            className="lg:grid flex overflow-x-scroll lg:grid-cols-7 gap-2 sm:gap-2 md:gap-4 bg-white text-black py-4 px-4 rounded-2xl shadow-lg mx-auto w-full lg:w-[80%]"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {universityDetails.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc(100%/3)] sm:w-auto flex flex-col items-center text-center space-y-2"
              >
                <div className="rounded-3xl flex items-center justify-center">
                  <div className="relative h-12 w-12 sm:h-16 sm:w-16">
                    <Image
                      src={item.Image}
                      alt={item.Heading}
                      layout="fill"
                      objectFit="contain"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="flex flex-col h-full justify-around">
                  <p className="text-[12px] font-semibold leading-4">
                    {item.Heading}
                  </p>
                  <p className="text-[12px] text-black  lg:text-center ">
                    {item.Name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default Herosec;
