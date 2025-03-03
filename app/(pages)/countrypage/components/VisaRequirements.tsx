import React from "react";
import { Button } from "@/components/ui/button";
// import mark from "/mark.svg";
// import info from "../../../../public/info.png";
// import test from "../../../../public/test.png";
// import unig from "../../../../public/unig.png";
// import funds from "../../../../public/funds.png";
// import language from "../../../../public/language.png";
// import health from "../../../../public/health.png";
import Link from "next/link";
import Image from "next/image";
export const VisaRequirements = ({ visaRequirements ,countryName}) => {
  interface requiremtProps {
    id: number;
    // src: StaticImageData;
    src: string;
    content: string;
  }
  const visarequirement = visaRequirements?.map((r) => (r))
  console.log(visarequirement);
  const requirements: requiremtProps[] = [
    {
      id: 1,
      src: "/mark.svg",
      content: "Valid Passport or Travel Document",
    },
    {
      id: 2,
      src: "/language.svg",
      content: "English Language Proficiency",
    },
    {
      id: 3,
      src: "/unig.svg",
      content: "Acceptance by a Recognized Institution",
    },
    {
      id: 4,
      src: "/funds.svg",
      content: "Proof of Funds",
    },
    {
      id: 5,
      src: "/test.svg",
      content: "Immigration Health Surcharge (IHS)",
    },
    {
      id: 6,
      src: "/tube.svg",
      content: "Tuberculosis Test",
    },
    {
      id: 7,
      src: "info.svg",
      content: " Biometric Information",
    },
  ];
  return (
    <>
      <section className="w-[90%] mx-auto 2xl:my-20">
        <div className=" flex md:flex-row flex-col  w-full  p-4 gap-4 md:gap-2">
          {/* Left Section */}
          <div className="w-[100%] md:w-[50%]  h-[400px] 2xl:h-[500px] flex flex-col ">
            <div className="w-[100%] h-[10%] 2xl:h-[15%] ">
              <h4 className="text-[#313131] md:text-left text-center 2xl:text-center font-bold w-full">
                Visa Requirements!
              </h4>
            </div>
            <ol className=" h-[90%] grid grid-cols-1  md:grid-cols-2 gap-2">
              {requirements?.map((requirement, indx) => (
                <li key={indx} className=" flex items-center  ">
                  <div className="flex items-center space-x-3 ">
                    <Image
                      src={requirement.src}
                      alt={requirement.content}
                      className="rounded-lg  w-10 h-10"
                      width={10}
                      height={10}
                    />
                    <p>{visarequirement ? visarequirement[indx] : <></>}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right Section */}
          <div className="w-[100%] md:w-[50%] md:h-[400px] h-[200px]  ">
            <div
              className=" relative   text-white rounded-3xl bg-cover flex overflow-hidden shadow-lg"
              style={{
                backgroundImage: "url('/studyuk.png')",
                height: "100%",
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90 h-[100%]"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end items-center text-center text-white pb-8 px-4">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {/* Heading */}
                  <p className="font-semibold">
                    LEARN MORE ABOUT STEP-BY-STEP GUIDE TO
                    <br />
                    {countryName} VISA APPLICATION PROCESS
                  </p>

                  {/* Button */}
                  <div className="w-full flex items-center justify-center">
                    <Link href="/visaguide">
                      <Button className="bg-red-700 2xl:w-60 2xl:h-35 2xl:py-10 2xl:text-[30px]">
                        Find out More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section>
      <div
        className="relative my-5 text-white bg-[#FCE7D2]"
        style={{
          backgroundImage: "url('/bg-usa.png')",

          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-70 z-0"></div>
        <div className="flex flex-col md:w-[90%] mx-auto md:flex-row w-full py-9 md:px-12 lg:gap-10 gap-10 sm:gap-0 ">
          <div className="relative w-full md:w-1/2">
            <h4 className="text-[#313131] md:text-left text-center font-bold ">
              Need help finding the perfect place to live abroad? Ask the WWAH
              Advisor now!
            </h4>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center items-center md:justify-end ">
            <Button className="bg-red-700">Consult with WWAH Advisor</Button>
          </div>
        </div>
      </div>
      </section> */}
    </>
  );
};
