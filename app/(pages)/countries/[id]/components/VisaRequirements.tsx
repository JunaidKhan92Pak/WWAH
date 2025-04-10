import React from "react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
interface VisaRequirementsProps {
  visaRequirements: string[];
  countryName: string;
  country: { short_name: string };
}

export const VisaRequirements: React.FC<VisaRequirementsProps> = ({
  visaRequirements,
  countryName,
  country,
}) => {
  interface requiremtProps {
    id: number;
    // src: StaticImageData;
    src: string;
    content: string;
  }
  const visarequirement = visaRequirements?.map((r) => r);
  // console.log(visarequirement);
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
      src: "/info.svg",
      content: " Biometric Information",
    },
  ];
  return (
    <>
      <section className="w-[90%] mx-auto my-5 ">
        <div className=" flex md:flex-row flex-col  w-full  p-4 gap-4 md:gap-2">
          {/* Left Section */}
          <div className="w-[100%] md:w-[50%]   flex flex-col ">
            <h4 className="text-[#313131] pb-2  md:text-left text-center font-bold w-full">
              Visa Requirements!
            </h4>

            <ol className="  grid grid-cols-1  md:grid-cols-2 gap-2 md:gap-6">
              {requirements?.map((requirement, indx) => (
                <li key={indx} className=" flex items-center  ">
                  <div className="flex items-center space-x-3 ">
                    <Image
                      src={requirement.src}
                      // src={`/countryarchive/${country.short_name}_visa.png`}
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
                backgroundImage: `url('/countryarchive/${country.short_name}_visa.png')`,
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
                      <Button className="bg-red-700  hover:bg-red-80">
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
    </>
  );
};
