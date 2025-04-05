import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface HeroProps {
  name: string;
  country: string;
  type: string;
  deadline: string;
  university: string;
}

const Hero: React.FC<HeroProps> = ({
  name,
  country,
  type,
  deadline,
  university,
}) => {
  const scholarshipArr = [
    {
      Image: "/scholarshipdetail/country.svg",
      Heading: "Host Country",
      Name: `${country}`,
    },
    {
      Image: "/scholarshipdetail/university.svg",
      Heading: "Host University",
      Name: `${university}`,
    },
    {
      Image: "/scholarshipdetail/scholarship.svg",
      Heading: "Scholarship Type",
      Name: `${type}`,
    },
    {
      Image: "/scholarshipdetail/deadline.svg",
      Heading: "Deadline",
      Name: `${deadline}`,
    },
  ];
  return (
    <>
      <section className="mx-auto w-[90%] md:w-[95%] md:mt-4">
        {/* Hero Section */}
        <div
          className="relative md:h-[80vh] h-[270px] flex justify-center items-center text-center rounded-3xl text-white bg-cover bg-center"
          style={{
            backgroundImage: "url('/scholarshipdetail/scholarshipdetail.png')",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-2 justify-items-center px-4 sm:px-6 py-4 md:py-8 sm:py-12  relative z-10 w-full">
            {/* Left Section */}
            <div className="w-[90%] flex flex-col justify-center items-center text-center md:text-left">
              <h2 className="text-white md:leading-10 lg:leading-12">{name}</h2>
            </div>

            {/* Right Section */}
            <div className="w-[95%]  md:w-[90%] lg:w-[50%] xl:w-[50%] 2xl:w-[60%] bg-white bg-opacity-30 backdrop-blur-sm  rounded-3xl p-4 2xl:p-12 flex flex-col items-center text-center">
              <p className="text-white w-full">
                Book Your Online Video Counselling Session with WWAH Advisor!
              </p>
              <div className="flex items-center w-[50%] my-2">
                <div className="flex-1 border-t border-gray-100"></div>
                <p className="mx-4 text-white">Or</p>
                <div className="flex-1 border-t border-gray-100"></div>
              </div>
              <Link href="/dashboard">
                <Button className="w-full px-14 py-3 2xl:py-5 bg-white bg-opacity-20 backdrop-blur-md  text-white rounded-lg hover:bg-gray-300 transition duration-300 ">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <section className="relative mt-4 md:my-6 z-10">
          <div
            className="flex md:grid md:grid-cols-4 items-center justify-items-center 
      bg-white shadow-lg rounded-2xl mx-auto w-[90%] md:w-[66%] px-1 md:px-3 2xl:max-w-[2200px] 
      py-2 md:py-2 2xl:p-8 2xl:gap-5 sm:relative lg:absolute lg:-top-20 lg:left-1/2 lg:transform lg:-translate-x-1/2"
          >
            {scholarshipArr.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center lg:justify-between p-1 w-full h-28 sm:h-36 md:h-32 2xl:h-[200px] bg-white py-1 rounded-lg text-center"
              >
                {/* Icon Wrapper */}
                <div className="bg-[#FEE7D1] flex items-center justify-center rounded-lg">
                  <Image
                    src={item.Image}
                    alt={item.Heading}
                    width={120} // Adjusted for better scaling
                    height={160}
                    className="object-contain 2xl:w-16 2xl:h-16"
                  />
                </div>
                {/* Text Content */}
                <div className="mt-4 flex flex-col justify-center items-center">
                  <p className="font-bold text-[10px] sm:text-[12px] 2xl:text-2xl">
                    {item.Heading}
                  </p>
                  <p className="text-gray-600 text-[10px] sm:text-[12px] 2xl:text-2xl">
                    {item.Name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
};

export default Hero;
