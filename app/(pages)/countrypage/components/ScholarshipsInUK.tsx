import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const healthcareItems = [
  { text: "Public Health", image: "/countrypage/img3.svg" },
  { text: "Healthcare Promotion", image: "/countrypage/img2.svg" },
  { text: "Healthcare Information", image: "/countrypage/img5.png" },
  { text: "Healthcare Management", image: "/countrypage/img4.svg" },
  { text: "Healthcare Policy", image: "/countrypage/img1.svg" },
]

export const ScholarshipsInUK = () => {



  return (
    <>
      <section>
        <div
          className="relative bg-cover mt-5 md:mt-10 bg-center min-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
          style={{
            backgroundImage: "url('/ScolarshipsInUK.png')",
          }}
        >
          <div className=" absolute inset-0 bg-black opacity-60 z-0"></div>
          <div className="flex flex-col lg:flex-row w-full gap-5 m-4 justify-center items-start md:items-center">
            <div className="relative w-full md:w-3/4 xl:w-1/2 md:space-y-5  text-white">
              <h3 className="md:mt-2 pt-4">Scholarships in United Kingdom!</h3>
              <p>
                Discover a range of scholarship opportunities on our dedicated
                scholarship page. Whether you&#39;re a prospective student or
                already enrolled, there are options available to help support
                your education. Explore various scholarships based on merit,
                need, or specific fields of study.
              </p>
            </div>
            

            <div className="hidden md:flex relative justify-center items-center w-full xl:w-1/2 text-white">

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
                  <div className="md:absolute md:inset-0 md:top-4 flex items-center justify-center">
                    <p className="w-[90px] text-center  text-white md:text-black font-semibold"> BSC Physiology</p>
                  </div>
                </div>


              </div>

              {/* Right Section with Reduced Border Height */}
              <div className="relative w-full pl-2 flex flex-col justify-center items-start h-[20vh]">
                <div className="flex h-[50%] items-center ">
                  <p>Healthcare Management</p>
                </div>
                <p className="flex h-[50%] items-center  pl-5 pt-4">Healthcare Policy</p>
              </div>
            </div>

            <div className="relative flex flex-col md:hidden space-y-4">
              <h2 className="text-white">BSC Physicology</h2>
              {healthcareItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 text-white ">
                  <Image src={item.image} alt={item.text} width={50} height={50} />
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        className="relative mt-10 text-white bg-[#FCE7D2]"
        style={{
          backgroundImage: "url('/bg-usa.png')",

          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-70 z-0"></div>
        <div className="flex flex-col md:flex-row w-full py-9 md:px-12 lg:gap-10 sm:gap-0 gap-5">
          <div className="relative w-full lg:w-1/2">
            <h4 className="md:w-full text-gray-900 leading-6 text-center lg:text-left">
              Discover Scholarship Opportunities on our Scholarships Page!
            </h4>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center items-center md:justify-end ">
            <Link href="/scholarships">
              <Button className="bg-red-700 2xl:w-100 2xl:h-35 2xl:py-10 2xl:text-[30px]">
                Explore Scholarship Options
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
