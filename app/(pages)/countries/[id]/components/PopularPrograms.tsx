import React from "react";
import Image from "next/image";
import Banner from "@/components/ui/enrollment/Banner";
interface PopularProgramsProps {
  country: string[];
  countryName: string;
}

const data = [
  {
    icon: "/countrypage/health.svg",
    title: "Health & Wellbeing",
    cost: "£26",
    color: "bg-teal-500",
  },
  {
    icon: "/countrypage/groceries.svg",
    title: "Groceries",
    cost: "£100-£200",
    color: "bg-green-500",
  },
  {
    icon: "/countrypage/rent.svg",
    title: "Rent",
    cost: "£439-£700",
    color: "bg-yellow-500",
  },
  {
    icon: "/countrypage/eatingOut.svg",
    title: "Eating Out",
    cost: "£66-£80",
    color: "bg-blue-500",
  },
  {
    icon: "/countrypage/transport.svg",
    title: "Transport",
    cost: "£30-£69",
    color: "bg-purple-500",
  },
  {
    icon: "/countrypage/householdbills.svg",
    title: "Household Bills",
    cost: "£40-£79",
    color: "bg-red-500",
  },
];

const PopularPrograms: React.FC<PopularProgramsProps> = ({
  country,
  countryName,
}) => {
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

      icon: "/Atomsvg.svg",
      caption: `${country?.[1]}`,
    },
    {
      icon: "/Laptopsvg.svg",
      caption: `${country?.[2]}`,
    },
    {
      icon: "/solarbroken.svg",
      caption: `${country?.[3]}`,
    },
    {
      icon: "/Heartsvg.svg",
      caption: `${country?.[4]}`,
    },
  ];

  return (
    <>
      <section
        className="relative flex flex-col lg:flex-row justify-between items-center mx-auto text-white bg-[#FCE7D2] bg-cover bg-center mb-8 md:mt-16 md:px-[20px] md:py-[39px]"
        style={{
          height: "auto",
          backgroundImage: "url('/bg-usa.png')",
          imageRendering: "crisp-edges",
        }}
      >
        <div className="absolute inset-0 bg-[#FCE7D2] opacity-60 z-0"></div>

        <div className="lg:flex z-10 w-full py-2 sm:py-0">
          {/* Title Section */}
          <div className="lg:w-2/5 flex items-center justify-center text-center lg:text-left text-gray-600  md:mb-6 mb-2 lg:mb-0">
            <h5 className="md:w-4/5 text-gray-900 font-bold leading-10 text-lg sm:text-xl md:text-2xl">
              Popular Programs to Study in {countryName}
            </h5>
          </div>

          {/* Icon Section with Horizontal Scrollbar */}
          <div
            className="flex lg:w-3/5 overflow-x-auto scrollbar-hide space-x-3 px-2 py-2 mx-2 md:mx-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {arr1.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-black"
              >
                <div className="flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20  bg-white rounded-lg shadow-md">
                  <Image
                    src={item.icon}
                    alt={item.caption}
                    width={40}
                    height={40}
                    className="w-8 h-8 md:w-10 md:h-10 "
                  />
                </div>
                <p className="text-center w-24 sm:w-28 text-[12px] sm:text-[14px] md:text-[15px] font-medium mt-2">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex justify-center my-6 md:my-8 text-center">
        <div className="text-center">
          <h4>Cost of Living in {countryName}!</h4>
          <div
            className="flex md:grid md:grid-cols-6 justify-center md:gap-4 overflow-x-auto md:overflow-x-hidden scrollbar-hide py-2 md:py-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc(100%/4)] sm:w-full flex flex-col gap-2  items-center text-black"
              >
                <div>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={110}
                    height={110}
                    className="w-14 h-14 md:w-18 md:h-18 lg:w-28 lg:h-28"
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
      <Banner
        title="Create your Application today for your desired program!"
        buttonText="Apply Now!"
        buttonLink="/coursearchive"
        backgroundImage="/bg-usa.png"
      />
    </>
  );
};

export default PopularPrograms;
