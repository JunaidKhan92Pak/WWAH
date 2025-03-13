import Image from "next/image";
import React from "react";
// import StudyInUk from "/StudyInUK.png";
// import StudyInUk from "./StudyInUk";

import Banner from "@/components/ui/enrollment/Banner";
interface ScholarshipsInUKProps {
  countryName: string;
  scholarships: string[];
}
export const ScholarshipsInUK: React.FC<ScholarshipsInUKProps> = ({
  countryName,
  // scholarships,
}) => {
  const healthcareItems = [
    { text: "Public Health", image: "/countrypage/img3.svg" },
    { text: "Healthcare Promotion", image: "/countrypage/img2.svg" },
    { text: "Healthcare Information", image: "/countrypage/img5.png" },
    { text: "Healthcare Management", image: "/countrypage/img4.svg" },
    { text: "Healthcare Policy", image: "/countrypage/img1.svg" },
  ];
  return (
    <>
      <section>
        <div
          className="relative bg-cover mt-5 lg:mt-10 bg-center min-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6"
          style={{
            backgroundImage: "url('/ScolarshipsInUK.png')",
          }}
        >
          <div className=" absolute inset-0 bg-black opacity-60 z-0"></div>
          <div className="flex flex-col lg:flex-row w-full justify-between items-start md:items-center">
            <div className=" relative w-full md:w-[75%] lg:w-[50%] space-y-5 lg:p-3 text-white">
              <h3 className="lg:mt-2 pt-4">Scholarships in {countryName}!</h3>
              <p className="text-[#9D9D9D]">
                Discover a range of scholarship opportunities on our dedicated
                scholarship page. Whether you&#39;re a prospective student or
                already enrolled, there are options available to help support
                your education. Explore various scholarships based on merit,
                need, or specific fields of study.
              </p>
            </div>

            <div className="hidden md:flex relative justify-center items-center w-full xl:w-[70%] text-white">
              <div className="relative w-full pr-2 flex flex-col justify-center items-end h-[20vh]">
                <div className="flex h-[50%] items-center justify-end">
                  <p>Healthcare Promotion</p>
                </div>
                <div className="flex h-[50%] items-center pr-5 justify-end pt-4">
                  <p>Healthcare Information</p>
                </div>
              </div>
              {/* Center Section */}
              <div className="w-full flex flex-col justify-start">
                <div className="flex justify-center text-center m-2">
                  <p>Public Health</p>
                </div>
                <div className="relative ">
                  <Image
                    src="/countrypage/studyinuk.svg"
                    alt="BSC Physiology"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 top-3 xl:top-4 flex justify-center items-center w-full h-full">
                    <div className="flex justify-center items-center  text-center w-[15%]">
                      <p className="text-center  text-white md:text-black font-semibold ">
                        {" "}
                        Scholarships
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Section with Reduced Border Height */}
              <div className="relative w-full pl-2 flex flex-col justify-center items-start h-[20vh]">
                <div className="flex h-[50%] items-center ">
                  <p>Healthcare Management</p>
                </div>
                <p className="flex h-[50%] items-center  pl-5 pt-4">
                  Healthcare Policy
                </p>
              </div>
            </div>
            <div className="relative flex flex-col md:hidden space-y-4 my-4">
              <h5 className="text-white"> Scholarships in {countryName}</h5>
              {healthcareItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 text-white "
                >
                  <Image
                    src={item.image}
                    alt={item.text}
                    width={30}
                    height={30}
                  />
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Banner
        title="Discover Scholarship Opportunities on our Scholarships Page!"
        buttonText="Explore Scholarship Options"
        buttonLink="/scholarships"
        backgroundImage="/bg-usa.png"
      />
    </>
  );
};
