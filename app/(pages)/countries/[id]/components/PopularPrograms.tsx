import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
interface PopularProgramsProps {
  country: string[];
}

const data = [
  { icon: '/countrypage/health.svg', title: 'Health & Wellbeing', cost: '£26', color: 'bg-teal-500' },
  { icon: '/countrypage/groceries.svg', title: 'Groceries', cost: '£100-£200', color: 'bg-green-500' },
  { icon: '/countrypage/rent.svg', title: 'Rent', cost: '£439-£700', color: 'bg-yellow-500' },
  { icon: '/countrypage/eatingOut.svg', title: 'Eating Out', cost: '£66-£80', color: 'bg-blue-500' },
  { icon: '/countrypage/transport.svg', title: 'Transport', cost: '£30-£69', color: 'bg-purple-500' },
  { icon: '/countrypage/householdbills.svg', title: 'Household Bills', cost: '£40-£79', color: 'bg-red-500' },
];

const PopularPrograms: React.FC<PopularProgramsProps> = ({ country }) => {
  const arr1 = [
    {
      icon: "/Suitcasesvg.svg",
      caption: "Business & Management",
    },
    {
      icon: "/Notebooksvg.svg",
      caption: `${country?.[0]}`,
    },
    {
      icon: "/Laptopsvg.svg",
      caption: `${country?.[1]}`,
    },
    {
      icon: "/solarbroken.svg",
      caption: `${country?.[2]}`,
    },
    {
      icon: "/Heartsvg.svg",
      caption: `${country?.[3]}`,
    },
    {
      icon: "/Atomsvg.svg",
      caption: `${country?.[4]}`,
    },
  ];

  return (
    <>
      <section
        className="relative  flex flex-col lg:flex-row justify-between items-center mx-auto text-white bg-[#FCE7D2] bg-cover bg-center mb-8 md:mt-16 md:px-[20px] md:py-[39px]"
        style={{
          height: "auto",
          minHeight: "md:200.81px",
          backgroundImage: "url('/bg-usa.png')",
          // padding: "39px 20px",
          imageRendering: "crisp-edges",
        }}
      >
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-60 z-0"></div>

        {/* <div className="relative flex flex-col lg:flex-row z-10 w-full items-center"> */}
        <div className="lg:flex z-10 w-full py-5">
          <div className="lg:w-2/5 flex items-center justify-center text-center lg:text-left text-gray-600 2xl:justify-center md:mb-6 mb-2 lg:mb-0">
            <h4 className="md:w-full text-gray-900 leading-10">
              Popular Programs to Study in United Kingdom!
            </h4>
          </div>
          <div
            className="flex lg:w-3/5 md:grid md:grid-cols-6  justify-center gap-0 overflow-x-auto md:overflow-x-hidden scrollbar-hide "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {arr1.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc(100%/4)] sm:w-full flex flex-col gap-2 xl:gap-4 items-center text-black"
              >
                <div className="flex items-center justify-center w-14 h-12 md:w-16 md:h-16 xl:h-26 xl:w-30  sm:w-20 sm:h-20 bg-white rounded-lg">
                  <Image
                    src={item.icon}
                    alt={item.caption}
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-center w-16 sm:w-20 text-[12px] sm:text-[14px] 2xl:text-[24px]">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex justify-center my-6 md:my-12 text-center">
        <div className="text-center">
          <h4>Cost of Living in United Kingdom!</h4>
          <div
            className="flex md:grid md:grid-cols-6 justify-center md:gap-4 overflow-x-auto md:overflow-x-hidden scrollbar-hide py-2 md:py-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {data.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-[calc(100%/4)] sm:w-full flex flex-col gap-2  items-center text-black"
>
                <div
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={110}
                    height={110}
                    className="w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28"
                  />

                </div>
                <div className="md:w-2/3">
                <p className="font-semibold md:mt-2">{item.title}</p>
                </div>
                <p className="text-gray-600">{item.cost}</p>
              </div>
            ))}
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
          <div className="relative w-full md:w-1/2">
            <h4 className="md:w-full text-gray-900 leading-6 text-center lg:text-left">
              Create your application for your desired program!{" "}
            </h4>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center items-center md:justify-end ">
            <div className="w-1/2">
              <Link href="/scholarships">
                <Button className="bg-red-700 w-full 2xl:w-100 2xl:h-35 2xl:py-10 2xl:text-[30px]">
                  Apply Now{" "}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularPrograms;
