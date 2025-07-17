"use client";
import { useRef } from "react";
import Image from "next/image";
import Banner from "@/components/ui/enrollment/Banner";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
interface PopularProgramsProps {
  country: string[];
  countryName: string;
  costOfLiving: CostOfLiving;
}
interface CostOfLiving {
  rent: string;
  groceries: string;
  transportation: string;
  eating_out: string;
  household_bills: string;
  miscellaneous: string;
  healthcare: string;
  health: { name: string; description: string[] }[];
}

const PopularPrograms: React.FC<PopularProgramsProps> = ({
  country,
  countryName,
  costOfLiving,
}) => {
  const arr1 = [
    {
      icon: "/countrypage/Suitcasesvg.svg",
      caption: "Business & Management",
    },
    {
      icon: "/countrypage/Notebooksvg.svg",
      caption: `${country?.[0]}`,
    },
    {
      icon: "/countrypage/Laptop.svg",
      caption: `${country?.[1]}`,
    },
    {
      icon: "/degree-icon.svg",
      caption: `${country?.[2]}`,
    },
    {
      icon: "/countrypage/Medical.svg",
      caption: `${country?.[3]}`,
    },
    {
      icon: "/countrypage/social.svg",
      caption: `${country?.[4]}`,
    },
  ];
  const data = [
    {
      icon: "/countrypage/health.svg",
      title: "Health & Wellbeing",
      cost: `${costOfLiving.healthcare}`,
      color: "bg-teal-500",
    },
    {
      icon: "/countrypage/groceries.svg",
      title: "Groceries",
      cost: `${costOfLiving.groceries}`,
      color: "bg-green-500",
    },
    {
      icon: "/countrypage/rent.svg",
      title: "Rent",
      cost: `${costOfLiving.rent}`,
      color: "bg-yellow-500",
    },
    {
      icon: "/countrypage/eatingOut.svg",
      title: "Eating Out",
      cost: `${costOfLiving.eating_out}`,
      color: "bg-blue-500",
    },
    {
      icon: "/countrypage/transport.svg",
      title: "Transport",
      cost: `${costOfLiving.transportation}`,
      color: "bg-purple-500",
    },
    {
      icon: "/countrypage/householdbills.svg",
      title: "Household Bills",
      cost: `${costOfLiving.household_bills}`,
      color: "bg-red-500",
    },
  ];
  // Inside your component:
  const scrollRef = useRef<HTMLDivElement>(null);
  console.log("PopularPrograms rendered with countryName:", costOfLiving);

  // const scroll = (direction: "left" | "right") => {
  //   if (scrollRef.current) {
  //     const scrollAmount = direction === "left" ? -200 : 200;
  //     scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  //   }
  // };
  return (
    <>
      <section
        className="relative flex flex-col lg:flex-row justify-between items-center mx-auto text-white bg-[#FCE7D2] bg-cover bg-center mb-8 mt-4  md:mt-8 md:px-[20px] md:py-[39px]"
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
            <h5 className="md:w-4/5 text-gray-900 font-bold md:leading-10 text-lg sm:text-xl md:text-2xl">
              Popular Programs to Study in {countryName}
            </h5>
          </div>

          <div className="relative lg:w-3/5">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide space-x-2 md:space-x-3 py-2 pl-8 md:pl-10 md:mx-0 scroll-smooth"
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
                  <div className="flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-white rounded-lg shadow-md">
                    <Image
                      src={item.icon}
                      alt={item.caption}
                      width={40}
                      height={40}
                      className="w-8 h-8"
                    />
                  </div>
                  <p className="text-center w-24 sm:w-28 text-[12px] sm:text-[14px] md:text-[15px] font-medium mt-2">
                    {item.caption}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Scroll Button */}
            {/* <button
    onClick={() => scroll("right")}
    className="absolute right-4 top-11 transform -translate-y-1/2 z-10 p-1 bg-gray-300 shadow rounded-full md:hidden"
  >
    <FaArrowRight className="text-black" />
  </button> */}
          </div>
        </div>
      </section>

      <div className="text-center">
        <h4 className="px-2 md:px-0">Cost of Living in {countryName}!</h4>
        <div className="relative flex justify-start md:justify-center overflow-hidden">
          <div
            className="flex overflow-x-auto pt-4 gap-2 md:gap-5"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="relative pl-3 md:pl-0 flex flex-col items-center"
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={110}
                  height={110}
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                />
                <p className="text-center w-24 sm:w-28 text-[12px] sm:text-[14px] md:text-[15px] font-semibold mt-2">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600">{item.cost}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Banner
        title="Create your Application today for your desired program!"
        buttonText="Apply Now!"
        buttonLink={`/coursearchive?country=${
          countryName === "United States of America"
            ? "USA"
            : encodeURIComponent(countryName)
        }`}
        backgroundImage="/bg-usa.png"
      />

      {/* <Banner
  title="Create your Application today for your desired program!"
  buttonText="Apply Now!"
  buttonLink={`/coursearchive?country=${encodeURIComponent(countryName)}`}
  backgroundImage="/bg-usa.png"
/> */}

    </>
  );
};

export default PopularPrograms;
