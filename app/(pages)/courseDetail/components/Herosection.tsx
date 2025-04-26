"use client";

// import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const Herosection = () => {
  const arr1 = [
    {
      Image: "/CourseDetailPage/Notebook.svg",
      Heading: "Course Level",
      Name: "Undergraduate Programs",
    },
    {
      Image: "/CourseDetailPage/iletsbook.svg",
      Heading: "Intake",
      Name: "Year 2024",
    },
    {
      Image: "/CourseDetailPage/Clock-Circle.svg",
      Heading: "Duration",
      Name: "3 Years",
    },
    {
      Image: "/CourseDetailPage/Calendar-Mark.svg",
      Heading: "Start Date",
      Name: "September, 2024",
    },
    {
      Image: "/CourseDetailPage/Posts-Carousel-Horizontal.svg",
      Heading: "Formate",
      Name: "On Campus",
    },
    {
      Image: "/CourseDetailPage/Money-Bag.svg",
      Heading: "Annual Fee",
      Name: "$28,000 (USD)",
    },
    {
      Image: "/CourseDetailPage/Wallet.svg",
      Heading: "Initial Deposit",
      Name: "$14,000 (USD)",
    },
  ];
  return (
    <div>
      {/* Hero section */}
      <section className="mt-4 ">
        <div className="w-full mx-auto ">
          {/* Hero Section */}
          <div
            className="relative w-[90%] mx-auto rounded-3xl bg-no-repeat bg-cover bg-center overflow-hidden py-2 px-2 sm:px-0 min-h-[250px] sm:min-h-[400px] flex items-center justify-center"
            style={{ backgroundImage: "url('/dcu-hero-img.png')" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center justify-items-center sm:px-6 md:py-12 py-2 relative z-10">
              {/* Left Section */}
              <div className="w-[90%] flex flex-col items-center md:items-start md:justify-center text-center md:text-left space-y-2 pl-0 lg:pl-12">
                {/* <Image
                  src="/CourseDetailPage/dcu.svg"
                  alt="Dcu Logo"
                  width={130}
                  height={130}
                  className="object-contain w-[100px] h-[100px] md:w-[130px] md:h-[130px]"
                /> */}
                <h1 className="text-white">BSc PSYCHOLOGY</h1>
                <p className="text-white">Dublin City University</p>
                <div className="w-full sm:w-[60%] lg:w-[42%] p-3 bg-white bg-opacity-10 rounded-lg flex items-center justify-center text-white">
                  <Image
                    src="/CourseDetailPage/map-point.svg"
                    alt="Location Icon"
                    width={24}
                    height={24}
                  />
                  <p className="ml-2 text-base">Dubai, Ireland</p>
                </div>
              </div>
             
              <div className="w-[90%] md:w-full lg:w-[60%] bg-white bg-opacity-30 backdrop-blur-sm  rounded-3xl py-2  md:p-4 2xl:p-12 flex flex-col items-center text-center">
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
                <Link target="blank" href="/dashboard">
                  <Button className="w-full px-14 py-3 2xl:py-5 bg-white bg-opacity-20 backdrop-blur-md  text-white rounded-lg hover:bg-gray-300 transition duration-300 ">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
       
        <div className="relative mt-2 lg:-mt-10 flex justify-center">
          <div
            className="flex overflow-x-auto lg:overflow-visible whitespace-nowrap lg:whitespace-normal bg-white text-black py-3 md:py-8 md:px-4  rounded-2xl shadow-lg mx-auto w-[90%] lg:w-[70%] lg:grid lg:grid-cols-7"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {arr1.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center md:space-y-2 min-w-[100px] lg:min-w-0"
              >
                <Image
                  src={item.Image}
                  alt={item.Heading}
                  width={40}
                  height={40}
                  className="w-16 h-16"
                />
                <p className="font-semibold text-sm">{item.Heading}</p>
                <p className="text-xs text-wrap">{item.Name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Herosection;
