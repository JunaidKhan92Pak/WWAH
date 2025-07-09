import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { logo } from '@/public/logo.svg';

interface HeroProps {
  name: string;
  country: string;
  type: string;
  deadline: string;
  NumberOfScholarships: number;
  logo: string;
  banner: string;
  officialLink?: string;
}

const Hero: React.FC<HeroProps> = ({
  name,
  country,
  type,
  deadline,
  NumberOfScholarships,
  logo,
  banner,
  officialLink,
}) => {
  const scholarshipArr = [
    {
      Image: "/scholarshipdetail/country.svg",
      Heading: "Host Country",
      Name: `${country}`,
    },
    {
      Image: "/scholarshipdetail/university.svg",
      Heading: "Number of Scholarships",
      Name: `${NumberOfScholarships}`,
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
  const handleScroll = () => {
    const element = document.getElementById("Applicable-Departments");
    if (element) {
      const yOffset = -40; // adjust this value based on your header height
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="mx-auto w-[90%] md:w-[95%] md:mt-4">
        {/* Hero Section */}
        <div
          className="relative min-h-[250px] sm:min-h-[400px] flex justify-center items-center text-center rounded-3xl text-white bg-cover bg-center"
          style={{
            backgroundImage: `url(${banner})`,
          }}
        >
          <div className="absolute bg-black bg-opacity-50 w-full h-full rounded-2xl"></div>

          <div className="relative w-[95%] sm:w-[80%] mx-auto rounded-3xl overflow-hidden py-2 px-2 sm:px-0 min-h-[250px] sm:min-h-[400px] flex items-center justify-center">
            {/* Wrapper to center content and control layout */}
            <div className="flex flex-col md:flex-row w-full justify-between items-center gap-2 md:gap-6">
              {/* Left Section */}
              <div className="w-[100%] md:w-[50%] flex flex-col md:items-start md:text-left space-y-2 pl-0 lg:pl-12">
                <div className="bg-white rounded-full sm:w-[80px] sm:h-[80px] w-[50px] h-[50px]">
                  <Image
                    src={logo}
                    alt="Uni Logo"
                    width={130}
                    height={130}
                    className="object-cover object-center sm:w-[80px] sm:h-[80px] w-[50px] h-[50px] border-2 border-white rounded-full"
                  />
                </div>

                <div className="w-full flex flex-col justify-center items-start md:items-start text-left">
                  <h2 className="text-white md:leading-10 lg:leading-12">
                    {name}
                  </h2>
                </div>
                <Link
                  href={`${officialLink}`}
                  className="text-white w-[70%] md:w-[60%] xl:w-[43%]"
                >
                  <Button className="mt-2 bg-[#C7161E] hover:bg-red-800 ">
                    Go to Scholarship Website
                  </Button>
                </Link>
              </div>

              {/* Right Section */}
              <div className="hidden sm:flex w-full md:w-[45%] lg:w-[35%] xl:w-[30%]  bg-white bg-opacity-30 backdrop-blur-sm rounded-3xl p-4 flex-col items-center text-center">
                <Link
                  target="blank"
                  href="/schedulesession"
                  className="[text-align:-webkit-center]"
                >
                  <p className="text-white md:w-4/5 hover:underline">
                    Book Your Online Video Counselling Session with WWAH
                    Advisor!
                  </p>
                </Link>
                <div className="flex items-center w-[50%] my-2">
                  <div className="flex-1 border-t border-gray-100"></div>
                  <p className="mx-4 text-white">Or</p>
                  <div className="flex-1 border-t border-gray-100"></div>
                </div>
                {/* <Link >
                  <Button className="w-full px-14 py-3 2xl:py-5 bg-white bg-opacity-20 backdrop-blur-md text-white rounded-lg hover:bg-gray-300 transition duration-300">
                    Apply Now
                  </Button>
                </Link> */}
                <Button
                  onClick={handleScroll}
                  className="w-full px-14 py-3 2xl:py-5 bg-white bg-opacity-20 backdrop-blur-md text-white rounded-lg hover:bg-gray-300 transition duration-300"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex sm:hidden  justify-evenly gap-2">
            <Link target="blank" href="/dashboard">
              <Button className="text-[13px]  bg-gray-600 bg-opacity-20 backdrop-blur-md shadow-md text-black w-[142px]">
                Apply Now
              </Button>
            </Link>
            <Link target="blank" href="/dashboard">
              <Button className="bg-gray-600 text-[13px] bg-opacity-20 backdrop-blur-md shadow-md text-black w-[142px]">
                Book free Counselling{" "}
              </Button>
            </Link>
          </div>
        </div>
        {/* Grid Section */}
        <section className="relative mt-4 md:my-6 z-10">
          <div
            className="flex md:grid md:grid-cols-4 items-center justify-items-center 
      bg-white shadow-lg rounded-2xl mx-auto w-[95%] md:w-[80%] lg:w-[66%] px-1 md:px-3 2xl:max-w-[2200px] 
      py-2 md:py-2 2xl:p-8 2xl:gap-5 sm:relative lg:absolute lg:-top-20 lg:left-1/2 lg:transform lg:-translate-x-1/2"
          >
            {scholarshipArr.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center lg:justify-between p-1 w-full h-28 sm:h-36 md:h-32  bg-white py-1 rounded-lg text-center"
              >
                {/* Icon Wrapper */}
                <div className="bg-[#FEE7D1] flex items-center justify-center rounded-lg">
                  <Image
                    src={item.Image}
                    alt={item.Heading}
                    width={120} // Adjusted for better scaling
                    height={160}
                    className="object-contain "
                  />
                </div>
                {/* Text Content */}
                <div className="mt-4 flex flex-col justify-center items-center">
                  <p className="font-bold text-[10px] sm:text-[12px] 2xl:text-base">
                    {item.Heading}
                  </p>
                  <p className="text-gray-600 text-[10px] sm:text-[12px] 2xl:text-base">
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
