import Image from "next/image";
import React from "react";
// import StudyInUk from "/StudyInUK.png";
import StudyInUk from "../../../../public/StudyInUK.png";
// import StudyInUk from "./StudyInUk";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
          <div className="flex flex-col md:flex-row w-[90%] justify-between items-center">
            <div className=" relative w-full md:w-1/2  md:space-y-5 md:p-3 text-white">
              <h3 className="md:mt-2 pt-4">Scholarships in United Kingdom!</h3>
              <p className="text-[#9D9D9D]">
                Discover a range of scholarship opportunities on our dedicated
                scholarship page. Whether you&#39;re a prospective student or
                already enrolled, there are options available to help support
                your education. Explore various scholarships based on merit,
                need, or specific fields of study.
              </p>
            </div>
            <div className="flex relative w-full md:w-1/2 justify-center items-center">
              <Image
                src={StudyInUk}
                alt="popularPrograms"
                className="w-[90%]"
              />
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
